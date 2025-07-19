import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-secret-note-modal',
  templateUrl: './edit-secret-note-modal.component.html',
  styleUrls: ['./edit-secret-note-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditSecretNoteModalComponent implements OnInit {
  @Input() note: any;

  editedTitle: string = '';
  editedContent: string = '';
  editedImage: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (this.note) {
      this.editedTitle = this.note.title || '';
      this.editedContent = this.note.content;
      this.editedImage = this.note.image || '';
    }
  }

  async saveChanges() {
    this.modalController.dismiss({
      note: {
        id: this.note.id,
        title: this.editedTitle,
        content: this.editedContent,
        image: this.editedImage
      }
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos // or Camera
      });

      if (image.dataUrl) {
        this.editedImage = image.dataUrl;
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
}
