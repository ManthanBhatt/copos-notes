import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'COPOS Notes',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/NoCloud'
    },
    LocalNotifications: {
      smallIcon: 'res://ic_stat_icon_config',
      iconColor: '#488AFF',
      sound: 'res://bells'
    }
  }
};

export default config;
