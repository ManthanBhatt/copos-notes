import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-note-modal',
  templateUrl: './add-note-modal.component.html',
  styleUrls: ['./add-note-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddNoteModalComponent implements OnInit {
  title: string = '';
  content: string = '';
  image: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async addNote() {
    this.modalController.dismiss({ note: { title: this.title, content: this.content, image: this.image } });
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
        this.image = image.dataUrl;
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
}
