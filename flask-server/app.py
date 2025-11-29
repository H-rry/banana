from flask import Flask, jsonify, request, session
from flask_socketio import SocketIO, send, emit
import dotenv
import os
import flightdata as fd

dotenv.load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

socketio = SocketIO(app)

# The game_state - I think this will look different as time moves forward:
# Maybe we have a game state per user (long, lat, money) and more things to store spawns, destinations
game_state = {
    "location": "London",
    "story": ["You stand in London. It is rainy."],
    "options": ["Paris", "New York", "Tokyo"]
}

players = []

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


@socketio.on('message')
def handle_message(data):

    # Get the username for the current session with a default of Anonymous
    username = session.get('username', 'Anonymous')

    # Get the content of the message
    message = data.get('data')

    if message:
        # Add the message to the list of messages
        messages.append((username, message))

        # Send the message to the other players
        emit("message", {'username': username, 'data': message}, broadcast=True)


if __name__ == "__main__":
    socketio.run(app, debug=True)
