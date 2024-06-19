from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter
from client import reddit
from db import db
from models import RedditUser, TopicDistribution, TopicSentiment
from qa_model import get_openai_embeddings
import faiss
from EmbeddingsStore import EmbeddingsStore
from state import lock_and_get_state
import time
import os
import requests


analyzer = SentimentIntensityAnalyzer()


# Return most likely topic for a post
def categorize_text(text: str) -> dict:
    response = requests.post(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli", 
        headers={
            "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"
        }, 
        json={
            "inputs": text,
            "parameters": {
                "candidate_labels": [
                    'technology', 'gaming', 'entertainment', 'sports', 'news and current events',
                    'health and fitness', 'science', 'education', 'finance and cryptocurrency', 'lifestyle and hobbies'
                ]
            }
        }
    )

    return response.json()


# Keeps from running multiple analyses on the same user
def analyze_user_posts_safe(username: str):
    user_state = lock_and_get_state(username)

    if user_state['analyzing_posts']:
        while user_state['analyzing_posts']:
            time.sleep(1)
    
    else:
        user_state['analyzing_posts'] = True
        analyze_user_posts(username)
        user_state['analyzing_posts'] = False


def analyze_user_posts(username: str) -> dict:
    # Check if RedditUser exists, otherwise create
    reddit_user = RedditUser.query.filter_by(username=username).first()
    if not reddit_user:
        reddit_user = RedditUser(username=username)
        db.session.add(reddit_user)
        db.session.commit()
    
    # Get reddit user submissions
    user = reddit.redditor(username)
    submissions = list(user.submissions.new(limit=20))
    
    # Initialize counters and storage
    topic_counter = Counter()
    sentiment_by_topic = Counter()
    count_by_topic = Counter()
    all_texts = []
    
    # Get sentiment and topic for each post, calculate topic distribution and average sentiment per topic
    for submission in submissions:
        post = f"{submission.title}\n{submission.selftext}"
        topic_distribution = categorize_text(post)

        if 'labels' in topic_distribution and 'scores' in topic_distribution:
            sentiment = analyzer.polarity_scores(post)['compound']

            for label, score in zip(topic_distribution['labels'], topic_distribution['scores']):
                if score > 0.2:
                    topic_counter[label] += score
                    sentiment_by_topic[label] += sentiment * score
                    count_by_topic[label] += score

        all_texts.append(post)
    
    # Average sentiment for each topic
    average_sentiment = {topic: round(sentiment_by_topic[topic] / count, 2) for topic, count in count_by_topic.items()}

    total_sentiment = sum(sentiment_by_topic[topic] for topic in sentiment_by_topic)
    total_posts = len(submissions)
    overall_average_sentiment = round(total_sentiment / total_posts if total_posts > 0 else 0, 2)
    
    qa_model_available = False
    if len(submissions) > 0:
        # Generate embeddings
        formatted_submissions = [f"{submission.title}\n{submission.selftext}" for submission in submissions]
        post_embeddings = get_openai_embeddings(formatted_submissions)

        # Create a FAISS index
        index = faiss.IndexFlatL2(post_embeddings.shape[1])
        index.add(post_embeddings)

        # Save embeddings
        embeddings_store = EmbeddingsStore()
        embeddings_store.submissions = formatted_submissions
        embeddings_store.embeddings = post_embeddings
        embeddings_store.index = index

        embeddings_store.save(username)

        qa_model_available = True

    # Save stats to reddit user model
    reddit_user.num_submissions = len(submissions)
    reddit_user.average_sentiment = overall_average_sentiment
    reddit_user.qa_model_available = qa_model_available
    
    # Store topic distributions
    for topic, distribution in topic_counter.items():
        topic_distribution = TopicDistribution(user_id=reddit_user.id, topic=topic, distribution=round(distribution, 2))
        db.session.add(topic_distribution)
    
    # Store average sentiments
    for topic, sentiment in average_sentiment.items():
        topic_sentiment = TopicSentiment(user_id=reddit_user.id, topic=topic, sentiment=round(sentiment, 2))
        db.session.add(topic_sentiment)
    
    db.session.commit()


def get_user_analysis(username: str):
    reddit_user = RedditUser.query.filter_by(username=username).first()
    
    # Retrieve topic distributions from database
    topics_distribution = TopicDistribution.query.filter_by(user_id=reddit_user.id).all()
    topics_distribution_dict = {td.topic: td.distribution for td in topics_distribution}
    
    # Retrieve topic sentiments from database
    topic_sentiments = TopicSentiment.query.filter_by(user_id=reddit_user.id).all()
    topic_sentiments_dict = {ts.topic: ts.sentiment for ts in topic_sentiments}
    
    result = {
        'topics_distribution': topics_distribution_dict,
        'average_sentiment_by_topic': topic_sentiments_dict,
        'total_submissions': reddit_user.num_submissions,
        'overall_average_sentiment': reddit_user.average_sentiment,
        'qa_model_available': reddit_user.qa_model_available
    }
    
    return result
