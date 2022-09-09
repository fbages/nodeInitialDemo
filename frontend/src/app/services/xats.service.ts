import { Injectable,Optional, SkipSelf } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XatsService {
public xats:Array<{id:number,text:string,usuari:string}>;

private missatge = new Subject<any>();

  constructor(@Optional() @SkipSelf() sharedService?: XatsService) {
    if (sharedService) {
      throw new Error("Xats ja s'ha creat");
    }
   }
 
}
