import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogged = false;
  razaoSocial = localStorage.getItem('razao_social');
  nomeFantasia = localStorage.getItem('nome_fantasia');
  cnpj = environment.cnpj;
  versao = environment.versao;
  
  constructor(
    private router: Router
  ){
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'].substring(0, 6) == '/login') {
          this.isLogged = false;
        }else{
          this.isLogged = true;
          this.razaoSocial = localStorage.getItem('razao_social');
          this.nomeFantasia = localStorage.getItem('nome_fantasia');
        }
      }
    });

    if(localStorage.getItem('token')){
      this.isLogged = true;
    }else{
      this.router.navigate(['login']);
    }
  }

  logout(){
    this.isLogged = false;
    localStorage.removeItem('token');
  }
}
