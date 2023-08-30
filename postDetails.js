// Those lines are used to get the post ID from the url
// The Post ID was sent as a query parameter
const url = new URL(window.location);
const searchParams = url.searchParams;
const postID = searchParams.get("postId");

// This function will be used to get the post clicked by the user and shows exactly the clicked post
function getClickedPost() {
    axios
        .get(`${baseURL}/posts/${postID}`)
        .then((response) => {
            // Here we bring the data of the response of the API
            const postData = response.data.data;
            const author = postData.author;
            const comments = postData.comments;

            const postContainer = document.querySelector("#post-container");
            postContainer.innerHTML = "";

            // Here we are filling the post with the information about the author's information and content
            let clickedPostContent = `
            <div class="post-creator my-4 fs-1 fw-semibold">
                <span>${author.username}'s</span>
                post
            </div>
            <div class="card mt-4 w-100 shadow" style="width: 18rem;">
                <section class="d-flex align-items-center gap-2 p-3 bg-body-tertiary border-bottom border-2">
                    <img src="${
                        author.profile_image
                    }" alt="User-Name-Photo" class="user-photo border border-light-subtle border-2">
                    <h6>${author.username}</h6>
                    <div class='ms-auto'>
                       <button type="button" class="btn btn-secondary ms-auto" data-bs-toggle="modal" data-bs-target="#editPostModal" onclick = 'editThisPost(${JSON.stringify(
                           postData
                       )})'>Edit</button>
                        <button type="button" class="btn btn-danger ">Delete</button>
                    </div>
                </section>
                <section class="p-3">
                    <img src="${
                        postData.image
                    }" class="card-img-top rounded-bottom" alt="Post-Image">
                    <div>
                        <p class="fs-6 text-body-tertiary">${
                            postData.created_at
                        }</p>
                        <h5 class="card-title">Special ${postData.title}</h5>
                        <p class="card-text pb-2 border-bottom border-2">${
                            postData.body
                        }</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                        </svg>
                        <span>(${postData.comments_count}) comments</span>
                </section>
            </div>
            `;

            postContainer.innerHTML = clickedPostContent;

            const commentsContainer = document.querySelector(".comments");
            commentsContainer.innerHTML = "";

            // Here we are filling the comments of the post
            for (comment of comments) {
                const commentContent = `
                <div class="comment-box p-3 border-bottom border-black">
                <div class="comment-user-details">
                    <img src="${comment.author.profile_image}" alt="Profile Picture">
                    <span class="px-2 fs-5">${comment.author.username}</span>
                </div>
                <p class="py-2">${comment.body}</p>
            </div>`;

                commentsContainer.innerHTML += commentContent;
            }
        })
        .catch((error) => {});
}

// function about adding comment with the information about the user
function addComment() {
    const token = localStorage.getItem("token");

    const commentInput = document.querySelector(".comment-input");

    const param = {
        body: commentInput.value,
    };

    const headers = {
        authorization: `Bearer ${token}`,
    };

    axios
        .post(`${baseURL}/posts/${postID}/comments`, param, {
            headers: headers,
        })
        .then((response) => {
            getClickedPost();
            commentInput.value = "";
        });
}

getClickedPost();

function editThisPost(postObj) {
    editPostTitleName.value = postObj.title;
    editPostBodyName.value = postObj.body;

    document.querySelector("#post-id-input").value = postObj.id;
}
