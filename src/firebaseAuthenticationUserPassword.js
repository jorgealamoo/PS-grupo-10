import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from './firebaseConfig.js'; // Importa la instancia de la app de Firebase desde otro archivo

export async function logInUserPassword(email, password) {
    try {
        const auth = getAuth(app);
        const result = await signInWithEmailAndPassword(auth, email, password)
        return result.user;
    }  catch (error) {
        throw error;
    }
}