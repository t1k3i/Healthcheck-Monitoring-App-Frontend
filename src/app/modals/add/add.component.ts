import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UrlinfoAdd } from '../../models/urlInfoAdd';
import { UrlinfoService } from '../../services/urlinfo.service';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';

// Custom validator to check if the value is a number greater than one
export function greaterThanOneValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = control.value >= 1 && !isNaN(control.value);
    return isValid ? null : { 'greaterThanOne': { value: control.value } };
  };
}

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  urlForm: FormGroup;
  err: string = '';
  @ViewChild('closebutton') closebutton!: ElementRef;

  constructor(private urlinfoService: UrlinfoService, private eventService: EventService) {
    this.urlForm = new FormGroup({
      displayName: new FormControl("", [Validators.required]),
      url: new FormControl("", [Validators.required, Validators.pattern(/\b(https?|ftp|file):\/\/[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]/)]),
      frequency: new FormControl("", [Validators.required, greaterThanOneValidator()])
    })
  }

  public add(): void {
    this.urlinfoService.addUrlInfo({ url: this.urlForm.value.url, displayName: this.urlForm.value.displayName, frequency: this.urlForm.value.frequency }).subscribe(
      () => {
        this.close();
        this.eventService.triggerEvent();
        this.urlForm.reset();
        this.err = '';
      },
      () => {
        this.err = 'Url or name already exists';
      }
    );
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.escape', ['$event'])
  onDocumentEvent(event: MouseEvent | KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const modalElement = document.getElementById('add-form');
  
    if (event instanceof MouseEvent) {
      if (modalElement && !modalElement.contains(target)) {
        this.urlForm.reset();
        this.err = '';
      }
    } else if (event instanceof KeyboardEvent && event.key === 'Escape') {
      this.urlForm.reset();
      this.err = '';
    }
  }

  public close(): void {
    this.closebutton.nativeElement.click();
  }

}
