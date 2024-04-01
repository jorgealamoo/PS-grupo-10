//Para arrancar la API usar -----> npm start

const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, getDoc, setDoc, addDoc, doc } = require('firebase/firestore');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Initialize Firebase app
const firebaseConfig = {
    //API CONFIG
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);




//----------------------------- Firebase DataStore -----------------------------

// Define an API endpoint to fetch data from the "prueba" collection
app.get('/api/fetchData/:collectionName', async (req, res) => {
    try {
        const { collectionName } = req.params;
        const dynamicCollection = collection(db, collectionName);
        const querySnapshot = await getDocs(dynamicCollection);

        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        res.json(data);
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define an API endpoint to fetch data from a specific collection and document
app.get('/api/getDocument/:collectionName/:documentId', async (req, res) => {
    try {
        const { collectionName, documentId } = req.params;

        const specificCollection = collection(db, collectionName);
        const specificDocument = doc(specificCollection, documentId);
        const documentSnapshot = await getDoc(specificDocument);

        if (!documentSnapshot.exists()) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }

        const data = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define an API endpoint to create a document in the "prueba" collection
app.post('/api/addDoc/:collectionName/:documentName', express.json(), async (req, res) => {
    try {
        const dataJSON = req.body;
        const { collectionName, documentName } = req.params;

        const pruebaCollection = collection(db, collectionName);
        const docRef = doc(pruebaCollection, documentName);

        await setDoc(docRef, dataJSON, { merge: true }); // Use merge option to update an existing document

        res.status(201).json({ id: documentName, collection: collectionName, document: documentName });
    } catch (error) {
        console.error('Error adding or updating document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Define an API endpoint to create a document in the collection
app.post('/api/addUniqueDoc/:collectionName', express.json(), async (req, res) => {
    try {
        const dataJSON = req.body;
        const { collectionName } = req.params;

        // Verificar si los datos enviados son válidos (opcional)
        if (!dataJSON || typeof dataJSON !== 'object') {
            res.status(400).json({ error: 'Invalid request payload' });
            return;
        }

        const pruebaCollection = collection(db, collectionName);

        // Crear un nuevo documento con un nombre único generado por Firebase
        const docRef = await addDoc(pruebaCollection, dataJSON);

        res.status(201).json({ id: docRef.id, collection: collectionName, document: docRef.id });
    } catch (error) {
        console.error('Error adding document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/api/changeDoc/:collectionName/:documentName', express.json(), async (req, res) => {
    try {
        try {
            const newData = req.body;
            const { collectionName, documentName } = req.params;

            // Get a reference to the document
            const docRef = doc(collection(db, collectionName), documentName);

            // Replace all data in the document with the new data
            await setDoc(docRef, newData, { merge: true });

            res.status(201).json({ message:"Success" });
        } catch (error) {
            console.error('Error updating document:', error);
        }
    } catch (error) {
        console.error('Error adding or updating document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





//----------------------------- Firebase Storage -----------------------------

const storage = new Storage({
    projectId: firebaseConfig.projectId,
    keyFilename: './proyecto-ps-22ec6-firebase-adminsdk-u15t2-07c585be61.json', // Replace with the path to your Firebase key file
});

const bucket = storage.bucket(firebaseConfig.storageBucket);

// Set up Multer for handling file uploads
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });


app.get('/api/getImage/:imageName', async (req, res) => {
    try {
        const { imageName } = req.params;

        // Construct the file path in the Firebase Storage bucket
        let filePath = `${imageName}`;

        // Get a reference to the file
        const file = bucket.file(filePath);

        // Check if the file exists
        const [exists] = await file.exists();
        if (!exists) {
            res.status(404).json({ error: 'Image not found' });
            return;
        }

        // Generate a signed URL for the file
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 60 * 1000, // Link expires in 1 minute
        });

        res.json({ imageUrl: url });
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// POST endpoint to upload an image with the name as the current date and time
app.post('/api/uploadImage', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const fileBuffer = req.file.buffer;

        // Generate a unique name for the image using current date and time
        const currentDate = new Date();
        const fileName = `${currentDate.toISOString().replace(/[:.]/g, '_')}_${path.basename(req.file.originalname)}`;

        const file = bucket.file(fileName);
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
            resumable: false,
        });

        stream.end(fileBuffer);

        // Wait for the file to be uploaded to Firebase Storage
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        res.json({ success: true, fileUrl , fileName});
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




//----------------------------- Firebase Authentication -----------------------------
app.post('/api/login', express.json(), async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Invalid request payload' });
            return;
        }

        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, username, password);

        // If login is successful, you can customize the response accordingly
        const user = userCredential.user;
        res.json({ success: true, userId: user.uid, message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);

        // If login fails, provide an appropriate error response
        res.status(401).json({ error: 'Invalid username or password' });
    }
});


app.post('/api/signup', express.json(), async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Invalid request payload' });
            return;
        }

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, username, password);

        // If signup is successful, you can customize the response accordingly
        const user = userCredential.user;
        res.json({ success: true, userId: user.uid, message: 'Signup successful' });
    } catch (error) {
        console.error('Error during signup:', error);

        // If signup fails, provide an appropriate error response
        res.status(400).json({ error: 'Signup failed. Please try again.' });
    }
});


//--------------------------- CHANGE PASSWORD ------------------------
const admin = require('firebase-admin');
const serviceAccount = require('./proyecto-ps-22ec6-firebase-adminsdk-u15t2-07c585be61.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.post('/api/changePassword', express.json(), async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            res.status(400).json({ error: 'Invalid request payload' });
            return;
        }

        user = await admin.auth().getUser(userId);
        if (user) {

            await admin.auth().updateUser(user.uid, { password: newPassword });
            res.json({ success: true, message: 'Successful Password Change' });

        } else {
            res.status(404).json({ error: 'User Not Found' });
            return;
        }
    } catch (error) {
        console.error('Error during password change:', error);

        // If signup fails, provide an appropriate error response
        res.status(400).json({ error: error });
    }
});





// --------------------------- Check AUTH ---------------------------
// API endpoint to check if a user ID exists in Firebase Authentication
app.get('/api/checkAuth/:userID', (req, res) => {
    const requestedUserID = req.params.userID;

    admin.auth().getUser(requestedUserID)
        .then(userRecord => {
            // User exists
            res.status(200).json({ exists: true, userRecord: userRecord.toJSON() });
        })
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                // User does not exist
                res.status(404).json({ exists: false, error: 'User not found' });
            } else {
                // Other errors
                console.error('Error fetching user data:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});



//----------------------------- Main API Server -----------------------------
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
