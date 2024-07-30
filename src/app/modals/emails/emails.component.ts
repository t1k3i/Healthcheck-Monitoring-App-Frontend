import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Email } from '../../models/email';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [],
  templateUrl: './emails.component.html',
  styleUrl: './emails.component.css'
})
export class EmailsComponent implements AfterViewInit {
  @Input() inputFromParent: number = -1;
  @ViewChild('emailsc', { static: true }) modal!: ElementRef;
  emails: Email[] = [];

  constructor(private renderer: Renderer2, private urlinfoService: UrlinfoService) {}

  ngAfterViewInit(): void {
    const modalElement = this.modal.nativeElement;
    this.renderer.listen(modalElement, 'shown.bs.modal', () => {
      this.getEmails();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.emails = [];
    });
  }

  getEmails(): void {
    this.urlinfoService.getEmails(this.inputFromParent).subscribe(
      (response: Email[]) => {
        this.emails = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  delete(id: number) {
    this.urlinfoService.deleteEmail(this.inputFromParent, id).subscribe(
      () => {
        this.getEmails();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  addEmail(): void {
    
  }
}
