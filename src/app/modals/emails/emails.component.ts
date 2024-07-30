import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Email } from '../../models/email';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emails.component.html',
  styleUrl: './emails.component.css'
})
export class EmailsComponent implements AfterViewInit {
  @Input() inputFromParent: number = -1;
  @ViewChild('emailsc', { static: true }) modal!: ElementRef;
  emails: Email[] = [];

  confirmingEmailId: number | null = null;
  timeoutId: any;
  loading = true;

  constructor(private renderer: Renderer2, private urlinfoService: UrlinfoService) {}

  ngAfterViewInit(): void {
    const modalElement = this.modal.nativeElement;
    this.renderer.listen(modalElement, 'shown.bs.modal', () => {
      this.getEmails();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.emails = [];
      this.loading = true;
    });

    this.renderer.listen(modalElement, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (modalElement.contains(target) && !target.classList.contains('btn')) {
        this.resetButton();
      }
    });
  }

  getEmails(): void {
    this.urlinfoService.getEmails(this.inputFromParent).subscribe(
      (response: Email[]) => {
        this.loading = false;
        this.emails = response;
      },
      () => {
        this.loading = false;
      }
    )
  }

  delete(id: number) {
    this.urlinfoService.deleteEmail(this.inputFromParent, id).subscribe(
      () => {
        this.getEmails();
      }
    )
  }

  onDeleteClick(id: number) {
    if (this.confirmingEmailId === id) {
      this.delete(id);
      this.resetButton();
    } else {
      this.resetButton();
      this.confirmingEmailId = id;
      this.timeoutId = setTimeout(() => this.resetButton(), 3000);
    }
  }

  resetButton() {
    clearTimeout(this.timeoutId);
    this.confirmingEmailId = null;
  }

  addEmail(): void {
    
  }
}
