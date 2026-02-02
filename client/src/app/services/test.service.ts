import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class TestService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiUrl = 'http://localhost:5001/api';

    getTests() {
        return this.http.get<any[]>(`${this.apiUrl}/tests`);
    }

    getTest(id: number) {
        return this.http.get<any>(`${this.apiUrl}/tests/${id}`);
    }

    submitTest(id: number, submission: any) {
        return this.http.post(`${this.apiUrl}/tests/${id}/submit`, submission);
    }

    getResults() {
        return this.http.get<any[]>(`${this.apiUrl}/results`, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    getMyResults(userId: number) {
        return this.http.get<any[]>(`${this.apiUrl}/candidates/${userId}/results`, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    downloadCertificate(resultId: number) {
        window.open(`${this.apiUrl}/results/${resultId}/certificate`, '_blank');
    }

    checkout(planId: string) {
        return this.http.post(`${this.apiUrl}/payments/checkout`, { planId }, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    // Recruiter/Admin CRUD
    createTest(testData: any) {
        return this.http.post(`${this.apiUrl}/tests`, testData, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    updateTest(id: number, testData: any) {
        return this.http.put(`${this.apiUrl}/tests/${id}`, testData, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    deleteTest(id: number) {
        return this.http.delete(`${this.apiUrl}/tests/${id}`, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    // Review methods
    getResultForReview(resultId: number) {
        return this.http.get<any>(`${this.apiUrl}/results/${resultId}/review`, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }

    updateReviewStatus(resultId: number, reviewStatus: 'approved' | 'rejected') {
        return this.http.patch(`${this.apiUrl}/results/${resultId}/review`, { reviewStatus }, {
            headers: { Authorization: `Bearer ${this.auth.getToken()}` }
        });
    }
}
