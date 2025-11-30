import requests
import time
import pandas as pd
import numpy as np

def get_nearby_place(lat, lon):

    time.sleep(1)

    URL = "https://nominatim.openstreetmap.org/reverse"
    params = {
        'lat': lat,
        'lon': lon,
        'format': 'json',
        'zoom': 18,
        'addressdetails': 1,
        'extratags': 1
    }
    try:
        response = requests.get(
            url = URL,
            params=params,
            headers={'User-Agent': 'ProjectNostosHackathon/1.0'}
        )
        response.raise_for_status() # Raises HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        
        if not data or 'address' not in data:
            return "An anonymous field or open water location."

        address = data.get('address', {})
        display = data.get('display_name', "")
        placeName = "A forgotten street corner"
        placeType = "unknown"

        amenity = address.get('amenity')
        if amenity:
            placeName = amenity
            # Find the specific key associated with the amenity (e.g., 'cafe', 'restaurant')
            placeType = next((k for k, v in address.items() if v == amenity), 'amenity')
            
        # Priority 2: Use the 'building' name
        elif address.get('building'):
            placeName = address['building']
            placeType = 'building'
            
        # Priority 3: Use 'tourism' spot
        elif address.get('tourism'):
            placeName = address['tourism']
            placeType = 'tourist_spot'
            
        # Priority 4: Fallback to the first part of the display name
        else:
            # Use the first line of the address description as the location name
            placeName = display.split(',')[0].strip()
            placeType = 'general_location'
            
        # --- End Parsing Logic ---
        
        # Format the rich context string for the AI agent
        address_snippet = ','.join([s.strip() for s in display.split(',')[1:3]])
        
        context_string = (
            f"Location: {placeName} (Type: {placeType}). "
            f"Address snippet: {address_snippet}"
        )
        return context_string

    except requests.exceptions.HTTPError as e:
        # Handle the rate-limiting error (HTTP 429) specifically
        if e.response.status_code == 429:
            return "The map master is tired (Rate Limit). Try again in 30 seconds."
        # For other HTTP errors (404, 500, etc.)
        print(f"HTTP Error: {e}")
        return "The map scrolls are corrupted (HTTP Error)."
        
    except requests.exceptions.RequestException as e:
        # Handle connection errors (DNS failure, timeout, etc.)
        print(f"Request Error: {e}")
        return "The path to the map domain is blocked (Connection Error)."
        
    except Exception as e:
        print(f"General Error during OSM processing: {e}")
        return "An unknown anomaly occurred. Context is generalized." 



def initialize_riddle_dataframe() -> pd.DataFrame:
    """
    Initializes a Pandas DataFrame to track the riddles given.
    Returns:
        A Pandas DataFrame with defined columns and data types.
    """
    # 1. Define the structure (schema) for the DataFrame
    data = {
        'player': pd.Series(dtype='str'),
        # Boolean to track if the current stage's task is done
        'riddle_given': pd.Series(dtype='str'), 
        # Stores the latest GPS coordinates (as a dictionary) or location context string
        'input_location': pd.Series(dtype=object), 
    }
    
    df = pd.DataFrame(data)
    return df

def populate_initial_state(players, initial_locations) -> pd.DataFrame:
    """
    Adds initial mock data for the 5 players in the group chat.
    In a real app, this would be loaded from a database (like Firestore) 
    after users join the game.
    """
    if len(players) != len(initial_locations):
        raise ValueError("The 'names' list and 'initial_locations' list must be the same length.")
    new_players_data = []

    for name, location_tuple in zip(players, initial_locations):
        new_players_data.append({
            'player': name,
            'task_completed': False, # Always starting at False
            'current_location': location_tuple, # Stores the (lat, lon) tuple
            'previous_locations': [], # Starts as an empty list (will store history of tuples)
            'task': '' # Task is initialized as empty
        })
    
    # 2. Append the new data to the existing DataFrame
    df = pd.DataFrame(new_players_data)
    return df


def initial_locations(players):
    locations = np.array([

    ])
    number_of_players = len(players)
    rand_locations = np.random.choice(locations, size = 1, replace=False)
    return rand_locations



if __name__ == "__main__":
    print("--- OSM Context Function Testing ---")
    
    # --- Test Case 1: High Specificity (A famous landmark) ---
    # Coordinates for the Eiffel Tower, Paris
    print("\n[TEST 1: High Specificity (Landmark)]")
    lat_landmark, lon_landmark = 48.8606, 2.3376
    result_landmark = get_nearby_place(lat_landmark, lon_landmark)
    print(f"Input: {lat_landmark}, {lon_landmark}")
    print(f"Output: {result_landmark}")
    