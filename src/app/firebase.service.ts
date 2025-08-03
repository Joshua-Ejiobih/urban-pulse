import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, Firestore, getDocs, DocumentData, DocumentReference, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNCUvWapIt1OPuVf86-REQ2RSi3x74WjY",
  authDomain: "urban-803d0.firebaseapp.com",
  projectId: "urban-803d0",
  storageBucket: "urban-803d0.firebasestorage.app",
  messagingSenderId: "410806816385",
  appId: "1:410806816385:web:1de632e28ac50d7c4e8780",
  measurementId: "G-E2DWJM1ES0"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class FirebaseService {

  constructor() {}

  async signUp(email: string, password: string, fullName: string) {
    try {
        const auth = getAuth(app);
        const db = getFirestore();
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Save user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email,
            fullName,
            uid: user.uid
        });
        return user;
    }catch(e: any){
        console.error('SignUp Error:', e);
        throw e;
    }
  }

  async getCurrentUserFullName(): Promise<string> {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;
    if (!user) return '';
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
        return userDoc.data()['fullName'] || '';
    }
    return '';
  }

    signIn(email: string, password: string){
        try{
        return signInWithEmailAndPassword(auth, email, password );
    }catch(e: any){
       console.log('SignIn Error:', e);
       throw e;
    }
    }

    signOut(){
        return signOut(auth);
    }

    getCurrentUser(): User | null {
        return auth.currentUser;
    }

    onAuthStateChanged (callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, callback);//callback and user are parameters
    }
}
