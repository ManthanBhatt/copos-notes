import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IDatabaseService } from './database.interface';
import { CapacitorSqliteService } from './capacitor-sqlite.service';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseProviderService {
  private _databaseService: IDatabaseService;

  constructor(private platform: Platform, private capacitorSqliteService: CapacitorSqliteService, private indexedDbService: IndexedDbService) {
    if (this.platform.is('hybrid')) {
      this._databaseService = this.capacitorSqliteService;
    } else {
      this._databaseService = this.indexedDbService;
    }
  }

  get databaseService(): IDatabaseService {
    return this._databaseService;
  }
}