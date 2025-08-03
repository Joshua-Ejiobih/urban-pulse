import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "./firebase.service";
import { PostsService, Post } from "./posts.service";


@Injectable({providedIn: 'root' })
export class MyServices {
    // Posts and UI State
    posts: Post[] = [];
    post: Partial<Post> = {};
    signUpEmail = '';
    signUpPassword = '';
    signInEmail = '';
    signInPassword = '';
    searchQuery = '';
    selectedCategory = 'all';
    filteredPosts: Post[] = [];
    signUpFullName = '';
    currentUserFullName = '';
    currentUser: any = '';
    selectedTags: string[] = [];
    tagInput: string = '';

    // Image and Form Error
    imageError: string = '';
    formError: string = '';

    // Track selected image file name for display
    selectedImageFileName: string = '';

    private errorTimeout: any = null;

    constructor (
        private firebaseService:FirebaseService,
        private postsService: PostsService,
        private router: Router
    ){
        // Listen for Firebase Auth state changes ONCE
    this.firebaseService.onAuthStateChanged(async (user) => {
        this.currentUser = user;
        if (user) {
            this.currentUserFullName = await this.firebaseService.getCurrentUserFullName();
        } else {
            this.currentUserFullName = '';
        }
    });
    }

    //Modal State
    isAuthOpenModal = false;
    isViewModal = false;
    isPostModal = false;
    isViewDrawerOpen = false;
    //auth
    isSignInTab = true;
    isSignUpTab = false;

    //switch auth tabs
    switchTab(tab: string){
       if(tab === 'signin'){
        this.isSignUpTab = false;
        this.isSignInTab = true;
       } else{
        this.isSignUpTab = true;
        this.isSignInTab = false;
       }
    }

    //authmodal
    openAuthModal(){
        this.isAuthOpenModal = true;
    }

    closeAuthModal() {
        this.isAuthOpenModal = false;
    }
    //view modal
    openViewModal(post: Post){
        this.post = { ...post };
        this.isViewModal = true;
    }
    closeViewModal() {
        this.isViewModal = false;
    }

    //postmodal
    openPostModal(){
        this.isPostModal = true;
        // Reset tags for new post
        if (!this.editId) this.selectedTags = [];
    }
    closePostModal() {
        this.isPostModal = false;
        this.editId = undefined;
        this.post = {};
        this.selectedTags = [];
    }

    

    // Add tag logic
    addTag() {
        const tag = this.tagInput.trim();
        if (tag && !this.selectedTags.includes(tag)) {
            this.selectedTags.push(tag);
        }
        this.tagInput = '';
    }

    removeTag(index: number) {
        this.selectedTags.splice(index, 1);
    }

    //editPosts
    editId: string | undefined = undefined;
    editPost(editpost: Post) {
        this.editId = editpost.id;
        this.post = { ...editpost };
        this.selectedTags = editpost.tags ? [...editpost.tags] : [];
        this.openPostModal();
    }

    async loadPosts() {
        this.posts = await this.postsService.getPost();
        this.filterPosts();
    }

    handleImageUpload(event: any) {
        this.imageError = '';
        const file: File = event.target.files[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            this.imageError = 'Only JPG, JPEG, or PNG images are allowed.';
            this.selectedImageFileName = '';
            return;
        }
        if (file.size > 1024 * 1024) {
            this.imageError = 'Image must be less than 1MB.';
            this.selectedImageFileName = '';
            return;
        }
        this.selectedImageFileName = file.name;
        const reader = new FileReader();
        reader.onload = () => {
            this.post.image = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    async savePost () {
        // Ensure user is signed in before posting
        if (!this.currentUser) {
            alert('You must sign in to create a post.');
            return;
        }
        if (!this.post.title || !this.post.description || !this.post.category) {
            alert('Please fill all required fields.');
            return;
        }
        if (this.imageError) {
            alert('Please fix the image error before submitting.');
            return;
        }
        try {
            if (!this.currentUserFullName) {
                this.currentUserFullName = await this.firebaseService.getCurrentUserFullName();
            }
            const postToSave: any = {
                author: this.currentUserFullName,
                date: new Date().toDateString(),
                title: this.post.title ?? '',
                description: this.post.description ?? '',
                category: this.post.category ?? '',
                tags: [...this.selectedTags],
                image: this.post.image ?? '',
            };
            if(!this.editId){
                postToSave.id = this.post.id,
                await this.postsService.addPost(postToSave);
            }else {
                await this.postsService.updatePost(postToSave);
            }
            await this.loadPosts();
            this.post = {};
            this.editId = undefined;
            this.selectedTags = [];
            this.isPostModal = false;
        } catch (e: any) {
            // Handle offline or auth errors
            console.error('SavePost Error:', e?.message || e);
            alert('Failed to save post: ' + (e?.message || e));
        }
    }

    async deletePost(id: string | undefined){
        await this.postsService.deletePost(id);
        this.loadPosts;
    }

    validateEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    validatePassword(password: string): boolean {
        // At least 8 chars, 1 uppercase, 1 number, 1 special char
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    async signUp() {
        this.formError = '';
        if (!this.signUpFullName || !this.signUpEmail || !this.signUpPassword) {
            this.formError = 'All fields are required.';
            return;
        }
        if (!this.validateEmail(this.signUpEmail)) {
            this.formError = 'Please enter a valid email.';
            return;
        }
        if (!this.validatePassword(this.signUpPassword)) {
            this.formError = 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character.';
            return;
        }
        try {
            const user = await this.firebaseService.signUp(this.signUpEmail, this.signUpPassword, this.signUpFullName);
            this.currentUser = user;
            this.currentUserFullName = this.signUpFullName;
            this.resetAllModals();
            this.router.navigate(['/userpage']);
        } catch(e: any) {
            this.formError = e?.message || 'Sign up failed.';
        }
    }

    async signIn() {
        this.formError = '';
        if (!this.signInEmail || !this.signInPassword) {
            this.formError = 'Email and password are required.';
            return;
        }
        if (!this.validateEmail(this.signInEmail)) {
            this.formError = 'Please enter a valid email.';
            return;
        }
        try {
            await this.firebaseService.signIn(this.signInEmail, this.signInPassword);
            this.currentUser = this.firebaseService.getCurrentUser;
            this.resetAllModals();
            this.router.navigate(['/userpage']);
        } catch(e: any) {
            this.formError = e?.message || 'Sign in failed.';
        }
    }

    async signOut() {
        await this.firebaseService.signOut();
        this.resetAllModals(); // call the function
        this.router.navigate(['/homepage']);
    }

    filterPosts() {
        this.filteredPosts = this.posts.filter(post => {
            const matchesCategory = this.selectedCategory === 'all' || post.category === this.selectedCategory;
            const matchesSearch = !this.searchQuery || post.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) || post.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
            // No tag search
            return matchesCategory && matchesSearch;
        });
    }

    resetAllModals(){
        this.closeAuthModal();
        this.closePostModal();
        this.closeViewModal();
    }

    startErrorTimeout() {
        this.clearErrorTimeout();
        this.errorTimeout = setTimeout(() => {
            this.formError = '';
        }, 3500);
    }
    clearErrorTimeout() {
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = null;
        }
    }
}