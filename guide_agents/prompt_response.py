from helper import get_nearby_place
import asyncio
from agents import Runner


async def get_riddle(agent, player):
    """
    Checks weather players task has been completed and gives riddle based on completion status:
    Either encrypted clues of where to look

    Returns: Riddle for the player to progress
    """


    place = await asyncio.to_thread(get_nearby_place, player.lat, player.lon)
        
    input_message = (
        f"The hero, {player}, is at latitude {player.lat} and longitude {player.lon}. "
        f"Provide a riddle for the hero to complete their task: {player.task} and affiliate something to help them using the location: {place}. "
        "Write a single, cryptic, mythical riddle (max 2 sentences) that leads them closer to completing their task."
    )

    riddle_response = await Runner.run(agent, input_message)
    riddle = riddle_response.final_output
    return riddle.strip()


async def get_task(agent, info):
    """
    Using the Task Master agent to generate a task to deliver.
    """
    lat = info["Latitude"]
    lng = info["Longitude"]
    cur_place = await asyncio.to_thread(get_nearby_place, lat, lon)
    input_message = (
        f"Define the critical objective item for Hero {player}. "
        f"The players is at LAT {lat} and LON {lon} near {cur_place}. "
        f"Based on the type of landmark found near to them: {cur_place} (e.g., 'cafe', 'museum', 'park'), "
        "generate a single, tangible item that can be photographed as proof of acquisition."
    )

    task_response = await Runner.run(agent, input_message)
    task = task_response.final_output

    return str(task) 


async def get_judgement(agent, player,task, msg, history):
    input_message = (
        f"Decide weather it is feasible that {player} has completed their task: {task} based the their last message {msg}, and the {player.lat} and {player.lon}"
        "If you think the player has completed their task, return: COMPLETE"
        "If you think the player has not completed their task, return: INCOMPLETE"
    )
    judge_response = await Runner.run(agent, input_message)
    judgement = judge_response.final_output
    if "complete" in judgement.tolower():
        return 1
    return 0

async def get_help(agent, player,task, msg, history):
    input_message = (
        f"Give the player a helpful tip on how they could achieve their task."
    )
    help_response = await Runner.run(agent, input_message)
    help = help_response.final_output
    return str(help)




