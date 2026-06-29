using Microsoft.EntityFrameworkCore;
using QuizAppApi.Models;

namespace QuizAppApi.Data;

public class QuizContext(DbContextOptions<QuizContext> options) : DbContext(options)
{
    public DbSet<Quiz> QuizItems { get; set; } = null!;
}
