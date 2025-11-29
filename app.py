from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, send, emit
import dotenv
import os

dotenv.load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

socketio = SocketIO(app)

messages = []

# Returns the login page
@app.route('/')
def home():
    return render_template('login.html')


# Load up the game page
@app.route('/game', methods=['POST'])
def game():
    # Get the players name from the form
    player_name = request.form.get('username')

    # Add the name to the session
    session['username'] = player_name

    # Return the game page
    return render_template('game.html', name=player_name)

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
