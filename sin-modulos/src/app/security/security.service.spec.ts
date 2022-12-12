import { HttpClient, HttpContext, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { LoggerService } from '../services';
import { AuthInterceptor, AuthService, LoginService, AuthGuard, InRoleGuard, AUTH_REQUIRED } from './security.service';

describe('AuthService', () => {
  let service: AuthService;
  let log: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    });
    service = TestBed.inject(AuthService);
    log = TestBed.inject(LoggerService);
    spyOn(log, 'log');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Login', () => {
    const roles = ['rol 1', 'rol 2']
    service.login('token', 'refresh', 'usuario', roles)
    expect(service.AuthorizationHeader).toBe('token')
    expect(service.RefreshToken).toBe('refresh')
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
  const apiURL = environment.securityApiURL

  let service: LoginService;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, HttpClient],
    });
    service = TestBed.inject(LoginService);
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('login', () => {
    it('OK', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const demoUsr = { "username": "demo@example.com", "password": "P@$$w0rd" }
      const res = {
        "success": true,
        "token": "B" + "earer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJhZG1AZXhhbXBsZS5jb20iLCJuYW1lIjoiQWRtaW5pc3RyYWRvciIsInJvbGVzIjpbIlVzdWFyaW9zIiwiQWRtaW5pc3RyYWRvcmVzIl0sImlhdCI6MTY3MDU4NTE0MSwiZXhwIjoxNjcwNTg1NDQxLCJhdWQiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiTWljcm9zZXJ2aWNpb3NKV1QifQ.R4w4DH3HfVssI7TSO0u0z2uCu7BrhLXN5YdxEyx3uOIzhENycz0vL8B0_etz8kSz8KVWM0hOLqf0J7XOwNci1ksf4ZWenykapG-AuEkQkX2Y7ZTjECscor5dT3Cmj0swI12Yx-FL3r3OXDRppSnoOCvOE_w-ardwHt48QCU5u7YjvXjcP34bavFDjYpD7dvy5eoT-TDb0Un4XYkBVhR18u0ogH9TKoxF0lt8TSh5ckwjcZ4_KF3E4TGAIHId6UbuxUqMNTyJW0gkJR7iCQPn4Ez3osvZG4Rvj7VT_VbX_9EzTdXOJ9ZeuMpSuhk-AmFyXCeu8wcD-mU7JWn8RW2OCQ",
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJhZG1AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzA1ODUxNDEsIm5iZiI6MTY3MDU4NTQ0MSwiZXhwIjoxNjcwNTg2MzQxLCJhdWQiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiTWljcm9zZXJ2aWNpb3NKV1QifQ.rh8bgIhlPKkKeiCHBvkT2qZruAvdFjldfD9PCeC4ZN0",
        "name": "Administrador",
        "roles": ["Usuarios", "Administradores"],
        "expires_in": 300
      }

      service.login(demoUsr.username, demoUsr.password).subscribe(
        {
          next: data => {
            expect(data).toBeTruthy();
            expect(service.isAutenticated).toBeTruthy();
            expect(service.Name).toEqual(res.name);
            expect(service.Roles.length).toEqual(2);
          },
          error: data => { fail(); }
        }
      );
      const req = httpMock.expectOne(apiURL + 'login');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(demoUsr);
      req.flush(res);
      httpMock.verify();
    }));

    it('KO', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const demoUsr = { "username": "demo@example.com", "password": "P@$$w0rd" }
      const res = {
        "success": false,
      }

      service.login(demoUsr.username, demoUsr.password).subscribe(
        {
          next: data => {
            expect(data).withContext('service result').toBeFalsy();
            expect(service.isAutenticated).withContext('is autenticated').toBeFalsy();
          },
          error: data => { fail(); }
        }
      );
      const req = httpMock.expectOne(apiURL + 'login');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(demoUsr);
      req.flush(res);
      httpMock.verify();
    }));

    it('network failure', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      service.login('', '').subscribe({
        next: data => { fail('observable failure'); },
        error: data => {
          expect(data.status).withContext('service result').toBe(404);
        }
      });
      const req = httpMock.expectOne(apiURL + 'login');
      expect(req.request.method).toEqual('POST');
      req.flush('error', { status: 404, statusText: 'Not Found' });
      httpMock.verify();
    }));
  })

  it('logout', () => {
    auth.login('token', 'refresh', 'usuario', [])
    expect(service.isAutenticated).toBeTruthy();
    service.logout()
    expect(service.isAutenticated).toBeFalsy();
  });
  describe('refresh', () => {
    it('OK', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      const res = {
        "success": true,
        "token": "B" + "earer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJhZG1AZXhhbXBsZS5jb20iLCJuYW1lIjoiQWRtaW5pc3RyYWRvciIsInJvbGVzIjpbIlVzdWFyaW9zIiwiQWRtaW5pc3RyYWRvcmVzIl0sImlhdCI6MTY3MDU4NTE0MSwiZXhwIjoxNjcwNTg1NDQxLCJhdWQiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiTWljcm9zZXJ2aWNpb3NKV1QifQ.R4w4DH3HfVssI7TSO0u0z2uCu7BrhLXN5YdxEyx3uOIzhENycz0vL8B0_etz8kSz8KVWM0hOLqf0J7XOwNci1ksf4ZWenykapG-AuEkQkX2Y7ZTjECscor5dT3Cmj0swI12Yx-FL3r3OXDRppSnoOCvOE_w-ardwHt48QCU5u7YjvXjcP34bavFDjYpD7dvy5eoT-TDb0Un4XYkBVhR18u0ogH9TKoxF0lt8TSh5ckwjcZ4_KF3E4TGAIHId6UbuxUqMNTyJW0gkJR7iCQPn4Ez3osvZG4Rvj7VT_VbX_9EzTdXOJ9ZeuMpSuhk-AmFyXCeu8wcD-mU7JWn8RW2OCQ",
        "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJhZG1AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzA1ODUxNDEsIm5iZiI6MTY3MDU4NTQ0MSwiZXhwIjoxNjcwNTg2MzQxLCJhdWQiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiTWljcm9zZXJ2aWNpb3NKV1QifQ.rh8bgIhlPKkKeiCHBvkT2qZruAvdFjldfD9PCeC4ZN0",
        "name": "Administrador",
        "roles": ["Usuarios", "Administradores"],
        "expires_in": 300
      }
      const token = "1234567890"
      auth.login('token', token, 'usuario', [])
      service.refresh().subscribe(
        {
          next: data => {
            expect(data).toBeTruthy();
            expect(service.isAutenticated).toBeTruthy();
            expect(service.Name).toEqual(res.name);
            expect(service.Roles.length).toEqual(2);
          },
          error: data => { fail(); }
        }
      );
      const req = httpMock.expectOne(apiURL + 'login/refresh');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual({ token });
      req.flush(res);
      httpMock.verify();
    }));
    describe('KO', () => {
      it('invalid user', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        const res = {
          "success": false,
        }
        const token = "1234567890"
        auth.login('token', token, 'usuario', [])

        service.refresh().subscribe(
          {
            next: data => {
              expect(data).withContext('service result').toEqual([false]);
              expect(service.isAutenticated).withContext('is autenticated').toBeFalsy();
            },
            error: data => { fail(); }
          }
        );
        const req = httpMock.expectOne(apiURL + 'login/refresh');
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({ token });
        req.flush(res);
        httpMock.verify();
      }));

      it('not is Autenticated', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        auth.logout()
        service.refresh().subscribe({
          next: data => {
            expect(data).withContext('service result').toEqual([false]);
          },
          error: data => {
            fail('observable failure');
          }
        });
      }));

      it('network failure', inject([HttpTestingController], (httpMock: HttpTestingController) => {
        auth.login('token', '', 'usuario', [])
        service.refresh().subscribe({
          next: data => {
            fail('observable failure');
          },
          error: data => {
            expect(data.status).withContext('service result').toBe(404);
          }
        });
        const req = httpMock.expectOne(apiURL + 'login/refresh');
        expect(req.request.method).toEqual('POST');
        req.flush('error', { status: 404, statusText: 'Not Found' });
        httpMock.verify();
      }));
    })
  });
});

