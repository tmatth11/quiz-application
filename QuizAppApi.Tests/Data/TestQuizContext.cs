using Microsoft.EntityFrameworkCore;
using QuizAppApi.Data;

namespace QuizAppApi.Tests.Data;

public static class TestQuizContext
{
    public static QuizContext Create()
    {
        var options = new DbContextOptionsBuilder<QuizContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new QuizContext(options);
    }
}
