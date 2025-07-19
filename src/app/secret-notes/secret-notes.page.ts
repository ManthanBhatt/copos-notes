import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { DatabaseProviderService } from '../services/database-provider.service';
import { PinInputModalComponent } from '../components/pin-input-modal/pin-input-modal.component';
import { AddSecretNoteModalComponent } from '../components/add-secret-note-modal/add-secret-note-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secret-notes',
  templateUrl: './secret-notes.page.html',
  styleUrls: ['./secret-notes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PinInputModalComponent, AddSecretNoteModalComponent]
})
export class SecretNotesPage implements OnInit {
  secretNotes: any[] = [];
  isAuthenticated: boolean = false;
  hasPinConfigured: boolean = false;

  constructor(private databaseProviderService: DatabaseProviderService, private alertController: AlertController, private modalController: ModalController, private router: Router) { }

  async ngOnInit() {
    await this.checkPinStatus();
    if (this.hasPinConfigured) {
      await this.openPinAuthenticationModal();
    } else {
      this.isAuthenticated = false; // If no PIN is configured, user is not authenticated for secret notes
    }
  }

  async checkPinStatus() {
    this.hasPinConfigured = await this.databaseProviderService.databaseService.hasSecretPin();
  }

  async openPinAuthenticationModal() {
    const modal = await this.modalController.create({
      component: PinInputModalComponent,
      componentProps: { title: 'Enter PIN to access Secret Notes' }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data || !data.pin) {
      this.isAuthenticated = false;
      return;
    }

    if (await this.databaseProviderService.databaseService.verifySecretPin(data.pin)) {
      this.isAuthenticated = true;
      this.loadSecretNotes();
    } else {
      const alert = await this.alertController.create({
        header: 'Authentication Failed',
        message: 'Incorrect PIN. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
      this.isAuthenticated = false;
    }
  }

  async loadSecretNotes() {
    if (this.isAuthenticated) {
      this.secretNotes = await this.databaseProviderService.databaseService.getSecretNotes();
    }
  }

  async openAddSecretNoteModal() {
    const modal = await this.modalController.create({
      component: AddSecretNoteModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data) {
      return;
    }

    if (data && data.note) {
      await this.databaseProviderService.databaseService.addSecretNote(data.note.content);
      this.loadSecretNotes();
    }
  }

  async deleteSecretNote(id: number) {
    if (this.isAuthenticated) {
      await this.databaseProviderService.databaseService.deleteSecretNote(id);
      this.loadSecretNotes();
    }
  }

  navigateToSettings() {
    this.router.navigateByUrl('/settings');
  }

  // Placeholder for edit functionality
  editSecretNote(note: any) {
    console.log('Edit secret note:', note);
    // Implement navigation to an edit page or a modal
  }
}
