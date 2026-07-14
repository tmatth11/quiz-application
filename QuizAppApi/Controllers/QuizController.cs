using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizAppApi.Models;
using QuizAppApi.Data;
using QuizAppApi.DTOs;

[Route("api/[controller]")]
[ApiController]
public class QuizController : ControllerBase
{
    private readonly QuizContext _context;
    public QuizController(QuizContext context)
    {
        _context = context;
    }

    // GET: api/Quiz
    [HttpGet]
    public async Task<IResult> GetQuizzes()
    {
        var quizzes = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.AnswerChoices)
            .ToListAsync();

        return TypedResults.Ok(quizzes.Select(ToDTO));
    }

    // GET: api/Quiz/5
    [HttpGet("{id:int}")]
    public async Task<IResult> GetQuiz(int id)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.AnswerChoices)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(ToDTO(quiz));
    }

    // PUT: api/Quiz/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id:int}")]
    public async Task<IResult> PutQuiz(int id, QuizRequestDTO dto)
    {
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.AnswerChoices)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (quiz is null)
        {
            return TypedResults.NotFound();
        }

        quiz.Title = dto.Title;
        quiz.Description = dto.Description;

        _context.AnswerChoices.RemoveRange(
            quiz.Questions.SelectMany(q => q.AnswerChoices));

        _context.Questions.RemoveRange(quiz.Questions);

        quiz.Questions = [.. dto.Questions.Select(question => new Question
        {
            Content = question.Content,
            AnswerChoices = [.. question.AnswerChoices.Select(answer => new AnswerChoice
            {
                Content = answer.Content,
                IsCorrect = answer.IsCorrect
            })]

        })];

        await _context.SaveChangesAsync();

        return TypedResults.Ok(ToDTO(quiz));
    }

    // POST: api/Quiz
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<IResult> PostQuiz(QuizRequestDTO dto)
    {
        var quiz = new Quiz
        {
            Title = dto.Title,
            Description = dto.Description,
            Questions = [.. dto.Questions.Select(question => new Question
            {
                Content = question.Content,
                AnswerChoices = [.. question.AnswerChoices.Select(answer => new AnswerChoice
                {
                    Content = answer.Content,
                    IsCorrect = answer.IsCorrect
                })]
            })]
        };

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();

        quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.AnswerChoices)
            .FirstAsync(q => q.Id == quiz.Id);

        return TypedResults.Created($"/api/Quiz/{quiz.Id}", ToDTO(quiz));
    }

    // DELETE: api/Quiz/5
    [HttpDelete("{id:int}")]
    public async Task<IResult> DeleteQuiz(int id)
    {
        var quiz = await _context.Quizzes.FindAsync(id);

        if (quiz is null)
        {
            return TypedResults.NotFound();
        }

        _context.Quizzes.Remove(quiz);
        await _context.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private static QuizDTO ToDTO(Quiz quiz)
    {
        return new QuizDTO
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            Questions = [.. quiz.Questions.Select(question => new QuestionDTO
            {
                Id = question.Id,
                Content = question.Content,
                AnswerChoices = [.. question.AnswerChoices.Select(answer => new AnswerChoiceDTO
                {
                    Id = answer.Id,
                    Content = answer.Content,
                    IsCorrect = answer.IsCorrect
                })]
            })]
        };
    }
}
