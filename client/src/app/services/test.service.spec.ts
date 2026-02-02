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

    it('deleteTest should call DELETE', () => {
        service.deleteTest(1).subscribe(res => expect(res).toBeTruthy());
        const req = httpMock.expectOne(`${apiUrl}/tests/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('submitTest should post answers', () => {
        const payload = { userId: 1, answers: {} };
        service.submitTest(1, payload).subscribe(res => expect(res).toBeTruthy());
        const req = httpMock.expectOne(`${apiUrl}/tests/1/submit`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('getResults should return all results', () => {
        service.getResults().subscribe();
        const req = httpMock.expectOne(`${apiUrl}/results`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('getMyResults should call API', () => {
        service.getMyResults(1).subscribe();
        const req = httpMock.expectOne(`${apiUrl}/candidates/1/results`);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('inviteCandidate should post emails', () => {
        service.inviteCandidate({ testId: 1, emails: [] }).subscribe();
        const req = httpMock.expectOne(`${apiUrl}/candidates/invite`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('updateTest should call PUT', () => {
        service.updateTest(1, { title: 'U' }).subscribe();
        const req = httpMock.expectOne(`${apiUrl}/tests/1`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('checkout should call POST payment', () => {
        service.checkout('basic').subscribe();
        const req = httpMock.expectOne(`${apiUrl}/payments/checkout`);
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('review methods should call API', () => {
        service.getResultForReview(1).subscribe();
        const req1 = httpMock.expectOne(`${apiUrl}/results/1/review`);
        expect(req1.request.method).toBe('GET');
        req1.flush({});

        service.updateReviewStatus(1, 'approved').subscribe();
        const req2 = httpMock.expectOne(`${apiUrl}/results/1/review`);
        expect(req2.request.method).toBe('PATCH');
        req2.flush({});
    });
});
