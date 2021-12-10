import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Api } from '../class/Api';
import { Auth } from '../class/Auth';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VendaService {
  public url: string;
  public auth = new Auth;
  public api =  new Api;
  
  constructor(
    private http: HttpClient,
  ) {
    this.url = this.api.getUrlApi() + 'api/Venda/Digitalizacao';
  }

  all(takeNumber: any = 0, fromNumber: any = 0){
    return this.http.get<Object[]>(this.url + '/Pendente/List?takeNumber=' + takeNumber + '&fromNumber=' + fromNumber, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? ""}) 
    });
  }

  create(numAutorizacao: any, empresaId: any){
    return this.http.post<Object[]>(this.url + '/Pendente/Adicionar',{
      empresaId: empresaId,
      emissaoDataHora: formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss', 'en'),
      farmaciaPopularAutorizacaoNumero: numAutorizacao
    }, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? ""}) 
    });
  }

  addImage(vendaId: any, empresaId: any, documentoDigitalizadoTipoId: any, imagemOriginalBase64: any){
    return this.http.post<Object[]>(this.url + '/Pendente/Imagem/Adicionar',{
      vendaId: vendaId,
      empresaId: empresaId,
      documentoDigitalizadoTipoId: documentoDigitalizadoTipoId,
      imagemOriginalBase64: imagemOriginalBase64
    }, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? ""}) 
    });
  }

  confirm(vendaId: any){
    return this.http.post<Object[]>(this.url + '/Pendente/Confirmar',{
      vendaId: vendaId,
    }, {
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? ""}) 
    });
  }

  filterVenda(farmaciaPopularNumero: any = null, consumidorNome: any = null, takeNumber: any = 0, fromNumber: any = 0){
    let data = {};
    if(farmaciaPopularNumero !== null){
      data = {
        takeNumber: takeNumber,
        fromNumber: fromNumber,
        farmaciaPopularAutorizacaoNumero: farmaciaPopularNumero
      };
    }else{
      data = {
        takeNumber: takeNumber,
        fromNumber: fromNumber,
        consumidorNome: consumidorNome
      };
    }

    return this.http.post<Object[]>(this.url + '/Pendente/List/Filter', data,{
      headers: new HttpHeaders({ 'client-token': this.auth.getToken().token ?? ""}) 
    });
  }
}
