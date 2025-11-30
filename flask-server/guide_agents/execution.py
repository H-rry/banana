from agent_gen import GameOrchestrator


if __name__ == '__ main __':
    from agent_gen import riddler_agent, task_master_agent, judge_agent, helper_agent
    AGENTS_COLLECTION = {
        "The Riddler": riddler_agent(),
        "The Task Master": task_master_agent(),
        "The Judge": judge_agent(), 
        "The Helper": helper_agent(judge_agent), 
    }
    players = ......

    # 2. Initialize and Start Orchestrator
    orchestrator = GameOrchestrator(AGENTS_COLLECTION, players)
    TASKS = orchestrator.start_game()
    print(TASKS)

    for player in players:
        print(f"The first riddle for {player} is {orchestrator.riddles(player)}")
    
    while not orchestrator.over:
        #### SOMEHOW GETTING THE MESSAGE AND WHO SAID THE MESSAGE
        player = 
        player_message = 
        message = orchestrator.handle_player_input(player, player_message)
        if message:
            print(message)
        orchestrator.game_over()
