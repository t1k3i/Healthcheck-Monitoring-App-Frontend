import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;
  @ViewChild('userForm') userForm!: NgForm; // Reference to NgForm

  public authError: string = '';

  constructor(private authService: AuthenticationService) {}

  public onLogin(form: NgForm): void {
    this.authService.login(form.value.username, form.value.password).subscribe(
      success => {
        form.resetForm();
        this.close(form);
      },
      error => {
        this.authError = 'User not found';
      }
    );
  }

  public close(form: NgForm): void {
    form.resetForm();
    this.closebutton.nativeElement.click();
    this.authError = '';
  }

  // Host listener for clicking outside the modal or pressing escape key
  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.escape', ['$event'])
  onDocumentEvent(event: MouseEvent | KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const modalElement = document.getElementById('login-form');
    if (modalElement && !modalElement.contains(target)) {
      this.userForm.resetForm();
      this.authError = '';
    } else if (event instanceof KeyboardEvent && event.key === 'Escape') {
      this.userForm.resetForm();
      this.authError = '';
    }
  }

}
