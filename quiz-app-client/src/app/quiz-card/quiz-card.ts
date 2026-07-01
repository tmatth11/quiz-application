import { Component, input, output } from '@angular/core';
import { Quiz } from '../types';

@Component({
	selector: 'app-quiz-card',
	imports: [],
	templateUrl: './quiz-card.html',
	styleUrl: './quiz-card.css',
})
export class QuizCard {
    quiz = input.required<Quiz>();

    deleteQuizEvent = output<number>();

    deleteQuiz(id: number) {
        this.deleteQuizEvent.emit(id);
    }
}
