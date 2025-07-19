import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-secret-note-modal',
  templateUrl: './add-secret-note-modal.component.html',
  styleUrls: ['./add-secret-note-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddSecretNoteModalComponent implements OnInit {
  content: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async addSecretNote() {
    this.modalController.dismiss({ note: { content: this.content } });
  }

  async closeModal() {
    this.modalController.dismiss();
  }
}
