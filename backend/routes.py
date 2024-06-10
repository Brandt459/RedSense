from flask import Blueprint, jsonify, request
from functions import analyze_user_posts, get_user_analysis
from models import RedditUser


route_blueprint = Blueprint('my_blueprint', __name__)


@route_blueprint.route('/user', methods=['GET'])
def get_user():
    username = request.args.get('username', '').lower()
    if not username:
        return "No username provided!", 400

    reddit_user = RedditUser.query.filter_by(username=username).first()
    
    if not reddit_user:
        analyze_user_posts(username)
    
    return jsonify(get_user_analysis(username))


@route_blueprint.route('/analyze_user', methods=['GET'])
def analyze_user():
    username = request.args.get('username').lower()
    analyze_user_posts(username)

    return jsonify(get_user_analysis(username))
