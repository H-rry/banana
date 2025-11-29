import pandas as pd


cols_list=["Source airport","Destination airport"]
G_df = pd.read_csv('../input/openflights-route-database-2014/routes.csv',usecols=cols_list)


cols_list=["City","Country","IATA","Latitude","Longitude"]
airport_df = pd.read_csv('../input/openflights-airports-database-2017/airports.csv',usecols=cols_list)


