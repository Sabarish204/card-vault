import { inject } from '@angular/core';
import { CanActivateFn, Routes, Router } from '@angular/router';

import { CardAddComponent } from './cards/card-add.component';
import { CardEditComponent } from './cards/card-edit.component';
import { CardsListComponent } from './cards/cards-list.component';
import { VaultUnlockComponent } from './vault/vault-unlock.component';
import { VaultService } from './vault/vault.service';

const vaultGuard: CanActivateFn = () => {
  const vault = inject(VaultService);
  const router = inject(Router);
  return vault.unlocked() ? true : router.parseUrl('/unlock');
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'unlock' },
  { path: 'unlock', component: VaultUnlockComponent },
  { path: 'cards', component: CardsListComponent, canActivate: [vaultGuard] },
  { path: 'cards/add', component: CardAddComponent, canActivate: [vaultGuard] },
  { path: 'cards/:id/edit', component: CardEditComponent, canActivate: [vaultGuard] },
  { path: '**', redirectTo: 'cards' }
];
