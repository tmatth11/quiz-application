import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Quiz } from '../types';

@Injectable({
    providedIn: 'root',
})
export class QuizService {
    private http = inject(HttpClient);
    private baseUrl = environment.baseUrl;

    getQuizzes(): Observable<Quiz[]> {
        return this.http.get<Quiz[]>(`${this.baseUrl}/Quiz`).pipe(
            catchError(this.handleError)
        );
    }

    deleteQuiz(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/Quiz/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            return throwError(() => ({
                type: 'NETWORK',
                message: 'Error: Network error. Check your connection.',
            }));
        }
        else if (error.status == 404) {
            return throwError(() => ({
                type: 'NOT_FOUND',
                message: 'Error: Video Game not found.'
            }));
        }

        return throwError(() => ({
            type: 'UNKNOWN',
            message: 'Error: Something went wrong.',
        }));
    }
}
