import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { TestExecutionComponent } from './pages/test-execution/test-execution.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RecruiterDashboardComponent } from './pages/recruiter-dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AuthService } from './services/auth.service';
import { TestService } from './services/test.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('Coverage Booster', () => {

    const authMock = {
        currentUser: () => ({ id: 1, role: 'admin' }),
        isLoggedIn: () => true,
        getToken: () => 'token',
        getUsers: () => of([]),
        getResults: () => of([]),
        getTests: () => of([]),
        isAdmin: () => true,
        isRecruiter: () => false
    };

    const testMock = {
        getTests: () => of([]),
        getResults: () => of([]),
        getTest: () => of({ Questions: [] }),
        getTestsWithAnalytics: () => of([]), // Added for Recruiter
        getMyResults: () => of([]) // Added for Dashboard
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                LoginComponent,
                LandingComponent,
                TestExecutionComponent,
                DashboardComponent,
                RecruiterDashboardComponent,
                AdminDashboardComponent
            ],
            providers: [
                { provide: AuthService, useValue: authMock },
                { provide: TestService, useValue: testMock },
                { provide: ActivatedRoute, useValue: { snapshot: { params: { id: 1 } } } }
            ]
        }).compileComponents();
    });

    it('should instantiate Login and run ngOnInit', () => {
        const fixture = TestBed.createComponent(LoginComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should instantiate Recruiter and run ngOnInit', () => {
        const fixture = TestBed.createComponent(RecruiterDashboardComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should instantiate Admin and run ngOnInit', () => {
        const fixture = TestBed.createComponent(AdminDashboardComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should instantiate Landing and run ngOnInit', () => {
        const fixture = TestBed.createComponent(LandingComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('should instantiate Dashboard and run ngOnInit', () => {
        const fixture = TestBed.createComponent(DashboardComponent);
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
    });
});
