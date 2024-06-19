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
        try:
            self.embeddings = np.load(f"{self.embeddings_path_prefix}/{username}.npy")
        except:
            print('Could not load embeddings')
            self.embeddings = None

        try:
            self.index = faiss.read_index(f"{self.indexes_path_prefix}/{username}.index")
        except:
            print('Could not load index')
            self.index = None

        try:
            with open(f"{self.submissions_path_prefix}/{username}.pkl", 'rb') as f:
                self.submissions = pickle.load(f)
        except:
            print('Could not load submissions')
            self.submissions = None
        
        self.username = username


    def save(self, username):
        np.save(f"{self.embeddings_path_prefix}/{username}.npy", self.embeddings)
        faiss.write_index(self.index, f"{self.indexes_path_prefix}/{username}.index")
        
        with open(f"{self.submissions_path_prefix}/{username}.pkl", 'wb') as f:
            pickle.dump(self.submissions, f)
