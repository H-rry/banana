class Player:
    def __init__(self, userid, name, airport, city, country, lat, lng, color, score, target=None, routes=None):
        self.id = userid
        self.name = name
        self.airport = airport
        self.city = city
        self.country = country
        self.lat = lat
        self.lng = lng
        self.color = color
        self.target = target
        self.score = score
        self.routes = routes if routes is not None else []
        self.task = None
        self.points = 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'airport': self.airport,
            'city': self.city,
            'country': self.country,
            'lat': self.lat,
            'lng': self.lng,
            'color': self.color,
            'target': self.target,
            'score': self.score,
            'routes': self.routes
        }