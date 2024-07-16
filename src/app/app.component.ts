import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlinfoService } from './services/urlinfo.service';
import { CommonModule } from '@angular/common';
import { UrlinfoGet } from './models/urlInfoGet';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { UrlinfoAdd } from './models/urlInfoAdd';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'healthcheck-app';

  username = '';
  password = '';

  urlinfoAdd: UrlinfoAdd = {
    url: '',
    displayName: ''
  };

  public urlinfos: UrlinfoGet[] = [];
  constructor(private urlinfoService: UrlinfoService, private authService: AuthenticationService) {}

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

  public onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        console.log('Login successful ');
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

  public add(): void {
    if (this.urlinfoAdd.url && this.urlinfoAdd.displayName) {
      this.urlinfoService.addUrlInfo(this.urlinfoAdd).subscribe(
        response => {
          console.log('URL info added successfully', response);
        },
        error => {
          console.error('Error adding URL info', error);
        }
      );
    } else {
      console.error('URL and description are required');
    }
  }

}
