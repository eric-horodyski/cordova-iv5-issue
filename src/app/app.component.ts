import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { IdentityService } from './identity.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private identityService: IdentityService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  public initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
        this.statusBar.styleLightContent();
        this.registerVault();
      }, 1000);
    });
  }

  private registerVault() {
    this.identityService.init().then((res) => {
      console.log('does the vault exist', res);

      if (res === true) {
        this.identityService.setVaultSessionStatus(true);
        console.log('there is a Vault session');

        try {
          console.log('trying to unlock the Vault');
          this.identityService.unlock().then(() => {
            console.log('you have unlocked the Vault');
          });
        } catch (error) {
          console.log('error trying to unlock the Vault', error);
        }
      }
    });
  }
}
