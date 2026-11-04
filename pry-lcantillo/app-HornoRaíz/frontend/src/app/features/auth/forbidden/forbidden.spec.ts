import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Forbidden } from './forbidden';

describe('Forbidden Component', () => {
  let component: Forbidden;
  let fixture: ComponentFixture<Forbidden>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forbidden],
      providers: [provideRouter([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Forbidden);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar a /dashboard al pulsar goHome()', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.goHome();
    expect(navSpy).toHaveBeenCalledWith(['/dashboard']);
  });
});
