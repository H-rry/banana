import pandas as pd


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

def get_airport_info(airport_iata):
    info = airport_df[airport_df['IATA'] == airport_iata]

    return info.to_dict('records')[0]