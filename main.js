const baseURL = "https://tarmeezacademy.com/api/v1";

getAllPosts();

function getAllPosts() {
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
            <div class="card mt-4 w-100 shadow" style="width: 18rem; cursor: pointer;" onclick="postClicked()">
                <section class="d-flex align-items-center gap-2 p-3 bg-body-tertiary border-bottom border-2">
                    <img src="${
                        "imgs/1.png" || author.profile_image
                    }" alt="User-Photo" class="user-photo border border-light-subtle border-2">
                    <h6>${author.username}</h6>
                </section>
                <section class="p-3">
                    <img src= ${
                        post.image
                    }  class="card-img-top rounded-bottom" alt="Post-Image">
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
}
// Capturing the Add Post Button
const addPostBtn = document.querySelector(".add-post-btn");

const logInSection = document.querySelector(".user-info__section ");
const logOutSection = document.querySelector(".logout__section ");

showUINavbarBtns();

// Capturing the username and password inputs in the LOGIN MODAl
const emailInput = document.querySelector("#recipient-name");
const passwordInput = document.querySelector("#recipient-password");

// Capturing the name, username and password inputs in the REGISTER MODAl
const registerName = document.querySelector("#register-name");
const registerUserName = document.querySelector("#register-user-name");
const registerPassword = document.querySelector("#register-password");
const registerPhoto = document.querySelector("#register-profile-image");

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
            params["profile_image"] = response.data.user.profile_image;
            token = response.data.token;
            localStorage.setItem("user", JSON.stringify(params));
            localStorage.setItem("token", token);

            // Closing the modal
            myModal.hide();

            showAlert("You have logged in successfully", "success");

            showUINavbarBtns();

            // document.querySelector(".profile-picture-image").src =
            //     response.data.user.profile_image;
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
    const headers = {
        "Content-Type": "multipart/form-data",
    };

    const registerData = new FormData();

    registerData.append("name", registerName.value);
    registerData.append("username", registerUserName.value);
    registerData.append("password", registerPassword.value);
    registerData.append("image", registerPhoto.files[0]);
    axios
        .post(`${baseURL}/register`, registerData, {
            headers: headers,
        })
        .then((response) => {
            console.log(response);
            // Positive request and saving the data in the Local Storage
            token = response.data.token;
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", token);

            // Closing the modal
            myRegisterModal.hide();

            showAlert("You have registered in successfully", "success");

            showUINavbarBtns();
        })
        .catch((error) => {
            // const message = error.response.data.message;
            // document.querySelector(".wrong-register-msg").innerHTML = message;
            console.log(error);
        });
}

// A Function to add post to the page
function addPost() {
    const postTitle = document.querySelector("#post-title-name");
    const postBody = document.querySelector("#post-body-name");
    const postImage = document.querySelector("#post-image-name").files[0];

    const token = localStorage.getItem("token");

    const headers = {
        authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
    };

    const formData = new FormData();

    formData.append("title", postTitle.value);
    formData.append("body", postBody.value);
    formData.append("image", postImage);

    axios
        .post(`${baseURL}/posts`, formData, {
            headers: headers,
        })
        .then((response) => {
            // Positive request and saving the data in the Local Storage
            addPostModal.hide();
            showAlert("Your post was added successfully", "success");
            getAllPosts();
        })
        .catch((error) => {
            const errorMessage = error.response.data.message;
            showAlert(errorMessage, "danger");
        });
}

// A function to show that the login went successfully
function showAlert(message, type) {
    const showAlertPlaceholder = document.getElementById(
        "showAlertPlaceholder"
    );

    showAlertPlaceholder.style.display = "block";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class=" position-absolute bottom-0 end-0 z-3 alert alert-${type} alert-dismissible fade show" role="alert" style="z-index: 999;">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    showAlertPlaceholder.append(wrapper);
}

function showUINavbarBtns() {
    let checkToken = localStorage.getItem("token");

    if (checkToken == null) {
        if (addPostBtn != null) {
            addPostBtn.style.setProperty("display", "none", "important");
        }
        logInSection.style.setProperty("display", "flex", "important");
        logOutSection.style.setProperty("display", "none", "important");
    } else {
        if (addPostBtn != null) {
            addPostBtn.style.setProperty("display", "flex", "important");
        }
        logInSection.style.setProperty("display", "none", "important");
        logOutSection.style.setProperty("display", "flex", "important");

        // Getting the user object from the local storage and using the value of the username and profile_image to fill the navbar
        const user = getUserDetails();
        document.querySelector(".logged-in-username").innerHTML = user.username;
        document.querySelector("#profile-picture-image").src =
            user.profile_image;
    }
}

function getUserDetails() {
    const userDetails = JSON.parse(localStorage.getItem("user"));

    return userDetails;
}

function postClicked() {
    window.open(`postDetails.html`, "_blank");
    showUINavbarBtns();
}

/*
    TODO:     
        1- Fill the comment section dynamically 
        2- Change user's comment profile picture and user name
        3- Change the name of the author of the post
        4- Fill the comment automatically with what we have from the API
        5- Send the ID of the post with the Query Parameter
*/
