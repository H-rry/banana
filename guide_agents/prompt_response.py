from helper import get_nearby_place
import asyncio
from agents import Runner


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



