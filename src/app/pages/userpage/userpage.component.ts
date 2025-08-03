import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../firebase.service';
import { PostsService, Post } from '../../posts.service';
import { MyServices } from '../../myservices.services';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userpage',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './userpage.component.html',
  styleUrl: './userpage.component.css',
  providers: [MyServices]
})
export class UserpageComponent implements OnInit {
  userMenuOpen = false;
  mobileMenuOpen = false;

  constructor (
    private firebaseService: FirebaseService,
    public postsService: PostsService,
    public myServices: MyServices,
  ){}

  ngOnInit() {
    this.myServices.resetAllModals();
    this.myServices.loadPosts();
  }
}
