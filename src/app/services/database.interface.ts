export interface IDatabaseService {
  initializePlugin(): Promise<boolean>;
  // Notes CRUD
  addNote(title: string, content: string, image: string, type?: string): Promise<number>;
  getNotes(): Promise<any[]>;
  updateNote(id: number, title: string, content: string, image: string, type?: string): Promise<number>;
  deleteNote(id: number): Promise<number>;

  // Secret Notes CRUD
  addSecretNote(content: string): Promise<number>;
  getSecretNotes(): Promise<any[]>;
  updateSecretNote(id: number, content: string): Promise<number>;
  deleteSecretNote(id: number): Promise<number>;

  // Tasks CRUD
  addTask(title: string, description: string, status?: string, dueDate?: number, reminderTime?: number): Promise<number>;
  getTasks(): Promise<any[]>;
  updateTask(id: number, title: string, description: string, status: string, dueDate?: number, reminderTime?: number): Promise<number>;
  deleteTask(id: number): Promise<number>;

  // User Settings
  saveUserSettings(name: string, email: string, profilePicture: string, pin: string): Promise<number>;
  getUserSettings(): Promise<any | null>;
  verifySecretPin(pin: string): Promise<boolean>;
  hasSecretPin(): Promise<boolean>;
}