from flask import Flask
from flask_migrate import Migrate
from flask_basicauth import BasicAuth
from pymemcache import Client
from dotenv import load_dotenv
import os


def create_app() -> Flask:
    load_dotenv()

    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['BASIC_AUTH_USERNAME'] = os.getenv('ADMIN_AUTH_USERNAME')
    app.config['BASIC_AUTH_PASSWORD'] = os.getenv('ADMIN_AUTH_PASSWORD')
    basic_auth = BasicAuth(app)
    cache = Client(('127.0.0.1', 11211))

    from app.models import db
    from app.admin import admin_init
    from app.routers import init_routers
    from app.cors import init_cors

    db.init_app(app)
    Migrate(app, db)
    admin_init(app, basic_auth)
    init_routers(app, cache)
    init_cors(app)

    with app.app_context():
        db.create_all()

    return app
