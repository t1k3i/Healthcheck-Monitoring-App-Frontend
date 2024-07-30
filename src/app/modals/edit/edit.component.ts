import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { UrlinfoService } from '../../services/urlinfo.service';
import { UrlinfoUpdate } from '../../models/urlInfoUpdate';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  @Input() inputFromParent: number = -1;
  @ViewChild('closebutton') closebutton!: ElementRef;

  @Input() urlInfo: UrlinfoUpdate = {
    displayName: '',
    url: '',
    frequency: 0
  };
  errEdit = '';
  editForm: FormGroup;

  errEmail = '';
  emailForm: FormGroup;


  constructor(private urlinfoService: UrlinfoService, private eventService: EventService) {
    this.emailForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)])
    });
    this.editForm = new FormGroup({
      displayName: new FormControl(this.urlInfo.displayName, [Validators.required]),
      url: new FormControl(this.urlInfo.url, [Validators.required, Validators.pattern(/\b(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/)]),
      frequency:  new FormControl(this.urlInfo.frequency, [Validators.required, Validators.min(1)]),
    })
  }

  update(): void {
    this.urlinfoService.updateUrlInfo({ displayName: this.editForm.value.displayName, url: this.editForm.value.url, frequency: this.editForm.value.frequency }, this.inputFromParent).subscribe(
      () => {
        this.closebutton.nativeElement.click();
        this.eventService.triggerEvent();
        this.editForm.reset({ displayName: this.editForm.value.displayName, url: this.editForm.value.url, frequency: this.editForm.value.frequency });
        this.errEdit = '';
      }, 
      () => {
        this.errEdit = 'This url or display name already exists';
      }
    )
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.escape', ['$event'])
  onDocumentEvent(event: MouseEvent | KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const modalElement = document.getElementById('editModal');
  
    if (event instanceof MouseEvent) {
      if (modalElement && !modalElement.contains(target)) {
        this.editForm.reset({ displayName: this.urlInfo.displayName, url: this.urlInfo.url, frequency: this.urlInfo.frequency });
        this.errEdit = '';
        this.errEmail = '';
      }
    } else if (event instanceof KeyboardEvent && event.key === 'Escape') {
      this.editForm.reset({ displayName: this.urlInfo.displayName, url: this.urlInfo.url, frequency: this.urlInfo.frequency });
      this.errEmail = '';
      this.errEdit = '';
    }
  }

}
