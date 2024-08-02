import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { EditusersComponent } from './modals/editusers/editusers.component';
import { RegisterComponent } from './modals/register/register.component';
import { EmailsComponent } from './modals/emails/emails.component';
import { HistoryComponent } from "./modals/history/history.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, LoginComponent, AddComponent, DeleteComponent, EditComponent, ReactiveFormsModule, EditusersComponent, RegisterComponent, EmailsComponent, HistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'healthcheck-app';

  private eventSubscription!: Subscription;
  
  searchControl: FormControl = new FormControl();

  public urlinfos: UrlinfoGet[] = [];

  public idTo: number = -1;
  public urlInfoToUpdate: UrlinfoUpdate = {
    displayName: '',
    url: '',
    frequency: 0
  };
  
  private sort: boolean = true;

  selectedUrlInfo: UrlinfoGet | null = null;
  private selectedUrlId: number | null = null;

  loading = true;

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
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
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
    this.urlinfoService.getUrlInfos(this.sort).subscribe(
      (response: UrlinfoGet[]) => {
        this.urlinfos = response;
        this.loading = false;
        this.reselectRow();
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.loading = false;
      }
    )
  }

  public loggout(): void {
    this.authService.logout();
  }

  public openModal(id: number): void {
    this.idTo = id;
  }

  openModalOuter(): void {
    this.openModal(this.selectedUrlInfo!.id);
  }

  public openEditModal(newName: String, newUrl: String, id: number, newFrequency: number): void {
    this.urlInfoToUpdate = {
      displayName: newName,
      url: newUrl,
      frequency: newFrequency
    }
    this.openModal(id);
  }

  public openEditModalOuter(): void {
    this.openEditModal(this.selectedUrlInfo!.displayName, this.selectedUrlInfo!.url, this.selectedUrlInfo!.id, this.selectedUrlInfo!.frequency);
  }

  public toggle(id: number) {
    this.selectedUrlInfo = null;
    this.urlinfoService.toggleMute(id).subscribe(
      () => {
        this.eventService.triggerEvent();
      }
    )
  }

  changeOrder(): void {
    this.sort = this.sort ? false : true;
    this.eventService.triggerEvent();
  }

  performHealthCheckNow(id: number): void {
    this.urlinfoService.performHealthcheckNow(id).subscribe(
      () => {
        this.eventService.triggerEvent();
      }
    );
  }

  performHealthCheckNowOuter(): void {
    this.performHealthCheckNow(this.selectedUrlInfo!.id);
  }

  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('table') && !targetElement.closest('.button-group') && !targetElement.closest('.modal') && !targetElement.closest('.form-switch')) {
      this.selectedUrlInfo = null;
      this.selectedUrlId = null;
    }
  }

  selectRow(urlinfo: UrlinfoGet, event: MouseEvent) {
    event.stopPropagation();
    this.selectedUrlInfo = urlinfo;
    this.selectedUrlId = urlinfo.id;
  }
  
  reselectRow() {
    if (this.selectedUrlId) {
      this.selectedUrlInfo = this.urlinfos.find(urlinfo => urlinfo.id === this.selectedUrlId) || null;
    }
  }
}
