
export enum CFATopic {
  ETHICS = "Ethical and Professional Standards",
  QUANTS = "Quantitative Methods",
  ECONOMICS = "Economics",
  FSA = "Financial Statement Analysis",
  CORPORATE = "Corporate Issuers",
  EQUITY = "Equity Valuation",
  FIXED_INCOME = "Fixed Income",
  DERIVATIVES = "Derivatives",
  ALTERNATIVES = "Alternative Investments",
  PORTFOLIO = "Portfolio Management"
}

export interface Question {
  id: string;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
  };
  correctAnswer: 'A' | 'B' | 'C';
  explanation: string;
}

export interface Vignette {
  title: string;
  topic: CFATopic;
  context: string;
  questions: Question[];
}

export interface QuizSession {
  vignette: Vignette;
  userAnswers: Record<string, 'A' | 'B' | 'C'>;
  isComplete: boolean;
  startTime: number;
}
