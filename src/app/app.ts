import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';

import { CardStoreService } from './cards/card-store.service';
import { VaultService } from './vault/vault.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, TagModule, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    public readonly vault: VaultService,
    private readonly store: CardStoreService,
    private readonly confirmation: ConfirmationService
  ) {}

  resetVault() {
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
      }
    });
  }
}
