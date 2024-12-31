export interface Market {
  id: number;
  slug: string;
  name: string;
  domain: string;
  description: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
  rating: string;
  logo: string;
  coverImage: string;
  productCount: number;
  isFeatured: boolean;
}

export interface MarketResponse {
  success: boolean;
  data: Market[];
  message: string;
}