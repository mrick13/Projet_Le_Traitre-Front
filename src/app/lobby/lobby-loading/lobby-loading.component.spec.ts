import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyLoadingComponent } from './lobby-loading.component';

describe('LobbyLoadingComponent', () => {
  let component: LobbyLoadingComponent;
  let fixture: ComponentFixture<LobbyLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LobbyLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LobbyLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
