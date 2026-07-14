namespace QuizAppApi.DTOs;

public class QuestionDTO
{
    public int Id { get; set; }

    public string? Content { get; set; }

    public List<AnswerChoiceDTO> AnswerChoices { get; set; } = [];
}

public class QuestionRequestDTO
{
    public string? Content { get; set; }

    public List<AnswerChoiceRequestDTO> AnswerChoices { get; set; } = [];
}
