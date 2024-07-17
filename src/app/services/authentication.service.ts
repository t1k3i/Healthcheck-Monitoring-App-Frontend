import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { UrlinfoService } from './urlinfo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  private currentUser: User | null = null;

  public canUse1: boolean = false;
  public canUse2: boolean = false;

  constructor(private http: HttpClient, private urlinfoService: UrlinfoService) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.urlinfoService.apiServer}/users/authenticate`, { username, password })
      .pipe(map(user => {
        user.authdata = window.btoa(username + ':' + password);
        this.currentUser = user;
        this.userSubject.next(user);
        this.canUse1 = this.currentUser?.role.name === 'USER' || this.currentUser?.role.name === 'ADMIN';
        this.canUse2 = this.currentUser?.role.name === 'ADMIN';
        return user;
      }));
  }

  logout(): void {
    this.currentUser = null;
    this.userSubject.next(null);
    this.canUse1 = false;
    this.canUse2 = false;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

}
