import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
})
export class UiComponent implements OnInit, OnDestroy {

  public constructor() { }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    console.log("s'ha eliminat aquest component")
  }


}
