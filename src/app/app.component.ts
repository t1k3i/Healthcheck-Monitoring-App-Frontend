import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UrlinfoService } from './services/urlinfo.service';
import { CommonModule } from '@angular/common';
import { UrlinfoGet } from './models/urlInfoGet';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormsModule } from '@angular/forms';
import { LoginComponent } from "./modals/login/login.component";
import { AddComponent } from "./modals/add/add.component";
import { DeleteComponent } from "./modals/delete/delete.component";
import { EditComponent } from "./modals/edit/edit.component";
import { UrlinfoUpdate } from './models/urlInfoUpdate';
import { AuthenticationService } from './services/authentication.service';
import { debounceTime, Subscription } from 'rxjs';
import { EventService } from './services/event.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, LoginComponent, AddComponent, DeleteComponent, EditComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'healthcheck-app';

  private eventSubscription!: Subscription;
  
  searchControl: FormControl = new FormControl();

  public urlinfos: UrlinfoGet[] = [];
  public idToDelete: number = -1;
  public idToUpdate: number = -1;
  public urlInfoToUpdate: UrlinfoUpdate = {
    displayName: '',
    url: ''
  };

  constructor(private urlinfoService: UrlinfoService, public authService: AuthenticationService, private eventService: EventService) {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        this.searchForUrl(value);
      });
  }

  ngOnInit(): void {
    this.getUrlInfos();
    this.eventSubscription = this.eventService.event$.subscribe(() => {
      this.getUrlInfos();
    });
  }

  public searchForUrl(key: string): void {
    this.urlinfoService.searchUrlInfos(key).subscribe(
      (response: UrlinfoGet[]) => {
        this.urlinfos = response;
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
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

  public loggout(): void {
    this.authService.logout();
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
