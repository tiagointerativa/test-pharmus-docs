import { formatDate } from '@angular/common';

export class Auth {
    getToken() {
        return {
            'token': localStorage.getItem('token'),
            'date_login': localStorage.getItem('date_login')
        };
    }

    login(data: any) {
        this.logout();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('date_login', formatDate(new Date(), 'yyyy-MM-dd h:mm:ss', 'en'));
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('date_login');
        localStorage.removeItem('idEmpresa');
    }
}