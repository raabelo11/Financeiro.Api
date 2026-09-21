using Financeiro.Api.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Financeiro.Api.Data.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Lancamento> Lancamentos { get; set; }
    }
}
