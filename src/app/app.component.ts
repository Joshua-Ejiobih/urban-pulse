import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { PostsService, Post } from './posts.service';
import { MyServices } from './myservices.services';
import { ImageService } from './image.service';

// root component of the Angular application
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'urban-pulse';

}
