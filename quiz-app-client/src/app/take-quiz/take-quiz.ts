import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuizService } from '../api/quiz-service';
import { Quiz } from '../types';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'app-take-quiz',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './take-quiz.html',
    styleUrl: './take-quiz.css',
})
export class TakeQuiz {
    quizService = inject(QuizService);
    private formBuilder = inject(FormBuilder);

    id = input<number>();

    placeholderMessage = signal<string>('');
    quiz = signal<Quiz | undefined>(undefined);
    answerResults = signal<boolean[][]>([]);
    questionResults = signal<boolean[]>([]);
    submitted = signal(false);
    score = computed(() =>
        this.questionResults().filter(correct => correct).length
    );

    takeQuizForm = this.formBuilder.group({
        questions: this.formBuilder.array([])
    });

    constructor() {
        effect(() => {
            this.placeholderMessage.set("Loading...");

            this.quizService.getQuiz(this.id()!).subscribe({
                next: quiz => {
                    this.quiz.set(quiz);
                    this.placeholderMessage.set('');

                    this.questions.clear();

                    quiz.questions.forEach(question => {
                        this.questions.push(
                            this.formBuilder.group({
                                answers: this.formBuilder.array(
                                    question.answerChoices.map(() =>
                                        this.formBuilder.control(false)
                                    ),
                                    {
                                        validators: this.atLeastOneSelected()
                                    }
                                )
                            })
                        )
                    });
                },
                error: error => {
                    this.placeholderMessage.set(error.message);
                }
            });
        });
    }

    private atLeastOneSelected(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const answers = control as FormArray;
            const hasSelection = answers.controls.some(answers => answers.value);

            return hasSelection ? null : { noAnswersSelected: true };
        };
    }

    get questions() {
        return this.takeQuizForm.get("questions") as FormArray;
    }

    handleSubmit() {
        const quiz = this.quiz();

        if (!quiz) {
            return;
        }

        const questionResults: boolean[] = [];
        const answerResults: boolean[][] = [];

        quiz.questions.forEach((question, questionIndex) => {
            const userAnswers = this.questions.at(questionIndex).get("answers") as FormArray;
            const currentAnswerResults: boolean[] = [];
            let questionCorrect = true;

            question.answerChoices.forEach((answerChoice, answerIndex) => {
                const userSelected = userAnswers.at(answerIndex).value;
                const correct = userSelected === answerChoice.isCorrect;
                currentAnswerResults.push(correct);

                if (!correct) {
                    questionCorrect = false;
                }
            });

            answerResults.push(currentAnswerResults);
            questionResults.push(questionCorrect);
        });

        this.answerResults.set(answerResults);
        this.questionResults.set(questionResults);
        this.submitted.set(true);
    }
}
