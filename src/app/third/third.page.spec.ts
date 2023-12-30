import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThirdPage } from './third.page';

describe('ThirdPage', () => {
  let component: ThirdPage;
  let fixture: ComponentFixture<ThirdPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThirdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
