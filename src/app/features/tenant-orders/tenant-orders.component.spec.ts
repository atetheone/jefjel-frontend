import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantOrdersComponent } from './tenant-orders.component';

describe('TenantOrdersComponent', () => {
  let component: TenantOrdersComponent;
  let fixture: ComponentFixture<TenantOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
