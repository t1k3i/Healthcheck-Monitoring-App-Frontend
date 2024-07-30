import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  if (!password) {
    return null;
  }

  const hasNumber = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinLength = password.length >= 8;

  const valid = hasNumber && hasUpper && hasLower && hasSpecial && hasMinLength;
  if (!valid) {
    return { passwordStrength: true };
  }
  return null;
}

export function capitalizedFirstLetterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const firstLetterIsCapital = /^[A-Z]/.test(value);
    return firstLetterIsCapital ? null : { capitalizedFirstLetter: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  userForm: FormGroup;
  @ViewChild('closeBtn') closebutton!: ElementRef;
  authError: string = '';

  constructor(private authService: AuthenticationService) {
    this.userForm = new FormGroup({
      firstName: new FormControl("", [Validators.required, capitalizedFirstLetterValidator()]),
      lastName: new FormControl("", [Validators.required, capitalizedFirstLetterValidator()]),
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required, passwordValidator]),
      role: new FormControl("USER", [Validators.required])
    })
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.escape', ['$event'])
  onDocumentEvent(event: MouseEvent | KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const modalElement = document.getElementById('register-form');
  
    if (event instanceof MouseEvent) {
      if (modalElement && !modalElement.contains(target)) {
        this.userForm.reset({ role: 'USER' });
        this.authError = "";
      }
    } else if (event instanceof KeyboardEvent && event.key === 'Escape') {
      this.userForm.reset({ role: 'USER' });
      this.authError = "";
    }
  }
  
  register(): void {
    this.authService.register(this.userForm.value.firstName, this.userForm.value.lastName, 
      this.userForm.value.username, this.userForm.value.password, this.userForm.value.role).subscribe(
        () => {
          this.userForm.reset({ role: 'USER' });
          this.close();
          this.authError = "";
        },
        (error) => {
          this.userForm.reset({ role: 'USER' });
          this.authError = "Username already exists";
        }
      )
  }

  private close(): void {
    this.closebutton.nativeElement.click();
  }
  
}
