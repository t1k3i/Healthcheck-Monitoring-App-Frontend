import { Component } from '@angular/core';
import { UrlinfoAdd } from '../../models/urlInfoAdd';
import { UrlinfoService } from '../../services/urlinfo.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private urlinfoService: UrlinfoService) {}

  public add(): void {
    if (this.urlinfoAdd.url && this.urlinfoAdd.displayName) {
      this.urlinfoService.addUrlInfo(this.urlinfoAdd).subscribe(
        response => {
          console.log('URL info added successfully', response);
        },
        error => {
          console.error('Error adding URL info', error);
        }
      );
    } else {
      console.error('URL and description are required');
    }
  }

}
