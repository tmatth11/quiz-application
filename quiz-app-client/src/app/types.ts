// Type aliases

// Interfaces
export interface Environment {
    production: boolean;
    baseUrl: string;
}

export interface AnswerChoices {
    id: number;
    content: string;
    isCorrect: boolean;
}

interface CreateAnswerChoices {
    content: string;
    isCorrect: boolean;
}

export interface Questions {
    id: number;
    content: string;
    answerChoices: AnswerChoices[];
}

interface CreateQuestions {
    content: string;
    answerChoices: CreateAnswerChoices[];
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    questions: Questions[]
}

export interface CreateQuiz {
    title: string;
    description: string;
    questions: CreateQuestions[];
}
