import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecretNotesPage } from './secret-notes.page';

describe('SecretNotesPage', () => {
  let component: SecretNotesPage;
  let fixture: ComponentFixture<SecretNotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretNotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
