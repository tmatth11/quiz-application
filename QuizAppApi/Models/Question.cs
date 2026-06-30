using System.ComponentModel.DataAnnotations;

namespace QuizAppApi.Models;

public class Question
{
    public int Id { get; set; }

    [StringLength(500, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 1)]
    public string? Content { get; set; }

    public int QuizId { get; set; }

    public Quiz? Quiz { get; set; }

    public ICollection<AnswerChoice> AnswerChoices { get; set; } = [];
}
