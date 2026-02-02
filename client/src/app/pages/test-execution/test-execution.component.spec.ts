import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestExecutionComponent } from './test-execution.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestService } from '../../services/test.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TestExecutionComponent', () => {
    let component: TestExecutionComponent;
    let fixture: ComponentFixture<TestExecutionComponent>;
    let testServiceSpy: jasmine.SpyObj<TestService>;

    beforeEach(async () => {
        const tSpy = jasmine.createSpyObj('TestService', ['getTest', 'submitTest', 'downloadCertificate']);
        tSpy.getTest.and.returnValue(of({
            id: 1,
            title: 'Quiz',
            duration: 10,
            Questions: [
                { id: 101, content: 'Q1', options: ['A', 'B'] },
                { id: 102, content: 'Q2', options: ['Y', 'N'] }
            ]
        }));
        tSpy.submitTest.and.returnValue(of({ id: 10, score: 80 }));

        const aSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser: () => ({ id: 1 })
        });

        await TestBed.configureTestingModule({
            imports: [TestExecutionComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [
                { provide: TestService, useValue: tSpy },
                { provide: AuthService, useValue: aSpy },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { params: { id: '1' } } }
                }
            ]
        })
            .compileComponents();

        testServiceSpy = TestBed.inject(TestService) as jasmine.SpyObj<TestService>;
        fixture = TestBed.createComponent(TestExecutionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and load test', () => {
        expect(component).toBeTruthy();
        expect(testServiceSpy.getTest).toHaveBeenCalled();
        expect(component.test()).toBeTruthy();
        expect(component.timeLeft()).toBe(600);
    });

    it('should start test', () => {
        component.startTest();
        expect(component.isStarted()).toBeTrue();
        // cleanup
        clearInterval((component as any).timerInterval);
    });

    it('should select option', () => {
        component.selectOption(101, 1);
        expect(component.answers()[101]).toBe(1);
    });

    it('should navigate questions', () => {
        component.nextQuestion();
        expect(component.currentQuestionIndex()).toBe(1);
        component.prevQuestion();
        expect(component.currentQuestionIndex()).toBe(0);
    });

    it('should submit test', () => {
        component.startTest();
        component.submitTest();
        expect(testServiceSpy.submitTest).toHaveBeenCalled();
        expect(component.isFinished()).toBeTrue();
    });
});
