import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  FormControl,
  Validators 
} from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { ProductService } from '#shared/services/product.service';
import { CategoryService } from '#shared/services/category.service';
import { ToastService } from '#shared/services/toast.service';
import { CreateProduct, UpdateProduct, ProductResponse, CategoryResponse } from '#types/product';

@Component({
  selector: 'app-create-product',
  imports: [
    CommonModule, 
    MaterialModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.sass'
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId?: number;
  selectedCategories: number[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  categories$!: Observable<CategoryResponse[]>;

  categories: CategoryResponse[] = [];
  filteredCategories: CategoryResponse[] = [];
  categorySearchCtrl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) {
    this.initForm();

    this.categorySearchCtrl.valueChanges.subscribe(value => {
      this.filterCategories(value || '');
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      sku: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      basePrice: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      categoryIds: [[]]
    });
  }

  ngOnInit() {
    this.loadCategories();

    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditMode = true;
      this.loadProductData();
    }
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.filteredCategories = this.categories;
      },
      error: (error) => {
        this.toastService.error('Failed to load categories');
        console.error('Error loading categories:', error);
      }
    });
  }

  private filterCategories(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(filterValue)
    );
  }



  // isCategorySelected(categoryId: number): boolean {
  //   return this.selectedCategories.includes(categoryId);
  // }

  private loadProductData() {
    this.productService.getProductById(this.productId!).subscribe({
      next: (response) => {
        const product = response;
        this.selectedCategories = product.categories.map(c => c.id);
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          sku: product.sku,
          price: product.price,
          basePrice: product.basePrice,
          stock: product.stock,
          isActive: product.isActive,
          categoryIds: product.categories.map(c => c.id)
        });
      },
      error: (error) => {
        this.toastService.error('Failed to load product');
        console.error('Error loading product:', error);
      }
    });
  }

  async onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;


      try {
        if (this.isEditMode) {
          const response = await this.productService.updateProduct(this.productId!, productData).toPromise();
          await this.uploadImages(this.productId!);
          this.toastService.success(response?.message || 'Product updated successfully');
        } else {
          const response = await this.productService.createProduct(productData).toPromise();
          if (response?.data) {
            await this.uploadImages(response.data.id);
          }
          this.toastService.success(response?.message || 'Product created successfully');
        }
        this.router.navigate(['/dashboard/products']);
      } catch (error) {
        this.toastService.error('Failed to save product');
        console.error('Error saving product:', error);
      }
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.previewUrls = [];
      
      // Generate preview URLs
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrls.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  private async uploadImages(productId: number): Promise<void> {
    if (this.selectedFiles.length === 0) return;

    try {
      const response = await this.productService
        .uploadProductImages(productId, this.selectedFiles)
        .toPromise();
        
      if (response?.data) {
        this.toastService.success('Images uploaded successfully');
      }
    } catch (error) {
      this.toastService.error('Failed to upload images');
      console.error('Image upload error:', error);
    }

  }

  goBack() {
    this.router.navigate(['/dashboard/products']);
  }
}