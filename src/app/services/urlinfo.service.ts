import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlinfoGet } from '../models/urlInfoGet';
import { UrlinfoAdd } from '../models/urlInfoAdd';
import { UrlinfoUpdate } from '../models/urlInfoUpdate';
import { EmailAdd } from '../models/emailAdd';
import { Email } from '../models/email';
import { HistoryInfo } from '../models/historyInfo';

@Injectable({
  providedIn: 'root',
})
export class UrlinfoService {
  apiServer = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getUrlInfos(healthyFirst: boolean = true): Observable<UrlinfoGet[]> {
    const params = new HttpParams().set(
      'healthyFirst',
      healthyFirst.toString()
    );
    return this.http.get<UrlinfoGet[]>(`${this.apiServer}/urls`, { params });
  }

  public getUrlInfo(urlinfoId: number): Observable<UrlinfoGet[]> {
    return this.http.get<UrlinfoGet[]>(`${this.apiServer}/urls/${urlinfoId}`);
  }

  public addUrlInfo(urlinfo: UrlinfoAdd): Observable<UrlinfoAdd> {
    return this.http.post<UrlinfoAdd>(`${this.apiServer}/urls`, urlinfo);
  }

  public updateUrlInfo(
    urlinfo: UrlinfoUpdate,
    urlinfoId: number
  ): Observable<UrlinfoUpdate> {
    return this.http.put<UrlinfoUpdate>(
      `${this.apiServer}/urls/${urlinfoId}`,
      urlinfo
    );
  }

  public updateEmail(email: EmailAdd, urlinfoId: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiServer}/email/${urlinfoId}/emails`,
      email
    );
  }

  public toggleMute(urlinfoId: number): Observable<any> {
    return this.http.put<any>(`${this.apiServer}/urls/toggle/${urlinfoId}`, {});
  }

  public deleteUrlInfo(urlinfoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiServer}/urls/${urlinfoId}`);
  }

  public deleteUrlInfos(): Observable<void> {
    return this.http.delete<void>(`${this.apiServer}/urls`);
  }

  public searchUrlInfos(param: string): Observable<UrlinfoGet[]> {
    return this.http.get<UrlinfoGet[]>(
      `${this.apiServer}/urls/search?query=${encodeURIComponent(param)}`
    );
  }

  public getEmails(urlinfoId: number): Observable<Email[]> {
    return this.http.get<Email[]>(
      `${this.apiServer}/email/${urlinfoId}/emails`
    );
  }

  public deleteEmail(urlinfoId: number, emailId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServer}/email/${urlinfoId}/emails/${emailId}`
    );
  }

  public performHealthcheckNow(urlinfoId: number): Observable<any> {
    return this.http.put<any>(
      `${this.apiServer}/urls/healthcheck/${urlinfoId}`,
      {}
    );
  }

  public getHistory(urlinfoId: number): Observable<HistoryInfo[]> {
    return this.http.get<HistoryInfo[]>(
      `${this.apiServer}/history/${urlinfoId}`
    );
  }

  public deleteHistory(urlinfoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServer}/history/${urlinfoId}`);
  }
}
