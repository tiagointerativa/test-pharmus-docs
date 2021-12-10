import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from './login';
import{ BehaviorSubject} from'rxjs';
import { EmpresaService } from 'src/app/services/empresa.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  private loggedIn= new BehaviorSubject<boolean>(false);
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private authService: AuthService,
    private empresaService: EmpresaService,
  ) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.validateForm.valid) {
      let message = this.message.loading('Validando...').messageId;
      //localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IntcInNlc3Npb25JZFwiOlwiZGM4MjZmMTYtMGNlOC00ZGM4LThkMzYtM2JiMmZiZDBmODdkXCIsXCJlbXByZXNhSWRcIjpcIjBmOWZjNmI1LTc3MTItNDNhMC1hZGJlLTExZTgwNDdhNzFkYVwiLFwiZW1wcmVzYVVzdWFyaW9JZFwiOlwiYTE5NjgwMDctZWQxMy00ZTllLWFlNmYtYTBjODBkZDljZTU4XCIsXCJlbXByZXNhRGV2aWNlSWRcIjpcIlwiLFwic2Vydmlkb3JEYXRhSG9yYVwiOlwiMjAyMS0xMi0wOVQxMjo1NTo0Mi4yNTQwODQyXCIsXCJzZXJ2aWRvckRhdGFIb3JhVVRDXCI6XCIyMDIxLTEyLTA5VDE1OjU1OjQyLjI1NDA4OTZaXCIsXCJzZXJ2aWRvckRhdGFIb2plXCI6XCIyMDIxLTEyLTA5VDAwOjAwOjAwKzAwOjAwXCIsXCJleHBpcmF0ZURhdGVUaW1lXCI6XCIyMDIxLTEyLTA5VDE0OjI1OjQyLjI1NDA5MDFcIn0iLCJuYmYiOjE2MzkwNjUzNDIsImV4cCI6MTYzOTE5NDk0MiwiaWF0IjoxNjM5MDY1MzQyfQ.skOrXWmjqI2cr0JBIP0eaz611SOvV3hnrxWb4Fp7Kog');
      //this.router.navigate(['/index']);
      this.authService.login(this.validateForm.value.usuario, this.validateForm.value.password).subscribe((l: any) => {
        let login = new Login;
        this.loggedIn.next(true);
        login.login(l);
        this.empresaService.info().subscribe((data: any) => {
          localStorage.setItem('idEmpresa', data.objeto.empresa.id);
          localStorage.setItem('razao_social', data.objeto.empresa.razaoSocial);
          localStorage.setItem('nome_fantasia', data.objeto.empresa.nomeFantasia);
          this.router.navigate(['/index']);
        }, (err: any) => {
          login.logout();
          this.message.remove(message);
          this.message.error('Houve uma falha ao enviar a requisição, tente novamente mais tarde!');
        });
        
      }, (err: any) => {
        this.message.remove(message);
        this.message.error('Houve uma falha ao enviar a requisição, tente novamente mais tarde!');
      });
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

}
