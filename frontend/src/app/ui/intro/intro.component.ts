import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NicknameService } from 'src/app/services/nickname.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, AfterViewInit {
  nomInput:string;
  loginForm!: FormGroup;

  constructor(
    private sockets: SocketsIoService, 
    private elementRef:ElementRef,
    private formBuilder: FormBuilder,
    private nicknameService: NicknameService,
    private router:Router
    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngAfterViewInit():void {
    this.elementRef.nativeElement.querySelector('#registreNom').addEventListener('click', this.registrarNom.bind(this)); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
  }

  registrarNom(){
    if(this.nomInput == null){
      this.nomInput=this.nicknameService.getNickname();
    }
    this.nicknameService.setNickname(this.nomInput);
    this.sockets.nomJugador = this.nomInput;
    this.sockets.registrarJugador();
    this.router.navigate(['/xat/Xat General']);
  }
  
}
