from sentence_transformers import SentenceTransformer
from EmbeddingsStore import EmbeddingsStore
from openai import OpenAI


embeddings_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
global_embeddings_store = EmbeddingsStore()

client = OpenAI()


def retrieve_relevant_posts(question, top_k=5):
    question_embedding = embeddings_model.encode([question])
    _, indices = global_embeddings_store.index.search(question_embedding, top_k)
    relevant_posts = [global_embeddings_store.submissions[i] for i in indices[0]]
    return relevant_posts


def answer_question_with_retrieval(question, messages, relevant_posts):
    context = "\n".join(relevant_posts)
    input_text = f"Context: {context}\n\nQuestion: {question}\nAnswer:"

    all_messages = [{"role": "system", "content": "You are a helpful assistant."}] + messages + [{"role": "user", "content": input_text}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=all_messages
    )

    answer = response.choices[0].message.content.strip()

    return answer


def prompt(question, messages):
    relevant_posts = retrieve_relevant_posts(question)
    print(relevant_posts)
    return answer_question_with_retrieval(question, messages, relevant_posts)
