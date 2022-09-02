import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  subs!: Subscription;
  constructor(private readService: ReaderService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl()
    })
  }

  readFile(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const filesList = target.files as FileList;
    this.file = filesList[0];
    this.readService.readFile(this.file);
    if(this.file){
      this.uploadFlag = true;
      this.subs = this.readService.parsedArray.subscribe((el)=>{
        this.certificats = el[el.length-1];
      });
    }
  }

  ngOnDestroy() {
    if(this.subs){
      this.subs.unsubscribe();
    }
  }
}
