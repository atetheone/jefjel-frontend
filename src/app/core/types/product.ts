import { ApiResponse } from './api_response';

interface BaseProduct {
  name: string
  description: string
  price: string
  basePrice?: string
  sku: string
  stock: number
  isActive: boolean
  tenantId: number
}

export interface CreateProduct extends BaseProduct {
  categoryIds?: number[]
}

export interface UpdateProduct extends Partial<BaseProduct> {
  id: number
  categoryIds?: number[]
}

export interface CategoryResponse {
  id: number
  name: string
  description?: string
  parentId?: number
}

export interface ProductImageResponse {
  id: number
  url: string
  altText?: string
  isCover: boolean
  displayOrder: number
}

export interface ProductResponse extends BaseProduct {
  id: number
  coverImage?: ProductImageResponse
  images?: ProductImageResponse[]
  categories: CategoryResponse[]
  createdAt: string
  updatedAt: string
}

export type ProductsResponse = ApiResponse<ProductResponse[]>;
