import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { IDatabaseService } from './database.interface';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService implements IDatabaseService {
  private notesStore: LocalForage;
  private secretNotesStore: LocalForage;
  private tasksStore: LocalForage;
  private userSettingsStore: LocalForage;

  constructor() {
    this.notesStore = localforage.createInstance({
      name: 'copos_notes_db',
      storeName: 'notes'
    });
    this.secretNotesStore = localforage.createInstance({
      name: 'copos_notes_db',
      storeName: 'secret_notes'
    });
    this.tasksStore = localforage.createInstance({
      name: 'copos_notes_db',
      storeName: 'tasks'
    });
    this.userSettingsStore = localforage.createInstance({
      name: 'copos_notes_db',
      storeName: 'user_settings'
    });
  }

  async initializePlugin(): Promise<boolean> {
    // IndexedDB does not require explicit initialization like SQLite
    return true;
  }

  // Placeholder for encryption/decryption methods
  private encrypt(data: string): string {
    // WARNING: This is a simple XOR encryption for demonstration purposes only.
    // For a production application, use a robust cryptographic library.
    return data.split('').map((char) => String.fromCharCode(char.charCodeAt(0) ^ 123)).join('');
  }

  private decrypt(data: string): string {
    // WARNING: This is a simple XOR decryption for demonstration purposes only.
    // For a production application, use a robust cryptographic library.
    return data.split('').map((char) => String.fromCharCode(char.charCodeAt(0) ^ 123)).join('');
  }

  // Placeholder for PIN hashing
  private hashPin(pin: string): string {
    // WARNING: This is a simple placeholder for PIN hashing.
    // For a production application, use a robust hashing algorithm like bcrypt.
    return btoa(pin); // Base64 encode as a very basic "hash"
  }

  private verifyPin(pin: string, hashedPin: string): boolean {
    return btoa(pin) === hashedPin;
  }

  // Notes CRUD
  async addNote(title: string, content: string, image: string, type: string = 'text'): Promise<number> {
    const now = Date.now();
    const note = { id: now, title, content, image, type, created_at: now, updated_at: now };
    await this.notesStore.setItem(String(now), note);
    return now;
  }

  async getNotes(): Promise<any[]> {
    const notes: any[] = [];
    await this.notesStore.iterate((value, key, iterationNumber) => {
      notes.push(value);
    });
    return notes.sort((a, b) => b.updated_at - a.updated_at);
  }

  async updateNote(id: number, title: string, content: string, image: string, type: string = 'text'): Promise<number> {
    const note = await this.notesStore.getItem(String(id));
    if (note) {
      const updatedNote = { ...note, title, content, image, type, updated_at: Date.now() };
      await this.notesStore.setItem(String(id), updatedNote);
      return 1;
    }
    return 0;
  }

  async deleteNote(id: number): Promise<number> {
    await this.notesStore.removeItem(String(id));
    return 1;
  }

  // Secret Notes CRUD
  async addSecretNote(content: string): Promise<number> {
    const now = Date.now();
    const encryptedContent = this.encrypt(content);
    const secretNote = { id: now, encrypted_content: encryptedContent, created_at: now, updated_at: now };
    await this.secretNotesStore.setItem(String(now), secretNote);
    return now;
  }

  async getSecretNotes(): Promise<any[]> {
    const secretNotes: any[] = [];
    await this.secretNotesStore.iterate((value: any, key, iterationNumber) => {
      secretNotes.push({ ...value, content: this.decrypt(value.encrypted_content) });
    });
    return secretNotes.sort((a, b) => b.updated_at - a.updated_at);
  }

  async updateSecretNote(id: number, content: string): Promise<number> {
    const secretNote = await this.secretNotesStore.getItem(String(id));
    if (secretNote) {
      const encryptedContent = this.encrypt(content);
      const updatedSecretNote = { ...secretNote, encrypted_content: encryptedContent, updated_at: Date.now() };
      await this.secretNotesStore.setItem(String(id), updatedSecretNote);
      return 1;
    }
    return 0;
  }

  async deleteSecretNote(id: number): Promise<number> {
    await this.secretNotesStore.removeItem(String(id));
    return 1;
  }

  // Tasks CRUD
  async addTask(title: string, description: string, image: string, status: string = 'new', dueDate?: number, reminderTime?: number): Promise<number> {
    const now = Date.now();
    const task = { id: now, title, description, image, status, due_date: dueDate, reminder_time: reminderTime, created_at: now, updated_at: now };
    await this.tasksStore.setItem(String(now), task);
    return now;
  }

  async getTasks(): Promise<any[]> {
    const tasks: any[] = [];
    await this.tasksStore.iterate((value, key, iterationNumber) => {
      tasks.push(value);
    });
    return tasks.sort((a, b) => b.updated_at - a.updated_at);
  }

  async updateTask(id: number, title: string, description: string, status: string, image: string, dueDate?: number, reminderTime?: number): Promise<number> {
    const task = await this.tasksStore.getItem(String(id));
    if (task) {
      const updatedTask = { ...task, title, description, image, status, due_date: dueDate, reminder_time: reminderTime, updated_at: Date.now() };
      await this.tasksStore.setItem(String(id), updatedTask);
      return 1;
    }
    return 0;
  }

  async deleteTask(id: number): Promise<number> {
    await this.tasksStore.removeItem(String(id));
    return 1;
  }

  // User Settings
  async saveUserSettings(name: string, email: string, profilePicture: string, pin: string): Promise<number> {
    const hashedPin = pin ? this.hashPin(pin) : null;
    const settings = { id: 1, name, email, profile_picture: profilePicture, hashed_pin: hashedPin };
    await this.userSettingsStore.setItem('settings', settings);
    return 1;
  }

  async getUserSettings(): Promise<any | null> {
    return await this.userSettingsStore.getItem('settings');
  }

  async verifySecretPin(pin: string): Promise<boolean> {
    const settings = await this.getUserSettings();
    if (settings && settings.hashed_pin) {
      return this.verifyPin(pin, settings.hashed_pin);
    }
    return false;
  }

  async hasSecretPin(): Promise<boolean> {
    const settings = await this.getUserSettings();
    return settings && settings.hashed_pin !== null;
  }
}
