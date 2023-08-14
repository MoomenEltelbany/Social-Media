const baseURL = "https://tarmeezacademy.com/api/v1";

// API Get request for the post
axios.get(`${baseURL}/posts?limit=4`).then(function (response) {
    // Array for posts
    let posts = response.data.data;

    // Post container
    let postContainer = document.querySelector(".posts-container");

    postContainer.innerHTML = "";
    // handle success

    for (post of posts) {
        // Let Author details
        let author = post.author;

        // console.log(post);
        let postContent = `
            <div class="card mt-4 w-100 shadow" style="width: 18rem;">
                <section class="d-flex align-items-center gap-2 p-3 bg-body-tertiary border-bottom border-2">
                    <img src="${
                        "imgs/1.png" || author.profile_image
                    }" alt="User-Photo" class="user-photo border border-light-subtle border-2">
                    <h6>${author.username}</h6>
                </section>
                <section class="p-3">
                    <img src="./imgs/1.jpeg" class="card-img-top rounded-bottom" alt="Post-Image">
                    <div>
                        <p class="fs-6 text-body-tertiary">${
                            post.created_at
                        }</p>
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text pb-2 border-bottom border-2">${
                            post.body
                        }</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg>
                        <span>(${post.comments_count}) comments</span>
                </section>
            </div>`;

        postContainer.innerHTML += postContent;
    }
});

// Capturing the Add Post Button
const addPostBtn = document.querySelector(".add-post-btn");

const logInSection = document.querySelector(".user-info__section ");
const logOutSection = document.querySelector(".logout__section ");

showUINavbarBtns();

// Capturing the username and password inputs in the LOGIN MODAl
const emailInput = document.querySelector("#recipient-name");
const passwordInput = document.querySelector("#recipient-password");

// Capturing the name, username and password inputs in the LOGIN MODAl
const registerName = document.querySelector("#register-name");
const registerUserName = document.querySelector("#register-user-name");
const registerPassword = document.querySelector("#register-password");

// Declaring the token variable globally
let token = ``;

// Creating an instance of the modal through the bootstrap.Modal class
const myModal = new bootstrap.Modal("#loginModal");
const myRegisterModal = new bootstrap.Modal("#registerModal");

// Function that will be invoked once the client hits the submit btn in the login form
function loginUser() {
    let params = {
        username: emailInput.value,
        password: passwordInput.value,
    };

    axios
        .post(`${baseURL}/login`, params)
        .then((response) => {
            // Positive request and saving the data in the Local Storage
            token = response.data.token;
            localStorage.setItem("user", JSON.stringify(params));
            localStorage.setItem("token", token);

            // Closing the modal
            myModal.hide();

            showAlert("You have logged in successfully", "success");

            showUINavbarBtns();

            document.querySelector(".logged-in-username").innerHTML =
                params.username;
            console.log(params.username);
        })
        .catch((error) => {
            const message = error.response.data.message;
            document.querySelector(".wrong-username-msg").innerHTML = message;
        });
}

// The function that will log out which will change the display of buttons, use the function to show the alert and remove the token from the local storage
function logOut() {
    showAlert("You have logged out successfully", "danger");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    showUINavbarBtns();
}

function registerUser() {
    let params = {
        name: registerName.value,
        username: registerUserName.value,
        password: registerPassword.value,
    };

    axios
        .post(`${baseURL}/register`, params)
        .then((response) => {
            // Positive request and saving the data in the Local Storage
            token = response.data.token;
            localStorage.setItem("user", JSON.stringify(params));
            localStorage.setItem("token", token);

            // Closing the modal
            myRegisterModal.hide();

            showAlert("You have registered in successfully", "success");

            showUINavbarBtns();
        })
        .catch((error) => {
            const message = error.response.data.message;
            document.querySelector(".wrong-register-msg").innerHTML = message;
        });
}

// A Function to add post to the page
function addPost() {}

// A function to show that the login went successfully
function showAlert(message, type) {
    const showAlertPlaceholder = document.getElementById(
        "showAlertPlaceholder"
    );

    showAlertPlaceholder.style.display = "block";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    showAlertPlaceholder.append(wrapper);
}

function showUINavbarBtns() {
    let checkToken = localStorage.getItem("token");

    if (checkToken == null) {
        addPostBtn.style.setProperty("display", "none", "important");
        logInSection.style.setProperty("display", "flex", "important");
        logOutSection.style.setProperty("display", "none", "important");
    } else {
        addPostBtn.style.setProperty("display", "flex", "important");
        logInSection.style.setProperty("display", "none", "important");
        logOutSection.style.setProperty("display", "flex", "important");
    }
}

/*
    TODO: 
        1- The modal of the add post.
        2- The user name next to the logout button disappears if we refresh.
        3- Create Post and upload photos.
*/
