namespace QuizAppApi.DTOs;

public class AnswerChoiceDTO
{
    public int Id { get; set; }

    public string? Content { get; set; }

    public bool IsCorrect { get; set; }
}


public class AnswerChoiceRequestDTO
{
    public string? Content { get; set; }

    public bool IsCorrect { get; set; }
}