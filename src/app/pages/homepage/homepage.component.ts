import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../firebase.service';
import { PostsService, Post } from '../../posts.service';
import { MyServices } from '../../myservices.services';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-homepage',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  providers: [MyServices]
})
export class HomepageComponent implements OnInit {
  userMenuOpen = false;
  mobileMenuOpen = false;

  constructor (
    private firebaseService: FirebaseService,
    private postsService: PostsService,
    public myService: MyServices
  ){}

  ngOnInit() {
    this.myService.resetAllModals();
    this.myService.loadPosts();
  }
}



