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


def answer_question_with_retrieval(question, relevant_posts):
    context = "\n".join(relevant_posts)
    input_text = f"Context: {context}\n\nQuestion: {question}\nAnswer:"

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": input_text}
        ]
    )

    generated_text = response.choices[0].message.content.strip()

    # Extract the answer part from the generated text
    answer_start = generated_text.find("Answer:") + len("Answer:")
    answer = generated_text[answer_start:].strip()

    return answer


def prompt(question):
    relevant_posts = retrieve_relevant_posts(question)
    print(relevant_posts)
    return answer_question_with_retrieval(question, relevant_posts)
