import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CartService } from '#shared/services/cart.service';
import { OrderService } from '#shared/services/order.service';
import { AddressService } from '#shared/services/address.service';
import { ZoneService } from '#shared/services/zone.service';
import { ToastService } from '#shared/services/toast.service';
import { CartResponse, CartItem } from '#types/cart';
import { AddressResponse, AddressRequest } from '#types/address';
import { DeliveryZoneResponse } from '#types/zone';
import { OrderResponse, CreateOrderRequest } from '#types/order';
import { Observable } from 'rxjs';



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
  zones: DeliveryZoneResponse[] = [];
  filteredZones: DeliveryZoneResponse[] = [];
  selectedZone?: DeliveryZoneResponse;
  zoneSearchCtrl = new FormControl('');
  addresses: AddressResponse[] = []

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private zoneService: ZoneService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
    this.initForm();

    this.zoneSearchCtrl.valueChanges.subscribe(value => {
      this.filterZones(value || '');
    });
  }

  ngOnInit() {
    this.cartService.refreshCart();
    this.loadZones();
    this.loadDefaultAddress();
  }

  private initForm() {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        state: [''],
        country: ['', Validators.required],
        postalCode: [''],
        phone: [''],
        isDefault: [false],
        type: ['shipping'],
        zone: ['', Validators.required]
      }),
      paymentMethod: ['cash', Validators.required]
    });
  }

  placeOrder() {
    this.isProcessing = true;

    let cartId: number;
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        if (!cart) {
          this.toastService.error('No active cart');
          this.isProcessing = false;
          return;
        }
        const orderData: CreateOrderRequest = {
          cartId: cart.id,
          shippingAddress: {
            ...this.checkoutForm.get('shippingAddress')?.value,
            zoneId: this.checkoutForm.get('shippingAddress')?.value.zone.id,
            type: 'shipping' as const
          },
          paymentMethod: this.checkoutForm.get('paymentMethod')?.value
        }
    
        this.orderService.createOrder(orderData).subscribe({
          next: (response: OrderResponse) => {
            this.toastService.success('Order placed successfully');
            this.router.navigate(['/dashboard/orders', response.id]);
          },
          error: (error) => {
            console.error('Order creation failed:', error);
            this.toastService.error('Failed to place order. Please try again.');
            this.isProcessing = false;
          }
        })
      }
    })
  }

  getSubtotal(cart: CartResponse): number {
    const total = cart.items.reduce((total: number, item: CartItem) => {
      const price = Number(item.product.price);
      const quantity = Number(item.quantity);
      return total + (price * quantity);
    }, 0);

    return Number(total.toFixed(2));
  }

  getTotal(cart: CartResponse): number {
    const subtotal = this.getSubtotal(cart);
    const delivery = Number(this.getDeliveryFee());
    const total = subtotal + delivery;
    return Number(total.toFixed(2));
  }

  onSubmit() {

  }

  private loadZones() {
    this.zoneService.getZones().subscribe({
      next: (zones) => {
        this.zones = zones;
      },
      error: (error) => {
        this.toastService.error('Failed to load delivery zones');
      }
    });
  }

  getDeliveryFee(): number {
    const zone = this.checkoutForm.get('shippingAddress.zone')?.value;
    const selectedZone = this.zones.find(zone_ => zone_.id === zone.id);
    return selectedZone?.fee || 0;
  }

  onZoneSelected(event: MatAutocompleteSelectedEvent) {
    const zone = event.option.value as DeliveryZoneResponse;
    this.selectedZone = zone;
    this.checkoutForm.patchValue({
      shippingAddress: {
        zone: zone
      }
    });
  }

  private filterZones(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredZones = this.zones.filter(zone => 
      zone.name.toLowerCase().includes(filterValue)
    );
  }


  private loadDefaultAddress() {
    this.addressService.getDefaultShippingAddress().subscribe({
      next: (address) => {
        if (address) {
          console.log(address);
          this.checkoutForm.get('shippingAddress')?.patchValue({
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            country: address.country,
            postalCode: address.postalCode,
            phone: address.phone,
            isDefault: address.isDefault,
            zone: address.zone
          });
        }
      },
      error: (error) => {
        console.error('Error loading default address:', error);
      }
    });
  }

  private loadUserAddresses() {
    this.addressService.loadUserAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.toastService.error('Failed to load addresses');
      }
    });
  }

  displayZone = (zone: DeliveryZoneResponse): string => {
    if (!zone) return '';
    return `${zone.name} - ${zone.fee} FCFA`;
  }
}
