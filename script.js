function a(){
    window.location="login/login.html"
}
function signup(){
    window.location="login/login.html"
}
function toproperties(){
    window.location="properties/properties.html"
}  
function move(){
    window.location="properties/properties.html"
}
function transferaddproperties(){
    window.location="addproperties/addproperties.html"
}
// Simulate login function
function login() {
    // Set the user as logged in by storing in localStorage (or sessionStorage)
    localStorage.setItem('isLoggedIn', 'true');

    // Redirect to the home page or do any other actions you need
    window.location = "index.html";
}

// Function to check if the user is logged in and remove the login button if true
function checkLoginStatus() {
    // Check if user is logged in by reading localStorage
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Hide the login button if user is logged in
        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            loginButton.style.display = 'none';
        }
    }
}

// Call the checkLoginStatus function when the page loads
window.onload = checkLoginStatus;

function logout() {
    // Remove login status
    localStorage.removeItem('isLoggedIn');
    
    // Refresh the page or redirect to the login page
    window.location.reload();
}
