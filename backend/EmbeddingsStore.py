import faiss
import numpy as np
import pickle


class EmbeddingsStore:
    def __init__(self):
        self.embeddings = None
        self.index = None
        self.submissions = []
        self.embeddings_path_prefix = "embeddings"
        self.indexes_path_prefix = "indexes"
        self.submissions_path_prefix = "submissions"
        self.username = None


    def load(self, username):
        self.embeddings = np.load(f"{self.embeddings_path_prefix}/{username}.npy")
        self.index = faiss.read_index(f"{self.indexes_path_prefix}/{username}.index")
        
        with open(f"{self.submissions_path_prefix}/{username}.pkl", 'rb') as f:
            self.submissions = pickle.load(f)
        
        self.username = username


    def save(self, username):
        np.save(f"{self.embeddings_path_prefix}/{username}.npy", self.embeddings)
        faiss.write_index(self.index, f"{self.indexes_path_prefix}/{username}.index")
        
        with open(f"{self.submissions_path_prefix}/{username}.pkl", 'wb') as f:
            pickle.dump(self.submissions, f)
