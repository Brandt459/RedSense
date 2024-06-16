from flask import Flask
from dotenv import load_dotenv
import logging
from routes import route_blueprint
from flask_cors import CORS
from flask_migrate import Migrate
from db import db


load_dotenv()
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
db.init_app(app)

migrate = Migrate(app, db)

app.register_blueprint(route_blueprint)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
