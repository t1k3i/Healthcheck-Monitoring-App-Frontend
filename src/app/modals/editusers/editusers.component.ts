import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-editusers',
  standalone: true,
  imports: [],
  templateUrl: './editusers.component.html',
  styleUrl: './editusers.component.css'
})
export class EditusersComponent implements AfterViewInit {
  @ViewChild('editusers', { static: true }) modal!: ElementRef;
  users: User[] = [];

  constructor(private authService: AuthenticationService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const modalElement = this.modal.nativeElement;
    this.renderer.listen(modalElement, 'shown.bs.modal', () => {
      this.getUsers();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.users = [];
    });
  }

  getUsers(): void {
    this.authService.getAll().subscribe(
      (response: User[]) => {
        this.users = response;
      },
      () => {
        console.log("errrrorrr");
      }
    )
  }

  delete(id: number): void {
    this.authService.delete(id).subscribe(
      () => {
        console.log("Zbrisal uspešno userja");
        this.getUsers();
      },
      () => {
        console.log("errrrorrr");
      }
    )
  }

}
