import { Component, input, output } from '@angular/core';
import { Quiz } from '../types';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-quiz-card',
	imports: [RouterLink],
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
