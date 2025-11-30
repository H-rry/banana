from flask import Flask, jsonify, request, session
from flask_socketio import SocketIO, send, emit
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'guide_agents'))
import guide_agents.prompt_response as prompt 
import guide_agents.agent_cache as cachedAgents
import dotenv
import os
import flightdata as fd
import uuid
from player import Player
import random
import numpy as np

_cached_agents = {} 
dotenv.load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

socketio = SocketIO(app, cors_allowed_origins="*")

# The game_state - I think this will look different as time moves forward:
# Maybe we have a game state per user (long, lat, money) and more things to store spawns, destinations
game_state = {
    "location": "London",
    "story": ["You stand in London. It is rainy."],
    "options": ["Paris", "New York", "Tokyo"]
}

PLAYER_COLORS = [
    "#00FFFF", # Cyan
    "#FF00FF", # Magenta
    "#00FF00", # Lime
    "#FFFF00", # Yellow
    "#FF4500", # OrangeRed
    "#FF1493", # DeepPink
    "#00BFFF", # DeepSkyBlue
    "#7FFF00", # Chartreuse
    "#FFD700", # Gold
    "#FF69B4", # HotPink
]

players = []

def get_player(userid):
    for player in players:
        if player.id == userid:
            return player

def remove_player(userid):
    for (i, player) in enumerate(players):
        if player.id == userid:
            players.pop(i)
            return

messages = []

@app.route("/api/game", methods=["GET", "POST"]) 
def handle_game():
    if request.method == "POST":
        data = request.json
        action_type = data.get("action")

        if action_type == "move":
            destination = data.get("destination") 
            userid = data.get("userid") or session.get("userid")
            
            player = get_player(userid)
            
            if player:
                try:
                    # 1. Update Location
                    info = fd.get_airport_info(destination)
                    player.airport = destination
                    player.city = info["City"]
                    player.country = info["Country"]
                    player.lat = info["Latitude"]
                    player.lng = info["Longitude"]
                    
                    update_player_routes(player)

                    # ---------------------------------------------------------
                    # 2. CHECK WIN CONDITION
                    # ---------------------------------------------------------
                    if destination == player.target['iata']:
                        # A. Increment Score
                        player.score += 1
                        
                        # B. Broadcast Victory Message
                        win_msg = f"🏆 {player.name} reached {player.target['city']}! (+1 Point)"
                        socketio.emit("message", {'username': 'SYSTEM', 'data': win_msg})
                        
                        # C. Give them a new target so the game continues
                        assign_new_target(player)
                    # ---------------------------------------------------------

                    broadcast_players()
                    
                    return jsonify({"status": "success", "message": f"Traveled to {info['City']}"})
                except Exception as e:
                     print(f"Error moving player: {e}")
                     return jsonify({"status": "error", "message": "Invalid destination"}), 400

    return jsonify([p.to_dict() for p in players])

def update_player_routes(player):
    try:
        # 1. Get all outbound flights
        outbound = fd.get_outbound_from(player.airport)
        all_destinations = outbound['Destination airport'].unique().tolist()
        
        new_routes = []
        target_iata = player.target['iata']

        # --- PRIORITY SCAN: CHECK FOR DIRECT FLIGHT TO TARGET ---
        if target_iata in all_destinations:
            try:
                info = fd.get_airport_info(target_iata)
                dist = fd.haversine_distance(player.lat, player.lng, info['Latitude'], info['Longitude'])
                
                new_routes.append({
                    'lat': info['Latitude'],
                    'lng': info['Longitude'],
                    'name': target_iata, 
                    'city': info['City'],
                    'country': info['Country'],
                    'distance': dist,
                    'is_direct': True  # <--- SPECIAL FLAG
                })
                
                # Remove it from the pool so we don't add it twice
                all_destinations.remove(target_iata)
            except Exception as e:
                print(f"Target found in routes but data missing: {e}")

        # --- FILL THE REST OF THE SLOTS ---
        # We want 5 options total. If we found the target, we need 4 more. If not, 5.
        slots_needed = 5 - len(new_routes)
        
        if len(all_destinations) > slots_needed:
            random_dests = random.sample(all_destinations, slots_needed)
        else:
            random_dests = all_destinations

        for dest_iata in random_dests:
            try:
                info = fd.get_airport_info(dest_iata)
                dist = fd.haversine_distance(player.lat, player.lng, info['Latitude'], info['Longitude'])
                new_routes.append({
                    'lat': info['Latitude'],
                    'lng': info['Longitude'],
                    'name': dest_iata, 
                    'city': info['City'],
                    'country': info['Country'],
                    'distance': dist,
                    'is_direct': False
                })
            except:
                continue
        
        # --- SORTING ---
        # Sort so the Direct Target is ALWAYS at the top (True sorts before False if reversed)
        # We sort by: 1. Is it the target? (descending), 2. Distance (ascending)
        player.routes = sorted(new_routes, key=lambda x: (not x['is_direct'], x['distance']))

    except Exception as e:
        print(f"Error updating routes for {player.name}: {e}")
        player.routes = []
