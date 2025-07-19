import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NoteCardComponent implements OnInit {
  @Input() note: any;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  constructor() { }

  ngOnInit() { }

  onEdit() {
    this.edit.emit(this.note);
  }

  onDelete() {
    this.delete.emit(this.note.id);
  }
}
