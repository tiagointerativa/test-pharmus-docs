import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { VendaService } from 'src/app/services/venda.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  //Table
  takeNumber = 5;
  fromNumber = 0;
  loading = false;
  isVisibleImportImages = false;
  disableButtonLoadingMore = false;

  isVisibleImportAutorizacao = false;
  numAutorizacao: any = '';
  loadingImport = false;
  idVenda: any = 0;

  //search
  search: any;
  typeFilter: any = 'farmaciaPopularAutorizacaoNumero';  
  showCancelButton = false;

  listOfData: any = [];
  nomeFantasia = localStorage.getItem('nome_fantasia');
  constructor(
    private vendaService : VendaService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.disableButtonLoadingMore = false;

    this.vendaService.all(this.takeNumber, this.fromNumber).subscribe((data: any) => {
      if(data.status == 'OK' && data.objeto.list.length !== 0){
        data.objeto.list.forEach((element: any) => {
          this.listOfData = [...this.listOfData, element];  
        });
      }else{
        this.disableButtonLoadingMore = true;
        
        this.message.info('Não há mais vendas pendentes de digitalização.');
      }
      this.showCancelButton = false;
      this.loading = false;
      
    }, (error: any) => {
      this.loading = false;
      this.message.error('Houve um erro ao enviar a requisição para o servidor, tente novamente mais tarde!');
    });
  }

  loadingMore(){
    this.fromNumber = this.fromNumber + this.takeNumber;
    if(this.showCancelButton){
      this.searchAutorizacoes(this.takeNumber, this.fromNumber);
    }else{
      this.ngOnInit();
    }
    
  }

  toggleModalImportImages(){
    this.isVisibleImportImages = !this.isVisibleImportImages;
    this.isVisibleImportAutorizacao = false;
    this.fromNumber = 0;
    this.ngOnInit();
  }

  toggleModalImportAutorizacao(){
    this.isVisibleImportAutorizacao = !this.isVisibleImportAutorizacao;
    if(this.isVisibleImportAutorizacao){
      this.numAutorizacao = '';
    }
  }

  scan(id: any){
    this.isVisibleImportImages = false;
    this.idVenda = id;
    this.listOfData = [];
    this.toggleModalImportImages();
  }

  refresh(){
    this.ngOnInit();
  }

  importManual(autorizacao: any){
    this.loadingImport = true;
    this.vendaService.create(autorizacao, localStorage.getItem('idEmpresa')).subscribe((data: any) => {
      this.loadingImport = false;
      if(data.status == 'OK'){
        this.scan(data.objeto.venda.id);
      }else{
        this.message.error('Houve uma falha ao cadastrar a autorização, tente novamente mais tarde!');
      }
    }, (error: any) => {
      this.loadingImport = false;
      this.message.error('Houve uma falha ao cadastrar a autorização, tente novamente mais tarde!');
    });
  }

  searchAutorizacoes(takeNumber = 0, fromNumber: any = 0){
    this.takeNumber = takeNumber;
    this.fromNumber = fromNumber;
    let searchNumAutorizacao = null;
    let searchNomeComprador = null;

    if(this.typeFilter === 'farmaciaPopularAutorizacaoNumero'){
      searchNumAutorizacao = this.search;
    }else{
      searchNomeComprador = this.search;
    }
    this.loading = true;
    this.vendaService.filterVenda(searchNumAutorizacao, searchNomeComprador, takeNumber, fromNumber).subscribe((data: any) =>{
      this.listOfData = [];
      if(data.status == 'OK' && data.objeto.list.length !== 0){
        data.objeto.list.forEach((element: any) => {
          this.listOfData = [...this.listOfData, element];  
        });
        
      }else{
        this.disableButtonLoadingMore = true;
        this.message.warning('Nenhum venda foi encontrada com o filtro informado.');
      }
      this.loading = false;
      this.showCancelButton = true;
    }, (error: any) => {
      this.loading = false;
      this.message.error('Houve uma falha ao enviar a requisição para o servidor, tente novamente mais tarde!');
    });   
  }

  hideCancelButton(){
    this.search = '';
    this.showCancelButton = false;
    this.fromNumber = 0;
    this.listOfData = [];
    this.ngOnInit();
  }
}
