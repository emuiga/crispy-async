//grab HTML elements

const userCard = document.getElementById("user-card");
const postsContainer = document.getElementById("posts-container");
const postsList = document.getElementById("posts-list");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error-message");
const errorText = document.getElementById("error-text");
const themeToggle = document.getElementById("theme-toggle");



//helper functions

function showLoading(){
    loadingEl.classList.remove('hidden');
    userCard.classList.add('hidden')
    postsContainer.classList.add('hidden')
    errorEl.classList.add('hidden')
}

function hideLoading(){
    loadingEl.classList.add('hidden')
}

function showError(message){
    errorText.textContent = message;
    errorEl.classList.remove('hidden')
}

function clearUI(){
    userCard.classList.add('hidden')
    postsContainer.classList.add('hidden')
    errorEl.classList.add('hidden')
    postsList.innerHTML = ''
}


// ============================================================
// FETCH — real HTTP requests using the browser's fetch() API
// fetch(url) returns a Promise
// response.json() ALSO returns a Promise — needs its own await
// Always check response.ok — fetch() doesn't throw on 404/500
// ============================================================

async function fetchUser(userId){
    // const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    // if (!response.ok) throw new Error(`User not found: ${response.status}`)
    // return await response.json()

    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    if (!response.ok)
        throw new Error(`User not found: ${response.status}`)
    return await response.json()
}

async function fetchPosts(userId){
    // Same pattern as fetchUser but different URL:
    // https://jsonplaceholder.typicode.com/users/${userId}/posts
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
    if(!response.ok)
        throw new Error(`Failed: ${response.status}`)
    return await response.json()
}


// ============================================================
// RENDER — take data objects and turn them into HTML strings
// Set that HTML into the element using innerHTML
// Then remove 'hidden' so the element becomes visible
// ============================================================

function renderUser(user){
    // user looks like: { id, name, email, phone, company: { name } }
    //
    // userCard.innerHTML = `
    //   <h2 class="user-name">${user.name}</h2>
    //   <p class="user-detail"><span>Email</span>${user.email}</p>
    //   <p class="user-detail"><span>Phone</span>${user.phone}</p>
    //   <p class="user-detail"><span>Company</span>${user.company.name}</p>
    // `
    // Then: remove 'hidden' from userCard

    userCard.innerHTML = `
    <h2 class="user-name">${user.name}</h2>
    <p class="user-detail"><span>Email</span>${user.email}</p>
    <p class="user-detail"><span>Phone</span>${user.phone}</p>
    <p class="user-detail"><span>Company</span>${user.company.name}</p>
    `
    userCard.classList.remove('hidden')
}

function renderPosts(posts){
    // posts is an ARRAY — loop through it and build one card string per post
    // post looks like: { id, title, body }
    //
    // Option: use .map() to turn each post into an HTML string, then .join('')
    //
    // postsList.innerHTML = posts.map(post => `
    //   <div class="post-card">
    //     <p class="post-title">${post.title}</p>
    //     <p class="post-body">${post.body}</p>
    //   </div>
    // `).join('')
    //
    // Then: remove 'hidden' from postsContainer

    postsList.innerHTML = posts.map(post =>
        `
        <div class="post-card">
        <p class="post-title">${post.title}</p>
        <p class="post-body">${post.body}</p>
        </div>
    `).join('')
    postsContainer.classList.remove('hidden')
}


// ============================================================
// MAIN — this is where all the async concepts come together
// Called by the buttons in index.html: onclick="loadDashboard(1)"
// ============================================================

async function loadDashboard(userId){
    clearUI()
    showLoading()
    try{
        const [user, posts] = await Promise.all([
            fetchUser(userId),
            fetchPosts(userId)
        ])

        renderUser(user)
        renderPosts(posts)
    } catch (error){
        showError(error.message)
    }
    finally{
        hideLoading()
    }
}


async function triggerError(){
    // Same structure as loadDashboard but pass an invalid userId
    // e.g. loadDashboard(9999)
    // OR manually fetch a bad URL and throw if !response.ok
    loadDashboard(9999)
}


// ============================================================
// THEME TOGGLE — runs when the ☀️ button is clicked
// document.documentElement = the <html> tag
// We read its current data-theme, flip it, update the emoji
// ============================================================

themeToggle.addEventListener('click', function(){
    const current = document.documentElement.getAttribute('data-theme')
    
    if (current === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light')
      themeToggle.textContent = '☀️'
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
      themeToggle.textContent = '🌙'
    }
})