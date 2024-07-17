import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { UrlinfoService } from '../../services/urlinfo.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  constructor(private urlinfoService: UrlinfoService) {}

  delete(): void {
    this.urlinfoService.deleteUrlInfo(this.inputFromParent).subscribe(
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
