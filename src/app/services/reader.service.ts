import {Injectable, OnInit} from '@angular/core';
// @ts-ignore
import ASN1 from '@lapo/asn1js';
import {BehaviorSubject, Subject, take} from "rxjs";
import {CertifOwner} from "../models/certif-owner";
@Injectable({
  providedIn: 'root'
})
export class ReaderService implements OnInit{
  startedArray!: CertifOwner[];
  reader: FileReader = new FileReader;
  chosenCertif: Subject<CertifOwner> = new Subject;
  chosenCertifStream$ = this.chosenCertif.asObservable();
  successString: string = 'Ви успішно завантажили цей сертифікат...';
  errormessage: BehaviorSubject<string> = new BehaviorSubject<string>(this.successString);
  parsedArray: BehaviorSubject<CertifOwner[]> = new BehaviorSubject<CertifOwner[]>(this.getParsedCertifLocalData() ?? []);
  constructor() {}

  ngOnInit() {
    if(this.getParsedCertifLocalData()){
      this.startedArray = this.getParsedCertifLocalData();
    }else{
      this.startedArray = [];
    }
  }

  readFile(file: File): void{
    this.reader.readAsBinaryString(file);
    this.reader.onloadend = ()=>{
     try{
          const result = ASN1.decode(this.reader.result);
          if (result.typeName() !== 'SEQUENCE') {
            this.createError('Неправильна структура конверта сертифіката (очікується SEQUENCE)');
          }else{
            this.parseCertif(result);
          }
      }catch(err:any){
        this.createError('Сертифікат зіпсований з причини  :  '  + err);
      }
    }
  }

  parseCertif(certif:any): void{
    this.parsedArray.pipe(take(1)).subscribe((val)=>{
      console.log(val)
      const info = {
        commonName: certif.sub[0].sub[5].sub[1].sub[0].sub[1].content(),
        issuerCN: certif.sub[0].sub[3].sub[2].sub[0].sub[1].content(),
        validFrom: certif.sub[0].sub[4].sub[0].content(),
        validTill: certif.sub[0].sub[4].sub[1].content(),
        id: certif.sub[0].sub[3].sub[3].sub[0].sub[1].content()
      }

      let newParsedArray: any = [];
      val.forEach(el=>{
        if(el.id == info.id){
          this.createError('Такой сертификат уже есть')
        }else{
          newParsedArray.push(el);
          this.createError(this.successString);
        }
      })
          newParsedArray.push(info);
          this.setParsedCertificatesLocal(newParsedArray);
          return this.parsedArray.next(newParsedArray);



    });
  }

  setParsedCertificatesLocal(readCertificats:any): void{
    localStorage.setItem('parsedcertificatesArray', JSON.stringify(readCertificats));
  }


  getParsedCertifLocalData(): CertifOwner[]{
    return JSON.parse(localStorage.getItem('parsedcertificatesArray')!);
  }
  // If we need to do something with full loaded datas
  // setFullCertificatesLocal(certificatsArray:any): void{
  //   localStorage.setItem('certificatesArray', JSON.stringify(certificatsArray));
  // }
  //
  // getLoadedCertificates(){
  //   return JSON.parse(localStorage.getItem('certificatesArray')!);
  // }

  chosedCertif(certif: any):void{
    this.chosenCertif.next(certif);
  }

  createError(errorString:string):void{
    this.errormessage.next(errorString);
  }
}
