import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlinfoService } from './services/urlinfo.service';
import { CommonModule } from '@angular/common';
import { UrlinfoGet } from './models/urlInfoGet';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./modals/login/login.component";
import { AddComponent } from "./modals/add/add.component";
import { DeleteComponent } from "./modals/delete/delete.component";
import { EditComponent } from "./modals/edit/edit.component";
import { UrlinfoUpdate } from './models/urlInfoUpdate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, LoginComponent, AddComponent, DeleteComponent, EditComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'healthcheck-app';

  public urlinfos: UrlinfoGet[] = [];
  public idToDelete: number = -1;
  public idToUpdate: number = -1;
  public urlInfoToUpdate: UrlinfoUpdate = {
    displayName: '',
    url: ''
  };
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

  public openDeleteModal(id: number): void {
    this.idToDelete = id;
  }

  public openEditModal(newName: String, newUrl: String, id: number): void {
    this.urlInfoToUpdate = {
      displayName: newName,
      url: newUrl
    }
    this.idToUpdate = id;
  }

}
