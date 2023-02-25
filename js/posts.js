let page = 1;

const postsContainer = document.querySelector(".posts-container");
const recentPostsContainer = document.querySelector(".recent-posts-container");
const morePostsButtonContainer = document.querySelector(
  ".see-more-button-container"
);
const morePostsButton = document.querySelector(".more-posts-button");
const nextButton = document.querySelector("#next-button");
const prevButton = document.querySelector("#prev-button");
const categoryButton = document.querySelectorAll(".category-button");
const categoryOptions = document.querySelector(".category-options");
const carouselTips = document.querySelector(".carousel-tip");
const specificPostContainer = document.querySelector(
  ".specific-post-container"
);
const specificPostTitle = document.querySelector(".specific-post-title");
const postH1 = document.querySelector(".post-h1");
const searchBar = document.querySelector(".search-bar");

function dateFormatter(string) {
  return string.substring(0, 10);
}

function getShortText(string) {
  const newString = removeTags(string);
  return newString.substring(0, 110) + "...";
}

// removes the <p> tags from the excerpt
function removeTags(string) {
  return string.substring(3, string.length - 5);
}

// set up loading message in case of slow connection
if (postsContainer) {
  postsContainer.innerHTML = `<img class="loading" src="/images/gifs/loading-spinner.gif" alt="loading" />`;
} else if (specificPostContainer) {
  specificPostContainer.innerHTML = `<img class="loading" src="/images/gifs/loading-spinner.gif" alt="loading" />`;
}

async function getPosts() {
  try {
    const url = `https://travela.magnuspladsen.no/wp-json/wp/v2/posts?page=${page}&_embed`;
    const response = await fetch(url);
    // if try to get more pages than there are, hide the button
    if (response.ok === false) {
      morePostsButtonContainer.innerHTML = `<p class="no-more-posts">No more posts to show</p>`;
      return;
    } else {
      const posts = await response.json();
      const postCache = [];
      const oldPosts = JSON.parse(sessionStorage.getItem("posts"));
      if (oldPosts) {
        oldPosts.forEach((post) => {
          postCache.push(post);
        });
      }
      posts.forEach((post) => {
        if (!postCache.find((p) => p.id === post.id)) {
          postCache.push(post);
        }
      });
      sessionStorage.setItem("posts", JSON.stringify(postCache));
      displayPosts(postCache);
      setCategories(postCache);
    }
  } catch (error) {
    console.log(error);
    postsContainer.innerHTML = `<p class="error">Error, please reload the page</p>`;
  }
}

function displayPosts(posts, carouselOption = "none") {
  if (recentPostsContainer) {
    // remove loading message
    recentPostsContainer.innerHTML = "";

    let postCounter = 0;
    let postStopper = 2;

    if (carouselOption === "next") {
      postCounter = 3;
      postStopper = 5;
      carouselTips.innerHTML = "";
      carouselTips.innerHTML = `<p class="carousel-tip">Showing 3-6 of 6 most recent posts</p>`;
    } else if (carouselOption === "prev") {
      postCounter = 0;
      postStopper = 2;
      carouselTips.innerHTML = "";
      carouselTips.innerHTML = `<p class="carousel-tip">Showing 1-3 of 6 most recent posts</p>`;
    }
    for (postCounter; postCounter <= postStopper; postCounter++) {
      const post = posts[postCounter];
      recentPostsContainer.innerHTML += `
      <a href="/pages/post.html?id=${post.id}" class="post-link">
        <div class="post-container">
  
          <img
            class="post-img"
            src="${
              post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                .source_url
            }"
            alt="image of ${post.title.rendered}"
          />
          <div class="post-all-text-container">
            <h2 class="post-title">${post.title.rendered}</h2>
            <div class="post-info-container">
              <p class="post-author">By ${
                post._embedded.author[0].name
              }</p><p>-</p>
              <p class="post-date">${dateFormatter(post.date)}</p>
              <p>-</p>
              <p class="post-category">${
                post._embedded["wp:term"][0][0].name
              }</p>
            </div>
            <p class="post-text">${getShortText(post.excerpt.rendered)}</p>
            <p class="posts-readmore">Click to read more</p>
          </div>
        </div>
      </a>`;
    }
  } else if (postsContainer) {
    // remove loading message
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
      postsContainer.innerHTML += `
      <a href="post.html?id=${post.id}" class="post-link">
        <div class="post-container">
  
          <img
            class="post-img"
            src="${
              post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                .source_url
            }"
            alt="image of ${post.title.rendered}"
          />
          <div class="post-all-text-container">
            <h2 class="post-title">${post.title.rendered}</h2>
            <div class="post-info-container">
              <p class="post-author">By ${
                post._embedded.author[0].name
              }</p><p>-</p>
              <p class="post-date">${dateFormatter(post.date)}</p>
              <p>-</p>
              <p class="post-category">${
                post._embedded["wp:term"][0][0].name
              }</p>
            </div>
            <p class="post-text">${getShortText(post.excerpt.rendered)}</p>
            <p class="posts-readmore">Click to read more</p>
          </div>
        </div>
      </a>`;
    });
  } else {
    // remove loading message
    specificPostContainer.innerHTML = "";
    // get the id from the url
    const postID = new URLSearchParams(window.location.search).get("id");
    // find the post with the id
    const post = posts.find((post) => post.id === parseInt(postID));
    specificPostTitle.innerHTML = "Travela - " + post.title.rendered;
    // display the post
    specificPostContainer.innerHTML = `
    <img
      class="specific-post-img"
      src="${
        post._embedded["wp:featuredmedia"][0].media_details.sizes.full
          .source_url
      }"
      alt="image of ${post.title.rendered}"
    />
    <div class="post-all-text-container">
    <div class="speicific-post-text-container">
      ${post.content.rendered}
      </div>
      <div class="post-info-container">
      <p class="post-author">By ${post._embedded.author[0].name}</p><p>-</p>
      <p class="post-date">${dateFormatter(post.date)}</p>
      <p>-</p>
      <p class="post-category">${post._embedded["wp:term"][0][0].name}</p>
    </div>
    </div>`;
    postH1.innerHTML = post.title.rendered;
  }
}

