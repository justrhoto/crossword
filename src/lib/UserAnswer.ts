export class UserAnswer {
  answer: string;
  checked: boolean;
  correct: boolean;

  constructor(
    answer: string | { answer: string; checked: boolean; correct: boolean },
  ) {
    if (typeof answer === "string") {
      this.answer = answer;
      this.checked = false;
      this.correct = false;
    } else {
      this.answer = answer.answer;
      this.checked = answer.checked;
      this.correct = answer.correct;
    }
  }
}
