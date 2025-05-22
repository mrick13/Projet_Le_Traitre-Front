import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoupGarouComponent } from './loup-garou.component';

describe('LoupGarouComponent', () => {
  let component: LoupGarouComponent;
  let fixture: ComponentFixture<LoupGarouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoupGarouComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoupGarouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
