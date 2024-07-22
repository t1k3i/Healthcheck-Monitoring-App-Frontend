import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {

  @Input() inputFromParent: number = -1;
  @ViewChild('closebutton') closebutton!: ElementRef;
  constructor(private urlinfoService: UrlinfoService, private eventService: EventService) {}

  delete(): void {
    this.urlinfoService.deleteUrlInfo(this.inputFromParent).subscribe(
      () => {
        this.closebutton.nativeElement.click(); 
        this.eventService.triggerEvent();
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
