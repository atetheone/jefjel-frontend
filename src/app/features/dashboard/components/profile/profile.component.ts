import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#services/auth.service';
import { ToastService } from '#shared/services/toast.service';
import { UserService } from '#features/users/services/user.service';
import { AddressService } from '#shared/services/address.service';
import { ZoneService } from '#shared/services/zone.service';
import { UserResponse } from '#types/user';
import { AddressResponse } from '#types/address';
import { DeliveryZoneResponse } from '#types/zone';


@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.sass'
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  user: UserResponse | null = null;
  address: AddressResponse | null = null;
  zones: DeliveryZoneResponse[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private addressService: AddressService,
    private zoneService: ZoneService,
    private toastService: ToastService
  ) {
    this.initForms();
  }

  ngOnInit() {
    // Load delivery zones
    this.zoneService.getZones()
      .pipe(takeUntil(this.destroy$))
      .subscribe(zones => this.zones = zones);

    // Load user data and default address
    forkJoin({
      user: this.authService.getUser(),
      address: this.addressService.getDefaultShippingAddress()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ user, address }) => {
        this.user = user;
        this.address = address;
        this.loadData();
      },
      error: (error) => {
        console.error('Error loading profile data:', error);
        this.toastService.error('Failed to load profile data');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForms() {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phone: [''],
      bio: ['']
    });

    // Address form
    this.addressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: [''],
      country: ['', Validators.required],
      postalCode: [''],
      zoneId: ['', Validators.required]
    });
  }

  loadData() {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email,
        phone: this.user.profile?.phone || '',
        bio: this.user.profile?.bio || ''
      });
    }

    if (this.address) {
      this.addressForm.patchValue({
        addressLine1: this.address.addressLine1,
        addressLine2: this.address.addressLine2,
        city: this.address.city,
        state: this.address.state,
        country: this.address.country,
        postalCode: this.address.postalCode,
        zoneId: this.address.zone?.id
      });
    }
  }

  loadUserData() {

    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email
      });
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const profileData = {
        firstName: this.profileForm.get('firstName')?.value,
        lastName: this.profileForm.get('lastName')?.value,
        phone: this.profileForm.get('phone')?.value,
        bio: this.profileForm.get('bio')?.value
      };
  
      this.userService.updateUserProfile(profileData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log(JSON.stringify(response.data, null, 3))
            this.toastService.success('Profile updated successfully');
            
            // Update stored user data
            if (this.user) {
              const updatedUser = {
                ...this.user,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                profile: {
                  ...this.user.profile,
                  phone: profileData.phone,
                  bio: profileData.bio
                }
              };
              
              this.authService.userSubject.next(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          },
          error: (error) => {
            console.error('Profile update error:', error);
            this.toastService.error('Failed to update profile');
          }
        });
    }
  }

  saveAddress() {
    if (this.addressForm.valid) {
      const addressData = {
        ...this.addressForm.getRawValue(),
        type: 'shipping',
        isDefault: true
      };
  
      this.addressService.updateDefaultAddress(addressData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastService.success('Address updated successfully');
            this.address = response;
          },
          error: (error) => {
            console.error('Address update error:', error);
            this.toastService.error('Failed to update address');
          }
        });
    }
  }
  

  resetProfileForm() {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        username: this.user.username,
        email: this.user.email,
        phone: this.user.profile?.phone || '',
        bio: this.user.profile?.bio || ''
      });
    }
  }
  
  resetAddressForm() {
    if (this.address) {
      this.addressForm.patchValue({
        addressLine1: this.address.addressLine1,
        addressLine2: this.address.addressLine2,
        city: this.address.city,
        state: this.address.state,
        country: this.address.country,
        postalCode: this.address.postalCode,
        zoneId: this.address.zone?.id
      });
    }
  }
}