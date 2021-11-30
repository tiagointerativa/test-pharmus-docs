import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogged = false;
  razaoSocial = environment.razao_social;
  nomeFantasia = environment.nome_fantasia;
  cnpj = environment.cnpj;
  versao = environment.versao;
  
  constructor(){
    if(localStorage.getItem('token')){
      this.isLogged = true;
    }
  }

  logout(){
    this.isLogged = false;
    localStorage.removeItem('token');
  }
}
