import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpravljanjeVozilimaPage } from './upravljanje-vozilima.page';

describe('UpravljanjeVozilimaPage', () => {
  let component: UpravljanjeVozilimaPage;
  let fixture: ComponentFixture<UpravljanjeVozilimaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpravljanjeVozilimaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
