import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

function buildImagePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'image-post');

    const imageElement = document.createElement('img');
    imageElement.src = post.thumbnail;
    imageElement.alt = post.title;

    const titleElement = document.createElement('h1');
    titleElement.textContent = post.title;

    postContainer.appendChild(titleElement);
    postContainer.appendChild(imageElement);

    return postContainer;
}

function buildArticlePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'article-post');

    const imageElement = document.createElement('img');
    imageElement.src = post.thumbnail;
    imageElement.alt = post.title;

    const titleElement = document.createElement('h1');
    titleElement.textContent = post.title;

    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('textbox');
    const descriptionText = document.createElement('p');
    descriptionText.textContent = post.description;
    descriptionElement.appendChild(descriptionText);

    const lineBreak = document.createElement('br');
    postContainer.appendChild(lineBreak);

    const contentElement = document.createElement('div');
    contentElement.innerHTML = marked(post.content);

    postContainer.appendChild(titleElement);
    postContainer.appendChild(imageElement);
    postContainer.appendChild(descriptionElement);
    postContainer.appendChild(lineBreak);
    postContainer.appendChild(contentElement);

    return postContainer;
}

function buildMicroblogPost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'microblog-post');

    const contentElement = document.createElement('div');
    contentElement.innerHTML = marked(post.content);

    postContainer.appendChild(contentElement);

    return postContainer;
}

// function to add rating in hearts and a number to the post as a button
function addRating(post) {
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('rating-container');

    const ratingButton = document.createElement('button');
    ratingButton.classList.add('rating-button');
    ratingButton.textContent = post.rating;

    ratingContainer.appendChild(ratingButton);

    return ratingContainer;
}

async function fetchPosts() {
    const blogContainer = document.getElementById('blog-container');
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();

        console.log(posts);

        if (!posts || posts.length === 0) {
            blogContainer.classList.add('invisible');
            return;
        }

        posts.forEach(post => {
            let postContainer;
            if (post.type === 'image') {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article') {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog') {
                postContainer = buildMicroblogPost(post);
            }


            // const rating = addRating(post);
            // postContainer.appendChild(rating);


            console.log(postContainer);

            blogContainer.appendChild(postContainer);
        });

    } catch (error) {
        blogContainer.classList.add('invisible');
        console.error('Error fetching posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchPosts();
});
