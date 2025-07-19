import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecretNotesPageRoutingModule } from './secret-notes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecretNotesPageRoutingModule
  ]
})
export class SecretNotesPageModule {}
