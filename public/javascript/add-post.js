async function newFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const post_content = document.querySelector('input[name="post-content"]').value;

    const response = await fetch(`/apit/posts`, {
        method: "POST",
        body: JSON.stringify({
            title, 
            post_content
        }),
        headers: {
            "Content-Type": "appication/json"
        }
    });

    if (response.ok) {
        document.location.replace("/dashboard");
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener("submit", newFormHandler);