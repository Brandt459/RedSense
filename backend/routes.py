from flask import Blueprint, jsonify, request
from functions import analyze_user_posts, get_user_analysis
from models import RedditUser
from client import reddit
from prawcore.exceptions import NotFound


route_blueprint = Blueprint('my_blueprint', __name__)


@route_blueprint.route('/user', methods=['GET'])
def get_user():
    username = request.args.get('username', '').lower()
    if not username:
        return jsonify({'error': 'Username parameter is required'}), 400

    reddit_user = RedditUser.query.filter_by(username=username).first()
    
    if not reddit_user:
        analyze_user_posts(username)
    
    return jsonify(get_user_analysis(username))


@route_blueprint.route('/analyze_user', methods=['GET'])
def analyze_user():
    username = request.args.get('username').lower()
    analyze_user_posts(username)

    return jsonify(get_user_analysis(username))


@route_blueprint.route('/profile-photo', methods=['GET'])
def get_profile_photo():
    username = request.args.get('username')
    if not username:
        return jsonify({'error': 'Username parameter is required'}), 400

    try:
        user = reddit.redditor(username)
        profile_photo_url = user.icon_img
        return jsonify({'username': username, 'profile_photo_url': profile_photo_url})
    
    except NotFound:
        return jsonify({'error': 'User not found'}), 404
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
