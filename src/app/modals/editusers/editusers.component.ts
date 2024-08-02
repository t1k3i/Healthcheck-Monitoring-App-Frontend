import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editusers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editusers.component.html',
  styleUrls: ['./editusers.component.css']
})
export class EditusersComponent implements AfterViewInit {
  @ViewChild('editusers', { static: true }) modal!: ElementRef;
  users: User[] = [];
  confirmingUserId: number | null = null;
  loading = true;
  timeoutId: any;

  constructor(public authService: AuthenticationService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const modalElement = this.modal.nativeElement;
    this.renderer.listen(modalElement, 'shown.bs.modal', () => {
      this.getUsers();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.users = [];
      this.loading = true;
    });

    this.renderer.listen(modalElement, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (modalElement.contains(target) && !target.classList.contains('btn')) {
        this.resetButton();
      }
    });
  }

  getUsers(): void {
    this.authService.getAll().subscribe(
      (response: User[]) => {
        this.users = response;
        this.loading = false;
      }
    )
  }

  delete(id: number): void {
    this.authService.delete(id).subscribe(
      () => {
        this.getUsers();
      }
    )
  }

  onDeleteClick(id: number) {
    if (this.confirmingUserId === id) {
      this.delete(id);
      this.resetButton();
    } else {
      this.resetButton();
      this.confirmingUserId = id;
      this.timeoutId = setTimeout(() => this.resetButton(), 3000);
    }
  }

  resetButton() {
    clearTimeout(this.timeoutId);
    this.confirmingUserId = null;
  }
}
