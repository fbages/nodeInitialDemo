import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.addEventListener("keyup", this.disableF5);

    window.addEventListener("keydown", this.disableF5);
  }

  disableF5(e) {
    if ((e.which || e.keyCode) == 116) e.preventDefault(); 
 };

}
