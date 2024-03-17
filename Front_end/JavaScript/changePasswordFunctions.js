
// Función para mostrar/ocultar el contenedor de cambio de contraseña
function toggleChangePassword() {
    var container = document.getElementById('changePasswordContainer');
    container.classList.toggle('active');
}

async function validateOfChangePassword() {
    const userID = localStorage.getItem('userId');
    const pass1 = document.getElementById("newPassword");
    console.log(pass1.value);
    const pass2 = document.getElementById("repeatPassword");
    console.log(pass2.value);
    var errorDiv = document.getElementById("passwordError");

    if (pass1.value !== pass2.value) {
        errorDiv.innerText = "Passwords do not match";
    } else if (pass1.value === "" && pass2.value === "") {
        errorDiv.innerText = "Password is empty";
    } else if (pass1.value.length < 6){
        errorDiv.innerText = "At least 6 characters";
        return;
    } else {
        console.log('Contraseñas Iguales')
        errorDiv.innerText = "";
        try {
            try {
                const response = await fetch('http://localhost:3000/api/changePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "userId": userID.toString(), "newPassword" :pass1.value.toString() })
                });

                console.log(JSON.stringify({ "userId": userID.toString(), "newPassword" :pass1.value.toString()}))

                const data = await response.json();
                if (response.ok) {
                    toggleChangePassword();
                    alert(data.message);
                } else {
                    document.getElementById('message').textContent = data.error.message;
                    alert('Error al cambiar contraseña: ' + data.error.message);
                }
            } catch (error) {
                console.error('Error during password change:', error.message);
                alert('Error: ' + error.message);
            }


        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            alert('Error al iniciar sesión con Google: ' + error.message);
        }
    }
}
