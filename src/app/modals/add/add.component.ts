import { Component, ElementRef, ViewChild } from '@angular/core';
import { UrlinfoAdd } from '../../models/urlInfoAdd';
import { UrlinfoService } from '../../services/urlinfo.service';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {

  urlinfoAdd: UrlinfoAdd = {
    url: '',
    displayName: ''
  };
  @ViewChild('closebutton') closebutton!: ElementRef;

  constructor(private urlinfoService: UrlinfoService, private eventService: EventService) {}

  public add(): void {
    if (this.urlinfoAdd.url && this.urlinfoAdd.displayName) {
      this.urlinfoService.addUrlInfo(this.urlinfoAdd).subscribe(
        response => {
          this.close();
          console.log('URL info added successfully', response);
          this.eventService.triggerEvent();
        },
        error => {
          console.error('Error adding URL info', error);
        }
      );
    } else {
      console.error('URL and description are required');
    }
  }

  private clear(): void {
    this.urlinfoAdd.url = '';
    this.urlinfoAdd.displayName = '';
  }

  public close(): void {
    this.clear();
    this.closebutton.nativeElement.click();
  }

}
