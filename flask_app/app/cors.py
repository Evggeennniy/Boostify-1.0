from flask_cors import CORS


def init_cors(app):
    CORS(app, resources={
         r"/api/*": {"origins": ["http://localhost:3000", "https://capilike.mom"]}})
