from flask import Blueprint, jsonify, request
from functions import analyze_user_posts


route_blueprint = Blueprint('my_blueprint', __name__)


@route_blueprint.route('/analyze_user', methods=['GET'])
def analyze_user():
    return jsonify(analyze_user_posts(request.args.get('username')))
