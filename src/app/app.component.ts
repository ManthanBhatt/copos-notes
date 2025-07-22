import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatabaseProviderService } from './services/database-provider.service';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  darkMode: boolean = false;

  constructor(private platform: Platform, private databaseProviderService: DatabaseProviderService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      await this.databaseProviderService.databaseService.initializePlugin();
      this.loadThemePreference();
      StatusBar.setOverlaysWebView({
        overlay: false
      });
    });
  }

  loadThemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('darkMode');

    if (storedTheme !== null) {
      this.darkMode = storedTheme === 'true';
    } else {
      this.darkMode = prefersDark.matches;
    }
    document.body.classList.toggle('dark', this.darkMode);

    prefersDark.addEventListener('change', (mediaQuery) => {
      if (localStorage.getItem('darkMode') === null) { // Only react to system changes if no user preference is set
        this.darkMode = mediaQuery.matches;
        document.body.classList.toggle('dark', this.darkMode);
      }
    });
  }

  toggleTheme(enableDark: boolean) {
    this.darkMode = enableDark;
    document.body.classList.toggle('dark', this.darkMode);
    localStorage.setItem('darkMode', String(this.darkMode));
  }
}
