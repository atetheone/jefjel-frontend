import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceProductCardComponent } from './marketplace-product-card.component';

describe('MarketplaceProductCardComponent', () => {
  let component: MarketplaceProductCardComponent;
  let fixture: ComponentFixture<MarketplaceProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketplaceProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
