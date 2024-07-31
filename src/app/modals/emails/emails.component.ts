import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { Email } from '../../models/email';
import { UrlinfoService } from '../../services/urlinfo.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  errEmail = '';
  emailForm: FormGroup;

  constructor(private renderer: Renderer2, private urlinfoService: UrlinfoService) {
    this.emailForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)])
    });
  }

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
    this.urlinfoService.updateEmail({ email: this.emailForm.value.email }, this.inputFromParent).subscribe(
      () => {
        this.getEmails();
      },
      () => {
        this.errEmail = 'This email is already connected';
      }
    );
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:keyup.escape', ['$event'])
  onDocumentEvent(event: MouseEvent | KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const modalElement = document.getElementById('editEmailsModal');
  
    if (event instanceof MouseEvent) {
      if (modalElement && !modalElement.contains(target)) {
        this.emailForm.reset();
        this.errEmail = '';
      }
    } else if (event instanceof KeyboardEvent && event.key === 'Escape') {
      this.emailForm.reset();
      this.errEmail = '';
    }
  }
}
