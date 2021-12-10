import {formatDate} from '@angular/common';
export class Login {
    guard(){
        console.log('Teste de guard!');
    }

    getToken(){
        return localStorage.getItem('token');
    }

    login(data: any) {
        let data_atu = new Date();
        localStorage.setItem('token', data.objeto.token);
        localStorage.setItem('data_login', formatDate(data_atu, 'yyyy-MM-dd h:mm:ss', 'en'));
    }

    setInfoUsuario(data: any){
        localStorage.setItem('info', JSON.stringify(data));
    }

    getInfoUsuario(){
        return JSON.parse(localStorage.getItem('info') ?? '');
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('info');
        localStorage.removeItem('data_login');
        localStorage.removeItem('idEmpresa');
    }
}