import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ReaderService} from "../../services/reader.service";
import {CertifOwner} from "../../models/certif-owner";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.sass']
})
export class ReaderComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  file?: File;
  certificats!: CertifOwner;
  uploadFlag: boolean = false;
  loading = false;
  subs!: Subscription;
  message$!: Observable<string>;
  constructor(private readService: ReaderService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl()
    });
    this.message$ = this.readService.errormessage;
  }

  readFile(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const filesList = target.files as FileList;
    this.file = filesList[0];
    this.readService.readFile(this.file);
    this.loading = true;
    setTimeout(() =>{
      if(this.file){
        this.loading = false;
        this.uploadFlag = true;
        this.subs = this.readService.parsedArray.subscribe((el)=>{
          this.certificats = el[el.length-1];
        });
      }
    }, 1000)
  }

  ngOnDestroy() {
    if(this.subs){
      this.subs.unsubscribe();
    }
  }
}
