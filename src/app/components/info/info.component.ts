import {Component, OnDestroy, OnInit} from '@angular/core';
import {CertifOwner} from "../../models/certif-owner";
import {ReaderService} from "../../services/reader.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.sass']
})
export class InfoComponent implements OnInit, OnDestroy{
  certificats!: CertifOwner;
  subs!: Subscription;
  constructor(private readService: ReaderService) { }

  ngOnInit(): void {
    this.subs = this.readService.chosenCertifStream$.subscribe((certif)=>{
      this.certificats = certif;
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
