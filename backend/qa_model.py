from sentence_transformers import SentenceTransformer
from EmbeddingsStore import EmbeddingsStore
from transformers import AutoTokenizer, AutoModelForCausalLM


embeddings_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
global_embeddings_store = EmbeddingsStore()

model_name = "EleutherAI/gpt-j-6B"
tokenizer = AutoTokenizer.from_pretrained(model_name)
text_generation_model = AutoModelForCausalLM.from_pretrained(model_name)


def retrieve_relevant_posts(question, top_k=5):
    question_embedding = embeddings_model.encode([question])
    _, indices = global_embeddings_store.index.search(question_embedding, top_k)
    relevant_posts = [global_embeddings_store.submissions[i] for i in indices[0]]
    return relevant_posts


def answer_question_with_retrieval(question, relevant_posts):
    context = "\n".join(relevant_posts)
    input_text = f"Context: {context}\n\nQuestion: {question}\nAnswer:"

    inputs = tokenizer(input_text, return_tensors="pt")
    outputs = text_generation_model.generate(**inputs, max_length=512, num_return_sequences=1, pad_token_id=tokenizer.eos_token_id)
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract the answer part from the generated text
    answer_start = generated_text.find("Answer:") + len("Answer:")
    answer = generated_text[answer_start:].strip()

    return answer


def prompt(question):
    relevant_posts = retrieve_relevant_posts(question)
    print(relevant_posts)
    return answer_question_with_retrieval(question, relevant_posts)
