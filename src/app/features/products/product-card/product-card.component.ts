import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { ProductResponse } from '#types/product';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductResponse;
  @Output() onDelete = new EventEmitter<number>();
}