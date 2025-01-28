import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MarketService } from '../services/market.service';
import { Market } from '#types/marketplace';
import { BehaviorSubject } from 'rxjs';
import { DataState } from '#types/data_state';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-markets',
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './markets.component.html',
  styleUrl: './markets.component.sass'
})
export class MarketsComponent implements OnInit {
  private marketsSubject = new BehaviorSubject<DataState<Market[]>>({
    status: 'loading',
    data: [],
    error: null
  });
  markets$ = this.marketsSubject.asObservable();
  
  searchControl = new FormControl('');
  statusFilter = 'all';
  sortBy = 'rating';

  constructor(private marketService: MarketService) {
    // Set up search debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadMarkets();
      });
  }

  ngOnInit() {
    this.loadMarkets();
  }

  loadMarkets() {
    this.marketsSubject.next({ status: 'loading', data: [], error: null });
    this.marketService.getAllMarkets().subscribe({
      next: (markets) => {
        this.marketsSubject.next({
          status: 'success',
          data: markets,
          error: null
        });
      },
      error: (error) => {
        this.marketsSubject.next({
          status: 'error',
          data: [],
          error: 'Failed to load markets'
        });
      }
    });
  }
}
