import { Component, computed, inject, input, signal } from '@angular/core';
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

    private createQuestion(): FormGroup {
        return this.formBuilder.group({
            question: ['', Validators.required],
            answerChoices: this.formBuilder.array([
                this.createAnswerChoice(),
                this.createAnswerChoice()
            ],
                {
                    validators: [
                        Validators.minLength(2),
                        this.atLeastOneCorrectAnswer()
                    ]
                }
            )
        });
    }

    private createAnswerChoice(): FormGroup {
        return this.formBuilder.group({
            answerChoice: this.formBuilder.control('', Validators.required),
            isCorrect: [false],
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
        console.log(`Quiz Title: ${this.quizForm.value.title}`);
        console.log(`Quiz Description: ${this.quizForm.value.description}`);
        console.log(`Question Length: ${this.questions.length}`)
        for (let i = 0; i < this.questions.length; ++i) {
            console.log(`Question #${i + 1}: ${this.getQuestion(i)}`);
            for (let j = 0; j < this.getAnswerChoices(i).length; ++j) {
                const answer = this.getAnswerChoice(i, j).value;
                console.log(`Answer #${j + 1}: ${answer.answerChoice}`);
                console.log(`Correct Answer: ${answer.isCorrect}`);
            }
        }

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

        }
        else {
            this.quizService.createQuiz(newQuiz).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: error => {
                    this.errorMessage.set(error.message);
                    setTimeout(() => {
                        this.errorMessage.set('');
                    }, 3000);
                }
            });
        }
    }
}
