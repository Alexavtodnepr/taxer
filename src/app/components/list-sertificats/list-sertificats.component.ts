import { Component, OnInit } from '@angular/core';
import {ReaderService} from "../../services/reader.service";
import {CertifOwner} from "../../models/certif-owner";
import {Observable} from "rxjs";

@Component({
  selector: 'app-list-sertificats',
  templateUrl: './list-sertificats.component.html',
  styleUrls: ['./list-sertificats.component.sass']
})
export class ListSertificatsComponent implements OnInit {
  emptyArr: any;
  items$!: Observable<CertifOwner[]>;
  activeItem!: any;
  constructor(private readServ: ReaderService) { }

  ngOnInit(): void {
    this.items$ = this.readServ.parsedArray;
    this.items$.subscribe(items=>{
      this.emptyArr = items;
    })
  }

  choosedItem(item: CertifOwner):void{
    this.activeItem = item;
    this.readServ.chosedCertif(item);
  }

}
