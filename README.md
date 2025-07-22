# Copos Notes

Copos Notes is a versatile note-taking application built with Ionic and Angular. It allows you to create, manage, and secure your notes and tasks. The application is designed to work seamlessly on both web and mobile devices, with data persistence handled by SQLite on native platforms and IndexedDB on the web.

## Features

*   **Note Management:** Create, edit, and delete notes with titles, content, and images.
*   **Task Management:** Keep track of your to-dos with a simple and efficient task manager.
*   **Secret Notes:** Secure your sensitive information with encrypted, PIN-protected notes.
*   **Cross-Platform:** Built with Ionic and Capacitor, the application runs on Android, iOS, and the web from a single codebase.
*   **Offline Support:** Your data is stored locally, so you can access your notes and tasks even without an internet connection.
*   **Dark Mode:** The application supports a dark theme and respects your device's color scheme preferences.

## Project Structure

The project is organized as follows:

```
copos-notes/
├── src/
│   ├── app/
│   │   ├── components/  # Reusable UI components
│   │   ├── home/        # Notes page
│   │   ├── secret-notes/ # Secret notes page
│   │   ├── services/    # Database and other services
│   │   ├── tasks/       # Tasks page
│   │   └── settings/    # Settings page
│   ├── assets/          # Images and other static assets
│   └── theme/           # Application-wide styles
├── android/             # Android native project
├── resources/           # App icons and splash screens
└── www/                 # Compiled web application
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js 20
*   Ionic CLI
*   Capacitor

### Installation & Running

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/copos-notes.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Run the app in your browser
    ```sh
    ionic s
    ```

### Building the Application

For Android:
```sh
ionic cap build android --prod
```

For iOS:
```sh
ionic cap build ios --prod
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
