import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpravljanjeNalozimaPage } from './upravljanje-nalozima.page';

describe('UpravljanjeNalozimaPage', () => {
  let component: UpravljanjeNalozimaPage;
  let fixture: ComponentFixture<UpravljanjeNalozimaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpravljanjeNalozimaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
