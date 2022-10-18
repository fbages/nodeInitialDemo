import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit, AfterViewChecked {
  @ViewChild('llistatMissatges') private myScrollContainer: ElementRef;
  constructor() { }

  ngOnInit(): void { 
    this.scrollToBottom();
}

ngAfterViewChecked() :void {        
    this.scrollToBottom();        
} 

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}
}
