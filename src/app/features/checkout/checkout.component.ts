import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '#shared/services/cart.service';
import { CheckoutService } from './services/checkout.service';
import { ToastService } from '#shared/services/toast.service';
import { CartResponse } from '#types/cart';
import { Observable } from 'rxjs';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, MaterialModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.sass'
})
export class CheckoutComponent {
  cart$: Observable<CartResponse | null>;
  checkoutForm!: FormGroup;
  isProcessing = false;

  sampleAddresses: Address[] = [
    { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
    { street: '456 Oak Ave', city: 'Othertown', state: 'NY', zip: '67890' },
    { street: '789 Elm St', city: 'Sometown', state: 'TX', zip: '54321' }
  ];

  filteredAddresses: Address[] = []; 
  selectedAddress!: Address;
  
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
    this.initForm();
  }

  ngOnInit() {
    this.cartService.refreshCart();
  }

  private initForm() {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      paymentMethod: ['', Validators.required]
    });
  }

  placeOrder() {

  }

  getTotal(cart: any) {

  }

  onSubmit() {

  }

  filterAddresses(value: string): void {
    this.filteredAddresses = this.sampleAddresses.filter(address => 
      address.street.toLowerCase().includes(value.toLowerCase()) || 
      address.city.toLowerCase().includes(value.toLowerCase())
    );
  }

  // Handle address selection from autocomplete
  addressSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedAddress = event.option.value;
    this.checkoutForm.get('shippingAddress')?.setValue(this.selectedAddress.street);
  }
}
