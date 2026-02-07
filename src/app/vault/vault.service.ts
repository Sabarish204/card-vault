import { Injectable, signal } from '@angular/core';

const KEY_HASH = 'vault_key_hash_v1';
const DATA_KEY = 'vault_cards_v1';

@Injectable({ providedIn: 'root' })
export class VaultService {
  private readonly _unlocked = signal<boolean>(false);
  readonly unlocked = this._unlocked.asReadonly();

  get dataKey() {
    return DATA_KEY;
  }

  lock() {
    this._unlocked.set(false);
  }

  resetVault() {
    localStorage.removeItem(KEY_HASH);
    localStorage.removeItem(DATA_KEY);
    this.lock();
  }

  unlock(passphrase: string) {
    const trimmed = passphrase.trim();
    if (!trimmed) return false;

    const storedHash = localStorage.getItem(KEY_HASH);
    const nextHash = this.hash(trimmed);

    if (storedHash && storedHash !== nextHash) {
      return false;
    }

    if (!storedHash) {
      localStorage.setItem(KEY_HASH, nextHash);
    }

    this._unlocked.set(true);
    return true;
  }

  encrypt(payload: string, passphrase: string) {
    return `ENC:${btoa(`${passphrase}:${payload}`)}`;
  }

  decrypt(payload: string, passphrase: string) {
    if (!payload.startsWith('ENC:')) return null;
    const decoded = atob(payload.replace('ENC:', ''));
    const prefix = `${passphrase}:`;
    if (!decoded.startsWith(prefix)) return null;
    return decoded.slice(prefix.length);
  }

  private hash(value: string) {
    return btoa(value.split('').reverse().join(''));
  }
}
