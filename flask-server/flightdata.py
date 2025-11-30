import pandas as pd
import math


cols_list=["Source airport","Destination airport"]
G_df = pd.read_csv('routes.csv',usecols=cols_list)


cols_list=["City","Country","IATA","Latitude","Longitude"]
airport_df = pd.read_csv('airports.csv',usecols=cols_list)

airports = airport_df['IATA'].unique().tolist()


def get_outbound_from(airport_iata):
    return G_df[G_df['Source airport'] == airport_iata]


def get_flights_in(airport_iata):
    return G_df[G_df['Destination airport'] == airport_iata]


def get_airports():
    return airports

def get_airports_with_min_connections(min_connections):
    # Group by Source airport and count
    connection_counts = G_df['Source airport'].value_counts()
    # Filter by min_connections
    valid_iatas = connection_counts[connection_counts >= min_connections].index.tolist()
    # Intersection with known airports to ensure we have their data
    return [iata for iata in valid_iatas if iata in airports]

def get_airport_info(airport_iata):
    info = airport_df[airport_df['IATA'] == airport_iata]

    return info.to_dict('records')[0]

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return distance