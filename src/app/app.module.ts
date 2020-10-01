import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MdePopoverModule } from '@material-extended/mde';
import { NgxKjuaModule } from 'ngx-kjua';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ContentComponent } from './content/content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CapsuleDetailsBottomSheetComponent, CapsuleDetailsDialogComponent, GalleryComponent} from './gallery/gallery.component';
import { EditorComponent } from './editor/editor.component';
import { AdminComponent } from './admin/admin.component';
import { RedirectGuard } from './guards/redirect/redirect.guard';
import { CallbackComponent } from './callback/callback.component';

import { FileSaverModule } from 'ngx-filesaver';
import { SorterComponent } from './sorter/sorter.component';
import { ContentTextComponent } from './content-text/content-text.component';
import { TextSelectDirective } from './text-select/text-select.directive';
import { NotesModalComponent } from './notes-modal/notes-modal.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutComponent } from './about/about.component';

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
    CapsuleDetailsBottomSheetComponent,
    SorterComponent,
    ContentTextComponent,
    TextSelectDirective,
    NotesModalComponent,
    FaqsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
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
    MdePopoverModule,
    NgxKjuaModule
  ],
  providers: [
    RedirectGuard
  ],
  entryComponents: [
    CapsuleDetailsDialogComponent,
    CapsuleDetailsBottomSheetComponent,
    NotesModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
