import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

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

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  async addTask() {
    this.modalController.dismiss({
      task: {
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        reminderTime: this.reminderTime
      }
    });
  }

  async closeModal() {
    this.modalController.dismiss();
  }
}
