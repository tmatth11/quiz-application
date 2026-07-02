import { Component, effect, inject, signal } from '@angular/core';
import { QuizService } from '../api/quiz-service';
import { Quiz } from '../types';
import { QuizCard } from '../quiz-card/quiz-card';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home-page',
    imports: [QuizCard, RouterLink],
    templateUrl: './home-page.html',
    styleUrl: './home-page.css',
})
export class HomePage {
    quizService = inject(QuizService);

    quizzes = signal<Quiz[]>([]);
    placeholderMessage = signal<string>('');

    constructor() {
        effect(() => {
            this.placeholderMessage.set("Loading...");

            this.quizService.getQuizzes().subscribe({
                next: quizzes => {
                    this.placeholderMessage.set('');
                    this.quizzes.set(quizzes);
                    if (quizzes.length == 0) {
                        this.placeholderMessage.set("No quizzes made yet.");
                    }
                },
                error: error => {
                    this.placeholderMessage.set(error.message);
                }
            });
        });
    }

    deleteQuiz(id: number) {
        this.quizService.deleteQuiz(id).subscribe({
            next: () => {
                this.quizzes.update(quizzes => quizzes.filter(quiz => quiz.id !== id));

                if (this.quizzes.length == 0) {
                    this.placeholderMessage.set("No quizzes made yet.");
                }
            }
        });
    }
}
