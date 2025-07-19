import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { DatabaseProviderService } from '../services/database-provider.service';
import { AddNoteModalComponent } from '../components/add-note-modal/add-note-modal.component';
import { EditNoteModalComponent } from '../components/edit-note-modal/edit-note-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AddNoteModalComponent, EditNoteModalComponent]
})
export class HomePage implements OnInit {
  notes: any[] = [];

  constructor(private databaseProviderService: DatabaseProviderService, private modalController: ModalController) { }

  ngOnInit() {
    this.loadNotes();
  }

  async loadNotes() {
    this.notes = await this.databaseProviderService.databaseService.getNotes();
  }

  async openAddNoteModal() {
    const modal = await this.modalController.create({
      component: AddNoteModalComponent,
      cssClass: 'modal-border-radius'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data) {
      return;
    }

    if (data && data.note) {
      await this.databaseProviderService.databaseService.addNote(data.note.title, data.note.content, data.note.image);
      this.loadNotes();
    }
  }

  async deleteNote(id: number) {
    await this.databaseProviderService.databaseService.deleteNote(id);
    this.loadNotes();
  }

  async editNote(note: any) {
    const modal = await this.modalController.create({
      component: EditNoteModalComponent,
      componentProps: { note: note },
      cssClass: 'modal-border-radius'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data) {
      return;
    }

    if (data && data.note) {
      await this.databaseProviderService.databaseService.updateNote(
        data.note.id,
        data.note.title,
        data.note.content,
        data.note.image
      );
      this.loadNotes();
    }
  }
}