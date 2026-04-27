import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpravljanjeRezervacijamaPage } from './upravljanje-rezervacijama.page';

describe('UpravljanjeRezervacijamaPage', () => {
  let component: UpravljanjeRezervacijamaPage;
  let fixture: ComponentFixture<UpravljanjeRezervacijamaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpravljanjeRezervacijamaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
