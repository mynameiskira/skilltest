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
            expect(localStorage.getItem('token')).toBe('fake-token');
        });

        const req = httpMock.expectOne('http://localhost:5001/api/auth/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });
});
