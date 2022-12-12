/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { LoggerService } from '@my/core';
import { DAOServiceMock } from '../base-code/RESTDAOService';
import { NavigationService, NotificationService } from '../common-services';

import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogDAOService, BlogViewModelService } from './servicios.service';
import { BLOG_COMPONENTES } from './componente.component';

describe('Modulo Blog', () => {
  const apiURL = environment.apiURL + 'blog'
  const dataMock = [
    {  "id": 1,  "titulo": "Saludo",  "texto": "Lorem ipsum dolor sit amet consectetur adipisicing elit.",  "autor": "Javier",  "fecha": "2016-02-29",  "megusta": 7,  "fotourl": "https://cdn-images-1.medium.com/max/800/1*V3Kfghg_jIV0ubxmAnCXBA.jpeg"},
    {  "id": 2,  "titulo": "Uno",  "texto": "Dolores eveniet eum nisi expedita ab dolorum labore",  "autor": "Pepito",  "fecha": "2020-01-01",  "megusta": 5,  "fotourl": "https://cdn-images-1.medium.com/max/800/1*nbJ41jD1-r2Oe6FsLjKaOg.png"},
    {  "id": 3,  "titulo": "Otro",  "texto": "similique provident officia ipsa, aliquam recusandae dicta id",  "autor": "Javier",  "fecha": "2021-03-15",  "megusta": 10,  "fotourl": "https://cdn-images-1.medium.com/max/800/1*V3Kfghg_jIV0ubxmAnCXBA.jpeg"},
    {  "id": 4,  "titulo": "El ultimo",  "texto": "praesentium quasi consequatur minus laborum perferendis?",  "autor": "Otro",  "fecha": "2021-12-3",  "megusta": 1,  "fotourl": "https://cdn-images-1.medium.com/max/800/1*CQKUmJrBs-523I4GOiEUaA.gif"}
      ];
  const dataAddMock: { [index: string]: any } = { id: 0, titulo: "Nuevo titulo", texto: "Algo de texto", autor: "Anonimo" }
  const dataEditMock: { [index: string]: any } = { id: 1, titulo: "Titulo nuevo", texto: "Algo de texto", autor: "Anonimo" }
  const dataBadMock: { [index: string]: any } = { id: -1 }

  describe('DAOService', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [BlogDAOService, HttpClient],
      });
    });

    it('query', inject([BlogDAOService, HttpTestingController], (dao: BlogDAOService, httpMock: HttpTestingController) => {
      dao.query().subscribe({
          next: data => {
            expect(data.length).toEqual(dataMock.length);
          },
          error: () => { fail('has executed "error" callback'); }
        });
      const req = httpMock.expectOne(apiURL);
      expect(req.request.method).toEqual('GET');
      req.flush([...dataMock]);
      httpMock.verify();
    }));

    it('get', inject([BlogDAOService, HttpTestingController], (dao: BlogDAOService, httpMock: HttpTestingController) => {
      dao.get(1).subscribe({
          next: data => {
            expect(data).toEqual(dataMock[0]);
          },
          error: () => { fail('has executed "error" callback'); }
        });
      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toEqual('GET');
      req.flush({ ...dataMock[0] });
      httpMock.verify();
    }));

    it('add', inject([BlogDAOService, HttpTestingController], (dao: BlogDAOService, httpMock: HttpTestingController) => {
      const item = { ...dataAddMock };
      dao.add(item).subscribe();
      const req = httpMock.expectOne(`${apiURL}`);
      expect(req.request.method).toEqual('POST');
      for (const key in dataEditMock) {
        if (Object.prototype.hasOwnProperty.call(dataAddMock, key)) {
          expect(req.request.body[key]).toEqual(dataAddMock[key]);
        }
      }
      httpMock.verify();
    }));

    it('change', inject([BlogDAOService, HttpTestingController], (dao: BlogDAOService, httpMock: HttpTestingController) => {
      const item = { ...dataEditMock };
      dao.change(1, item).subscribe();
      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toEqual('PUT');
      for (const key in dataEditMock) {
        if (Object.prototype.hasOwnProperty.call(dataEditMock, key)) {
          expect(req.request.body[key]).toEqual(dataEditMock[key]);
        }
      }
      httpMock.verify();
    }));

    it('delete', inject([BlogDAOService, HttpTestingController], (dao: BlogDAOService, httpMock: HttpTestingController) => {
      dao.remove(1).subscribe();
      const req = httpMock.expectOne(`${apiURL}/1`);
      expect(req.request.method).toEqual('DELETE');
      httpMock.verify();
    }));

  });
  describe('ViewModelService', () => {
    let service: BlogViewModelService;
    let dao: BlogDAOService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [NotificationService, LoggerService,
          {
            provide: BlogDAOService, useFactory: () => new DAOServiceMock<any, number>([...dataMock])
          }
        ],
      });
      service = TestBed.inject(BlogViewModelService);
      dao = TestBed.inject(BlogDAOService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });
    describe('mode', () => {
      it('list', fakeAsync(() => {
        service.list()
        tick()
        expect(service.Listado.length).withContext('Verify Listado length').toBe(dataMock.length)
        expect(service.Modo).withContext('Verify Modo is ').toBe('list')
      }))

      it('add', () => {
        service.add()
        expect(service.Elemento).withContext('Verify Elemento').toEqual({})
        expect(service.Modo).withContext('Verify Modo is add').toBe('add')
      })

      describe('edit', () => {
        it(' OK', fakeAsync(() => {
          service.edit(3)
          tick()

          expect(service.Elemento).withContext('Verify Elemento').toEqual(dataMock[2])
          expect(service.Modo).withContext('Verify Modo is edit').toBe('edit')
        }))

        it('KO', fakeAsync(() => {
          const notify = TestBed.inject(NotificationService);
          spyOn(notify, 'add')

          service.edit(dataMock.length + 1)
          tick()

          expect(notify.add).withContext('notify error').toHaveBeenCalled()
        }))
      })

      describe('view', () => {
        it(' OK', fakeAsync(() => {
          service.view(1)
          tick()

          expect(service.Elemento).withContext('Verify Elemento').toEqual(dataMock[0])
          expect(service.Modo).withContext('Verify Modo is view').toBe('view')
        }))

        it('KO', fakeAsync(() => {
          const notify = TestBed.inject(NotificationService);
          spyOn(notify, 'add')

          service.view(dataMock.length + 1)
          tick()

          expect(notify.add).withContext('notify error').toHaveBeenCalled()
        }))
      })

      describe('delete', () => {
        it('OK', fakeAsync(() => {
          service.delete(3)
          tick()
          expect(service.Listado.length).withContext('Verify Listado length').toBe(dataMock.length - 1)
          expect(service.Modo).withContext('Verify Modo is list').toBe('list')
        }))

        it('KO', fakeAsync(() => {
          const notify = TestBed.inject(NotificationService);
          spyOn(notify, 'add')

          service.delete(dataMock.length + 1)
          tick()

          expect(notify.add).withContext('notify error').toHaveBeenCalled()
        }))
      })
    })

    it('cancel', fakeAsync(() => {
      const navigation = TestBed.inject(NavigationService);
      spyOn(navigation, 'back')
      service.edit(2)
      tick()
      expect(service.Elemento).withContext('Verifica fase de preparación').not.toEqual({})
      service.cancel()
      expect(service.Elemento).withContext('Verify Elemento').toEqual({})
      expect(navigation.back).toHaveBeenCalled()
    }))

    describe('send', () => {
      describe('add', () => {
        it('OK', fakeAsync(() => {
          spyOn(service, 'cancel')
          service.add()
          tick()
          for (const key in dataAddMock) {
            service.Elemento[key] = dataAddMock[key];
          }
          service.send()
          tick()
          const listado = (dao as { [i: string]: any })['listado']
          expect(listado.length).toBe(dataMock.length + 1)
          expect(listado[listado.length - 1]).toEqual(dataAddMock)
          expect(service.cancel).withContext('Verify init ViewModel').toHaveBeenCalled()
        }))
        it('KO', fakeAsync(() => {
          const notify = TestBed.inject(NotificationService);
          spyOn(notify, 'add')
          service.add()
          tick()
          for (const key in dataBadMock) {
            service.Elemento[key] = dataBadMock[key];
          }
          service.send()
          tick()
          expect(notify.add).withContext('notify error').toHaveBeenCalled()
        }))
      })

      describe('edit', () => {
        it('OK', fakeAsync(() => {
          spyOn(service, 'cancel')
          service.edit(1)
          tick()
          for (const key in dataEditMock) {
            service.Elemento[key] = dataEditMock[key];
          }
          service.send()
          tick()
          const listado = (dao as { [i: string]: any })['listado']
          expect(listado.length).withContext('Verify Listado length').toBe(dataMock.length)
          expect(listado[0]).withContext('Verify Elemento').toEqual(service.Elemento)
          expect(service.cancel).withContext('Verify init ViewModel').toHaveBeenCalled()
        }))
        it('KO', fakeAsync(() => {
          const notify = TestBed.inject(NotificationService);
          spyOn(notify, 'add')
          service.edit(1)
          tick()
          for (const key in dataBadMock) {
            service.Elemento[key] = dataBadMock[key];
          }
          (dao as { [i: string]: any })['listado'].splice(0)
          service.send()
          tick()
          expect(notify.add).withContext('notify error').toHaveBeenCalled()
        }))
      })
    })

  });
  describe('Componentes', () => {
    BLOG_COMPONENTES.forEach(componente => {
      describe(componente.name, () => {
        let component: any;
        let fixture: ComponentFixture<any>;

        beforeEach(async () => {
          await TestBed.configureTestingModule({
            declarations: [componente],
            providers: [NotificationService, LoggerService],
            imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
            schemas: [NO_ERRORS_SCHEMA]
          })
            .compileComponents();
        });

        beforeEach(() => {
          fixture = TestBed.createComponent(componente as Type<any>);
          component = fixture.componentInstance;
          fixture.detectChanges();
        });

        it('should create', () => {
          expect(component).toBeTruthy();
        });
      });

    })
  })
});
