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

export interface Questions {
    id: number;
    content: string;
    answerChoices: AnswerChoices[];
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    questions: Questions[]
};
