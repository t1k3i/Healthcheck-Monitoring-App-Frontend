import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    const storedUser = sessionStorage.getItem('currentUser');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    this.userSubject = new BehaviorSubject<User | null>(this.currentUser);
    this.user = this.userSubject.asObservable();

    this.setPermissions();
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
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.setPermissions();
        return user;
      }));
  }

  logout(): void {
    this.currentUser = null;
    this.userSubject.next(null);
    sessionStorage.removeItem('currentUser');
    this.canUse1 = false;
    this.canUse2 = false;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  register(firstName: string, lastName: string, username: string, 
    password: string, role: string): Observable<void> {
    return this.http.post<any>(`${this.urlinfoService.apiServer}/users/register`, 
      { firstName, lastName, username, password, role });
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.urlinfoService.apiServer}/users`, {
      params: new HttpParams().set('currentUser', this.currentUser!.username)
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlinfoService.apiServer}/users/${id}`);
  }

  private setPermissions(): void {
    this.canUse1 = this.currentUser?.role.name === 'USER' || this.currentUser?.role.name === 'ADMIN';
    this.canUse2 = this.currentUser?.role.name === 'ADMIN';
  }
}