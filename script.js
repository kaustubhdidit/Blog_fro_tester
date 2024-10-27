// Mock Data
let users = [];
let articles = [];
let currentUser = null;
let selectedArticle = null;
const backendUrl = "https://blogger-springboot-sca.onrender.com";
// Show/Hide Sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// User Authentication
function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        alert("Login successful!");
        showSection('articles');
    } else {
        alert("Invalid credentials.");
    }
}

function register() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;
    const backendUrl = "https://blogger-springboot-sca.onrender.com";

    // Define the request body
    const body = {
        username: username,
        password: password,
        email: email
    };

    // Make the POST request to the API
    fetch(`https://blogger-springboot-sca.onrender.com/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to register. Please try again.");
        }
        return response.json();
    })
    .then(data => {
        alert("Registration successful!");
        showSection('login');
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error during registration: " + error.message);
    });
}


// Article CRUD
function createArticle() {
    const title = document.getElementById("articleTitle").value;
    const content = document.getElementById("articleContent").value;

    if (currentUser) {
        articles.push({ title, content, author: currentUser.username, comments: [] });
        alert("Article created!");
        displayArticles();
        showSection('articles');
    } else {
        alert("You need to be logged in to create an article.");
    }
}

function displayArticles() {
    const articleList = document.getElementById("articleList");
    articleList.innerHTML = "";
    articles.forEach((article, index) => {
        const articleDiv = document.createElement("div");
        articleDiv.className = "article";
        articleDiv.innerHTML = `
            <h3>${article.title}</h3>
            <p>By ${article.author}</p>
            <p>${article.content}</p>
            <button onclick="viewComments(${index})">View Comments</button>
            <button onclick="editArticle(${index})">Edit</button>
        `;
        articleList.appendChild(articleDiv);
    });
}

function editArticle(index) {
    const article = articles[index];
    document.getElementById("articleTitle").value = article.title;
    document.getElementById("articleContent").value = article.content;
    selectedArticle = index;
    showSection('createArticle');
}

function updateArticle() {
    if (selectedArticle !== null && currentUser) {
        articles[selectedArticle].title = document.getElementById("articleTitle").value;
        articles[selectedArticle].content = document.getElementById("articleContent").value;
        alert("Article updated!");
        displayArticles();
        showSection('articles');
    }
}

function viewComments(articleIndex) {
    const article = articles[articleIndex];
    const commentList = document.getElementById("commentList");
    commentList.innerHTML = article.comments.map(comment => `<p>${comment}</p>`).join("");
    selectedArticle = articleIndex;
    showSection('comments');
}

// Comments
function addComment() {
    const comment = document.getElementById("newComment").value;
    if (selectedArticle !== null && comment) {
        articles[selectedArticle].comments.push(comment);
        alert("Comment added!");
        viewComments(selectedArticle);
    }
}

// Initialize
showSection('login');

