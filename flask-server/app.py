from flask import Flask, jsonify, request, session
from flask_socketio import SocketIO, send, emit
import dotenv
import os
import flightdata as fd
import uuid
from player import Player
import random

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
    global game_state

    # 1. If React is SENDING data (Action)
    if request.method == "POST":
        data = request.json
        action_type = data.get("action")

        if action_type == "move":
            destination = data.get("destination")
            game_state["location"] = destination
            game_state["story"].append(f"You traveled to {destination}.")
        # if action_type == "buy_bananas": ... - can use this to communicate from front to back        

        return jsonify(game_state)

    # 2. If React is ASKING for data (Initial Load)
    return jsonify(game_state)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    
    userid = uuid.uuid4()

    # Store the username in the Flask session
    session["userid"] = userid
    player = Player(userid, username, random.choice(fd.get_airports()))
    players.append(player)
    
    return jsonify({"status": "success", "username": username})


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

        # Send the message to the other players
        emit("message", {'username': user.name, 'data': message}, broadcast=True)


@socketio.on('disconnect')
def handle_disconnect():
    # Attempt to retrieve the username from the session
    userid = session.get('userid')

    player = get_player(userid)

    if player:
        print(f"User disconnected: {player.name}")
        remove_player(userid)

        emit("message", {'username': 'System', 'data': f'{player.name} has left the game.'}, broadcast=True)
        


if __name__ == "__main__":
    socketio.run(app, debug=True)
