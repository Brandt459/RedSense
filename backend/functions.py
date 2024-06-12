from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter
from transformers import pipeline, BertTokenizer, BertForSequenceClassification
import torch
import numpy as np
from typing import List
from client import reddit
from db import db
from models import RedditUser, TopicDistribution, TopicSentiment


analyzer = SentimentIntensityAnalyzer()
classifier = pipeline('zero-shot-classification', model='facebook/bart-large-mnli')


# Return most likely topic for a post
def categorize_text(text: str) -> dict:
    candidate_labels = [
        'technology', 'gaming', 'entertainment', 'sports', 'news and current events',
        'health and fitness', 'science', 'education', 'finance and cryptocurrency', 'lifestyle and hobbies'
    ]
    return classifier(text, candidate_labels)


""" tokenizer = BertTokenizer.from_pretrained('harrisonzhuo/BERT-MBTI')
model = BertForSequenceClassification.from_pretrained('harrisonzhuo/BERT-MBTI')

# MBTI types as per the model's training
mbti_types = ['INFP', 'INFJ', 'INTP', 'INTJ', 'ISFP', 'ISFJ', 'ISTP', 'ISTJ', 
              'ENFP', 'ENFJ', 'ENTP', 'ENTJ', 'ESFP', 'ESFJ', 'ESTP', 'ESTJ']

# Returns confidence score for each MBTI type based on post
def predict_mbti_with_confidence(text: str) -> List[float]:
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=1).cpu().numpy()
    return probabilities[0]


def infer_mbti(posts: List[str]) -> str:
    # Predict MBTI types with confidence scores and calculate weights for each post
    weighted_scores = np.zeros((len(mbti_types),))
    total_weight = 0

    for post in posts:
        probabilities = predict_mbti_with_confidence(post)
        weight = max(probabilities)     # Weigh overall MBTI calculation by individual post mbti confidence
        weighted_scores += probabilities * weight
        total_weight += weight

    # Calculate the weighted average confidence scores
    average_confidence_scores = weighted_scores / total_weight if total_weight != 0 else weighted_scores

    # Determine the most likely MBTI type
    most_likely_mbti_index = np.argmax(average_confidence_scores)
    most_likely_mbti = mbti_types[most_likely_mbti_index]

    # Print the results
    print(f"Most Likely MBTI: {most_likely_mbti}")
    print("Weighted Average Confidence Scores:")
    for mbti, score in zip(mbti_types, average_confidence_scores):
        print(f"{mbti}: {score:.4f}")

    return most_likely_mbti """


def analyze_user_posts(username: str) -> dict:
    user = reddit.redditor(username)
    submissions = list(user.submissions.new(limit=5))
    
    # Initialize counters and storage
    topic_counter = Counter()
    sentiment_by_topic = Counter()
    count_by_topic = Counter()
    all_texts = []
    
    for submission in submissions:
        post = f"{submission.title}\n{submission.selftext}"
        topic_distribution = categorize_text(post)
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
    
    # Infer Myers-Briggs personality type
    #mbti = infer_mbti(all_texts)

    # Check if RedditUser exists, otherwise create
    reddit_user = RedditUser.query.filter_by(username=username).first()
    if reddit_user:
        reddit_user.num_submissions = len(submissions)
        reddit_user.average_sentiment = overall_average_sentiment
    else:
        reddit_user = RedditUser(username=username, num_submissions=len(submissions), average_sentiment=overall_average_sentiment)
        db.session.add(reddit_user)
        
    db.session.commit()
    
    # Store topic distributions
    for topic, distribution in topic_counter.items():
        topic_distribution = TopicDistribution(user_id=reddit_user.id, topic=topic, distribution=round(distribution, 2))
        db.session.add(topic_distribution)
    
    # Store average sentiments
    for topic, sentiment in average_sentiment.items():
        topic_sentiment = TopicSentiment(user_id=reddit_user.id, topic=topic, sentiment=round(sentiment, 2))
        db.session.add(topic_sentiment)
    
    db.session.commit()


def get_user_analysis(username):
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
        'overall_average_sentiment': reddit_user.average_sentiment
    }
    
    return result
