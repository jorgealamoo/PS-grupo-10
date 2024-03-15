// index.js
import {signInWithGoogle} from './auth.js';

document.getElementById('googleLogin').addEventListener('click', async function() {
    try {
        const user = await signInWithGoogle();
        console.log('El usuario ha iniciado sesión correctamente:', user);
        alert('Inicio de sesión exitoso con Google');
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        alert('Error al iniciar sesión con Google: ' + error.message);
    }
});



import {logInUserPassword} from "./authUserPassword.js";

document.getElementById('LogIn').addEventListener('click',async function() {
    try {
        const email = document.getElementById('user_name').value;
        console.log(email)
        const password = document.getElementById('password').value;
        console.log(password)

        const user = await logInUserPassword(email,password);
        console.log('El usuario ha iniciado sesión correctamente con su email:', user);
        location.href='/PS-grupo-10/Front_end/MapPage/map.html'
    } catch (error) {
        console.error('Error al iniciar sesión con email:', error);
        alert('Error al iniciar sesión con email: ' + error.message);
    }
});


import {changePasswordUser} from "./changePasswd.js";