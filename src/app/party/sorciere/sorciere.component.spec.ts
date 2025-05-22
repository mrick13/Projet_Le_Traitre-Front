import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorciereComponent } from './sorciere.component';

describe('SorciereComponent', () => {
  let component: SorciereComponent;
  let fixture: ComponentFixture<SorciereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorciereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SorciereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
