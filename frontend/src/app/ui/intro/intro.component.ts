import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  titolClass:string;
  
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log("hola han passat 5 segons");
      this.titolClass = "titolhidden";
    }, 5000);
  }

}
