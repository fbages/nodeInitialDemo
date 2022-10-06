import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NicknameService } from 'src/app/services/nickname.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent implements OnInit, AfterViewInit {
  nomInput: string;
  passInput: string;
  profileForm: FormGroup;
  signForm: FormGroup;
  submitted: boolean = false;
  submittedSign: boolean = false;
  googleRegisterSubs: Subscription;
  googleRegister: boolean = false;
  mailRegistrat: boolean = false;
  nickNameRegistrat: boolean = false;
  passwordIncorrect: boolean = false;
  statusUsuari: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private nicknameService: NicknameService,
    private router: Router,
    private elementRef: ElementRef,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        nickname: ['', Validators.required],
      },
      {
        validators: [this.requireConfirmPassword],
      }
    );

    this.signForm = this.formBuilder.group({
      emailSign: ['', Validators.required],
      passwordSign: ['', Validators.required],
    });

    this.googleRegisterSubs = this.nicknameService
      .subscripcionnickname()
      .subscribe((googlestatus) => {
        this.googleRegister = googlestatus;
        this.profileForm
          .get('email')
          .setValue((<HTMLInputElement>document.getElementById('nom')).value);
        this.profileForm
          .get('nickname')
          .setValue(
            (<HTMLInputElement>document.getElementById('nickname')).value
          );
      });
  }

  ngAfterViewInit() {
    // this.elementRef.nativeElement
    //   .querySelector('#registreNom')
    //   .addEventListener('click', this.registrarNom.bind(this)); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
    // this.elementRef.nativeElement
    //   .querySelector('#signNom')
    //   .addEventListener('click', this.registrarNom.bind(this)); //bind(this) generar link permanent, sense bind(this), s'executar una sola vegada
  }

  onSubmit() {
    this.submitted = true;
    this.mailRegistrat = false;
    this.nickNameRegistrat = false;

    if (
      this.profileForm.status == 'VALID' ||
      (this.googleRegister == true &&
        this.profileForm.get('email').valid &&
        this.profileForm.get('nickname').valid)
    ) {
      //console.log("formulari valid");

      const cerca = async () => {
        let resposta = await this.buscarUsuari(
          this.profileForm.get('email').value
        );
        return resposta;
      };
      cerca().then((res) => {
        if (res) {
          // console.log('Mail is already register');
          this.mailRegistrat = true;
        } else {
          const cercaNickname = async () => {
            let resposta = await this.buscarNickname(
              this.profileForm.get('nickname').value
            );
            return resposta;
          };
          cercaNickname().then((res) => {
            if (res) {
              console.log('Nickname is already taken');
              this.nickNameRegistrat = true;
            } else {
              if (this.nomInput != null) {
                this.nomInput = this.profileForm.get('nickname').value;
              }
              this.nicknameService.setNickname(
                this.profileForm.get('nickname').value
              );
              this.nicknameService.setEmail(
                this.profileForm.get('email').value
              );
              this.nicknameService.setPassword(
                this.profileForm.get('password').value
              );

              this.nicknameService.nouRegistrat = true;
              let jugador = {
                email: this.nicknameService.getEmail(),
                nom: this.nicknameService.getNickname(),
                password: this.nicknameService.getPassword(),
                status:true
              };
              this.loginService.registrarNouJugador(jugador);
              this.router.navigate(['/xat/Xat General']);
            }
          });
        }
      });
    } else {
      this.submitted = true;
    }
  }

  onSubmitSign() {
    this.submittedSign = true;

    console.log(this.signForm.status);
    //console.log(this.googleRegister, this.signForm.get('nomSign'));
    if (
      this.signForm.status == 'VALID' ||
      (this.googleRegister == true && this.signForm.get('emailSign').valid)
    ) {
      if (this.signForm.status == 'VALID') {
        const cercaPassword = async () => {
          let jugador = {
            email: this.signForm.get('emailSign').value,
            password: this.signForm.get('passwordSign').value,
            // idsocketjugador: this.sockets.jugadorsSocket.id,
            // idsocketmissatge: this.sockets.missatgesSocket.id,
            // idsocketxat: this.sockets.xatsSocket.id,
          };
          //console.log(jugador);
          let resposta = await this.buscarJugador(jugador);
          //console.log(resposta);
          return resposta;
        };
        cercaPassword().then((res) => {

          if (!res) {
            this.passwordIncorrect = true;
          } else {
            //S'ha de fer tornar el nickname perque angular sapiga com es diu el jugador que ha entrat
            //if (this.nomInput == null) {
              const cercaNickname = async () => {
                this.nomInput = await this.getNickname(
                  this.signForm.get('emailSign').value
                );
                // console.log('nomInput ' + this.nomInput, this.signForm.get('emailSign').value);
              };
              cercaNickname().then( async () => {
                this.nicknameService.setNickname(this.nomInput);
                //console.log('nomInput ' + this.nomInput);
                this.nicknameService.setEmail(
                  this.signForm.get('emailSign').value
                );
                this.nicknameService.setPassword(
                  this.signForm.get('passwordSign').value
                );

                //Controla que no estigui ja conectat
                let resposta = await this.loginService.getStatus(this.signForm.get('emailSign').value);
                console.log(resposta)
                if(resposta['data']){
                  this.statusUsuari = true;
                  setTimeout(() => {
                    this.statusUsuari = false;
                    this.submittedSign = false;
                  }, 3000);
                } else {
                  this.router.navigate(['/xat/Xat General']);
                }
              });
           // }
          }
        });
      } else {
        //buscar jugador que s'ha registrat amb google
        const cercaMailGoogle = async () => {
          let jugador = {
            email: this.signForm.get('emailSign').value,
            password: 'Google',
            // idsocketjugador: this.sockets.jugadorsSocket.id,
            // idsocketmissatge: this.sockets.missatgesSocket.id,
            // idsocketxat: this.sockets.xatsSocket.id,
          };
          let resposta = await this.buscarJugador(jugador);
          return resposta;
        };
        cercaMailGoogle().then((res) => {
          if (!res) {
            this.passwordIncorrect = true;
          } else {
            //console.log('nomInput ' + this.nomInput);
            //S'ha de fer tornar el nickname perque angular s'apiga com es diu el jugador que ha entrat
            if (this.nomInput != null) {
              const cercaNickname = async () => {
                this.nomInput = await this.getNickname(
                  this.signForm.get('emailSign').value
                );
                //console.log('nomInput ' + this.nomInput);
              };
              cercaNickname().then(() => {
                //console.log(this.nomInput);
                this.nicknameService.setNickname(this.nomInput);
                //console.log(this.nicknameService.getNickname())
                this.router.navigate(['/xat/Xat General']);
              });
            }
          }
        });
      }
    } else {
      this.submittedSign = false;
    }
  }

  async buscarUsuari(mail: string) {
    let resposta = await this.loginService.buscarMail(mail);
    //console.log(resposta)
    if (resposta['data']) {
      return true;
    } else {
      return false;
    }
  }

  async buscarNickname(nickName: string) {
    let resposta = await this.loginService.buscarNickname(nickName);
    //console.log(resposta)
    if (resposta['data']) {
      return true;
    } else {
      return false;
    }
  }

  async buscarJugador(jugador: object) {
    //console.log(jugador);
    let resposta = await this.loginService.signInJugador(jugador);
    //console.log(resposta);
    if (resposta['data']) {
      return true;
    } else {
      return false;
    }
  }

  async getNickname(nickName: string) {
    let resposta = await this.loginService.getNickname(nickName);
    //console.log(resposta)
    return resposta['data'];
  }

  requireConfirmPassword(form: FormGroup) {
    if (form.get('password').value !== form.get('confirmPassword').value) {
      return { requireConfirmPassword: true };
    }
    return null;
  }

  registrarNom() {
    if (this.nomInput == null) {
      this.nomInput = this.nicknameService.getNickname();
    }
    this.nicknameService.setNickname(this.nomInput);
    this.router.navigate(['/xat/Xat General']);
  }
}
