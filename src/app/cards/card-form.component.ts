import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputMask, InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { CardFormValue, CardIssuer, CardType } from './card.model';
import { INDIA_BANKS } from './india-banks';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputMaskModule,
    InputTextModule,
    SelectModule,
    TagModule
  ],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent implements OnChanges {
  @Input({ required: true }) title = '';
  @Input({ required: true }) submitLabel = '';
  @Input() initial?: Partial<CardFormValue>;
  @Output() save = new EventEmitter<CardFormValue>();

  readonly typeOptions: CardType[] = ['Credit', 'Debit'];
  readonly issuerOptions: CardIssuer[] = ['Visa', 'Mastercard', 'Amex', 'Rupay'];
  readonly bankOptions = INDIA_BANKS;

  readonly form: FormGroup;
  cvvMaskValue = '999';

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      type: ['Credit' as CardType, Validators.required],
      issuer: ['Visa' as CardIssuer, Validators.required],
      bankName: ['', [Validators.required, Validators.maxLength(40)]],
      holderName: ['', [Validators.required, Validators.maxLength(60)]],
      cardNumber: ['', [Validators.required, Validators.minLength(19)]],
      expiry: ['', [Validators.required, Validators.minLength(5), expiryNotPast]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });

    this.form.get('issuer')?.valueChanges.subscribe((issuer) => {
      const isAmex = issuer === 'Amex';
      this.cvvMaskValue = isAmex ? '9999' : '999';
      const cvvControl = this.form.get('cvv');
      if (!cvvControl) return;
      const len = isAmex ? 4 : 3;
      cvvControl.setValidators([Validators.required, Validators.minLength(len), Validators.maxLength(len)]);
      cvvControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnChanges() {
    if (this.initial) {
      this.form.patchValue({
        type: this.initial.type ?? 'Credit',
        issuer: this.initial.issuer ?? 'Visa',
        bankName: this.initial.bankName ?? '',
        holderName: this.initial.holderName ?? '',
        cardNumber: this.initial.cardNumber ?? '',
        expiry: this.initial.expiry ?? '',
        cvv: this.initial.cvv ?? ''
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue() as CardFormValue);
  }

  onEnter(event: Event, next?: HTMLElement | InputMask | Select) {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }
    this.focusNext(next);
  }

  focusNext(next?: HTMLElement | InputMask | Select) {
    if (!next) return;
    if (typeof (next as InputMask).focus === 'function') {
      (next as InputMask).focus();
      return;
    }
    if (typeof (next as Select).focus === 'function') {
      (next as Select).focus();
      return;
    }
    (next as HTMLElement).focus?.();
  }

  focusMask(mask?: InputMask) {
    mask?.focus();
  }
}

function expiryNotPast(control: AbstractControl) {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  if (!/^\d{2}\/\d{2}$/.test(value)) return { expiryInvalid: true };
  const [mmRaw, yyRaw] = value.split('/');
  const mm = Number(mmRaw);
  const yy = Number(yyRaw);
  if (!Number.isFinite(mm) || !Number.isFinite(yy) || mm < 1 || mm > 12) {
    return { expiryInvalid: true };
  }
  const fullYear = 2000 + yy;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (fullYear < currentYear || (fullYear === currentYear && mm < currentMonth)) {
    return { expiryPast: true };
  }
  return null;
}
