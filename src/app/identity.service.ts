import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {
  IdentityVaultConfig,
  BrowserVault,
  Device,
  DeviceSecurityType,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';

const config: IdentityVaultConfig = {
  key: 'io.ionic.healthyboi',
  type: VaultType.DeviceSecurity,
  deviceSecurityType: DeviceSecurityType.Biometrics, //Both
  lockAfterBackgrounded: 1800000, //30 mins
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 3,
};

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  vault: Vault | BrowserVault;

  biometricsStrength: any;

  hasVaultSession = false;

  constructor(private platform: Platform) {}

  init(): Promise<boolean> {
    console.log('inside init');
    this.vault = this.platform.is('hybrid')
      ? new Vault(config)
      : new BrowserVault(config);

    return this.vault.doesVaultExist();
  }

  async doesVaultExist() {
    const vaultExists = await this.vault.doesVaultExist();
    if (!vaultExists) {
      // the vault does not exist...
      return false;
    } else {
      return true;
    }
  }

  async isBiometricsEnabled() {
    const biometricsEnabled = await Device.isBiometricsEnabled();
    if (!biometricsEnabled) {
      // biometrics not enabled on this device...
      console.log('biometrics disabled');
      return false;
    } else {
      console.log('biometrics enabled');
      return true;
    }
  }

  async isBiometricsSupported() {
    const biometricsSupported = await Device.isBiometricsSupported();
    if (biometricsSupported) {
      // biometrics is supported on this device...
      console.log('biometrics supported');
      return true;
    } else {
      console.log('biometrics not supported');
      return false;
    }
  }

  async getDeviceBiometrics() {
    const hardware = await Device.getAvailableHardware();

    return hardware;
  }

  async getBiometricsStrengthLevel() {
    const biometricStrength = await Device.getBiometricStrengthLevel();
    console.log('biometric strength ', biometricStrength);

    return biometricStrength;
  }

  setVaultSessionStatus(state: boolean) {
    this.hasVaultSession = state;
  }

  getVaultSessionStatus() {
    return this.hasVaultSession;
  }

  async setCustomPasscode(code: string) {
    await this.vault.setCustomPasscode(code);
  }

  async set(key: string, value: string): Promise<void> {
    await this.vault.setValue<string>(key, value);
  }

  async get(key: string): Promise<string> {
    const data = await this.vault.getValue<string>(key);
    return data;
  }

  async unlock() {
    await this.vault.unlock();
  }

  async hasStoredSession() {
    return await this.vault.doesVaultExist();
  }

  async logout() {
    await this.vault.clear();
  }

  async toggleHideScreen(shouldHide: boolean) {
    await Device.setHideScreenOnBackground(shouldHide);
  }
}
