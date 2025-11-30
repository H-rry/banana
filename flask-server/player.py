class Player:
    def __init__(self, userid, name, airport, lat, lng):
        self.id = userid
        self.name = name
        self.airport = airport
        self.lat = lat
        self.lng = lng
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'airport': self.airport,
            'lat': self.lat,
            'lng': self.lng
        }