import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbGLFzzUj5y8F927mW6JcrObKnF9bynAY",
    authDomain: "proyecto-ps-22ec6.firebaseapp.com",
    projectId: "proyecto-ps-22ec6",
    storageBucket: "proyecto-ps-22ec6.appspot.com",
    messagingSenderId: "611131563975",
    appId: "1:611131563975:web:f5663ec606ee9eecf003e2",
    measurementId: "G-BJ8S3HC2XC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);