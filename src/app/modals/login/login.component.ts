import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';
  @ViewChild('closebutton') closebutton!: ElementRef;

  constructor(private authService: AuthenticationService) {}

  public onLogin(): void {
    this.authService.login(this.username, this.password).subscribe(
      success => {
        this.closebutton.nativeElement.click(); 
        console.log('Login successful ');
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

}