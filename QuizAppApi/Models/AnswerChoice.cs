using System.ComponentModel.DataAnnotations;

namespace QuizAppApi.Models;

public class AnswerChoice
{
    public int Id { get; set; }

    [StringLength(500, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 1)]
    public string? Content { get; set; }

    [Required]
    public bool IsCorrect { get; set; }

    public int QuestionId { get; set; }

    public Question? Question { get; set; }
}
