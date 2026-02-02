import { Component, inject, signal, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    tests = signal<any[]>([]);
    myResults = signal<any[]>([]);
    view = signal<'available' | 'results'>('available');
    loading = signal(true);

    private testService = inject(TestService);
    private auth = inject(AuthService);

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.loading.set(true);
        this.testService.getTests().subscribe(data => this.tests.set(data));

        const user = this.auth.currentUser();
        if (user) {
            this.testService.getMyResults(user.id).subscribe(data => {
                this.myResults.set(data);
                this.loading.set(false);
            });
        }
    }

    downloadCert(resId: number) {
        this.testService.downloadCertificate(resId);
    }

    buyPlan(plan: string) {
        this.testService.checkout(plan).subscribe((res: any) => {
            window.location.href = res.url;
        });
    }
}
