import { Component, OnInit } from '@angular/core';
import { NicknameService } from 'src/app/services/nickname.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  nickname:string;

  constructor(public nicknameService : NicknameService) { }

  ngOnInit(): void {
    this.nickname = this.nicknameService.getNickname();
    console.log(this.nickname);
  }

}
