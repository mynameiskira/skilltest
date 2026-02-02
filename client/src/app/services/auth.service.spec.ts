import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('login should store token on success', () => {
        const mockResponse = { token: 'fake-token', user: { id: 1, role: 'admin' } };

        service.login({ email: 'test@example.com', password: 'password' }).subscribe(response => {
            expect(response.token).toBe('fake-token');
            expect(localStorage.getItem('auth_token')).toBe('fake-token');
        });

        const req = httpMock.expectOne('http://localhost:5001/api/auth/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });
    it('logout should clear storage', () => {
        service.logout();
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(service.currentUser()).toBeNull();
    });

    it('should compute roles correctly', () => {
        service.currentUser.set({ role: 'admin' });
        expect(service.isAdmin()).toBeTrue();
        expect(service.isRecruiter()).toBeFalse();

        service.currentUser.set({ role: 'recruiter' });
        expect(service.isAdmin()).toBeFalse();
        expect(service.isRecruiter()).toBeTrue();
    });

    it('getToken should return token', () => {
        localStorage.setItem('auth_token', 'xyz');
        expect(service.getToken()).toBe('xyz');
    });

    it('Admin methods should call API', () => {
        // getUsers
        service.getUsers().subscribe();
        const req1 = httpMock.expectOne('http://localhost:5001/api/admin/users');
        expect(req1.request.method).toBe('GET');
        req1.flush([]);

        // createUser
        service.createUser({}).subscribe();
        const req2 = httpMock.expectOne('http://localhost:5001/api/admin/users');
        expect(req2.request.method).toBe('POST');
        req2.flush({});

        // deleteUser
        service.deleteUser(1).subscribe();
        const req3 = httpMock.expectOne('http://localhost:5001/api/admin/users/1');
        expect(req3.request.method).toBe('DELETE');
        req3.flush({});
    });
});
