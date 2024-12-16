import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { CommonModule } from '@angular/common';
import { TenantService } from '../services/tenant.service';
import { ToastService } from '#services/toast.service'; 
import { CreateTenantRequest, UpdateTenantRequest } from '#types/tenant';

@Component({
  selector: 'app-create-tenant',
  imports: [
    MaterialModule, 
    ReactiveFormsModule, 
    RouterModule,
    CommonModule
  ],
  templateUrl: './create-tenant.component.html',
  styleUrl: './create-tenant.component.sass',

})
export class CreateTenantComponent implements OnInit {
  tenantForm: FormGroup;
  isEditMode = false;
  tenantId?: number

  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      domain: [''],
      description: [''],
      isActive: [true]
    });

    // Auto-generate slug from name
    this.tenantForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const slug = name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        this.tenantForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  ngOnInit(){
    this.tenantId = this.route.snapshot.params['id'];
    if (this.tenantId) {
      this.isEditMode = true;
      this.loadTenantData();
    }
  }

  private loadTenantData() {
    this.tenantService.getTenantById(this.tenantId!).subscribe({
      next: (response) => {
        const tenant = response.data;
        this.tenantForm.patchValue({
          name: tenant.name,
          slug: tenant.slug,
          domain: tenant.domain,
          description: tenant.description,
          isActive: tenant.status === 'active'
        });
      },
      error: (error) => {
        this.toastService.error('Error loading tenant data');
        console.error('Error loading tenant data: ' + error)
      }
    })
  }

  onSubmit() {
    if (this.tenantForm.valid) {
      const tenantData = {
        ...this.tenantForm.value,
        status: this.tenantForm.value.isActive ? 'active' : 'inactive'
      };
      console.table(tenantData)

      const request$ = this.isEditMode 
        ? this.tenantService.updateTenant(this.tenantId!, tenantData)
        : this.tenantService.createTenant(tenantData);

      request$.subscribe({
        next: (response) => {
          this.toastService.success(response.message)
          this.router.navigate(['/dashboard/tenants']);
        },
        error: (error) => {
          this.toastService.error(error.message)
          console.error('Error saving tenant:', error);
        }
      });
    }
  }
}