function sortByCategory(posts, category) {
  if (category === "All") {
    displayPosts(posts);
    return;
  } else {
    const filteredPosts = posts.filter((post) => {
      return post._embedded["wp:term"][0][0].name === category;
    });
    displayPosts(filteredPosts);
  }
}

function AddCategoryOptions() {
  if (categoryButton) {
    categoryButton.forEach((button) => {
      button.onclick = function () {
        categoryOptions.classList.toggle("hidden");
      };
    });
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      const posts = JSON.parse(sessionStorage.getItem("posts"));
      option.onclick = function () {
        sortByCategory(posts, option.id);
        categoryOptions.classList.toggle("hidden");
        options.forEach((option) => {
          option.classList.remove("selected");
        });
        option.classList.toggle("selected");
      };
    });
  }
}

function setCategories(posts) {
  if (categoryOptions) {
    categoryOptions.innerHTML = "";
    const newCategories = { all: 0 };
    posts.forEach((post) => {
      newCategories[post._embedded["wp:term"][0][0].name] = 0;
    });
    posts.forEach((post) => {
      if (post._embedded["wp:term"][0][0].name) {
        newCategories[post._embedded["wp:term"][0][0].name]++;
        newCategories.all++;
      }
    });

    categoryOptions.innerHTML += `<div class="option" id="All">All posts (${newCategories.all})</div>`;

    Object.keys(newCategories).forEach((category) => {
      if (category === "all") {
        return;
      } else {
        categoryOptions.innerHTML += `<div class="option" id="${category}">${category} (${newCategories[category]})</div>
    `;
      }
    });
    AddCategoryOptions();
  }
}

// function sort by search
function sortBySearch(search) {
  const posts = JSON.parse(sessionStorage.getItem("posts"));
  const filteredPosts = posts.filter((post) => {
    const text = post.title.rendered
      .toLowerCase()
      .includes(search.toLowerCase());
    return text;
  });
  console.log(filteredPosts);
  if (filteredPosts.length === 0) {
    postsContainer.innerHTML = `<h2 class="no-posts">No posts matching your search "${search}" found </h2>`;
  } else {
    displayPosts(filteredPosts);
  }
}

// onchange handlere for search input

if (searchBar) {
  searchBar.addEventListener("change", (event) => {
    sortBySearch(event.target.value);
  });
}

// check if posts are in sessionStorage
if (sessionStorage.getItem("posts")) {
  // if so, get them from sessionStorage
  const posts = JSON.parse(sessionStorage.getItem("posts"));
  displayPosts(posts);
  setCategories(posts);
} else {
  // if not, get them from the API
  getPosts();
}

// if on all blogs page add event listener for the see more posts button
if (morePostsButton) {
  morePostsButton.onclick = function () {
    page++;
    getPosts();
  };
}

if (nextButton) {
  nextButton.onclick = function () {
    const posts = JSON.parse(sessionStorage.getItem("posts"));
    displayPosts(posts, "next");
    prevButton.classList.remove("hidden");
    nextButton.classList.add("hidden");
  };
}

if (prevButton) {
  prevButton.onclick = function () {
    const posts = JSON.parse(sessionStorage.getItem("posts"));
    displayPosts(posts, "prev");
    nextButton.classList.remove("hidden");
    prevButton.classList.add("hidden");
  };
}
