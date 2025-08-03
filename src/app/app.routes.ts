import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { UserpageComponent } from './pages/userpage/userpage.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/homepage',
        pathMatch: 'full'
    },
    {
        path: 'homepage',
        component: HomepageComponent,
        title: 'UrbanPulse - Homepage'
    },
    {
        path: 'userpage',
        component: UserpageComponent,
        title: 'UrbanPulse - User Page'
    }
];
