import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { DatabaseProviderService } from '../services/database-provider.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';
import { TaskDetailModalComponent } from '../components/task-detail-modal/task-detail-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AddTaskModalComponent, TaskDetailModalComponent]
})
export class TasksPage implements OnInit {
  selectedSegment: string = 'new';
  tasks: any[] = [];
  newTasks: any[] = [];
  inProgressTasks: any[] = [];
  completedTasks: any[] = [];

  constructor(private databaseProviderService: DatabaseProviderService, private modalController: ModalController) { }

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.databaseProviderService.databaseService.getTasks();
    this.filterTasks();
  }

  filterTasks() {
    this.newTasks = this.tasks.filter(task => task.status === 'new');
    this.inProgressTasks = this.tasks.filter(task => task.status === 'in-progress');
    this.completedTasks = this.tasks.filter(task => task.status === 'completed');
  }

  async openAddTaskModal() {
    const modal = await this.modalController.create({
      component: AddTaskModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data) {
      return;
    }

    if (data && data.task) {
      const dueDateTimestamp = data.task.dueDate ? new Date(data.task.dueDate).getTime() : undefined;
      const reminderTimeTimestamp = data.task.reminderTime ? new Date(data.task.reminderTime).getTime() : undefined;

      const taskId = await this.databaseProviderService.databaseService.addTask(
        data.task.title,
        data.task.description,
        'new',
        dueDateTimestamp,
        reminderTimeTimestamp
      );

      if (reminderTimeTimestamp && taskId !== -1) {
        await this.scheduleNotification(taskId, data.task.title, reminderTimeTimestamp);
      }
      this.loadTasks();
    }
  }

  async scheduleNotification(id: number, title: string, at: number) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Task Reminder',
          body: `Don't forget: ${title}`,
          id: id,
          schedule: { at: new Date(at) },
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }

  async updateTaskStatus(task: any) {
    await this.databaseProviderService.databaseService.updateTask(
      task.id,
      task.title,
      task.description,
      task.status,
      task.due_date,
      task.reminder_time
    );
    this.loadTasks();
  }

  async deleteTask(id: number) {
    await this.databaseProviderService.databaseService.deleteTask(id);
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
    this.loadTasks();
  }

  async editTask(task: any) {
    const modal = await this.modalController.create({
      component: TaskDetailModalComponent,
      componentProps: { task: task }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data) {
      return;
    }

    if (data && data.task) {
      await this.databaseProviderService.databaseService.updateTask(
        data.task.id,
        data.task.title,
        data.task.description,
        data.task.status,
        data.task.due_date,
        data.task.reminder_time
      );
      this.loadTasks();
    }
  }
}
