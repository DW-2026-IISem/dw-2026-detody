import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { Profile } from './profile';
import { SessionStore } from '../../../core/services/session-store';

describe('Profile Component', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let sessionStore: SessionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
      ],
    }).compileComponents();

    sessionStore = TestBed.inject(SessionStore);
    sessionStore.setAccess({
      user: { id: 1, username: 'admin_test', email: 'test@hornoraiz.com', status: 'active' },
      permissions: [
        {
          resource_id: 1,
          method: 'GET',
          path: '/api/clientes',
          description: 'Listar clientes',
          role_id: 1,
          role_name: 'ADMIN',
        },
      ],
    });

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente y mostrar los datos del usuario', () => {
    expect(component).toBeTruthy();
    expect(component.session.user()?.username).toBe('admin_test');
    expect(component.session.permissionCount()).toBe(1);
  });
});
