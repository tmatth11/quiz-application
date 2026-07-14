using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using QuizAppApi.Data;
using QuizAppApi.DTOs;
using QuizAppApi.Models;
using QuizAppApi.Tests.Data;

namespace QuizAppApi.Tests.Tests;

public class QuizControllerTests : IDisposable
{
    private readonly QuizContext _context;
    private readonly QuizController _controller;

    public QuizControllerTests()
    {
        _context = TestQuizContext.Create();
        _controller = new QuizController(_context);
    }

    public void Dispose()
    {
        _context.Dispose();
    }

    [Fact]
    public async Task GetQuizzes_ReturnsEmptyList()
    {
        var result = await _controller.GetQuizzes();

        var ok = Assert.IsType<Ok<IEnumerable<QuizDTO>>>(result);

        Assert.Empty(ok.Value!);
    }

    [Fact]
    public async Task GetQuizzes_ReturnsQuiz()
    {
        // Add quiz first
        await AddQuizAsync();

        var result = await _controller.GetQuizzes();
        var ok = Assert.IsType<Ok<IEnumerable<QuizDTO>>>(result);

        Assert.NotEmpty(ok.Value!);
    }

    [Fact]
    public async Task GetQuiz_ReturnsQuiz()
    {
        // Add quiz first
        var quiz = await AddQuizAsync();

        var result = await _controller.GetQuiz(quiz.Id);
        var ok = Assert.IsType<Ok<QuizDTO>>(result);

        Assert.NotNull(ok.Value!);
    }

    [Fact]
    public async Task GetQuiz_ReturnsNotFound()
    {
        int randomId = 4;

        // Database is empty, so there should be no quizzes
        var result = await _controller.GetQuiz(randomId);
        
        Assert.IsType<NotFound>(result);
    }

    [Fact]
    public async Task CreateQuizSuccessfully()
    {
        var dto = GetUpdatedQuiz();

        // Test that API respose is correct
        var result = await _controller.PostQuiz(dto);
        var created = Assert.IsType<Created<QuizDTO>>(result);

        Assert.NotNull(created.Value);
        Assert.Equal("Math Quiz", created.Value.Title);
        Assert.Equal("A Very Fun Math Quiz!", created.Value.Description);
        Assert.Single(created.Value.Questions);
        Assert.Equal(2, created.Value.Questions.First().AnswerChoices.Count);

        // Test that database contains correct value
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.AnswerChoices)
            .SingleAsync();

        Assert.Equal("Math Quiz", quiz.Title);
        Assert.Equal("A Very Fun Math Quiz!", quiz.Description);
        Assert.Single(quiz.Questions);
        Assert.Equal(2, quiz.Questions.First().AnswerChoices.Count);
    }

    [Fact]
    public async Task UpdateQuiz_WhenQuizExists()
    {
        // Add quiz first
        var initialQuiz = await AddQuizAsync();

        var dto = GetUpdatedQuiz();

        // Test that API respose is correct
        var result = await _controller.PutQuiz(initialQuiz.Id, dto);
        var ok = Assert.IsType<Ok<QuizDTO>>(result);

        Assert.NotNull(ok.Value);
        Assert.Equal("Math Quiz", ok.Value.Title);
        Assert.Equal("A Very Fun Math Quiz!", ok.Value.Description);
        Assert.Single(ok.Value.Questions);
        Assert.Equal(2, ok.Value.Questions.First().AnswerChoices.Count);

        // Test that database contains correct value
        var quiz = await _context.Quizzes
            .Include(q => q.Questions)
            .ThenInclude(q => q.AnswerChoices)
            .SingleAsync();

        Assert.Equal("Math Quiz", quiz.Title);
        Assert.Equal("A Very Fun Math Quiz!", quiz.Description);
        Assert.Single(quiz.Questions);
        Assert.Equal(2, quiz.Questions.First().AnswerChoices.Count);
    }

    [Fact]
    public async Task UpdateQuiz_ReturnsNotFound()
    {
        int randomId = 4;
        var dto = GetUpdatedQuiz();

        // Database is empty, so there should be no quizzes
        var result = await _controller.PutQuiz(randomId, dto);

        Assert.IsType<NotFound>(result);
    }

    [Fact]
    public async Task DeleteQuiz_WhenQuizExists()
    {
        var quiz = await AddQuizAsync();

        // Test that API response is correct
        var result = await _controller.DeleteQuiz(quiz.Id);
        Assert.IsType<NoContent>(result);

        // Test that database does not contain the previously added quiz
        var quizzes = await _context.Quizzes.FindAsync(quiz.Id);

        Assert.Null(quizzes);
    }

    [Fact]
    public async Task DeleteQuiz_ReturnsNotFound()
    {
        int randomId = 4;

        // Database is empty, so there should be no quizzes
        var result = await _controller.DeleteQuiz(randomId);

        Assert.IsType<NotFound>(result);
    }

    // Helper methods

    private async Task<Quiz> AddQuizAsync()
    {
        var quiz = new Quiz
        {
            Title = "Sample Quiz",
            Description = "Sample Description",
            Questions = [
                new Question
                {
                    Content = "Sample Question",
                    AnswerChoices = [
                        new AnswerChoice
                        {
                            Content = "Sample Answer Choice #1",
                            IsCorrect = true
                        },
                        new AnswerChoice
                        {
                            Content = "Sample Answer Choice #2",
                            IsCorrect = false
                        }
                    ]
                }
            ]
        };

        _context.Quizzes.Add(quiz);
        await _context.SaveChangesAsync();

        return quiz;
    }

    private QuizRequestDTO GetUpdatedQuiz()
    {
        return new QuizRequestDTO
        {
            Title = "Math Quiz",
            Description = "A Very Fun Math Quiz!",
            Questions = [
                new QuestionRequestDTO
                {
                    Content = "What is 2 + 2?",
                    AnswerChoices = [
                        new AnswerChoiceRequestDTO
                        {
                            Content = "4",
                            IsCorrect = true
                        },
                        new AnswerChoiceRequestDTO
                        {
                            Content = "67",
                            IsCorrect = false
                        }
                    ]
                }
            ]
        };
    }
}
