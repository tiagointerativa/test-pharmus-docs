import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../class/Api';
import { Auth } from '../class/Auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public url: string;
  public auth = new Auth;
  public api =  new Api;
  
  constructor(
    private http: HttpClient,
  ) {
    this.url = this.api.getUrlApi() + 'api/Application/Account';
  }

  login(usuario: string, password: string) {
    console.log(usuario, password);
    return this.http.post<Object[]>(this.url + '/Authenticate', { usuario: usuario, senha: password, 	deviceIMEI: "" },{
      headers: new HttpHeaders({ 'Content-Type': "application/json" }) 
    });
  }

  refresh(){
    return this.http.post<Object[]>(this.url + '/Token/Refresh', {}, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? "" }) 
    });
  }

  /*logout(){
    return this.http.post<Object[]>(this.url + '/logout', {}, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? "" }) 
    });
  }*/
}