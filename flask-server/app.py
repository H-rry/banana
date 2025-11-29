from flask import Flask, jsonify, request

app = Flask(__name__)

# 1. The entire game state in one variable
state = {
    "location": "London",
    "story": ["You stand in London. It is rainy."],
    "options": ["Paris", "New York", "Tokyo"]
}

@app.route("/api/data")
def get_data():
    return jsonify(state)

if __name__ == "__main__":
    app.run(debug=True)