from helper import get_nearby_place, populate_initial_state, initialize_riddle_dataframe
from agent_cache import get_agent
import os
import asyncio
from openai import OpenAI
from agents import Runner
from dotenv import load_dotenv
"""
STRUCTURE
- DB INITIALISE
- AGENT INITIALISE
"""


"""
Initialisations:
- Empty db of Player, Task Status, Current Location, Previous Locations, Task (PTC)
- Empty db of Player, Riddles Given, Input Location (PRG)
"""

def initialise(players, initial_locations):
    PTC = populate_initial_state(players, initial_locations)
    PRG = initialize_riddle_dataframe()


    return PTC, PRG



async def get_riddle(agent, player, PTC, end_destination, PRG):
    """
    Checks weather players task has been completed and gives riddle based on completion status:
    Either encrypted clues of where to look

    Returns: Riddle for the player to progress
    """

    task_completed = PTC.loc[PTC['player'] == player, 'task_completed'].iloc[0]
    task = PTC.loc[PTC['player'] == player, 'task'].iloc[0]
    lat, lon = PTC.loc[PTC['player'] == player, 'current_location'].iloc[0]

    if not task_completed:
        place = await asyncio.to_thread(get_nearby_place, lat, lon)
        
        input_message = (
            f"The hero, {player}, is at latitude {lat} and longitude {lon}. "
            f"Provide a riddle for the hero to complete their task: {task} and affiliate something to help them using the location: {place}. "
            "Write a single, cryptic, mythical riddle (max 2 sentences) that leads them closer to completing their task."
        )
    else:
        input_message = (
            f"The hero, {player}, has completed their local trial. "
            f"They are located at latitude {lat} and longitude {lon}."
            f"They must now travel to the final rendezvous point: {end_destination}"
            "Write a single, encouraging, yet slightly cryptic clue (max 2 sentences) guiding them "
            "towards the geographical location of the final destination. "
            "Do NOT use any tools. Use metaphor and geographical references."
        ) # Encripted to get to the final destination

    riddle = await Runner.run(agent, input_message).final_output
    PTC.loc[PTC['player'] == player, 'riddle_given'] = riddle
    PTC.loc[PTC['player'] == player, 'input_location'] = (lat, lon)
    return riddle.strip()
        



async def get_task(agent, player, PTC):
    """
    Using the Task Master agent to generate a task to deliver.
    """
    lat, lon = PTC.loc[PTC['player'] == player, 'current_location'].iloc[0]
    cur_place = await asyncio.to_thread(get_nearby_place, lat, lon)
    input_message = (
        f"Define the critical objective item for Hero {player}. "
        f"The players is at LAT {lat} and LON {lon} near {cur_place}. "
        f"Based on the type of landmark found near to them: {cur_place} (e.g., 'cafe', 'museum', 'park'), "
        "generate a single, tangible item that can be photographed as proof of acquisition."
    )

    task_response = await Runner.run(agent, input_message)
    task = task_response.final_output
    PTC.loc[PTC['player'] == player, 'task'] = task

    return str(task) 

async def main(players, PTC):
    task_master = get_agent("task_master")
    for player in players:
        task = await get_task(task_master, player, PTC)
        print(task)

if __name__ == "__main__":
      load_dotenv()
      OpenAI.api_key = os.getenv("OPENAI_API_KEY")
      if not OpenAI.api_key:
        print("Error: OPENAI_API_KEY environment variable not set.")
        exit()
      client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

      player_names = ['Odysseus', 'Penelope', 'Telemachus', 'Eurycleia']
      locations = [
        (40.7128, -74.0060),    # NYC
        (51.5074, 0.1278),      # London
        (35.6895, 139.6917),    # Tokyo
        (33.7490, -84.3880)     # Atlanta
        ]
      
      PTC, PRG = initialise(player_names, locations)

      asyncio.run(main(player_names, PTC))


