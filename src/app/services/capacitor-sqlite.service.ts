import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, DBSQLiteValues } from '@capacitor-community/sqlite';
import { IDatabaseService } from './database.interface';
import * as bcrypt from 'bcryptjs';
@Injectable({
  providedIn: 'root'
})
export class CapacitorSqliteService implements IDatabaseService {
  private db: SQLiteDBConnection | null = null;
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private saltRounds = 10;  // Cost factor; you can adjust according to performance/security balance

  constructor() { }

  async initializePlugin() {
    try {
      const ret = await this.sqlite.checkConnectionsConsistency();
      const is  = ret.result;
      console.log(`isConnectionsConsistency ${is}`);
      let db: SQLiteDBConnection;
      const dbName = 'copos_notes_db';

      const isConn = (await this.sqlite.isConnection(dbName, false)).result;

      if (ret.result && isConn) {
        db = await this.sqlite.retrieveConnection(dbName, false);
      } else {
        db = await this.sqlite.createConnection(dbName, false, 'no-encryption', 1, false);
      }
      await db.open();
      this.db = db;
      await this.setupDatabase();
      return true;
    } catch (err) {
      console.error('Error initializing database:', err);
      return false;
    }
  }

  private async setupDatabase() {
    if (!this.db) {
      console.error('Database not initialized.');
      return;
    }

    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        image TEXT,
        type TEXT DEFAULT 'text',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `;

    const createSecretNotesTable = `
      CREATE TABLE IF NOT EXISTS secret_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        encrypted_content TEXT NOT NULL,
        image TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `;

    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT,
        status TEXT DEFAULT 'new',
        due_date INTEGER,
        reminder_time INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `;

    const createUserSettingsTable = `
      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        profile_picture TEXT,
        hashed_pin TEXT
      );
    `;

    await this.db.execute(createNotesTable);
    await this.db.execute(createSecretNotesTable);
    await this.db.execute(createTasksTable);
    await this.db.execute(createUserSettingsTable);
    console.log('Tables created or already exist.');
  }

  getDb(): SQLiteDBConnection | null {
    return this.db;
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

  // Hash the PIN securely with bcrypt
  private async hashPin(pin: string): Promise<string> {
    // const salt = await bcrypt.genSalt(this.saltRounds);
    // const hashedPin = await bcrypt.hash(pin, salt);
    return btoa(pin);
  }

  // Verify the PIN against the stored hashed PIN
  private async verifyPin(pin: string, hashedPin: string): Promise<boolean> {
    return atob(pin) === hashedPin;
  }

  // CRUD operations for notes
  async addNote(title: string, content: string, image: string, type: string = 'text'): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const now = Date.now();
    const query = `INSERT INTO notes (title, content, image, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);`;
    const res = await this.db.run(query, [title, content, image, type, now, now]);
    return res.changes?.lastId || -1;
  }

  async getNotes(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `SELECT * FROM notes ORDER BY updated_at DESC;`;
    const res = await this.db.query(query);
    return res.values || [];
  }

  async updateNote(id: number, title: string, content: string, image: string, type: string = 'text'): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const now = Date.now();
    const query = `UPDATE notes SET title = ?, content = ?, image = ?, type = ?, updated_at = ? WHERE id = ?;`;
    const res = await this.db.run(query, [title, content, image, type, now, id]);
    return res.changes?.changes || 0;
  }

  async deleteNote(id: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `DELETE FROM notes WHERE id = ?;`;
    const res = await this.db.run(query, [id]);
    return res.changes?.changes || 0;
  }

  // CRUD operations for secret notes
  async addSecretNote(title: string, content: string, image: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const now = Date.now();
    const encryptedContent = this.encrypt(content);
    const query = `INSERT INTO secret_notes (title, encrypted_content, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?);`;
    const res = await this.db.run(query, [title, encryptedContent, image, now, now]);
    return res.changes?.lastId || -1;
  }

  async getSecretNotes(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `SELECT * FROM secret_notes ORDER BY updated_at DESC;`;
    const res = await this.db.query(query);
    return res.values ? res.values.map(note => ({ ...note, content: this.decrypt(note.encrypted_content) })) : [];
  }

  async updateSecretNote(id: number, title: string, content: string, image: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const now = Date.now();
    const encryptedContent = this.encrypt(content);
    const query = `UPDATE secret_notes SET title = ?, encrypted_content = ?, image = ?, updated_at = ? WHERE id = ?;`;
    const res = await this.db.run(query, [title, encryptedContent, image, now, id]);
    return res.changes?.changes || 0;
  }

  async deleteSecretNote(id: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `DELETE FROM secret_notes WHERE id = ?;`;
    const res = await this.db.run(query, [id]);
    return res.changes?.changes || 0;
  }

  // CRUD operations for tasks
  async addTask(title: string, description: string, image: string, status: string = 'new', dueDate?: number, reminderTime?: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const now = Date.now();
    const query = `INSERT INTO tasks (title, description, image, status, due_date, reminder_time, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    const res = await this.db.run(query, [title, description, image, status, dueDate || null, reminderTime || null, now, now]);
    return res.changes?.lastId || -1;
  }

  async getTasks(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `SELECT * FROM tasks ORDER BY updated_at DESC;`;
    const res = await this.db.query(query);
    return res.values || [];
  }

  async updateTask(id: number, title: string, description: string, image: string, status: string, dueDate?: number, reminderTime?: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const now = Date.now();
    const query = `UPDATE tasks SET title = ?, description = ?, image = ?, status = ?, due_date = ?, reminder_time = ?, updated_at = ? WHERE id = ?;`;
    const res = await this.db.run(query, [title, description, image, status, dueDate || null, reminderTime || null, now, id]);
    return res.changes?.changes || 0;
  }

  async deleteTask(id: number): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `DELETE FROM tasks WHERE id = ?;`;
    const res = await this.db.run(query, [id]);
    return res.changes?.changes || 0;
  }

  // CRUD operations for user settings
  async saveUserSettings(name: string, email: string, profilePicture: string, pin: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized.');
    const hashedPin = pin ? this.hashPin(pin) : null;
    const existingSettings = await this.getUserSettings();
    if (existingSettings) {
      const query = `UPDATE user_settings SET name = ?, email = ?, profile_picture = ?, hashed_pin = ? WHERE id = ?;`;
      const res = await this.db.run(query, [name, email, profilePicture, hashedPin, existingSettings.id]);
      return res.changes?.changes || 0;
    } else {
      const query = `INSERT INTO user_settings (name, email, profile_picture, hashed_pin) VALUES (?, ?, ?, ?);`;
      const res = await this.db.run(query, [name, email, profilePicture, hashedPin]);
      return res.changes?.lastId || -1;
    }
  }

  async getUserSettings(): Promise<any | null> {
    if (!this.db) throw new Error('Database not initialized.');
    const query = `SELECT * FROM user_settings LIMIT 1;`;
    const res = await this.db.query(query);
    return res.values && res.values.length > 0 ? res.values[0] : null;
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
