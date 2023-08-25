const url = new URL(window.location);
const searchParams = url.searchParams;
const posID = searchParams.get("postId");

function getClickedPost() {
    axios
        .get(`${baseURL}/posts/${posID}`)
        .then((response) => {
            const postData = response.data.data;
            console.log(postData);
        })
        .catch((error) => console.log(error));
}

getClickedPost();
