from openai import OpenAI
from agents import Agent, Runner
from dotenv import load_dotenv
import os
import asyncio


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

def helper_agent():
    persona_instructions = (
    "You are the Hero's freindly helper"
    "Your goal is to guide the hero towards completing their task and then towards their rendevouz destination"
)
    return Agent(name = "The Helper", instructions = persona_instructions, model='gpt-5-nano')