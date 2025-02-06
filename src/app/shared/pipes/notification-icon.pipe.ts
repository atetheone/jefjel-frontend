import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notificationIcon',
  standalone: true
})
export class NotificationIconPipe implements PipeTransform {
  transform(type: string): string {
    switch (type) {
      case 'order:status_updated':
      case 'order:created':
        return 'local_shipping';
      case 'order:cancelled':
        return 'cancel';
      case 'inventory:low':
        return 'inventory_2';
      case 'inventory:reorder':
        return 'shopping_cart';
      case 'user:registered':
        return 'person_add';
      case 'payment:received':
        return 'payments';
      case 'payment:failed':
        return 'error_outline';
      default:
        return 'notifications';
    }
  }
}