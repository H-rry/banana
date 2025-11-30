from agents import Agent, Runner
from helper import initial_locations
from setup import run_setup
from prompt_response import get_riddle, get_judgement, get_help


def riddler_agent():
    persona_instructions = (
    "You are the Oracle of Delphi, a cryptic, mythical, and highly strategic entity. "
    "Your primary goal is to guide heroes through their trials by providing challenging riddles. "
    "Speak only in two-to-three sentence epic prose, using metaphors of fate, stone, and the sea. "
    "Do NOT give direct answers or modern street names. If you use a tool, ONLY output the final riddle."
)
    return Agent(name = "The Riddler", instructions = persona_instructions, model='gpt-5-nano')

def task_master_agent():
    persona_instructions = (
    "You are the Quartermaster of the Expedition, responsible for setting verifiable objectives. "
    "Your output must be a single, short noun phrase that names a specific, deliverable item "
    "or task that must be acquired at the location provided by your tools. "
    "The item must be something a famous object in the country of the location provided (e.g. In France: The mona lisa, In England: The Crown Jewels, In Sudan: The Sphinx of Taharqa, In America: The Statue of Liberty) "
    "Do NOT give a riddle or a description; only state the location specific item needed. Example output: 'The bronze plaque's serial number'."
    "Return all output in the format: 'Your task is to retrive: THE OBJECT DECIDED'"
)
    return Agent(name = "The Task Master", instructions = persona_instructions, model='gpt-5-nano')

def helper_agent(judge):
    persona_instructions = (
    "You are the Hero's freindly helper"
    "Your goal is to guide the hero towards completing their task and then towards their rendevouz destination"
    "Use your tools to determine if the player is struggling and needs you to give them clues"
)
    return Agent(name = "The Helper", instructions = persona_instructions, model='gpt-5-nano', tools=[judge.as_tool(
            tool_name="judge",
            tool_description="Judges the players",
        )])

def judge_agent():
    persona_instructions = (
    "You are the Stoic Arbiter, a highly logical and impartial judge for the Expedition. "
    "Your sole responsibility is to analyze the player's recent actions, current messages, and the historical record of their attempts. "
)
    return Agent(name = "The Helper", instructions = persona_instructions, model='gpt-5-nano')

class GameOrchestrator:
    """
    The central controller managing game state, agent turns, and message routing.
    """
    def __init__(self, agents, players):
        self.agents = agents
        self.game_state = {
            "target_location": "Unknown",
            "history": []
        }
        self.judge = self.agents["The Judge"],
        self.player = players,
        self.PTC = None,
        self.PRG = None,
        self.over = 0

    def start_game(self) -> str:
        """
        Initializes the game state by running the Task Master and the Riddler.
        Returns the initial message (the riddle) for the chat room.
        """

        self.PTC, self.PRG, tasks = run_setup(self.players)

        # Orchestrator calls the external world tool needed by the Task Master
        objective_loc = initial_locations([1])
        self.game_state["target_location"] = objective_loc
        self.game_state["history"].append(f"{tasks}")

        return tasks
    
    def riddles(self, player):
        agent = self.agents["The Judge"]
        PTC = self.PTC,
        end_destination = self.game_state["target_location"]
        return get_riddle(agent, player, PTC, end_destination)
        

    def handle_player_input(self, player, player_message: str) -> str:
        """
        Processes a player's message and orchestrates the Helper/Judge interaction.
        Returns the next message for the chat room.
        """
        if "riddle" in player_message.tolower():
            agent = self.agents["The Riddler"]
            self.riddles(player)
            
        self.game_state["history"].append(f"{player}: {player_message}")
        
        # 1. Helper Agent Decides (and calls Judge tool)
        helper = self.agents["The Helper"]
        
        # The Orchestrator facilitates the tool call that the Helper would ask for.
        # We assume the Helper's LLM is prompted to call its 'Judge' tool.
        # The result of the Judge tool is stored and fed back to the Helper LLM.
        task = self.PTC.loc[self.PTC['player'] == player, 'task']
        history = self.game_state["history"]
        judge_assessment = get_judgement(self.judge, player, task, player_message, history)
        
        # 2. Check the Judge's Assessment for Game Over (Success)
        if "completed" in judge_assessment.tolower(): # Reset for new game
            success_message = f"{player} has successfully retrived their object!."
            self.PTC.loc[self.PTC['player'] == player, 'task_completed'] = True
            return success_message
        elif "yes" in judge_assessment.tolower():
            help_message = get_help(helper, player, task, player_message, history)
            self.game_state["history"].append(f"{help_message}")
            return help_message
        else:
            return None
        
    def game_over(self):
        """
        Checks if the game has been completed.
        """
        for player in self.players:
            if self.PTC.loc[self.PTC['player'] == player, 'task_completed'] == False:
                continue
            self.game_over = True





