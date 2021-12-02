import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  loading = false;
  isVisibleImportImages = false;

  isVisibleImportAutorizacao = false;
  numAutorizacao: any = '';

  listOfData = [
    {
      numero_autorizacao: '1234567812345678',
      data_venda: '2021-01-01',
      comprador: 'José da Silva',
    },
    {
      numero_autorizacao: '1234567812345678',
      data_venda: '2021-01-01',
      comprador: 'José da Silva',
    },
    {
      numero_autorizacao: '1234567812345678',
      data_venda: '2021-01-01',
      comprador: 'José da Silva',
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

  toggleModalImportImages(){
    this.isVisibleImportImages = !this.isVisibleImportImages;
    this.isVisibleImportAutorizacao = false;
  }

  toggleModalImportAutorizacao(){
    this.isVisibleImportAutorizacao = !this.isVisibleImportAutorizacao;
    if(this.isVisibleImportAutorizacao){
      this.numAutorizacao = '';
    }
  }

  scan(autorizacao: any){
    this.isVisibleImportImages = false;
    this.numAutorizacao = autorizacao;
    this.toggleModalImportImages();
  }

  refresh(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
