function checkAuth() {
    //npm install dotenv
    //require('dotenv').config();

    var authenticate = true;     //If "true" se prueba la autenticación
    const userId = localStorage.getItem('userId');

    if (authenticate) {
        // Make a GET request to your server-side API endpoint
        document.body.style.display = 'none';

        //fetch(process.env.HOST_API + '/api/checkAuth/' + userId)
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
    } else {
        console.log("Authentication Disabled")
    }
}