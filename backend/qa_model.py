from EmbeddingsStore import EmbeddingsStore
from openai import OpenAI
import numpy as np


global_embeddings_store = EmbeddingsStore()
client = OpenAI()


def get_openai_embeddings(text_list):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text_list
    )
    embeddings = [data.embedding for data in response.data]
    embeddings_matrix = np.array(embeddings).astype('float32')
    return embeddings_matrix


def retrieve_relevant_posts(question, top_k=5):
    question_embedding = get_openai_embeddings([question])
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
