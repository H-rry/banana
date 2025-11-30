class Player:
    def __init__(self, userid, name, airport, city, lat, lng, routes=None):
        self.id = userid
        self.name = name
        self.airport = airport
        self.city = city
        self.lat = lat
        self.lng = lng
        self.routes = routes if routes is not None else []
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'airport': self.airport,
            'city': self.city,
            'lat': self.lat,
            'lng': self.lng,
            'routes': self.routes
        }