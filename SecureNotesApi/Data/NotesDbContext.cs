using Microsoft.EntityFrameworkCore;
using SecureNotesApi.Models;


namespace SecureNotesApi.Data
{
    public class NotesDbContext : DbContext
    {
        public NotesDbContext(DbContextOptions<NotesDbContext> options) : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
        public DbSet<User> Users { get; set; }

    }
}
