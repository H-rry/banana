class Player:
    def __init__(self, name, location):
        self.name = name
        self.location = location
    
    def to_dict(self):
        return {
            'name': name,
            'location': location
        }