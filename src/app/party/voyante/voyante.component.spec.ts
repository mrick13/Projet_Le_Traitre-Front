import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyanteComponent } from './voyante.component';

describe('VoyanteComponent', () => {
  let component: VoyanteComponent;
  let fixture: ComponentFixture<VoyanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoyanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
