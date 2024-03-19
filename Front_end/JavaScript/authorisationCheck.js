function checkAuth() {
    const userId = localStorage.getItem('userId');

    // Make a GET request to your server-side API endpoint
    document.body.style.display = 'none';
    fetch('http://localhost:3000/api/checkAuth/' + userId)
        .then(response => {
            if (response.ok) {
                // User is authenticated, continue to the dashboard
                console.log("User is authenticated");
                document.body.style.display = 'block'; // Show content
            } else {
                // User is not authenticated, redirect to login page
                console.log("User is not authenticated, redirecting to login page");
                location.href = '/PS-grupo-10/Front_end/Login_index/index.html';
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
        });
}