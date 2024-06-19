# Problem Statement

Understanding the online behavior of Reddit users presents a significant challenge due to the sheer volume of content and the diversity of topics discussed. Manually analyzing this information is not only labor-intensive but also insufficient for extracting deep, meaningful insights. The vast nature of Reddit discussions necessitates a tool that can efficiently and comprehensively analyze user behavior, providing actionable insights without requiring users to sift through each post individually. Therefore, there is a pressing need for a sophisticated solution that can automate this analysis process, offering a detailed understanding of user behavior and enabling users to ask specific questions about user-generated content effortlessly.
# Solution

To tackle this challenge, I developed RedSense, a robust and intuitive tool designed to analyze individual Reddit users' activities. RedSense streamlines the analysis process by examining a user's most recent posts, generating embeddings that facilitate advanced question answering powered by ChatGPT. By leveraging AI, RedSense allows users to gain deep insights and ask targeted questions about a user's content without the cumbersome task of reading each post manually. This tool not only saves time but also provides a richer, more nuanced understanding of Reddit user behavior, making it an indispensable asset for researchers, marketers, and social media enthusiasts.
# Methodology

The development of RedSense involved several key steps:

- **Data Collection:** The backend server is designed to automatically gather the most recent posts from each Reddit user added to the system. This ensures that the analysis is based on up-to-date and relevant data, capturing the latest trends and topics of interest for each user.
- **Topic Distribution Analysis:** Using the facebook/bart-large-mnli model, RedSense identifies and categorizes the main topics discussed in the user's posts. This model allows for precise topic classification, providing a clear overview of the subjects the user is most engaged with and enabling a structured analysis of their content.
- **Sentiment Analysis:** To evaluate the sentiment of each post, RedSense employs VADER sentiment analysis. This tool assesses the emotional tone of the content, providing average sentiment scores per topic. By understanding the sentiment distribution, users can gain insights into the user's overall attitude and emotional engagement with different subjects.
- **Embeddings Creation:** RedSense generates embeddings for each user's posts using the text-embedding-3-small OpenAI model. These embeddings serve as the foundation for the ChatGPT 3.5 turbo-powered question-answering feature, allowing users to ask specific questions about the user's content and receive accurate, contextually relevant answers.

# Outcome

RedSense delivers a detailed and insightful analysis of individual Reddit users, offering the unique ability to ask targeted questions about their posts through a sophisticated QA model. This tool empowers users to make informed decisions, engage more effectively with Reddit communities, and gain a deeper understanding of user behavior without the need to manually read through all posts. By harnessing the power of social media analysis and AI-driven insights, RedSense stands as an invaluable resource for anyone seeking to leverage the vast information available on Reddit to its fullest potential. 
