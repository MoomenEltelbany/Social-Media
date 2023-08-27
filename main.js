const baseURL = "https://tarmeezacademy.com/api/v1";

// Capturing the Add Post Button
const addPostBtn = document.querySelector(".add-post-btn");

const logInSection = document.querySelector(".user-info__section ");
const logOutSection = document.querySelector(".logout__section ");

const commentSection = document.querySelector(".post-comment-section");

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
        commentSection.style.setProperty("display", "none", "important");
    } else {
        if (addPostBtn != null) {
            addPostBtn.style.setProperty("display", "flex", "important");
        }
        logInSection.style.setProperty("display", "none", "important");
        logOutSection.style.setProperty("display", "flex", "important");
        commentSection.style.setProperty("display", "flex", "important");

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

function postClicked(postId) {
    window.open(`postDetails.html?postId=${postId}`, "_blank");
    showUINavbarBtns();
}
