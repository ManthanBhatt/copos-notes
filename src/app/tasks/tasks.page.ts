import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { DatabaseProviderService } from '../services/database-provider.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { EditTaskModalComponent } from '../components/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, DragDropModule]
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

  ionViewWillEnter() {
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
      cssClass: 'modal-border-radius'
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
        data.task.image,
        'new',
        dueDateTimestamp,
        reminderTimeTimestamp
      );

      this.loadTasks();
      if (reminderTimeTimestamp && taskId !== -1) {
        await this.scheduleNotification(taskId, data.task.title, reminderTimeTimestamp);
      }
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

  async updateTaskStatus(task: any, newStatus: string) {
    await this.databaseProviderService.databaseService.updateTask(
      task.id,
      task.title,
      task.description,
      newStatus,
      task.image,
      task.due_date,
      task.reminder_time
    );
    this.loadTasks();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Update the status of the dropped task
      const droppedTask: any = event.container.data[event.currentIndex];
      let newStatus: string;
      if (event.container.id === 'newTasksList') {
        newStatus = 'new';
      } else if (event.container.id === 'inProgressTasksList') {
        newStatus = 'in-progress';
      } else if (event.container.id === 'completedTasksList') {
        newStatus = 'completed';
      } else {
        newStatus = droppedTask.status; // Fallback
      }
      this.updateTaskStatus(droppedTask, newStatus);
    }
  }

  async deleteTask(id: number) {
    await this.databaseProviderService.databaseService.deleteTask(id);
    await LocalNotifications.cancel({ notifications: [{ id: id }] });
    this.loadTasks();
  }

  async editTask(task: any) {
    const modal = await this.modalController.create({
      component: EditTaskModalComponent,
      componentProps: { task: task },
      cssClass: 'modal-border-radius'
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
        data.task.image,
        data.task.due_date,
        data.task.reminder_time
      );
      this.loadTasks();
    }
  }
}
