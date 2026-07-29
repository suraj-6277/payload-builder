import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayloadBuilder } from './payload-builder';

describe('PayloadBuilder', () => {
  let component: PayloadBuilder;
  let fixture: ComponentFixture<PayloadBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayloadBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(PayloadBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
