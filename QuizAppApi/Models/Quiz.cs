using System.ComponentModel.DataAnnotations;

namespace QuizAppApi.Models;

public class Quiz
{
    public long Id { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 1)]
    public string? Title { get; set; }

    [Required]
    [StringLength(250, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 1)]
    public string? Description { get; set; }
}