describe('AuthInterceptor', () => {
  const fakeURL = 'https://localhost:80/test'
  const callback = {
    next: (data: { result: string }) => {
      expect(data.result).withContext('service result').toBe('OK');
    },
    error: () => { fail('observable error') }
  }
  let service: AuthInterceptor;
  let auth: AuthService
  let http: HttpClient


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor, AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, }
      ],
      imports: [HttpClientTestingModule,],
    });
    service = TestBed.inject(AuthInterceptor);
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('OK', () => {
    it('not required', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL).subscribe(callback);
      const req = httpMock.expectOne(fakeURL);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.has('Authorization')).toBeFalsy();
      req.flush({ result: 'OK' });
      httpMock.verify();
    }));

    it('withCredentials', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL, { withCredentials: true }).subscribe(callback);
      const req = httpMock.expectOne(fakeURL);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush({ result: 'OK' });
      httpMock.verify();
    }));

    it('AUTH_REQUIRED', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL, { context: new HttpContext().set(AUTH_REQUIRED, true) }).subscribe(callback);
      const req = httpMock.expectOne(fakeURL);
      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush({ result: 'OK' });
      httpMock.verify();
    }));
  });
  describe('KO', () => {
    const apiURL = environment.securityApiURL + 'login/refresh'
    const errorBody = {
      "type": "ApplicationError",
      "status": 401,
      "title": "Invalid token",
      "detail": "Token expired",
      "source": "expiredAt: Fri Dec 09 2022 11:30:41 GMT+0000 (Coordinated Universal Time)"
    }
    const refreshOK = {
      "success": true,
      "token": "B" + "earer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJhZG1AZXhhbXBsZS5jb20iLCJuYW1lIjoiQWRtaW5pc3RyYWRvciIsInJvbGVzIjpbIlVzdWFyaW9zIiwiQWRtaW5pc3RyYWRvcmVzIl0sImlhdCI6MTY3MDU4NTE0MSwiZXhwIjoxNjcwNTg1NDQxLCJhdWQiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiTWljcm9zZXJ2aWNpb3NKV1QifQ.R4w4DH3HfVssI7TSO0u0z2uCu7BrhLXN5YdxEyx3uOIzhENycz0vL8B0_etz8kSz8KVWM0hOLqf0J7XOwNci1ksf4ZWenykapG-AuEkQkX2Y7ZTjECscor5dT3Cmj0swI12Yx-FL3r3OXDRppSnoOCvOE_w-ardwHt48QCU5u7YjvXjcP34bavFDjYpD7dvy5eoT-TDb0Un4XYkBVhR18u0ogH9TKoxF0lt8TSh5ckwjcZ4_KF3E4TGAIHId6UbuxUqMNTyJW0gkJR7iCQPn4Ez3osvZG4Rvj7VT_VbX_9EzTdXOJ9ZeuMpSuhk-AmFyXCeu8wcD-mU7JWn8RW2OCQ",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3IiOiJhZG1AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzA1ODUxNDEsIm5iZiI6MTY3MDU4NTQ0MSwiZXhwIjoxNjcwNTg2MzQxLCJhdWQiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiTWljcm9zZXJ2aWNpb3NKV1QifQ.rh8bgIhlPKkKeiCHBvkT2qZruAvdFjldfD9PCeC4ZN0",
      "name": "Administrador",
      "roles": ["Usuarios", "Administradores"],
      "expires_in": 300
    }
    const refreshKO = {
      "success": false,
    }
    it('refresh success', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL, { withCredentials: true }).subscribe(callback);
      const reqIni = httpMock.expectOne(fakeURL);
      reqIni.flush(errorBody, { status: 401, statusText: 'Unauthorized' });
      expect(reqIni.request.headers.has('Authorization')).toBeTruthy();
      const reqRefr = httpMock.expectOne(apiURL);
      reqRefr.flush(refreshOK);
      const reReq = httpMock.expectOne(fakeURL);
      reReq.flush({ result: 'OK' });
      httpMock.verify();
    }));

    it('refresh no success', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL, { withCredentials: true }).subscribe({
        next: (data: { result: string }) => {
          fail('observable error')
        },
        error: data => {
          expect(auth.isAutenticated).withContext('is autenticated').toBeFalsy();
          expect(data.status).withContext('service result').toBe(401);
        }
      });
      const reqIni = httpMock.expectOne(fakeURL);
      reqIni.flush(errorBody, { status: 401, statusText: 'Unauthorized' });
      expect(reqIni.request.headers.has('Authorization')).toBeTruthy();
      const refresh = httpMock.expectOne(apiURL);
      refresh.flush(refreshKO);
      const reReq = httpMock.expectOne(fakeURL);
      // expect(reReq.request.headers.has('Authorization')).withContext('2 no Authorization').toBeFalsy();
      reReq.flush({ result: 'OK' }, { status: 401, statusText: 'Unauthorized' });
      httpMock.verify();
    }));

    it('refresh error', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL, { withCredentials: true }).subscribe({
        next: (data: { result: string }) => {
          fail('observable error')
        },
        error: data => {
          expect(auth.isAutenticated).withContext('is autenticated').toBeFalsy();
          expect(data.status).withContext('service result').toBe(401);
        }
      });
      const reqIni = httpMock.expectOne(fakeURL);
      reqIni.flush(errorBody, { status: 401, statusText: 'Unauthorized' });
      expect(reqIni.request.headers.has('Authorization')).toBeTruthy();
      const refresh = httpMock.expectOne(apiURL);
      refresh.flush({ result: 'OK' }, { status: 401, statusText: 'Unauthorized' });
      httpMock.verify();
    }));

    it('no refresh', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      auth.login('B' + 'earer 12345', '12345', 'usuario', [])
      http.get<{ result: string }>(fakeURL, { withCredentials: true }).subscribe({
        next: (data: { result: string }) => {
          fail('observable error')
        },
        error: data => {
          expect(auth.isAutenticated).withContext('is autenticated').toBeTruthy();
          expect(data.status).withContext('service result').toBe(404);
        }
      });
      const req = httpMock.expectOne(fakeURL);
      req.flush('', { status: 404, statusText: 'not found' });
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      httpMock.verify();
    }));

  });
});

describe('AuthGuard', () => {
  let service: AuthGuard;
  let auth: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
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
      providers: [AuthService],
    });
    service = TestBed.inject(InRoleGuard);
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
