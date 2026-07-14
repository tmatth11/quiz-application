namespace QuizAppApi.DTOs;

public class QuizDTO
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public List<QuestionDTO> Questions { get; set; } = [];
}

public class QuizRequestDTO
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public List<QuestionRequestDTO> Questions { get; set; } = [];
}