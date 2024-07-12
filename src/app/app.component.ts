import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlinfoGet } from './urlinfoget';
import { UrlinfoService } from './urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'healthcheck-app';

  public urlinfos: UrlinfoGet[] = [];

  constructor(private urlinfoService: UrlinfoService) {}

  ngOnInit(): void {
    this.getUrlinfos();
  }

  public getUrlinfos(): void {
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
