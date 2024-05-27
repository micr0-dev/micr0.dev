import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function buildImagePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'image-post');

    const imageElement = document.createElement('img');
    imageElement.src = post.Thumbnail;
    imageElement.alt = post.Title;

    const titleElement = document.createElement('h2');
    titleElement.textContent = post.Title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = post.Description;

    postContainer.appendChild(imageElement);
    postContainer.appendChild(titleElement);
    postContainer.appendChild(descriptionElement);

    return postContainer;
}

function buildArticlePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'article-post');

    const titleElement = document.createElement('h2');
    titleElement.textContent = post.Title;

    const contentElement = document.createElement('p');
    contentElement.textContent = marked(post.Content);

    postContainer.appendChild(titleElement);
    postContainer.appendChild(contentElement);

    return postContainer;
}

function buildMicroblogPost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'microblog-post');

    const titleElement = document.createElement('h3');
    titleElement.textContent = post.Title;

    const contentElement = document.createElement('p');
    contentElement.textContent = marked(post.Content);

    postContainer.appendChild(titleElement);
    postContainer.appendChild(contentElement);

    return postContainer;
}

async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();

        posts.forEach(post => {
            let postContainer;
            if (post.type === 'image') {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article') {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog') {
                postContainer = buildMicroblogPost(post);
            }

            const blogContainer = document.getElementById('blog-container');
            blogContainer.appendChild(postContainer);
        });

        // Hide if no posts are found
        if (!posts || posts.length === 0) {
            blogContainer.classList.add('invisible');
        }

    } catch (error) {
        blogContainer.classList.add('invisible');
        console.error('Error fetching posts:', error);
    }
}

// Make sure to call the function when the DOM is ready
document.addEventListener('DOMContentLoaded', (event) => {
    fetchPosts();
});
