import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pin-input-modal',
  templateUrl: './pin-input-modal.component.html',
  styleUrls: ['./pin-input-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PinInputModalComponent implements OnInit {
  pin: string = '';
  title: string = 'Enter PIN';
  isSettingPin: boolean = false;

  constructor(private modalController: ModalController) { }

  ngOnInit() { }

  addNumber(num: number) {
    if (this.pin.length < 6) {
      this.pin += num.toString();
    }
  }

  clearPin() {
    this.pin = '';
  }

  deleteLast() {
    this.pin = this.pin.slice(0, -1);
  }

  async confirm() {
    this.modalController.dismiss({ pin: this.pin });
  }

  async closeModal() {
    this.modalController.dismiss();
  }
}
