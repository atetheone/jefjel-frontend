import { Component, Inject } from '@angular/core';
import { MaterialModule } from '#shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MaterialModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.sass'
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}