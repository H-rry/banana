class Player:
    def __init__(self, userid, name, location):
        self.id = userid
        self.name = name
        self.location = location
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location
        }