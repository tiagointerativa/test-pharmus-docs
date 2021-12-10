import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { formatDate } from "@angular/common";
import { parse } from 'date-fns';
import { DatePipe } from '@angular/common'
import { AuthService } from '../services/auth.service';
import { Auth } from './Auth';
import { Inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Guard {
    constructor(
        private router: Router,
        private datepipe: DatePipe,
        @Inject(String) private authService: AuthService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> | any {
        if (!localStorage.getItem('token')) {
            this.router.navigate(['/login']);
        } else {
            let dateLogin: any = this.datepipe.transform(localStorage.getItem('date_login'), 'yyyy-MM-dd H:mm:ss');
            let dateNow: any = this.datepipe.transform(new Date(), 'yyyy-MM-dd H:mm:ss');
            let diffSeconds = (Math.floor(<any>new Date(dateNow) - <any>Date.parse(dateLogin))) /1000;
            if(diffSeconds > 86400){
                var auth = new Auth;
                this.authService.refresh().subscribe((data : any) => {
                    auth.login(data);
                }, () => {
                    auth.logout();
                    this.router.navigate(['/login']);
                    return false;
                });
            }
            return true;
        }
    }
}