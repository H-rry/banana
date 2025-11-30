from prompt_response import get_task
from helper import populate_initial_state, initialize_riddle_dataframe
from agent_cache import get_agent
import os
import asyncio
from openai import OpenAI
from dotenv import load_dotenv


def initialise(players, initial_locations):
    PTC = populate_initial_state(players, initial_locations)
    PRG = initialize_riddle_dataframe()

    return PTC, PRG

async def retriving_tasks(players, PTC):

    print(f"Retriving tasks each of the {len(players)} players...")
    task_master = get_agent("task_master")
    

    tasks = [get_task(task_master, player, PTC) for player in players]
    results = await asyncio.gather(*tasks)
    task_list = []
    for player, task in zip(players, results):
        task_list.append(f"[{player}] Task: {task}")
    return task_list

def run_setup(players):
      load_dotenv()
      OpenAI.api_key = os.getenv("OPENAI_API_KEY")
      if not OpenAI.api_key:
        print("Error: OPENAI_API_KEY environment variable not set.")
        exit()

      

      player_names = players
      number_of_player = len(player_names)
      locations = initial_locations(number_of_player)

      
      PTC, PRG = initialise(player_names, locations)
      tasks = asyncio.run(retriving_tasks(player_names, PTC))

      return PTC, PRG, tasks


