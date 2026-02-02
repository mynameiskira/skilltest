import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestService } from './test.service';

describe('TestService', () => {
    let service: TestService;
    let httpMock: HttpTestingController;
    const API_URL = 'http://localhost:5001/api';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TestService]
        });
        service = TestBed.inject(TestService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getTests should return list of tests', () => {
        const mockTests = [{ id: 1, title: 'Test 1' }];

        service.getTests().subscribe(tests => {
            expect(tests.length).toBe(1);
            expect(tests[0].title).toBe('Test 1');
        });

        const req = httpMock.expectOne(`${API_URL}/tests`);
        expect(req.request.method).toBe('GET');
        req.flush(mockTests);
    });

    it('createTest should post data', () => {
        const newTest = { title: 'New Test' };

        service.createTest(newTest).subscribe(test => {
            expect(test).toEqual(newTest);
        });

        const req = httpMock.expectOne(`${API_URL}/tests`);
        expect(req.request.method).toBe('POST');
        req.flush(newTest);
    });
});
