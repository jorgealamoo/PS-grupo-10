
// Función para mostrar/ocultar el contenedor de cambio de contraseña
function toggleChangePassword() {
    var container = document.getElementById('changePasswordContainer');
    container.classList.toggle('active');
}

async function validateOfChangePassword() {
    const pass1 = document.getElementById("newPassword");
    const pass2 = document.getElementById("repeatPassword");
    var errorDiv = document.getElementById("passwordError");

    if (pass1.value !== pass2.value) {
        errorDiv.innerText = "Passwords do not match";
    } else if (pass1.value === "" && pass2.value === "") {
        errorDiv.innerText = "Password is empty";
    } else {
        //errorDiv.innerText = "";
        //toggleChangePassword();
        console.log('Hace ALGO')
        try {
            if (document.getElementById('newPassword').value != document.getElementById('newPassword').value) {
                alert("No coinciden las contraseñas")
                return; //Se sale si no coinciden las contraseñas
            }

            const newPassword = document.getElementById('newPassword').value;
            console.log(document.getElementById('newPassword').value);
            const user = localStorage.getItem('userId');
            console.log(localStorage.getItem('userId'));

            //Se cambia la contraseña
            /*if (await changePassword(user, newPassword)) {
                alert('Se ha cambiado la contraseña');
                console.error('Se ha cambiado la contraseña');
            }*/
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            alert('Error al iniciar sesión con Google: ' + error.message);
        }
    }
}
