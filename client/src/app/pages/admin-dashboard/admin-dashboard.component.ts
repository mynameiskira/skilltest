import { Component, inject, signal, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    users = signal<any[]>([]);
    tests = signal<any[]>([]);
    view = signal<'users' | 'tests'>('users');
    showUserModal = signal(false);

    userForm = signal({
        username: '',
        email: '',
        password: '',
        role: 'candidate'
    });

    private authService = inject(AuthService);
    private testService = inject(TestService);

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.authService.getUsers().subscribe({
            next: (data) => this.users.set(data),
            error: (err) => console.error('Admin API Users Error:', err)
        });
        this.testService.getTests().subscribe({
            next: (data) => this.tests.set(data),
            error: (err) => console.error('Admin API Tests Error:', err)
        });
    }

    deleteUser(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.authService.deleteUser(id).subscribe(() => this.refresh());
        }
    }

    deleteTest(id: number) {
        if (confirm('Are you sure you want to delete this test?')) {
            this.testService.deleteTest(id).subscribe(() => this.refresh());
        }
    }

    openCreateUser() {
        this.userForm.set({ username: '', email: '', password: '', role: 'candidate' });
        this.showUserModal.set(true);
    }

    saveUser() {
        const data = this.userForm();
        if (!data.username || !data.email || !data.password) {
            alert('All fields are required.');
            return;
        }

        this.authService.createUser(data).subscribe({
            next: () => {
                this.showUserModal.set(false);
                this.refresh();
            },
            error: (err) => {
                console.error('User creation failed:', err);
                alert('Failed to create user: ' + (err.error?.error || err.message));
            }
        });
    }
}
