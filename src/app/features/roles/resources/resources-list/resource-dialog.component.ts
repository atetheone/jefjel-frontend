import { ResourceService } from "#app/core/services/resource.service";
import { CreateResourceDto, ResourceResponse } from "#app/core/types/resource";
import { MaterialModule } from "#app/shared/material/material.module";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

interface ResourceDialogData {
  resource?: ResourceResponse;  // If provided, we're in edit mode
  title: string;
}

@Component({
  selector: 'app-resource-dialog',
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Create New Resource</h2>
    
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="space-y-4">
          <mat-form-field class="w-full">
            <mat-label>Resource Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g., products">
            <mat-hint>Unique identifier for the resource (lowercase, no spaces)</mat-hint>
            @if (form.get('name')?.hasError('required')) {
              <mat-error>Name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="3"
                      placeholder="Describe what this resource represents"></textarea>
          </mat-form-field>

          <div class="space-y-2">
            <label class="text-sm font-medium">Available Actions</label>
            <mat-chip-grid #chipList>
              @for (action of actions; track action) {
                <mat-chip
                  mat-chip-selectable
                  mat-chip-removable
                  (removed)="removeAction(action)">
                  {{action}}
                  <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip>
              }
            </mat-chip-grid>
            
            <mat-form-field class="w-full">
              <mat-label>Add Action</mat-label>
              <input matInput
                     [matChipInputFor]="chipList"
                     [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                     (matChipInputTokenEnd)="addAction($event)">
            </mat-form-field>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit"
                [disabled]="form.invalid || !actions.length">
          Create Resource
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class ResourceDialogComponent implements OnInit {
  form: FormGroup;
  actions: string[] = [];
  defaultActions = ['create', 'read', 'update', 'delete'];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData,
    private dialogRef: MatDialogRef<ResourceDialogComponent>,
    private resourceService: ResourceService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]+$/)]],
      description: ['', Validators.required]
    });

    this.isEditMode = !!data.resource;
    this.initForm();
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.populateForm();
    }
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.pattern(/^[a-z0-9_-]+$/)
      ]],
      description: ['', Validators.required],
      isActive: [true]
    });

    // Disable name field in edit mode
    if (this.isEditMode) {
      this.form.get('name')?.disable();
    }
  }

  populateForm() {
    const resource = this.data.resource!;
    this.form.patchValue({
      name: resource.name,
      description: resource.description,
      isActive: resource.isActive
    });
    this.actions = [...resource.availableActions];
    
    // Remove existing actions from defaultActions
    this.defaultActions = this.defaultActions.filter(
      action => !this.actions.includes(action)
    );
  }

  addAction(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();
    if (value && !this.actions.includes(value)) {
      this.actions.push(value);
    }
    event.chipInput!.clear();
  }

  removeAction(action: string): void {
    const index = this.actions.indexOf(action);
    if (index >= 0) {
      this.actions.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.form.valid && this.actions.length) {
      const data: CreateResourceDto = {
        ...this.form.value,
        availableActions: this.actions
      };

      this.resourceService.createResource(data).subscribe({
        next: (response: ResourceResponse) => {
          this.dialogRef.close(response);
        },
        error: (error) => {
          if (error.status === 409) {
            this.form.get('name')?.setErrors({ duplicate: true });
          }
        }
      });
    }
  }
}