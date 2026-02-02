import { Component, inject, signal, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-recruiter-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './recruiter-dashboard.component.html'
})
export class RecruiterDashboardComponent implements OnInit {
    results = signal<any[]>([]);
    tests = signal<any[]>([]);
    loading = signal(true);
    view = signal<'analytics' | 'management' | 'pricing'>('analytics');
    showModal = signal(false);
    showReviewModal = signal(false);
    reviewingResult = signal<any>(null);

    // Notification system
    notification = signal<{ show: boolean, type: 'success' | 'error' | 'info', message: string }>({
        show: false,
        type: 'success',
        message: ''
    });

    // Confirmation dialog
    showConfirmDialog = signal(false);

    // Use a signal for form data
    formData = signal<any>({
        title: '',
        language: '',
        duration: 30,
        description: '',
        adaptiveDifficulty: false
    });

    editingTestId: number | null = null;

    protected Math = Math;
    private testService = inject(TestService);

    ngOnInit() {
        this.refreshData();
    }

    refreshData() {
        this.loading.set(true);
        this.testService.getResults().subscribe({
            next: (data) => this.results.set(data),
            error: (err) => {
                console.error('Error fetching results:', err);
                this.loading.set(false);
            },
            complete: () => this.loading.set(false)
        });
        this.testService.getTests().subscribe({
            next: (data) => this.tests.set(data),
            error: (err) => console.error('Error fetching tests:', err)
        });
    }

    getAverageScore() {
        const res = this.results();
        if (!res.length) return '0%';
        const avg = res.reduce((acc, r) => acc + (r.score / r.maxScore), 0) / res.length;
        return Math.round(avg * 100) + '%';
    }

    getUniqueCandidates() {
        return new Set(this.results().map(r => r.UserId)).size;
    }

    openCreateModal() {
        this.editingTestId = null;
        this.formData.set({ title: '', language: '', duration: 30, description: '' });
        this.showModal.set(true);
    }

    editTest(test: any) {
        this.editingTestId = test.id;
        this.formData.set({
            title: test.title,
            language: test.language,
            duration: test.duration,
            description: test.description
        });
        this.showModal.set(true);
    }

    saveTest() {
        const data = {
            ...this.formData(),
            questions: [] // Simplified
        };

        if (!data.title || !data.language) {
            alert('Title and Language are required.');
            return;
        }

        if (this.editingTestId) {
            this.testService.updateTest(this.editingTestId, data).subscribe({
                next: () => {
                    this.showModal.set(false);
                    this.refreshData();
                },
                error: (err) => {
                    console.error('Update failed:', err);
                    alert('Failed to update test: ' + (err.error?.error || err.message));
                }
            });
        } else {
            this.testService.createTest(data).subscribe({
                next: () => {
                    this.showModal.set(false);
                    this.refreshData();
                },
                error: (err) => {
                    console.error('Creation failed:', err);
                    alert('Failed to create test: ' + (err.error?.error || err.message));
                }
            });
        }
    }

    deleteTest(id: number) {
        if (confirm('Are you sure you want to delete this test?')) {
            this.testService.deleteTest(id).subscribe({
                next: () => this.refreshData(),
                error: (err) => alert('Delete failed: ' + err.message)
            });
        }
    }

    buyPlan(plan: string) {
        this.testService.checkout(plan).subscribe((res: any) => {
            window.location.href = res.url;
        });
    }

    showNotification(type: 'success' | 'error' | 'info', message: string) {
        this.notification.set({ show: true, type, message });
        setTimeout(() => {
            this.notification.set({ show: false, type: 'success', message: '' });
        }, 4000);
    }

    openReviewModal(result: any) {
        this.testService.getResultForReview(result.id).subscribe({
            next: (data) => {
                this.reviewingResult.set(data);
                this.showReviewModal.set(true);
            },
            error: (err) => {
                console.error('Failed to load review data:', err);
                this.showNotification('error', 'Failed to load test details');
            }
        });
    }

    approveTest() {
        const result = this.reviewingResult();
        if (!result) return;

        this.testService.updateReviewStatus(result.id, 'approved').subscribe({
            next: () => {
                this.showReviewModal.set(false);
                this.refreshData();
                this.showNotification('success', '✓ Test approved successfully!');
            },
            error: (err) => {
                console.error('Failed to approve:', err);
                this.showNotification('error', 'Failed to approve test');
            }
        });
    }

    rejectTest() {
        this.showConfirmDialog.set(true);
    }

    confirmReject() {
        const result = this.reviewingResult();
        if (!result) return;

        this.showConfirmDialog.set(false);

        this.testService.updateReviewStatus(result.id, 'rejected').subscribe({
            next: () => {
                this.showReviewModal.set(false);
                this.refreshData();
                this.showNotification('info', '✗ Test rejected');
            },
            error: (err) => {
                console.error('Failed to reject:', err);
                this.showNotification('error', 'Failed to reject test');
            }
        });
    }
}
