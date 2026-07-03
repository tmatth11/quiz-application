import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { QuizForm } from './quiz-form/quiz-form';
import { TakeQuiz } from './take-quiz/take-quiz';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'add-quiz',
        component: QuizForm
    },
    {
        path: 'edit-quiz/:id',
        component: QuizForm
    },
    {
        path: 'take-quiz/:id',
        component: TakeQuiz
    }
];
