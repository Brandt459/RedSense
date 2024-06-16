from db import db


class RedditUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    num_submissions = db.Column(db.Integer)
    average_sentiment = db.Column(db.Float)
    qa_model_available = db.Column(db.Boolean, default=False)
