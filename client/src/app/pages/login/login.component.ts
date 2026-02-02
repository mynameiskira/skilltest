import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    email = signal('jane@gmail.com');
    password = signal('password123');
    error = signal('');
    loading = signal(false);

    private authService = inject(AuthService);
    private router = inject(Router);

    async onSubmit() {
        this.loading.set(true);
        this.error.set('');

        this.authService.login({ email: this.email(), password: this.password() }).subscribe({
            next: (res) => {
                if (res.user.role === 'candidate') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/recruiter']);
                }
            },
            error: (err) => {
                this.error.set(err.error?.message || 'Login failed');
                this.loading.set(false);
            }
        });
    }
}
