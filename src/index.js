// index.js

import { signInWithGoogle, signInWithFacebook } from './auth.js';

document.getElementById('googleLogin').addEventListener('click', async function() {
    try {
        const user = await signInWithGoogle();
        console.log('El usuario ha iniciado sesión correctamente:', user);
        location.href='/PS-grupo-10/Front_end/MapPage/map.html';
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
});

document.getElementById('facebookLogin').addEventListener('click', async function() {
    try {
        const user = await signInWithFacebook();
        console.log('El usuario ha iniciado sesión correctamente:', user);
        location.href='/PS-grupo-10/Front_end/MapPage/map.html';
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
});

import {logInUserPassword} from "./authUserPassword.js";

document.getElementById('LogIn').addEventListener('click', async function() {
    try {
        const email = document.getElementById('user_name').value;
        const password = document.getElementById('password').value;

        if (email == "" && password == "") {
            return
        }


        logInUserPassword(email,password)
            .then(user =>{
                console.log('El usuario ha iniciado sesión correctamente con su email:', user);
                location.href='/PS-grupo-10/Front_end/MapPage/map.html';
            }).catch (error=>{
            console.error('Error al iniciar sesión con email:', error);
            alert('Error al iniciar sesión con email: ' + error.message);
        });
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        alert('Error al iniciar sesión con Google: ' + error.message);
    }
});

document.getElementById('password').addEventListener('keypress', async function(event) {
    if (event.key === 'Enter') {
        try {
            const email = document.getElementById('user_name').value;
            const password = document.getElementById('password').value;

            if (email == "" && password == "") {
                return;
            }

            logInUserPassword(email, password)
                .then(user =>{
                    console.log('El usuario ha iniciado sesión correctamente con su email:', user);
                    location.href='/PS-grupo-10/Front_end/MapPage/map.html';
                }).catch (error=>{
                console.error('Error al iniciar sesión con email:', error);
                alert('Error al iniciar sesión con email: ' + error.message);
            });
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            alert('Error al iniciar sesión con Google: ' + error.message);
        }
    }
});


//import {SignUp} from "./signUp.js";
/*export async function crearUsuario() {
    const emailNuevo = document.getElementById('email').value;
    const passwordNuevo = document.getElementById('password').value;

    SignUp(emailNuevo,passwordNuevo)
        .then(user =>{
            console.log('El usuario ha creado correctamente su cuenta:', user);
            alert('Creación de cuenta exitosa');
        }).catch (error=>{
            console.error('Error al crear la cuenta:', error);
        alert('Error al crear la cuenta: ' + error.message);

    });
}*/