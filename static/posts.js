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

    const descriptionElement = document.createElement('h2');
    descriptionElement.textContent = post.description;
    // TODO: Add reading time

    const lineBreak = document.createElement('hr');
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

// TODO: Implement rating system
function addRating(post) {
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('rating-container');

    const ratingButton = document.createElement('button');
    ratingButton.classList.add('rating-button');
    ratingButton.textContent = post.rating;

    ratingContainer.appendChild(ratingButton);

    return ratingContainer;
}

function addId(post) {
    const idElement = document.createElement('div');
    idElement.classList.add('post-id');
    idElement.textContent = "#" + post.id;

    return idElement;
}

async function fetchPosts() {
    let type = 'all';
    const feedContainer = document.getElementById('feed-container');

    if (feedContainer.classList.contains('image-feed')) {
        type = 'image';
    } else if (feedContainer.classList.contains('article-feed')) {
        type = 'article';
    } else if (feedContainer.classList.contains('microblog-feed')) {
        type = 'microblog';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    try {
        let posts;
        if (!postId) {
            const response = await fetch('/api/posts');
            posts = await response.json();
        } else {
            const response = await fetch(`/api/posts/${postId}`);
            posts = await response.json();
        }
        console.log(posts);

        if (!posts || posts.length === 0) {
            feedContainer.classList.add('invisible');
            return;
        }

        console.log('Type:', type);
        console.log('Feed Container:', feedContainer);

        posts.forEach(post => {
            let postContainer;
            if (post.type === 'image' && (type === 'all' || type === 'image')) {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article' && (type === 'all' || type === 'article')) {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog' && (type === 'all' || type === 'microblog')) {
                postContainer = buildMicroblogPost(post);
            }

            // const rating = addRating(post);
            // postContainer.appendChild(rating);

            const idElement = addId(post);
            postContainer.appendChild(idElement);

            if (postContainer) {
                console.log(postContainer);
                feedContainer.appendChild(postContainer);
            }
        });

    } catch (error) {
        feedContainer.classList.add('invisible');
        console.error('Error fetching posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchPosts();
});