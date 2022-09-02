import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MainComponent} from "./components/main/main.component";
import {ListSertificatsComponent} from "./components/list-sertificats/list-sertificats.component";
import {ReaderComponent} from "./components/reader/reader.component";
import {InfoComponent} from "./components/info/info.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ListSertificatsComponent,
    ReaderComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
