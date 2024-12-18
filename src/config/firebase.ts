import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCLkamQ_CUt83NjThcyNG0imfkWj4DAC8w",
    projectId: "arti-key-api",
    authDomain: "arti-key-api.firebaseapp.com",
    storageBucket: "arti-key-api.appspot.com",
    messagingSenderId: "1078207906029"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
