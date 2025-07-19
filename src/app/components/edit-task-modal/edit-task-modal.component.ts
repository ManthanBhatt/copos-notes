import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditTaskModalComponent implements OnInit {
  @Input() task: any;

  editedTitle: string = '';
  editedDescription: string = '';
  editedDueDate: string = '';
  editedReminderTime: string = '';
  editedStatus: string = '';
  editedImage: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (this.task) {
      this.editedTitle = this.task.title;
      this.editedDescription = this.task.description;
      this.editedDueDate = this.task.due_date ? this.getCurrentDateYMD() : '';
      this.editedReminderTime = this.task.reminder_time ? `${this.editedDueDate}T${this.getCurrentTimeHMS()}` : '';
      this.editedStatus = this.task.status;
      this.editedImage = this.task.image || '';
    }
  }

  private getCurrentDateYMD(): string {
    const now = new Date(this.task.due_date);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getCurrentTimeHMS(): string {
    const now = new Date(this.task.reminder_time);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  async saveChanges() {
    this.modalController.dismiss({
      task: {
        id: this.task.id,
        title: this.editedTitle,
        description: this.editedDescription,
        due_date: this.editedDueDate ? new Date(this.editedDueDate).getTime() : undefined,
        reminder_time: this.editedReminderTime ? new Date(this.editedReminderTime).getTime() : undefined,
        status: this.editedStatus,
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
