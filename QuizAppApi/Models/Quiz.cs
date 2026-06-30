using System.ComponentModel.DataAnnotations;

namespace QuizAppApi.Models;

public class Quiz
{
    public int Id { get; set; }

    [StringLength(100, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 1)]
    public string? Title { get; set; }

    [StringLength(250, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 1)]
    public string? Description { get; set; }

    public ICollection<Question> Questions { get; set; } = [];
}
