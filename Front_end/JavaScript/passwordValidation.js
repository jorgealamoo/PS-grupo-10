function validatePassword() {
    pass1 = document.getElementById("password");
    pass2 = document.getElementById("confirmPassword");
    var errorDiv = document.getElementById("passwordError");

    if (pass1.value !== pass2.value) {
        errorDiv.innerText = "Passwords do not match";
    }
    else {
        errorDiv.innerText = "";
        window.location.href="../Login_index/index.html";
    }
}