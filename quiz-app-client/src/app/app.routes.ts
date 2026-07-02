import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { QuizForm } from './quiz-form/quiz-form';

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
    }
];
