from flask import Flask
from flask_migrate import Migrate
from flask_basicauth import BasicAuth
from flask_babel import Babel
from dotenv import load_dotenv
from pymemcache import Client
import os

load_dotenv()

TG_BOT_API_KEY = os.getenv('TG_BOT_API_KEY')
TG_GROUP_ID = os.getenv('TG_GROUP_ID')


def create_app() -> Flask:

    app = Flask(__name__, static_url_path='/static_content')
    app.secret_key = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_URL')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['BASIC_AUTH_USERNAME'] = os.getenv('ADMIN_AUTH_USERNAME')
    app.config['BASIC_AUTH_PASSWORD'] = os.getenv('ADMIN_AUTH_PASSWORD')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    basic_auth = BasicAuth(app)
    cache = Client(('127.0.0.1', 11211))

    from app.models import db
    from app.admin import init_admin
    from app.routers import init_routers
    from app.cors import init_cors

    db.init_app(app)
    Migrate(app, db)
    Babel(app)
    init_admin(app, basic_auth)
    init_routers(app, cache)
    init_cors(app)

    with app.app_context():
        db.create_all()

    return app


app = create_app()
