import { Injectable } from "@angular/core";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, Firestore, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
apiKey: "AIzaSyBNCUvWapIt1OPuVf86-REQ2RSi3x74WjY",
  authDomain: "urban-803d0.firebaseapp.com",
  projectId: "urban-803d0",
  storageBucket: "urban-803d0.firebasestorage.app",
  messagingSenderId: "410806816385",
  appId: "1:410806816385:web:1de632e28ac50d7c4e8780",
  measurementId: "G-E2DWJM1ES0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Post{
    id: string | undefined;
    author: string;
    title: string;
    description: string;
    category: string;
    date: string;
    tags?: string[];
    image?: string;
    location?: { lat: number; lng: number}
}

@Injectable({providedIn: 'root' })
export class PostsService {
    async getPost (): Promise<Post[]> {
        const postsCol = collection(db, 'posts');
        const snapshot = await getDocs(postsCol);
        return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as Post))
    }

    //add
    async addPost (post: Post) {
        const PostCol = collection(db, 'posts');
        //remove id
        const { id, ...postWithoutId } = post;
        await addDoc(PostCol, postWithoutId);
    }

    async updatePost (post: Post) {
        if(!post.id) return;
        const postRef = doc(db, 'posts', post.id)
        //creates a new object (postWithoutId) that contains all properties of post except id.
        const { id, ...postWithoutId } = post;
        await updateDoc(postRef, postWithoutId);
    }

    async deletePost (id: string | undefined) {
        if(!id)return;
        const postRef = doc(db, 'posts', id);
        await deleteDoc(postRef);
    }
}
