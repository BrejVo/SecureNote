using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using SecureNotesApi.Data;
using SecureNotesApi.Models;

namespace SecureNotesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotesController : ControllerBase
    {
        private readonly NotesDbContext _context;

        public NotesController(NotesDbContext context)
        {
            _context = context;
        }

        // Pobiera ID zalogowanego usera z tokena
        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
        }

        // pobiera wszystkie notatki usera
        [HttpGet]
        public async Task<IActionResult> GetNotes()
        {
            string userId = GetUserId();
            var notes = await _context.Notes
                .Where(n => n.UserId == userId)
                .ToListAsync();

            return Ok(notes);
        }

        // POST: tworzy notatke
        [HttpPost]
        public async Task<IActionResult> CreateNote([FromBody] Note note)
        {
            if (note == null || string.IsNullOrWhiteSpace(note.Title))
                return BadRequest("Note or Title is empty");

            note.UserId = GetUserId();
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotes), new { id = note.Id }, note);
        }

        // PUT: edycja notatki po ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, [FromBody] Note updatedNote)
        {
            string userId = GetUserId();
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null)
                return NotFound();

            note.Title = updatedNote.Title;
            note.Content = updatedNote.Content;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: usuwa notatke po ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            string userId = GetUserId();
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (note == null)
                return NotFound();

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
