from flask import Flask, jsonify, request

app = Flask(__name__)

# The game_state - I think this will look different as time moves forward:
# Maybe we have a game state per user (long, lat, money) and more things to store spawns, destinations
game_state = {
    "location": "London",
    "story": ["You stand in London. It is rainy."],
    "options": ["Paris", "New York", "Tokyo"]
}

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

if __name__ == "__main__":
    app.run(debug=True)
