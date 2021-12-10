import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../class/Api';
import { Auth } from '../class/Auth';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  public url: string;
  public auth = new Auth;
  public api =  new Api;
  
  constructor(
    private http: HttpClient,
  ) {
    this.url = this.api.getUrlApi() + 'api/Empresa';
  }

  info(){
    return this.http.get<Object[]>(this.url, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? ""}) 
    });
  }
}
