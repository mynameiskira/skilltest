import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestService } from './test.service';

describe('TestService', () => {
    let service: TestService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:5001/api';

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
        const dummyTests = [{ id: 1, title: 'T1' }, { id: 2, title: 'T2' }];
        service.getTests().subscribe(tests => {
            expect(tests.length).toBe(2);
            expect(tests).toEqual(dummyTests);
        });
        const req = httpMock.expectOne(`${apiUrl}/tests`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyTests);
    });

    it('getTest should return single test', () => {
        const dummyTest = { id: 1, title: 'T1' };
        service.getTest(1).subscribe(test => {
            expect(test).toEqual(dummyTest);
        });
        const req = httpMock.expectOne(`${apiUrl}/tests/1`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyTest);
    });

    it('createTest should post data', () => {
        const newTest = { title: 'New' };
        service.createTest(newTest).subscribe(res => {
            expect(res).toEqual({ id: 1, ...newTest });
        });
        const req = httpMock.expectOne(`${apiUrl}/tests`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newTest);
        req.flush({ id: 1, ...newTest });
    });

    // Coverage for delete
    it('deleteTest should call DELETE', () => {
        service.deleteTest(1).subscribe(res => expect(res).toBeTruthy());
        const req = httpMock.expectOne(`${apiUrl}/tests/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    // Coverage for submit
    it('submitTest should post answers', () => {
        const payload = { userId: 1, answers: {} };
        service.submitTest(1, payload).subscribe(res => expect(res).toBeTruthy());
        const req = httpMock.expectOne(`${apiUrl}/tests/1/submit`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    // Coverage for getResults (Admin)
    it('getResults should return all results', () => {
        service.getResults().subscribe();
        const req = httpMock.expectOne(`${apiUrl}/results`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    // Coverage for inviteCandidate
    it('inviteCandidate should post emails', () => {
        service.inviteCandidate({ testId: 1, emails: [] }).subscribe();
        const req = httpMock.expectOne(`${apiUrl}/candidates/invite`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });
});
