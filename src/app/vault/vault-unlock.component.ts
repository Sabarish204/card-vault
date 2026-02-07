import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { CardStoreService } from '../cards/card-store.service';
import { VaultService } from './vault.service';

@Component({
  selector: 'app-vault-unlock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule
  ],
  templateUrl: './vault-unlock.component.html',
  styleUrl: './vault-unlock.component.css'
})
export class VaultUnlockComponent {
  readonly form: FormGroup;
  error = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly vault: VaultService,
    private readonly store: CardStoreService,
    private readonly router: Router,
    private readonly confirmation: ConfirmationService
  ) {
    this.form = this.fb.group({
      passphrase: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  unlock() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const passphrase = this.form.value.passphrase ?? '';
    const ok = this.vault.unlock(passphrase);
    if (!ok) {
      this.error = 'Passphrase mismatch. Try again.';
      return;
    }
    this.store.setPassphrase(passphrase);
    this.store.loadFromStorage();
    this.router.navigate(['/cards']);
  }

  reset() {
    this.confirmation.confirm({
      header: 'Reset CardVault',
      message:
        'This will permanently erase your stored cards on this device.',
      icon: 'pi pi-shield',
      acceptLabel: 'Reset',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.clear();
        this.vault.resetVault();
        this.form.reset();
      }
    });
  }
}
