from flask import Flask
from dotenv import load_dotenv
import logging
from routes import route_blueprint
from flask_cors import CORS

load_dotenv()
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

app.register_blueprint(route_blueprint)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
