import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestExecutionComponent } from './test-execution.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestService } from '../../services/test.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('TestExecutionComponent', () => {
    let component: TestExecutionComponent;
    let fixture: ComponentFixture<TestExecutionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestExecutionComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({ token: 'abc' }), snapshot: { params: { token: 'abc' } } }
                }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TestExecutionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
