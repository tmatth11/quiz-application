import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { QuizService } from '../api/quiz-service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { CreateQuiz } from '../types';

@Component({
    selector: 'app-quiz-form',
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './quiz-form.html',
    styleUrl: './quiz-form.css',
})
export class QuizForm {
    quizService = inject(QuizService);
    private router = inject(Router);
    private formBuilder = inject(FormBuilder);

    id = input<number>();
    canEdit = computed(() => !!this.id());
    placeholderMessage = signal<string>('');
    errorMessage = signal<string>('')

    quizForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        questions: this.formBuilder.array([
            this.createQuestion()
        ])
    });

    constructor() {
        effect(() => {
            if (this.canEdit()) {
                this.placeholderMessage.set("Loading...");

                this.quizService.getQuiz(this.id()!).subscribe({
                    next: quiz => {
                        this.placeholderMessage.set('');

                        this.quizForm.patchValue({
                            title: quiz.title,
                            description: quiz.description
                        });

                        this.questions.clear();

                        quiz.questions.forEach(question => {
                            this.questions.push(
                                this.createQuestion(
                                    question.content,
                                    question.answerChoices
                                )
                            );
                        });
                    },
                    error: error => {
                        this.placeholderMessage.set(error.message);
                    }
                });
            }
        });
    }

    private createQuestion(
        question = '',
        answers: { content: string; isCorrect: boolean }[] = [
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
        ]
    ): FormGroup {
        return this.formBuilder.group({
            question: [question, Validators.required],
            answerChoices: this.formBuilder.array(
                answers.map(answer =>
                    this.createAnswerChoice(answer.content, answer.isCorrect)
                )
                ,
                {
                    validators: [
                        Validators.minLength(2),
                        this.atLeastOneCorrectAnswer()
                    ]
                }
            )
        });
    }

    private createAnswerChoice(
        content = '',
        isCorrect = false
    ): FormGroup {
        return this.formBuilder.group({
            answerChoice: [content, Validators.required],
            isCorrect: [isCorrect],
        });
    }

    private atLeastOneCorrectAnswer(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const answerChoices = control as FormArray;

            const hasCorrectAnswer = answerChoices.controls.some(answer =>
                answer.get("isCorrect")?.value
            );

            return hasCorrectAnswer ? null : { noCorrectAnswer: true };
        }
    }

    private displayErrorMessage(errorMessage: string) {
        this.errorMessage.set(errorMessage);
        setTimeout(() => {
            this.errorMessage.set('');
        }, 3000);
    }

    get questions() {
        return this.quizForm.get("questions") as FormArray;
    }

    getQuestion(questionIndex: number) {
        return this.questions.at(questionIndex).value.question;
    }

    addQuestion() {
        this.questions.push(this.createQuestion());
    }

    deleteQuestion(questionIndex: number) {
        this.questions.removeAt(questionIndex);
    }

    getAnswerChoices(questionIndex: number) {
        const question = this.questions.at(questionIndex) as FormGroup;
        return question.get("answerChoices") as FormArray;
    }

    getAnswerChoice(questionIndex: number, answerIndex: number) {
        return this.getAnswerChoices(questionIndex).at(answerIndex) as FormGroup;
    }

    addAnswerChoice(answerIndex: number) {
        this.getAnswerChoices(answerIndex).push(
            this.createAnswerChoice()
        );
    }

    deleteAnswerChoice(questionIndex: number, answerIndex: number) {
        this.getAnswerChoices(questionIndex).removeAt(answerIndex);
    }

    handleSubmit() {
        const newQuiz: CreateQuiz = {
            title: this.quizForm.value.title!,
            description: this.quizForm.value.description!,
            questions: this.quizForm.value.questions!.map(question => ({
                content: question.question!,
                answerChoices: question.answerChoices!.map((answer: { answerChoice: string; isCorrect: boolean }) => ({
                    content: answer.answerChoice!,
                    isCorrect: answer.isCorrect!
                }))
            }))
        };

        if (this.canEdit()) {
            this.quizService.updateQuiz(this.id()!, newQuiz).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: error => {
                    this.displayErrorMessage(error.message);
                }
            })
        }
        else {
            this.quizService.createQuiz(newQuiz).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: error => {
                    this.displayErrorMessage(error.message);
                }
            });
        }
    }
}
