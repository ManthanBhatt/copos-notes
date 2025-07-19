import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-secret-note-modal',
  templateUrl: './edit-secret-note-modal.component.html',
  styleUrls: ['./edit-secret-note-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditSecretNoteModalComponent implements OnInit {
  @Input() note: any;

  editedContent: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (this.note) {
      this.editedContent = this.note.content;
    }
  }

  async saveChanges() {
    this.modalController.dismiss({
      note: {
        id: this.note.id,
        content: this.editedContent
      }
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }
}
