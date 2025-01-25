import { Location } from '@angular/common';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { NavigationService } from '@/app/core/services/navigation/navigation.service';
import { APP_ROUTE } from '@/app/core/services/navigation/routes';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerMock: { navigate: jest.Mock; events: Subject<NavigationEnd>; url: string };
  let locationMock: { back: jest.Mock };
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
      events: new Subject<NavigationEnd>(),
      url: '/home',
    };

    locationMock = { back: jest.fn() };

    activatedRouteMock = {
      snapshot: {
        queryParams: {},
        url: [],
        params: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        component: null,
        routeConfig: null,
        root: {} as ActivatedRouteSnapshot,
        parent: null,
        firstChild: null,
        children: [],
        pathFromRoot: [],
        title: 'test',
        paramMap: convertToParamMap({}),
        queryParamMap: convertToParamMap({}),
      },
    };

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('goBack', () => {
    it('should call location.back()', () => {
      service.goBack();
      expect(locationMock.back).toHaveBeenCalled();
    });
  });

  describe('navigateToLogin', () => {
    it('should navigate to login route', () => {
      service.navigateToLogin();
      expect(routerMock.navigate).toHaveBeenCalledWith([APP_ROUTE.LOGIN]);
    });
  });

  describe('updateQueryParams', () => {
    it('should navigate with the updated query params', () => {
      const params = { search: 'test' };
      service.updateQueryParams(params);
      expect(routerMock.navigate).toHaveBeenCalledWith([], {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: activatedRouteMock as ActivatedRoute,
      });
    });
  });

  describe('isLoginPage', () => {
    it('should set isLoginPage to true if the URL starts with login route', fakeAsync(() => {
      routerMock.url = '/login';
      const navigationEndEvent = new NavigationEnd(1, '/login', '/login');
      routerMock.events.next(navigationEndEvent);
      tick();
      expect(service.isLoginPage()).toBe(true);
    }));

    it('should set isLoginPage to false if the URL does not start with login route', fakeAsync(() => {
      routerMock.url = '/home';
      const navigationEndEvent = new NavigationEnd(1, '/home', '/home');
      routerMock.events.next(navigationEndEvent);
      tick();
      expect(service.isLoginPage()).toBe(false);
    }));
  });
});
