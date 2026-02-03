using Microsoft.AspNetCore.Mvc;
using ComplaintSystem.Data;
using ComplaintSystem.Models;

namespace ComplaintSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplaintsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComplaintsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateComplaint(Complaint complaint)
        {
            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();
            return Ok(complaint);
        }

        [HttpGet]
        public IActionResult GetComplaints()
        {
            return Ok(_context.Complaints.ToList());
        }
    }
}