def broadcast_players():
    data = [p.to_dict() for p in players]
    socketio.emit('players_update', data)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    
    userid = str(uuid.uuid4())

    # Store the username in the Flask session
    session["userid"] = userid

    # Get airports with at least 15 connections for the target to ensure it's reachable/major
    connected_airports = fd.get_airports_with_min_connections(150)
    
    start_iata = "LHR"
    
    # Pick a random target that is NOT LHR
    possible_targets = [a for a in connected_airports if a != start_iata]
    if possible_targets:
        target_iata = random.choice(possible_targets)
    else:
        target_iata = "JFK"

    # Setup Start
    try:
        start_info = fd.get_airport_info(start_iata)
    except Exception:
        # Fallback
        start_iata = "LHR"
        start_info = fd.get_airport_info("LHR")

    # Setup Target
    try:
        target_info = fd.get_airport_info(target_iata)
    except Exception:
        # Fallback
        target_iata = "JFK"
        target_info = fd.get_airport_info("JFK")

    target_data = {
        "iata": target_iata,
        "city": target_info["City"],
        "country": target_info["Country"],
        "lat": target_info["Latitude"],
        "lng": target_info["Longitude"]
    }

    player = Player(userid, username, start_iata, start_info["City"], start_info["Country"], start_info["Latitude"], start_info["Longitude"], random.choice(PLAYER_COLORS), target=target_data, score=0)
    update_player_routes(player)
    players.append(player)
    
    broadcast_players()
    # task_agent = cachedAgents.get_agent("task_master")
    # task = await prompt.get_task(task_agent, player)
    # player.task = task
    # socketio.emit("message", {'username': 'Task Master', 'data': task})
    
    return jsonify({"status": "success", "username": username, "userid": userid})

def assign_new_target(player):
    # Get airports with connections
    connected_airports = fd.get_airports_with_min_connections(90)
    
    # Ensure we don't pick the airport they are currently at
    current_iata = player.airport
    possible_targets = [a for a in connected_airports if a != current_iata]
    
    if possible_targets:
        target_iata = random.choice(possible_targets)
    else:
        target_iata = "JFK" # Fallback

    try:
        target_info = fd.get_airport_info(target_iata)
        player.target = {
            "iata": target_iata,
            "city": target_info["City"],
            "country": target_info["Country"],
            "lat": target_info["Latitude"],
            "lng": target_info["Longitude"]
        }
    except Exception as e:
        print(f"Error assigning target: {e}")

@socketio.on('connect')
def handle_connect():
    userid = request.args.get('userid') or session.get('userid')
    if userid:
        print(f"User connected: {userid}")
        emit('players_update', [p.to_dict() for p in players])


@socketio.on('message')
def handle_message(data):
    print(data)
    print(session)
    # Get the username for the current session with a default of Anonymous
    userid = session.get('userid', None)
    if userid is None:
        print("Error: No userId found")

    # Get the content of the message
    message = data.get('data')

    if message:
        # Add the message to the list of messages
        messages.append((userid, message))

        user = get_player(userid)
        
        if user:
            # Send the message to the other players
            emit("message", {'username': user.name, 'data': message}, broadcast=True)
            # judge_agent = cachedAgents.get_agent("judge")
            # if await prompt.get_judgement(judge_agent, user, user.task, message, messages):
            #     task_agent = cachedAgents.get_agent("task_master")
            #     user.task = await prompt.get_task(task_agent, user)
            #     user.points += 1
            #     message = f"{user.name} has completed their task: {user.task}. {user.name} has {user.points} points."
            #     emit("message", {'username': 'Task Master', 'data': message}, broadcast=True)
            # else:
            #     riddler_agent = cachedAgents.get_agent("riddler")
            #     riddle = await prompt.get_riddle(riddler_agent, user)
            #     emit("message", {'username': 'The Riddler', 'data': riddle}, broadcast=True)


@socketio.on('disconnect')
def handle_disconnect():
    # Attempt to retrieve the username from the session
    userid = session.get('userid')

    player = get_player(userid)

    if player:
        print(f"User disconnected: {player.name}")
        remove_player(userid)

        emit("message", {'username': 'System', 'data': f'{player.name} has left the game.'}, broadcast=True)
        broadcast_players()


if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
