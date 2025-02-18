import { Component, Inject } from "@angular/core";
import { MaterialModule } from "#shared/material/material.module";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-delivery-notes-dialog',
  imports: [MaterialModule, FormsModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Update Delivery Status</h2>
    <mat-dialog-content>
      <p>Update status to: <strong>{{ data.status | titlecase }}</strong></p>
      <mat-form-field class="w-full">
        <mat-label>Notes</mat-label>
        <textarea 
          matInput 
          [(ngModel)]="notes" 
          placeholder="Add any relevant notes..."
          rows="4"
        ></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]>Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        [mat-dialog-close]="{ notes: notes }"
      >
        Update
      </button>
    </mat-dialog-actions>
  `
})
export class DeliveryNotesDialog {
  notes: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { status: string }
  ) {}
}