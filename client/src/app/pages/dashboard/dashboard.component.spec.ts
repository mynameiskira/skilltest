import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        // Mock user for dashboard
        const aSpy = jasmine.createSpyObj('AuthService', [], {
            currentUser: () => ({ id: 1, role: 'candidate' }),
            getToken: () => 'fake-token'
        });

        await TestBed.configureTestingModule({
            imports: [DashboardComponent, HttpClientTestingModule, RouterTestingModule],
            providers: [{ provide: AuthService, useValue: aSpy }]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
