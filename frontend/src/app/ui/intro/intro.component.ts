import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { SocketsIoService } from 'src/app/services/sockets-io/sockets-io.service';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, AfterViewInit {
  nomInput:string;
  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean = false; 
  
  constructor(private sockets: SocketsIoService, private elementRef:ElementRef,private authService: SocialAuthService, private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
    });
    console.log(this.isLoggedin)
  }

  ngAfterViewInit():void {
    this.elementRef.nativeElement.querySelector('#registreNom').addEventListener('click', this.registrarNom.bind(this)); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
  }

  registrarNom(){
    this.sockets.nomJugador = this.nomInput;
    console.log(this.sockets.nomJugador);
    this.sockets.registrarJugador();
  }

  loginWithGoogle(): void {
    console.log(GoogleLoginProvider.PROVIDER_ID);
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  logOut(): void {
    this.authService.signOut();
  }

}
