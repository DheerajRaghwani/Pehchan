using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using pehchan.CommandModel;
using pehchan.Controllers;
using pehchan.Interface;
using pehchan.Models;

[Route("api/[controller]")]
[ApiController]
public class MotherschemerecordController : ControllerBase
{
    private readonly IMotherschemerecord _service;
    private readonly ILogger<MotherschemerecordController> _logger;
    private readonly PenchanContext _penchanContext;


    public MotherschemerecordController(IMotherschemerecord service, ILogger<MotherschemerecordController> logger, PenchanContext penchanContext)
    {
        _service = service;
        _logger = logger;
        _penchanContext = penchanContext;
    }

    [HttpPost("add")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Add(MotherschemerecordCommandModel model)
    {
        try
        {
            _service.add(model);
            return Ok(new { message = "Record added successfully" });
        }
        catch (Exception ex)
        {
            // Log error here if needed
            return StatusCode(500, new { message = "An error occurred while adding the record", error = ex.Message });
        }
    }

    [HttpDelete("delete/{rchid}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Delete(long rchid)
    {
        try
        {
            _service.DeleteByRchid(rchid);
            return Ok(new { message = "Record deleted successfully" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = $"Record with RCHID {rchid} not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the record", error = ex.Message });
        }
    }

    [HttpPut("update/{rchid}")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult Update(long rchid, MotherschemerecordCommandModel model)
    {
        try
        {
            _service.UpdateByRchid(rchid, model);
            return Ok(new { message = "Record updated successfully" });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = $"Record with RCHID {rchid} not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the record", error = ex.Message });
        }
    }

    [HttpGet("all")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetAll()
    {
        try
        {
            var records = _service.GetAll();
            return Ok(records);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching records", error = ex.Message });
        }
    }

    [HttpGet("GetByRCHID/{rchid}")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetByRchid(long rchid)
    {
        try
        {
            var record = _service.GetByRchid(rchid);
            if (record == null)
                return NotFound(new { message = $"Record with RCHID {rchid} not found" });

            return Ok(record);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while fetching the record", error = ex.Message });
        }
    }
    [HttpPost("ImportExcel")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult ImportExcel(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        int inserted = 0;
        int skipped = 0;
        var skipDetails = new List<string>();
        var insertedRchids = new HashSet<long>(); // Track RCHIDs in current Excel import

        try
        {
            using (var package = new ExcelPackage(file.OpenReadStream()))
            {
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                for (int row = 2; row <= rowCount; row++) // Skip header
                {
                    try
                    {
                        // Parse RCHID
                        long rchid = long.TryParse(worksheet.Cells[row, 7].Text, out long tempRch) ? tempRch : 0;
                        if (rchid == 0)
                        {
                            skipped++;
                            skipDetails.Add($"Row {row}: Invalid or missing RCHID — Skipped");
                            continue;
                        }

                        // Skip if duplicate in DB or in current Excel
                        bool existsInDb = _penchanContext.Motherschemerecords
                                             .AsNoTracking()
                                             .Any(x => x.Rchid == rchid);
                        if (existsInDb || insertedRchids.Contains(rchid))
                        {
                            skipped++;
                            skipDetails.Add($"Row {row}: Duplicate RCHID {rchid} — Skipped");
                            continue;
                        }

                        // Build model
                        var model = new MotherschemerecordCommandModel
                        {
                            Sno = int.TryParse(worksheet.Cells[row, 1].Text, out int snoVal) ? snoVal : 0,
                            District = worksheet.Cells[row, 2].Text,
                            HealthBlock = worksheet.Cells[row, 3].Text,
                            HealthFacility = worksheet.Cells[row, 4].Text,
                            HealthSubFacility = worksheet.Cells[row, 5].Text,
                            Village = worksheet.Cells[row, 6].Text,
                            Rchid = rchid,
                            MotherName = worksheet.Cells[row, 8].Text,
                            HusbandName = worksheet.Cells[row, 9].Text,
                            Mobileof = worksheet.Cells[row, 10].Text,
                            MobileNo = worksheet.Cells[row, 11].Text,
                            AgeAsPerRegistration = decimal.TryParse(worksheet.Cells[row, 12].Text, out var age) ? age : (decimal?)null,
                            MotherBirthDate = DateOnly.TryParse(worksheet.Cells[row, 13].Text, out var dob) ? dob : null,
                            Address = worksheet.Cells[row, 14].Text,
                            Anmname = worksheet.Cells[row, 15].Text,
                            Ashaname = worksheet.Cells[row, 16].Text,
                            RegistrationDate = DateOnly.TryParse(worksheet.Cells[row, 17].Text, out var regDate) ? regDate : null,
                            Lmd = DateOnly.TryParse(worksheet.Cells[row, 18].Text, out var lmd) ? lmd : null,
                            Edd = DateOnly.TryParse(worksheet.Cells[row, 19].Text, out var edd) ? edd : null
                            // Add any other optional fields here
                        };

                        // Save to DB
                        try
                        {
                            _service.add(model); // Your service handles DB saving
                            inserted++;
                            insertedRchids.Add(rchid); // Track inserted RCHID
                        }
                        catch (Exception innerEx)
                        {
                            skipped++;
                            skipDetails.Add($"Row {row}: Failed to save — {innerEx.Message}");
                            _logger.LogError(innerEx, "Error saving row {Row}", row);
                        }
                    }
                    catch (Exception rowEx)
                    {
                        skipped++;
                        skipDetails.Add($"Row {row}: Invalid data — {rowEx.Message}");
                        _logger.LogError(rowEx, "Error parsing row {Row}", row);
                    }
                }
            }

            // Return import summary
            return Ok(new
            {
                Message = "Import Completed",
                Inserted = inserted,
                Skipped = skipped,
                SkipDetails = skipDetails
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while importing Excel");
            return StatusCode(500, new { message = "Error importing Excel file", error = ex.Message });
        }
    }

    // 7 update a MBY
    [HttpPut("update-mby/{rchid}")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult UpdateMby(long rchid, [FromBody] MotherschemerecordCommandModel dto)
    {
        try
        {
            _service.UpdateMby(rchid, dto.Mby, dto.RemarkMby);
            return Ok(new { message = "MBY updated successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    //  8 update a JSY
    [HttpPut("update-jsy/{rchid}")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult UpdateJsy(long rchid, [FromBody] MotherschemerecordCommandModel dto)
    {
        try
        {
            _service.UpdateJsy(rchid, dto.Jsy, dto.RemarkJsy);
            return Ok(new { message = "Jsy updated successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    // 9 update a JSSY
    [HttpPut("update-jssy/{rchid}")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult UpdateJssy(long rchid, [FromBody] MotherschemerecordCommandModel dto)
    {
        try
        {
            _service.UpdateJssy(rchid, dto.Jssy, dto.RemarkJssy);
            return Ok(new { message = "Jssy updated successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    // 10 update a PMMVY
    [HttpPut("update-pmmvy/{rchid}")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult UpdatePmmvy(long rchid, [FromBody] MotherschemerecordCommandModel dto)
    {
        try
        {
            _service.UpdatePmmvy(rchid, dto.Pmmvy, dto.RemarkPmmvy);
            return Ok(new { message = "Pmmvy updated successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
    // 11 update a MmjY
    [HttpPut("update-mmjy/{rchid}")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult UpdateMmjy(long rchid, [FromBody] MotherschemerecordCommandModel dto)
    {
        try
        {
            _service.UpdateMmjy(rchid, dto.Mmjy, dto.RemarkMmjy);
            return Ok(new { message = "Mmjy updated successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    // 12 list of yes mby 
     
    [HttpGet("mby/yes")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMbyYes()
    {
        var list = _service.GetMbyYesList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 13 list of yes jsy 

    [HttpGet("jsy/yes")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJsyYes()
    {
        var list = _service.GetJsyYesList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 14 list of yes jssy 

    [HttpGet("jssy/yes")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJssyYes()
    {
        var list = _service.GetJssyYesList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 15 list of yes pmmvy 

    [HttpGet("pmmvy/yes")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetPmmvyYes()
    {
        var list = _service.GetPmmvyYesList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 16 list of yes mmjy 

    [HttpGet("mmjy/yes")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMmjyYes()
    {
        var list = _service.GetMmjyYesList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }

    // 17 list of No mby 

    [HttpGet("mby/No")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMbyNo()
    {
        var list = _service.GetMbyNoList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 18 list of No jsy 

    [HttpGet("jsy/No")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJsyNo()
    {
        var list = _service.GetJsyNoList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 19 list of yes jssy 

    [HttpGet("jssy/No")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJssyNo()
    {
        var list = _service.GetJssyNoList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 20 list of No pmmvy 

    [HttpGet("pmmvy/No")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetPmmvyNo()
    {
        var list = _service.GetPmmvyNoList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 21 list of No mmjy 

    [HttpGet("mmjy/No")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMmjyNo()
    {
        var list = _service.GetMmjyNoList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 22 list of No mby 

    [HttpGet("mby/Null")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMbyNull()
    {
        var list = _service.GetMbyNullList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 23 list of No jsy 

    [HttpGet("jsy/Null")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJsyNull()
    {
        var list = _service.GetJsyNullList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 24 list of Null jssy 

    [HttpGet("jssy/Null")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJssyNull()
    {
        var list = _service.GetJssyNullList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 25 list of Null pmmvy 

    [HttpGet("pmmvy/Null")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetPmmvyNull()
    {
        var list = _service.GetPmmvyNullList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }
    // 26 list of Null mmjy 

    [HttpGet("mmjy/Null")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMmjyNull()
    {
        var list = _service.GetMmjyNullList();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }

    // 27 count mby
    [HttpGet("mby/yes/count")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMbyYesCount()
    {
        var count = _service.GetMbyYesCount();
        return Ok(new {count });
    }
    
    // 28 count jsy
    [HttpGet("jsy/yes/count")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJsyYesCount()
    {
        var count = _service.GetJsyYesCount();
        return Ok(new { count });
        
    }

    // 29 count jssy
    [HttpGet("jssy/yes/count")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJssyYesCount()
    {
        var count = _service.GetJssyYesCount();
        return Ok(new { count });
         
    }

    // 30 count pmmvy
    [HttpGet("pmmvy/yes/count")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetJsyPmmvyCount()
    {
        var count = _service.GetPmmvyYesCount();
        return Ok(new { count });
         
    }

    // 31 count mmjy
    [HttpGet("mmjy/yes/count")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetMmjyYesCount()
    {
        var count = _service.GetMmjyYesCount();
        return Ok(new { count });
        
    }

    // 32 list of all scheme is yes
    [HttpGet("schemes/all-yes")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetAllSchemesYes()
    {
        var list = _service.GetAllSchemesYes();

        if (list == null || list.Count == 0)
            return Ok(new List<Motherschemerecord>());

        return Ok(list);
    }

    // 33 count of all scheme is yes
     
    [HttpGet("schemes/all-yes/count")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult GetAllSchemesYesCount()
    {
        var count = _service.GetAllSchemesYesCount();
        return Ok(new { allSchemesYesCount = count });
    }

    // 34 count all record in table
    [HttpGet("CountAll")]
    [Authorize(Roles = "ADMIN,USER")]
    public IActionResult CountAll()
    {
        int count = _service.CountAll();
        return Ok(count);
    }

}
