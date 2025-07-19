import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecretNotesPage } from './secret-notes.page';

const routes: Routes = [
  {
    path: '',
    component: SecretNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecretNotesPageRoutingModule {}
