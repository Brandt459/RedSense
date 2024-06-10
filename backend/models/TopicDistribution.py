from db import db


class TopicDistribution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('reddit_user.id'), nullable=False)
    topic = db.Column(db.String(30), nullable=False)
    distribution = db.Column(db.Float, nullable=False)
    user = db.relationship('RedditUser', backref=db.backref('topics', lazy=True))
