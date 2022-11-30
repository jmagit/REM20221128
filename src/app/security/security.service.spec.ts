import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoggerService } from 'src/lib/my-core';
import { AuthInterceptor, AuthService, LoginService, AuthGuard, InRoleGuard } from './security.service';

describe('AuthService', () => {
  let service: AuthService;
  let log: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ LoggerService ],
    });
    service = TestBed.inject(AuthService);
    log = TestBed.inject(LoggerService);
    spyOn(log, 'log');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Login', () => {
    let roles = ['rol 1', 'rol 2']
    service.login('token', 'usuario', roles)
    expect(service.AuthorizationHeader).toBe('token')
    expect(service.Name).toBe('usuario')
    expect(service.Roles.length).toEqual(2)
    expect(service.isAutenticated).toBeTruthy();
    expect(service.isInRoles('rol 1')).toBeTruthy();
  });

  it('Logout', () => {
    service.logout()
    expect(service.isAutenticated).toBeFalsy();
  });

});

describe('LoginService ', () => {
  let service: LoginService;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthService, HttpClient ],
    });
    service = TestBed.inject(LoginService );
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('AuthInterceptor', () => {
  let service: AuthInterceptor;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthInterceptor, AuthService ],
    });
    service = TestBed.inject(AuthInterceptor);
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('AuthGuard', () => {
  let service: AuthGuard;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthService ],
    });
    service = TestBed.inject(AuthGuard);
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('InRoleGuard', () => {
  let service: InRoleGuard;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AuthService ],
    });
    service = TestBed.inject(InRoleGuard);
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
