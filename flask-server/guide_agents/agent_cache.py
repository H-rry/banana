_cached_agents = {}

def get_agent(agent_name):
    if agent_name not in _cached_agents:
        from agent_gen import (
            riddler_agent, 
            #geographer_agent, 
            task_master_agent, 
            helper_agent
        )

        if agent_name == "riddler":
            _cached_agents[agent_name] = riddler_agent()
        elif agent_name == "geographer":
            _cached_agents[agent_name] = geographer_agent()
        elif agent_name == "task_master":
            _cached_agents[agent_name] = task_master_agent()
        elif agent_name == "helper":
            _cached_agents[agent_name] = helper_agent()
        else:
            raise ValueError(f"Unknown agent: {agent_name}")
    return _cached_agents[agent_name]