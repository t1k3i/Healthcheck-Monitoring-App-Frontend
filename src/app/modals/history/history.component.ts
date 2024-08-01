import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HistoryInfo } from '../../models/historyInfo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewInit {

  @ViewChild('historym', { static: true }) modal!: ElementRef;
  @Input() inputFromParent: number = -1;
  history: HistoryInfo[] = [];

  loading = true;

  isConfirming = false;
  confirmTimeout: any;

  constructor(private urlinfoService: UrlinfoService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const modalElement = this.modal.nativeElement;
    this.renderer.listen(modalElement, 'shown.bs.modal', () => {
      this.getHistory();
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      this.history = [];
      this.loading = true;
    });
    
    this.renderer.listen(modalElement, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (modalElement.contains(target) && !target.classList.contains('btn')) {
        this.resetButton();
      }
    });
  }

  getHistory(): void {
    this.urlinfoService.getHistory(this.inputFromParent).subscribe(
      (response: HistoryInfo[]) => {
        this.loading = false;
        this.history = response;
      },
      () => {
        this.loading = false;
      }
    )
  }

  onDeleteClick(): void {
    if (this.isConfirming) {
      this.delete();
    } else {
      this.isConfirming = true;
      this.confirmTimeout = setTimeout(() => {
        this.isConfirming = false;
      }, 3000);
    }
  }

  delete(): void {
    clearTimeout(this.confirmTimeout);
    this.urlinfoService.deleteHistory(this.inputFromParent).subscribe(
      () => {
        this.getHistory();
        this.isConfirming = false;
      }
    )
  }

  resetButton() {
    clearTimeout(this.confirmTimeout);
    this.isConfirming = false;
  }

}
