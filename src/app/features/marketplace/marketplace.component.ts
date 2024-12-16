import { MaterialModule } from '#shared/material/material.module';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';


interface Marketplace {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  productCount: number;
  rating: number;
}


@Component({
  selector: 'app-marketplace',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.sass'
})
export class MarketplaceComponent implements OnInit {
  marketplaces: Marketplace[] = [
    {
      id: '1',
      name: 'Organic Farmers Market',
      description: 'Fresh, locally sourced organic produce and artisan products',
      logo: '/assets/market1-logo.jpg',
      coverImage: '/assets/market1-cover.jpg',
      category: 'Food & Groceries',
      productCount: 128,
      rating: 4.7
    },
    {
      id: '2', 
      name: 'Tech Gadgets Hub',
      description: 'Latest electronics, gadgets, and innovative tech products',
      logo: '/assets/market2-logo.jpg',
      coverImage: '/assets/market2-cover.jpg',
      category: 'Electronics',
      productCount: 245,
      rating: 4.5
    },
    // Add more marketplaces
  ];

  filteredMarketplaces: Marketplace[] = [];
  searchTerm: string = '';
  categories: string[] = ['Food & Groceries', 'Electronics', 'Fashion', 'Home & Garden'];
  selectedCategories: { [key: string]: boolean } = {};

  ngOnInit() {
    this.filteredMarketplaces = this.marketplaces;
    this.categories.forEach(category => {
      this.selectedCategories[category] = false;
    });
  }

  filterMarketplaces() {
    this.filteredMarketplaces = this.marketplaces.filter(marketplace => {
      const matchesSearch = !this.searchTerm || 
        marketplace.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        marketplace.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        marketplace.category.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategories = Object.keys(this.selectedCategories)
        .filter(category => this.selectedCategories[category])
        .length === 0 || 
        this.selectedCategories[marketplace.category];

      return matchesSearch && matchesCategories;
    });
  }

  applyFilters() {
    this.filterMarketplaces();
  }

  openMarketplace(marketplace: Marketplace) {
    // TODO: Implement tenant-specific routing
    // This could be a subdomain or a specific route
    // Example: window.location.href = `https://${marketplace.id}.app.com`
    console.log(`Opening marketplace: ${marketplace.name}`);
  }

  onCategoryChange(event: MatChipSelectionChange, category: string) {
    this.selectedCategories[category] = event.selected;
    this.filterMarketplaces();
  }
}