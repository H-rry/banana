from flask import Flask, jsonify, request, session
from flask_socketio import SocketIO, send, emit
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

socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

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

@app.route("/api/game", methods=["GET", "POST"]) # This is the route for sending data to and fro the frontend
def handle_game():
    # 1. If React is SENDING data (Action)
    if request.method == "POST":
        data = request.json
        action_type = data.get("action")

        if action_type == "move":
            destination = data.get("destination") # Expecting IATA code
            # Prefer explicit userid from request body (for multi-tab testing), fallback to session
            userid = data.get("userid") or session.get("userid")
            
            player = get_player(userid)
            
            if player:
                try:
                    info = fd.get_airport_info(destination)
                    player.airport = destination
                    player.city = info["City"]
                    player.lat = info["Latitude"]
                    player.lng = info["Longitude"]
                    
                    update_player_routes(player)
                    broadcast_players()
                    
                    return jsonify({"status": "success", "message": f"Traveled to {info['City']}"})
                except Exception as e:
                     print(f"Error moving player: {e}")
                     return jsonify({"status": "error", "message": "Invalid destination"}), 400

    # 2. If React is ASKING for data (Initial Load)
    return jsonify([p.to_dict() for p in players])

def update_player_routes(player):
    try:
        outbound = fd.get_outbound_from(player.airport)
        # Get unique destination IATAs
        destinations = outbound['Destination airport'].unique().tolist()
        
        # Pick a subset to avoid overcrowding the map, e.g., 5 random routes
        if len(destinations) > 5:
            destinations = random.sample(destinations, 5)
            
        new_routes = []
        for dest_iata in destinations:
            try:
                info = fd.get_airport_info(dest_iata)
                new_routes.append({
                    'lat': info['Latitude'],
                    'lng': info['Longitude'],
                    'name': dest_iata, 
                    'city': info['City']
                })
            except Exception as e:
                # Destination airport info might not be in our CSV
                continue
        
        player.routes = new_routes
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

    # airport = random.choice(fd.get_airports())
    airport = np.random.choice(fd.get_airports(), size = 1, replace=False) 
    try:
        info = fd.get_airport_info(airport)
        city = info["City"]
        lat = info["Latitude"]
        lng = info["Longitude"]
    except:
        # Fallback if LHR fails for some reason
        airport = "JFK" 
        info = fd.get_airport_info(airport)
        city = info["City"]
        lat = info["Latitude"]
        lng = info["Longitude"]

    player = Player(userid, username, airport, city, lat, lng, random.choice(PLAYER_COLORS))
    update_player_routes(player)
    players.append(player)
    
    broadcast_players()
    task_agent = cachedAgents.get_agent("task_master")
    task = prompt.get_task(task_agent)
    player.task = task
    emit("message", {'username': 'Task Master', 'data': task}, broadcast=True)
    
    return jsonify({"status": "success", "username": username, "userid": userid})

@socketio.on('connect')
def handle_connect():
    userid = session.get('userid')
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
            judge_agent = cachedAgents.get_agent("The Judge")
            if prompt.get_judgement(judge_agent, user, user.task, message, messages):
                task_agent = cachedAgents.get_agent("task_master")
                user.task = prompt.get_task(task_agent)
                user.points += 1
                message = f"{user.name} has completed their task: {user.task}. {user.name} has {user.points} points."
                emit("message", {'username': 'Task Master', 'data': message}, broadcast=True)
            else:
                riddler_agent = cachedAgents.get_agent("The Riddler")
                riddle = riddler_agent.get_riddle(riddler_agent, user)
                emit("message", {'username': 'The Riddler', 'data': riddle}, broadcast=True)


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
    socketio.run(app, debug=True)
