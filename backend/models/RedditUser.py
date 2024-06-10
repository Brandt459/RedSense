from db import db


class RedditUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    num_submissions = db.Column(db.Integer)
