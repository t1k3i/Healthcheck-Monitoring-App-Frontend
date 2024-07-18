import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UrlinfoUpdate } from '../../models/urlInfoUpdate';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EmailAdd } from '../../models/emailAdd';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  @Input() inputFromParent: number = -1;
  @ViewChild('closebutton') closebutton!: ElementRef;

  @Input() urlInfo: UrlinfoUpdate = {
    displayName: '',
    url: ''
  };
  email: string = '';
  isValidEmail: boolean = false;
  constructor(private urlinfoService: UrlinfoService, private eventService: EventService) {}

  update(): void {
    this.urlinfoService.updateUrlInfo(this.urlInfo, this.inputFromParent).subscribe(
      (response) => {
        this.closebutton.nativeElement.click(); 
        console.log(response);
        this.eventService.triggerEvent();
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  validateEmail() {
    this.isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  addEmail(): void {
    this.urlinfoService.updateEmail({email: this.email}, this.inputFromParent).subscribe(
      (response) => {
        console.log(response);
        this.email = '';
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
