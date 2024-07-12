import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlinfoGet } from './models/urlInfoGet';
import { UrlinfoAdd } from './models/urlInfoAdd';
import { UrlinfoUpdate } from './models/urlInfoUpdate';
import { EmailAdd } from './models/emailAdd';

@Injectable({
  providedIn: 'root'
})
export class UrlinfoService {

  private apiServer = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getUrlInfos(): Observable<UrlinfoGet[]> {
    return this.http.get<UrlinfoGet[]>(`${this.apiServer}/urls`);
  }

  public getUrlInfo(urlinfoId: number): Observable<UrlinfoGet[]> {
    return this.http.get<UrlinfoGet[]>(`${this.apiServer}/urls/${urlinfoId}`);
  }

  public addUrlInfo(urlinfo: UrlinfoAdd): Observable<UrlinfoAdd> {
    return this.http.post<UrlinfoAdd>(`${this.apiServer}/urls`, urlinfo);
  }

  public updateUrlInfo(urlinfo: UrlinfoAdd, urlinfoId: number): Observable<UrlinfoUpdate> {
    return this.http.put<UrlinfoUpdate>(`${this.apiServer}/urls/${urlinfoId}`, urlinfo);
  }

  public updateEmail(email: EmailAdd, urlinfoId: number): Observable<UrlinfoUpdate> {
    return this.http.put<UrlinfoUpdate>(`${this.apiServer}/urls/${urlinfoId}/addEmail`, email);
  }

  public deleteUrlInfo(urlinfoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServer}/urls/${urlinfoId}`);
  }

  public deleteUrlInfos(): Observable<void> {
    return this.http.delete<void>(`${this.apiServer}/urls`);
  }

}
