import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform, AlertController, ModalController } from '@ionic/angular';
import { DatabaseProviderService } from '../services/database-provider.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PinInputModalComponent } from '../components/pin-input-modal/pin-input-modal.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userProfilePicture: string = '';
  newPin: string = '';
  pinInput: string = '';
  isAuthenticated: boolean = false;
  hasPinConfigured: boolean = false;
  isProfileConfigured: boolean = false;
  isEditingProfile: boolean = false;

  constructor(
    private databaseProviderService: DatabaseProviderService,
    private platform: Platform,
    private alertController: AlertController,
    private modalController: ModalController,
    public appComponent: AppComponent // Inject AppComponent
  ) { }

  async ngOnInit() {
    await this.checkPinStatus();
    if (!this.hasPinConfigured) {
      this.isAuthenticated = true; // Auto-authenticate if no PIN is set
      await this.loadUserSettings();
      this.isEditingProfile = !this.isProfileConfigured; // If no profile, start in edit mode
    } else {
      // If PIN is configured, show PIN input modal for authentication
      await this.openPinAuthenticationModal();
    }
  }

  async checkPinStatus() {
    this.hasPinConfigured = await this.databaseProviderService.databaseService.hasSecretPin();
  }

  async openPinAuthenticationModal() {
    const modal = await this.modalController.create({
      component: PinInputModalComponent,
      cssClass: 'pin-modal',
      componentProps: { title: 'Enter PIN to access Settings' }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data || !data.pin) {
      // User cancelled or no PIN entered, keep isAuthenticated false
      this.isAuthenticated = false;
      return;
    }

    if (await this.databaseProviderService.databaseService.verifySecretPin(data.pin)) {
      this.isAuthenticated = true;
      await this.loadUserSettings();
      this.isEditingProfile = !this.isProfileConfigured; // If no profile, start in edit mode
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

  async authenticate() {
    // This method is now redundant if openPinAuthenticationModal is used on init
    // However, keeping it for consistency if direct PIN input is still desired elsewhere
    if (await this.databaseProviderService.databaseService.verifySecretPin(this.pinInput)) {
      this.isAuthenticated = true;
      await this.loadUserSettings();
      this.isEditingProfile = !this.isProfileConfigured; // If no profile, start in edit mode
    } else {
      const alert = await this.alertController.create({
        header: 'Authentication Failed',
        message: 'Incorrect PIN. Please try again.',
        buttons: ['OK'],
      });
      await alert.present();
    }
    this.pinInput = '';
  }

  async loadUserSettings() {
    const settings = await this.databaseProviderService.databaseService.getUserSettings();
    if (settings) {
      this.userName = settings.name || '';
      this.userEmail = settings.email || '';
      this.userProfilePicture = settings.profile_picture || '';
      this.isProfileConfigured = true;
    } else {
      this.isProfileConfigured = false;
    }
  }

  async saveProfile() {
    await this.databaseProviderService.databaseService.saveUserSettings(
      this.userName,
      this.userEmail,
      this.userProfilePicture,
      (await this.databaseProviderService.databaseService.getUserSettings())?.hashed_pin || '' // Keep existing PIN if not setting new one
    );
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Profile saved successfully.',
      buttons: ['OK'],
    });
    await alert.present();
    await this.checkPinStatus(); // Recheck PIN status after saving
    await this.loadUserSettings(); // Reload settings to update UI
    this.isEditingProfile = false; // Exit edit mode after saving
  }

  async openPinModal() {
    const modal = await this.modalController.create({
      component: PinInputModalComponent,
      cssClass: 'pin-modal',
      componentProps: { title: this.hasPinConfigured ? 'Change PIN' : 'Set PIN', isSettingPin: true }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || !data || !data.pin) {
      return;
    }

    if (data.pin.length === 6) {
      await this.databaseProviderService.databaseService.saveUserSettings(
        this.userName,
        this.userEmail,
        this.userProfilePicture,
        data.pin
      );
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'PIN set successfully.',
        buttons: ['OK'],
      });
      await alert.present();
      this.newPin = '';
      await this.checkPinStatus(); // Recheck PIN status after setting
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'PIN must be 6 digits.',
        buttons: ['OK'],
      });
      await alert.present();
    }
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
        this.userProfilePicture = image.dataUrl;
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  }

  toggleTheme() {
    setTimeout(() => {
      this.appComponent.toggleTheme(this.appComponent.darkMode);
    }, 500);
  }

  toggleEditMode() {
    this.isEditingProfile = !this.isEditingProfile;
  }
}