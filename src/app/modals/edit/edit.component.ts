import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UrlinfoUpdate } from '../../models/urlInfoUpdate';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  @Input() inputFromParent: number = -1;
  @ViewChild('closebutton') closebutton!: ElementRef;

  @Input() urlInfo: UrlinfoUpdate = {
    displayName: '',
    url: ''
  };
  constructor(private urlinfoService: UrlinfoService) {}

  update(): void {
    this.urlinfoService.updateUrlInfo(this.urlInfo, this.inputFromParent).subscribe(
      (response) => {
        this.closebutton.nativeElement.click(); 
        console.log(response);
      }, 
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
