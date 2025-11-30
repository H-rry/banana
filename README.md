# Project Banana 🍌

This repository contains a game! Using a React frontend and a Flask backend.

## Project Structure

- **banana/**: React Frontend application (created with Create React App).
- **flask-server/**: Flask Backend API.

## Prerequisites

Ensure you have the following installed:
- **Node.js & npm** (for the frontend)
- **Python 3 & pip** (for the backend)

---

## Quick Start Guide

You will need to run **two** separate terminal sessions: one for the backend and one for the frontend.

### 1. Setting up the Backend (Flask)

Open your first terminal and navigate to the server directory:

```bash
cd flask-server
```

It is recommended to use a virtual environment:

```bash
# Create virtual environment
python3 -m venv venv

# Activate it (Linux/Mac)
source venv/bin/activate
# OR Activate it (Windows)
# venv\Scripts\activate
```

Install the required packages (if you haven't already):

```bash
pip install -r requirements.txt
```

Run the server:

```bash
python3 app.py
```
*The backend will start at `http://localhost:5000`.*

### 2. Setting up the Frontend (React)

Open a **new** terminal window (keep the previous one running) and navigate to the frontend directory:

```bash
cd banana
```

Install the Node dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```
*The frontend will open at `http://localhost:3000`.*

---

## Enjoy!!

ADD .env FILE WITH 
HOST=0.0.0.0
PORT=3000
to get multiplayer
GOOD LUCK