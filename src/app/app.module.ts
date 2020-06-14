import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxFileDropModule } from 'ngx-file-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ContentComponent } from './content/content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapsuleDetailsDialogComponent, GalleryComponent } from './gallery/gallery.component';
import { EditorComponent } from './editor/editor.component';
import { AdminComponent } from './admin/admin.component';
import { RedirectGuard } from './guards/redirect/redirect.guard';
import { CallbackComponent } from './callback/callback.component';

import { FileSaverModule } from 'ngx-filesaver';
import { SorterComponent } from './sorter/sorter.component';
import { ContentTextComponent } from './content-text/content-text.component';
import { TextSelectDirective } from './text-select/text-select.directive';
import { MdePopoverModule } from '@material-extended/mde';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ContentComponent,
    GalleryComponent,
    EditorComponent,
    AdminComponent,
    CallbackComponent,
    CapsuleDetailsDialogComponent,
    SorterComponent,
    ContentTextComponent,
    TextSelectDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    FileSaverModule,
    MdePopoverModule
  ],
  providers: [
    RedirectGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
