from sentence_transformers import SentenceTransformer
from EmbeddingsStore import EmbeddingsStore
from transformers import pipeline


embeddings_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
global_embeddings_store = EmbeddingsStore()
qa_pipeline = pipeline('question-answering', model='distilbert-base-uncased-distilled-squad')


def retrieve_relevant_posts(question, top_k=5):
    question_embedding = embeddings_model.encode([question])
    _, indices = global_embeddings_store.index.search(question_embedding, top_k)
    relevant_posts = [global_embeddings_store.submissions[i] for i in indices[0]]
    return relevant_posts


def answer_question_with_retrieval(question, relevant_posts):
    context = "\n".join(relevant_posts)
    result = qa_pipeline(question=question, context=context)
    return result['answer']


def prompt(question):
    relevant_posts = retrieve_relevant_posts(question)
    return answer_question_with_retrieval(question, relevant_posts)
