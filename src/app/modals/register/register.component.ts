import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild('closeBtn') closebutton!: ElementRef;
  authError: string = '';

  constructor(private authService: AuthenticationService) {}

  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.escape', ['$event'])
  onDocumentEvent(event: MouseEvent | KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const modalElement = document.getElementById('register-form');
  
    if (event instanceof MouseEvent) {
      if (modalElement && !modalElement.contains(target)) {
        this.resetForm(this.userForm);
      }
    } else if (event instanceof KeyboardEvent && event.key === 'Escape') {
      this.resetForm(this.userForm);
    }
  }

  resetForm(userForm: NgForm): void {
    userForm.reset({
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      role: 'USER'
    });
    this.authError = "";
  } 

  register(form: NgForm): void {
    this.authService.register(form.value.firstName, form.value.lastName, 
      form.value.username, form.value.password, form.value.role).subscribe(
        () => {
          form.resetForm(this.userForm);
          this.close();
        },
        (error) => {
          form.resetForm(this.userForm);
          if (error.status == 400) {
            this.authError = "Enter valid password";
          } else {
            this.authError = "Username already exists";
          }
        }
      )
  }

  private close(): void {
    this.closebutton.nativeElement.click();
  }
  
}
