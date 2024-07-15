import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlinfoService } from './urlinfo.service';
import { CommonModule } from '@angular/common';
import { UrlinfoGet } from './models/urlInfoGet';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'healthcheck-app';

  public urlinfos: UrlinfoGet[] = [];
key: any;
  constructor(private urlinfoService: UrlinfoService) {}

  ngOnInit(): void {
    this.getUrlInfos();
  }

  public searchForUrl(key: string): void {
    const results: UrlinfoGet[] = [];
    for (const urlInfo of this.urlinfos) {
      if (urlInfo.displayName.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || urlInfo.url.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(urlInfo);
      }
    }
    this.urlinfos = results;
    if (!key) {
      this.getUrlInfos();
    }
  }

  public getUrlInfos(): void {
    this.urlinfoService.getUrlInfos().subscribe(
      (response: UrlinfoGet[]) => {
        this.urlinfos = response;
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
