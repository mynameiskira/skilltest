import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:5001/api';

    currentUser = signal<any>(this.getUserFromStorage());
    isLoggedIn = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'admin');
    isRecruiter = computed(() => this.currentUser()?.role === 'recruiter');

    login(credentials: any) {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap((res: any) => {
                localStorage.setItem('auth_token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
                this.currentUser.set(res.user);
            })
        );
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    private getUserFromStorage() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    // Admin User Management
    getUsers() {
        return this.http.get<any[]>(`${this.apiUrl}/admin/users`, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        });
    }

    createUser(userData: any) {
        return this.http.post(`${this.apiUrl}/admin/users`, userData, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        });
    }

    deleteUser(userId: number) {
        return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${this.getToken()}` }
        });
    }
}
