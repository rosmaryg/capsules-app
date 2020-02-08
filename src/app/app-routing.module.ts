import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContentComponent} from './content/content.component';
import {HomePageComponent} from './home-page/home-page.component';
import {GalleryComponent} from './gallery/gallery.component';
import {EditorComponent} from './editor/editor.component';
import {AdminComponent} from './admin/admin.component';
import {RedirectGuard} from './guards/redirect/redirect.guard';

const routes: Routes = [
  { path: '',               component: GalleryComponent },
  { path: 'admin',          component: AdminComponent },
  { path: 'content/:id',    component: ContentComponent },
  { path: 'edit',           component: EditorComponent },
  { path: 'edit/:id',       component: EditorComponent },
  { path: 'gallery',        component: GalleryComponent },
  { path: 'oauth',          component: HomePageComponent,             canActivate: [RedirectGuard] },
  { path: '**',             redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
