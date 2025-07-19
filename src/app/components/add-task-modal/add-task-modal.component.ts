import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddTaskModalComponent implements OnInit {
  title: string = '';
  description: string = '';
  dueDate: string = '';
  reminderTime: string = '';
  image: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async addTask() {
    this.modalController.dismiss({
      task: {
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        reminderTime: this.reminderTime,
        image: this.image
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
        this.image = image.dataUrl;
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }
}
