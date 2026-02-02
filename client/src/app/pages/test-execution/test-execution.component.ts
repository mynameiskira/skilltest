import { Component, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TestService } from '../../services/test.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-test-execution',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './test-execution.component.html'
})
export class TestExecutionComponent implements OnInit, OnDestroy {
    test = signal<any>(null);
    currentQuestionIndex = signal(0);
    answers = signal<Record<number, number>>({});
    timeLeft = signal(0);
    isStarted = signal(false);
    isFinished = signal(false);
    result = signal<any>(null);
    cheatAttempts = signal(0);
    loading = signal(true);

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    public testService = inject(TestService);
    private authService = inject(AuthService);

    private timerInterval?: any;

    progress = computed(() => {
        const t = this.test();
        if (!t) return 0;
        return ((this.currentQuestionIndex() + 1) / t.Questions.length) * 100;
    });

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        this.testService.getTest(id).subscribe({
            next: (data) => {
                this.test.set(data);
                this.timeLeft.set(data.duration * 60);
                this.loading.set(false);
            }
        });

        window.addEventListener('blur', this.handleBlur);
    }

    ngOnDestroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        window.removeEventListener('blur', this.handleBlur);
    }

    handleBlur = () => {
        if (this.isStarted() && !this.isFinished()) {
            this.cheatAttempts.update(v => v + 1);
            alert('WARNING: Window focus lost. This attempt has been logged.');
        }
    };

    startTest() {
        this.isStarted.set(true);
        this.timerInterval = setInterval(() => {
            this.timeLeft.update(v => {
                if (v <= 1) {
                    this.submitTest();
                    return 0;
                }
                return v - 1;
            });
        }, 1000);
    }

    nextQuestion() {
        this.currentQuestionIndex.update(v => v + 1);
    }

    prevQuestion() {
        this.currentQuestionIndex.update(v => v - 1);
    }

    selectOption(questionId: number, optionIndex: number) {
        this.answers.update(v => ({ ...v, [questionId]: optionIndex }));
    }

    submitTest() {
        if (this.isFinished()) return;
        this.isFinished.set(true);
        if (this.timerInterval) clearInterval(this.timerInterval);

        const testData = this.test();
        this.testService.submitTest(testData.id, {
            answers: this.answers(),
            durationTaken: testData.duration * 60 - this.timeLeft(),
            userId: this.authService.currentUser().id
        }).subscribe({
            next: (res) => {
                this.result.set(res);
            }
        });
    }

    download() {
        if (this.result()) {
            this.testService.downloadCertificate(this.result().id);
        }
    }

    formatTime(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
}
