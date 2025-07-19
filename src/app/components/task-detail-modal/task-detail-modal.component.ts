import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.component.html',
  styleUrls: ['./task-detail-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TaskDetailModalComponent implements OnInit {
  @Input() task: any;

  editedTitle: string = '';
  editedDescription: string = '';
  editedDueDate: string = '';
  editedReminderTime: string = '';
  editedStatus: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (this.task) {
      this.editedTitle = this.task.title;
      this.editedDescription = this.task.description;
      this.editedDueDate = this.task.due_date ? new Date(this.task.due_date).toISOString() : '';
      this.editedReminderTime = this.task.reminder_time ? new Date(this.task.reminder_time).toISOString() : '';
      this.editedStatus = this.task.status;
    }
  }

  async saveChanges() {
    this.modalController.dismiss({
      task: {
        id: this.task.id,
        title: this.editedTitle,
        description: this.editedDescription,
        due_date: this.editedDueDate ? new Date(this.editedDueDate).getTime() : undefined,
        reminder_time: this.editedReminderTime ? new Date(this.editedReminderTime).getTime() : undefined,
        status: this.editedStatus
      }
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }
}
