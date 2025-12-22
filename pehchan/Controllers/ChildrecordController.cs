using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using pehchan.CommandModel;
using pehchan.Interface;
using pehchan.Models;
using pehchan.QueryModel;

namespace pehchan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChildrecordController : ControllerBase
    {
        private readonly IChildrecord _service;
        private readonly ILogger<ChildrecordController> _logger;
        private readonly PenchanContext _penchanContext;

        public ChildrecordController(IChildrecord service, ILogger<ChildrecordController> logger , PenchanContext penchanContext)
        {
            _service = service;
            _logger = logger;
            _penchanContext = penchanContext;
        }

        // 1️⃣ Add a new Child Record
        [HttpPost("Add")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Add([FromBody] ChildrecordCommandModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest("Invalid data provided.");

                _service.Add(model);
                return Ok("✅ Child record added successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding child record.");
                return StatusCode(500, "An error occurred while adding the record. Please try again later.");
            }
        }

        // 2️⃣ Delete by RCHID
        [HttpDelete("Delete/{rchid}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult DeleteByRchid(long rchid)
        {
            try
            {
                _service.DeleteByRchid(rchid);
                return Ok($"🗑️ Child record with RCHID {rchid} deleted successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while deleting record with RCHID {rchid}.");
                return StatusCode(500, "An error occurred while deleting the record.");
            }
        } 

        // 3️⃣ Update by RCHID
        [HttpPut("Update/{rchid}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult UpdateByRchid(long rchid, [FromBody] ChildrecordCommandModel model)
        {
            try
            {
                if (model == null)
                    return BadRequest("Invalid data provided.");

                _service.UpdateByRchid(rchid, model);
                return Ok($"✏️ Child record with RCHID {rchid} updated successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while updating record with RCHID {rchid}.");
                return StatusCode(500, "An error occurred while updating the record.");
            }
        }

        // 4️⃣ Get All Records
        [HttpGet("GetAll")]
        [Authorize(Roles = "ADMIN,USER")]
        public ActionResult<List<ChildrecordQueryModel>> GetAll()
        {
            try
            {
                var data = _service.GetAll();
                if (data == null || !data.Any())
                    return NotFound("⚠️ No child records found.");

                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching all child records.");
                return StatusCode(500, "An error occurred while fetching records.");
            }
        }

        // 5️⃣ Get by RCHID
        [HttpGet("GetByRchid/{rchid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public ActionResult<ChildrecordQueryModel> GetByRchid(long rchid)
        {
            try
            {
                var data = _service.GetByRchid(rchid);
                if (data == null)
                    return NotFound($"⚠️ No record found for RCHID {rchid}.");

                return Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while fetching record with RCHID {rchid}.");
                return StatusCode(500, "An error occurred while fetching the record.");
            }
        }
        // 6️⃣ Import Excel with Duplicate Check
        [HttpPost("ImportExcel")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult ImportExcel(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded.");

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                int inserted = 0;
                int skipped = 0;
                List<string> skipDetails = new();

                using (var package = new ExcelPackage(file.OpenReadStream()))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    int rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++) // skip header row
                    {
                        long rchid = long.TryParse(worksheet.Cells[row, 6].Text, out long tempRch) ? tempRch : 0;

                        // 1️⃣ Duplicate check by RCHID
                        bool exists = _penchanContext.Childrecords.Any(x => x.Rchid == rchid);

                        if (exists)
                        {
                            skipped++;
                            skipDetails.Add($"Row {row}: Duplicate RCHID {rchid} — Skipped");
                            continue; // skip this row
                        }

                        // 2️⃣ Build model
                        var model = new ChildrecordCommandModel
                        {
                            Sno = int.TryParse(worksheet.Cells[row, 1].Text, out var sno) ? sno : 0,
                            District = worksheet.Cells[row, 2].Text,
                            HealthBlock = worksheet.Cells[row, 3].Text,
                            HealthSubFacility = worksheet.Cells[row, 4].Text,
                            Village = worksheet.Cells[row, 5].Text,
                            RCHID = rchid,
                            MotherName = worksheet.Cells[row, 7].Text,
                            HusbandName = worksheet.Cells[row, 8].Text,
                            Mobileof = worksheet.Cells[row, 9].Text,
                            MobileNo = worksheet.Cells[row, 10].Text,
                            AgeasperRegistration = decimal.TryParse(worksheet.Cells[row, 11].Text, out var age) ? age : 0,
                            Address = worksheet.Cells[row, 12].Text,
                            Delivery = DateOnly.TryParse(worksheet.Cells[row, 13].Text, out var delivery) ? delivery : null,
                            MaternalDeath = worksheet.Cells[row, 14].Text,
                            DeliveryPlace = worksheet.Cells[row, 15].Text,
                            DeliveryPlaceName = worksheet.Cells[row, 16].Text,
                             
                        };

                        // 3️⃣ Add to DB
                        _service.Add(model);
                        inserted++;
                    }
                }

                // 4️⃣ Return Summary
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
                return StatusCode(500, ex.ToString());
            }
        }
        // 7 update a birthcertificate
        [HttpPut("UpdateBirthCert/{rchid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult UpdateBirthCertificate(long rchid, [FromBody] string birthCertificateId)
        {
            try
            {
                _service.UpdateBirthCertificate(rchid, birthCertificateId);
                return Ok("Birth Certificate Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class UpdateAadhaarModel
        {
            public string LastFourDigits { get; set; }
        }

        // 8 update a adhaarcard
        [HttpPut("UpdateAadhaar/{rchid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult UpdateAadhaar(long rchid, [FromBody] UpdateAadhaarModel model)
        {
            try
            {
                _service.UpdateAadhaarLastFour(rchid, model.LastFourDigits);
                return Ok("Aadhaar updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public class UpdateCasteModel
        {
            public string CasteCertificateNumber { get; set; }
        }

        // 9 update a castecertificate
        [HttpPut("UpdateCasteCert/{rchid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult UpdateCasteCert(long rchid, [FromBody] UpdateCasteModel model)
        {
            try
            {
                _service.UpdateCasteCertificate(rchid, model.CasteCertificateNumber);
                return Ok("Caste Certificate updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 10 fetch by birthcwertificate,adhaarcard
        [HttpGet("GetByBirthCert_AadhaarLast4")]
        [Authorize(Roles = "ADMIN,USER")]
        public ActionResult<ChildrecordQueryModel> GetByBirthCertAadhaarLast4(
     string birthCertificateId,
     string lastFourDigits)
        {
            try
            {
                var result = _service.GetByBirthCert_AadhaarLast4(birthCertificateId, lastFourDigits);

                if (result == null)
                    return NotFound("No record found.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class UpdateRationCardModel
        {
            public string RationCardNumber { get; set; }
        }

        // 11 update a rationcard
        [HttpPut("UpdateRationCard/{rchid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult UpdateRationCard(long rchid, [FromBody] UpdateRationCardModel model)
        {
            try
            {
                _service.UpdateRationCard(rchid, model.RationCardNumber);
                return Ok("Ration Card Number updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public class UpdateAyushmanCardModel
        {
            public string AyushmanCardNumber { get; set; }
        }

        // 12 update a ayushmancard
        [HttpPut("UpdateAyushmanCard/{rchid}")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult UpdateAyushmanCard(long rchid, [FromBody] UpdateAyushmanCardModel model)
        {
            try
            {
                _service.UpdateAyushmanCard(rchid, model.AyushmanCardNumber);
                return Ok("Ayushman Card Number updated successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // 13 fetch by birthcertificate,adhaarcard,rationcard
        [HttpGet("GetByBC_Aadhaar_Ration")]
        [Authorize(Roles = "ADMIN,USER")]
        public ActionResult<ChildrecordQueryModel> GetByBC_Aadhaar_Ration(string birthCertificateId,string lastFourDigits,string rationCardNumber)
        {
            try
            {
                var result = _service.GetByBC_AadhaarLast4_Ration(
                    birthCertificateId,
                    lastFourDigits,
                    rationCardNumber);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // 14 list by not birthcertificate enterd
        [HttpGet("GetByBirthCert/{birthCertificateId}")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetByBirthCert(string birthCertificateId)
        {
            try
            {
                var result = _service.GetByBirthCert(birthCertificateId);

                if (result == null)
                    return NotFound("Record not found.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // 15 list by not birthcertificate enterd
        [HttpGet("GetAllWithBirthCertificate")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithBirthCertificate()
        {
            var data = _service.GetAllWithBirthCertificate();

            if (data == null || data.Count == 0)
                return NotFound("No records found with Birth Certificate ID");

            return Ok(data);
        }
        // 16 list by not birthcertificate enterd
        [HttpGet("GetAllWithoutBirthCertificate")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithoutBirthCertificate()
        {
            var data = _service.GetAllWithoutBirthCertificate();

            if (data == null || data.Count == 0)
                return NotFound("No records found without Birth Certificate ID");

            return Ok(data);
        }
        // 17 count birthcertificate enterd
        [HttpGet("CountBirthCertificateEntered")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult CountBirthCertificateEntered()
        {
            int count = _service.CountBirthCertificateEntered();
            return Ok(count);
        }

        // 18 list by not CasteCertificate enterd
        [HttpGet("GetAllWithCasteCertificate")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithCasteCertificate()
        {
            var data = _service.GetAllWithCasteCertificate();

            if (data == null || data.Count == 0)
                return NotFound("No records found with Birth Certificate ID");

            return Ok(data);
        }
        // 19 list by not CasteCertificate enterd
        [HttpGet("GetAllWithoutCasteCertificate")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithoutCasteCertificate()
        {
            var data = _service.GetAllWithoutCasteCertificate();

            if (data == null || data.Count == 0)
                return NotFound("No records found without Birth Certificate ID");

            return Ok(data);
        }
        // 20 count CasteCertificate enterd
        [HttpGet("CountCasteCertificateEntered")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult CountCasteCertificateEntered()
        {
            int count = _service.CountCasteCertificateEntered();
            return Ok(count);
        }

        // 21 list by not AadharCard enterd
        [HttpGet("GetAllWithAadharCard")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithAadharCard()
        {
            var data = _service.GetAllWithAadharCard();

            if (data == null || data.Count == 0)
                return NotFound("No records found with Birth Certificate ID");

            return Ok(data);
        }
        // 22 list by not AadharCard enterd
        [HttpGet("GetAllWithoutAadharCard")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithoutAadharCard()
        {
            var data = _service.GetAllWithoutAadharCard();

            if (data == null || data.Count == 0)
                return NotFound("No records found without Birth Certificate ID");

            return Ok(data);
        }
        // 23 count AadharCard enterd
        [HttpGet("CountAadharCardEntered")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult CountAadharCardEntered()
        {
            int count = _service.CountAadharCardEntered();
            return Ok(count);
        }

        // 24 list by not RationCard enterd
        [HttpGet("GetAllWithRationCard")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithRationCard()
        {
            var data = _service.GetAllWithRationCard();

            if (data == null || data.Count == 0)
                return NotFound("No records found with Birth Certificate ID");

            return Ok(data);
        }
        // 25 list by not RationCard enterd
        [HttpGet("GetAllWithoutRationCard")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithoutRationCard()
        {
            var data = _service.GetAllWithoutRationCard();

            if (data == null || data.Count == 0)
                return NotFound("No records found without Birth Certificate ID");

            return Ok(data);
        }
        // 26 count RationCard enterd
        [HttpGet("CountRationCardEntered")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult CountRationCardEntered()
        {
            int count = _service.CountRationCardEntered();
            return Ok(count);
        }

        // 27 list by not AyushmanCard enterd
        [HttpGet("GetAllWithAyushmanCard")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithAyushmanCard()
        {
            var data = _service.GetAllWithAyushmanCard();

            if (data == null || data.Count == 0)
                return NotFound("No records found with Birth Certificate ID");

            return Ok(data);
        }
        // 28 list by not AyushmanCard enterd
        [HttpGet("GetAllWithoutAyushmanCard")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult GetAllWithoutAyushmanCard()
        {
            var data = _service.GetAllWithoutAyushmanCard();

            if (data == null || data.Count == 0)
                return NotFound("No records found without Birth Certificate ID");

            return Ok(data);
        }
        // 29 count AyushmanCard enterd
        [HttpGet("CountAyushmanCardEntered")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult CountAyushmanCardEntered()
        {
            int count = _service.CountAyushmanCardEntered();
            return Ok(count);
        }

        // 30 count all record 
        [HttpGet("CountAll")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult CountAll()
        {
            int count = _service.CountAll();
            return Ok(count);
        }


    }
}

