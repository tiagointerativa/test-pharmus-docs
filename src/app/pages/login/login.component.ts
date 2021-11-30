import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
  ) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let message = this.message.loading('Validando...').messageId;
      this.message.remove(message);
      localStorage.setItem('token', '123132');
      this.router.navigate(['/index']);
      /*this.authService.login(this.validateForm.value.email, this.validateForm.value.password).subscribe((l: any) => {
        let login = new Login;
        this.loggedIn.next(true);
        login.login(l);
        //Guarda as informações do usuario logado
        this.authService.me().subscribe((m: any) => {
          let save = new Login();
          save.setInfoUsuario(m);
          this.message.remove(id);
          this.router.navigate(['/inicio']);
        });
  
      }, (err: any) => {
        this.message.remove(id);
        this.message.error(err['error']['error']);
      });*/
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
    });
  }

}
