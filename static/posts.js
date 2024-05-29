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

    const interactionContainer = document.createElement('div');
    interactionContainer.classList.add('interaction-container');
    postContainer.appendChild(interactionContainer);

    return postContainer;
}

function buildArticlePost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'article-post');

    const titleElement = document.createElement('h1');
    titleElement.textContent = post.title;

    const lineBreak = document.createElement('hr');
    postContainer.appendChild(lineBreak);

    const contentElement = document.createElement('div');
    contentElement.innerHTML = marked(post.content);

    postContainer.appendChild(titleElement);
    if (post.thumbnail) {
        const imageElement = document.createElement('img');
        imageElement.src = post.thumbnail;
        imageElement.alt = post.title;
        postContainer.appendChild(imageElement);
    }
    if (post.description) {
        const descriptionElement = document.createElement('h2');
        descriptionElement.textContent = post.description;
        postContainer.appendChild(descriptionElement);
    }
    postContainer.appendChild(lineBreak);
    postContainer.appendChild(contentElement);

    const interactionContainer = document.createElement('div');
    interactionContainer.classList.add('interaction-container');

    const readingTime = estimateReadingTime(post.content);
    const readingTimeElement = document.createElement('span');
    readingTimeElement.classList.add('reading-time');
    readingTimeElement.textContent = `estimated reading time: ${readingTime} min`;
    interactionContainer.appendChild(readingTimeElement);

    postContainer.appendChild(interactionContainer);

    return postContainer;
}

function buildMicroblogPost(post) {
    const postContainer = document.createElement('div');
    postContainer.classList.add('post', 'microblog-post');

    const contentElement = document.createElement('div');
    contentElement.innerHTML = marked(post.content);

    postContainer.appendChild(contentElement);

    const interactionContainer = document.createElement('div');
    interactionContainer.classList.add('interaction-container');
    postContainer.appendChild(interactionContainer);

    return postContainer;
}

function estimateReadingTime(content) {
    const wordsPerMinute = 200;
    const textLength = content.split(' ').length;
    return Math.ceil(textLength / wordsPerMinute);
}

function addRating(post) {
    const ratingContainer = document.createElement('div');
    ratingContainer.classList.add('rating-container');

    const ratingButton = document.createElement('button');
    ratingButton.classList.add('rating-button');
    ratingButton.textContent = "+" + post.rating;

    ratingButton.addEventListener('click', async (event) => {
        try {
            const response = await fetch(`/api/posts/${post.id}/rate`, {
                method: 'POST',
            });
            const data = await response.json();
            if (data.message.includes('successfully')) {
                ratingButton.textContent = "+" + (parseInt(ratingButton.textContent.substring(1)) + 1);
            } else {
                console.error('Error rating post:', data);
            }
        } catch (error) {
            console.error('Error rating post:', error);
        }

        ratingButton.disabled = true;
    });

    ratingContainer.appendChild(ratingButton);

    return ratingContainer;
}

function addId(post) {
    const idElement = document.createElement('div');
    idElement.classList.add('post-id');
    const idText = document.createElement('span');
    idText.textContent = "#" + post.id;
    idElement.appendChild(idText);

    return idElement;
}

function addDateTimestamp(post) {
    const dateElement = document.createElement('div');
    dateElement.classList.add('date-timestamp');
    const dateText = document.createElement('span');

    dateText.textContent = new Date(post.date).toLocaleString();
    dateElement.appendChild(dateText);

    return dateElement;
}

//TODO: share button
function addShare(post) {
    const shareContainer = document.createElement('div');
    shareContainer.classList.add('share-container');

    const shareButton = document.createElement('button');
    shareButton.classList.add('share-button');
    shareButton.textContent = "Share";

    shareButton.addEventListener('click', (event) => {
        window.location.href = `/article?id=${post.id}`;
    });

    shareContainer.appendChild(shareButton);

    return shareContainer;
}

//TODO: zoom in on image when hovered

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
            const post = await response.json();
            posts = [post];
        }

        if (!posts || posts.length === 0) {
            feedContainer.classList.add('invisible');
            return;
        }

        posts.forEach(post => {
            let postContainer;
            if (post.type === 'image' && (type === 'all' || type === 'image')) {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article' && (type === 'all' || type === 'article')) {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog' && (type === 'all' || type === 'microblog')) {
                postContainer = buildMicroblogPost(post);
            }

            if (postContainer) {
                const rating = addRating(post);
                postContainer.appendChild(rating);

                const idElement = addId(post);
                postContainer.appendChild(idElement);

                const dateElement = addDateTimestamp(post);
                postContainer.appendChild(dateElement);

                const share = addShare(post);
                postContainer.querySelector('.interaction-container').appendChild(share);

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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('new-post-form');
    if (form) {
        function previewPost(post) {
            let postContainer;
            if (post.type === 'image') {
                postContainer = buildImagePost(post);
            } else if (post.type === 'article') {
                postContainer = buildArticlePost(post);
            } else if (post.type === 'microblog') {
                postContainer = buildMicroblogPost(post);
            }

            if (postContainer) {
                const previewContainer = document.getElementById('preview-container');
                previewContainer.innerHTML = '';
                previewContainer.appendChild(postContainer);
            }
        }

        const form = document.getElementById('new-post-form');
        const postTypeSelector = document.getElementById('post-type');
        const titleInput = document.getElementById('title');
        const thumbnailInput = document.getElementById('thumbnail');
        const descriptionInput = document.getElementById('description');
        const contentInput = document.getElementById('content');

        form.addEventListener('input', (event) => {
            const postData = {
                type: postTypeSelector.value,
                title: titleInput.value,
                thumbnail: thumbnailInput.value,
                description: descriptionInput.value,
                content: contentInput.value
            };
            previewPost(postData);
        });
    }
});
