import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

interface ToastOptions {
  duration?: number;
  verticalPosition?: 'top' | 'bottom';
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'center'
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string, title?: string, options?: ToastOptions) {
    const config = this.getConfig('success-toast', options);
    const displayMessage = this.formatMessage(message, title);
    this.snackBar.open(displayMessage, 'Close', config);
  }

  error(message: string, title?: string, options?: ToastOptions) {
    const config = this.getConfig('error-toast', options);
    const displayMessage = this.formatMessage(message, title);
    this.snackBar.open(displayMessage, 'Close', config);
  }

  info(message: string, title?: string, options?: ToastOptions) {
    const config = this.getConfig('info-toast', options);
    const displayMessage = this.formatMessage(message, title);
    this.snackBar.open(displayMessage, 'Close', config);
  }

  warning(message: string, title?: string, options?: ToastOptions) {
    const config = this.getConfig('warning-toast', options);
    const displayMessage = this.formatMessage(message, title);
    this.snackBar.open(displayMessage, 'Close', config);
  }

  private getConfig(panelClass: string, options?: ToastOptions): MatSnackBarConfig {
    return {
      ...this.defaultConfig,
      panelClass: [panelClass],
      duration: options?.duration ?? this.defaultConfig.duration,
      verticalPosition: options?.verticalPosition ?? this.defaultConfig.verticalPosition,
      horizontalPosition: options?.horizontalPosition ?? this.defaultConfig.horizontalPosition,
    };
  }

  private formatMessage(message: string, title?: string): string {
    return title ? `${title}: ${message}` : message;
  }
}