using pehchan.CommandModel;
using pehchan.Interface;
using pehchan.Models;
using pehchan.QueryModel;

namespace pehchan.Service
{
    public class ChildrecordService:IChildrecord
    {
        private readonly PenchanContext _context;

        public ChildrecordService(PenchanContext context)
        {
            _context = context;
        }

        // 1️⃣ Add new Child Record
        public void Add(ChildrecordCommandModel model)
        {
            int nextSno = _context.Childrecords.Any()
             ? _context.Childrecords.Max(x => x.Sno) + 1
        :    1;
            var data = new Childrecord
            {
                Sno = nextSno, // ✅ Auto-set Sno here
                District = model.District,
                HealthBlock = model.HealthBlock,
                HealthSubfacility = model.HealthSubFacility,
                Village = model.Village,
                Rchid = model.RCHID,
                MotherName = model.MotherName,
                HusbandName = model.HusbandName,
                Mobileof = model.Mobileof,
                MobileNo = model.MobileNo,
                AgeasperRegistration = model.AgeasperRegistration,
                Address = model.Address,
                Delivery = model.Delivery,
                MaternalDeath = model.MaternalDeath,
                DeliveryPlace = model.DeliveryPlace,
                DeliveryPlaceName = model.DeliveryPlaceName,
                
            };
            _context.Childrecords.Add(data);
            _context.SaveChanges();
        }

        // 2️⃣ Delete Child Record by RCHID
        public void DeleteByRchid(long rchid)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);
            if (data != null)
            {
                _context.Childrecords.Remove(data);
                _context.SaveChanges();
            }
        }

        // 3️⃣ Update Child Record by RCHID
        public void UpdateByRchid(long rchid, ChildrecordCommandModel model)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);
            if (data != null)
            {
                data.District = model.District;
                data.HealthBlock = model.HealthBlock;
                data.HealthSubfacility = model.HealthSubFacility;
                data.Village = model.Village;
                data.MotherName = model.MotherName;
                data.HusbandName = model.HusbandName;
                data.Mobileof = model.Mobileof;
                data.MobileNo = model.MobileNo;
                data.AgeasperRegistration = model.AgeasperRegistration;
                data.Address = model.Address;
                data.Delivery = model.Delivery;
                data.MaternalDeath = model.MaternalDeath;
                data.DeliveryPlace = model.DeliveryPlace;
                data.DeliveryPlaceName = model.DeliveryPlaceName;
                 
                 

                _context.SaveChanges();
            }
        }

        // 4️⃣ View All Child Records
        public List<ChildrecordQueryModel> GetAll()
        {
            return _context.Childrecords
                .Select(x => new ChildrecordQueryModel
                {
                    Sno = x.Sno,
                    District = x.District,
                    HealthBlock = x.HealthBlock,
                    HealthSubfacility = x.HealthSubfacility,
                    Village = x.Village,
                    Rchid = x.Rchid,
                    MotherName = x.MotherName,
                    HusbandName = x.HusbandName,
                    Mobileof = x.Mobileof,
                    MobileNo = x.MobileNo,
                    AgeasperRegistration = x.AgeasperRegistration,
                    Address = x.Address,
                    Delivery = x.Delivery,
                    MaternalDeath = x.MaternalDeath,
                    DeliveryPlace = x.DeliveryPlace,
                    DeliveryPlaceName = x.DeliveryPlaceName,
                    
                    BirthCertificateId = x.BirthCertificateId,
                    AadhaarCardNumber = x.AadhaarCardNumber,
                    RationCardNumber = x.RationCardNumber,
                    CasteCertificateNumber = x.CasteCertificateNumber,
                    AyushmanCardNumber = x.AyushmanCardNumber
                })
                .ToList();
        }

        // 5️⃣ View by RCHID
        public ChildrecordQueryModel GetByRchid(long rchid)
        {
            var x = _context.Childrecords.FirstOrDefault(c => c.Rchid == rchid);
            if (x == null) return null;

            return new ChildrecordQueryModel
            {
                Sno = x.Sno,
                District = x.District,
                HealthBlock = x.HealthBlock,
                HealthSubfacility = x.HealthSubfacility,
                Village = x.Village,
                Rchid = x.Rchid,
                MotherName = x.MotherName,
                HusbandName = x.HusbandName,
                Mobileof = x.Mobileof,
                MobileNo = x.MobileNo,
                AgeasperRegistration = x.AgeasperRegistration,
                Address = x.Address,
                Delivery = x.Delivery,
                MaternalDeath = x.MaternalDeath,
                DeliveryPlace = x.DeliveryPlace,
                DeliveryPlaceName = x.DeliveryPlaceName,
                 
                BirthCertificateId = x.BirthCertificateId,
                AadhaarCardNumber = x.AadhaarCardNumber,
                RationCardNumber = x.RationCardNumber,
                CasteCertificateNumber = x.CasteCertificateNumber,
                AyushmanCardNumber = x.AyushmanCardNumber
            };
        }
        // 6️⃣ Import Excel with Duplicate Check -- in controller part written 
        // 7 update a birthcertificate
        public void UpdateBirthCertificate(long rchid, string birthCertificateId)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);

            if (data == null)
                throw new Exception("Record not found for given RCHID");

            data.BirthCertificateId = birthCertificateId;

            _context.SaveChanges();
        }
        // 8 update a adhaarcard
        public void UpdateAadhaarLastFour(long rchid, string lastFourDigits)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);

            if (data == null)
                throw new Exception("Record not found for given RCHID");

            // 1️⃣ If Birth Certificate is empty → STOP Aadhaar update
            if (string.IsNullOrWhiteSpace(data.BirthCertificateId))
            {
                throw new Exception("Write BirthCertificateId first.");
            }

            // 2️⃣ Update Aadhaar last 4 digits
            data.AadhaarCardNumber = lastFourDigits;

            _context.SaveChanges();
        }
        // 9 update a castecertificate
        public void UpdateCasteCertificate(long rchid, string casteCertificateNumber)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);

            if (data == null)
                throw new Exception("Record not found for given RCHID");

            // 1️⃣ Check Birth Certificate
            if (string.IsNullOrWhiteSpace(data.BirthCertificateId))
            {
                throw new Exception("Write BirthCertificateId first.");
            }

            // 2️⃣ Update Caste Certificate Number
            data.CasteCertificateNumber = casteCertificateNumber;

            _context.SaveChanges();
        }
        // 10 fetch by birthcwertificate,adhaarcard
        public ChildrecordQueryModel GetByBirthCert_AadhaarLast4(string birthCertificateId, string lastFourDigits)
        {
            if (string.IsNullOrWhiteSpace(birthCertificateId))
                throw new Exception("Birth Certificate ID is required.");

            if (string.IsNullOrWhiteSpace(lastFourDigits))
                throw new Exception("Last four digits of Aadhaar are required.");

            var x = _context.Childrecords.FirstOrDefault(c =>
                c.BirthCertificateId == birthCertificateId &&
                c.AadhaarCardNumber != null &&
                c.AadhaarCardNumber.Replace(" ", "").EndsWith(lastFourDigits)
            );

            if (x == null)
                throw new Exception("No record found for given details.");

            return new ChildrecordQueryModel
            {
                Sno = x.Sno,
                District = x.District,
                HealthBlock = x.HealthBlock,
                HealthSubfacility = x.HealthSubfacility,
                Village = x.Village,
                Rchid = x.Rchid,
                MotherName = x.MotherName,
                HusbandName = x.HusbandName,
                Mobileof = x.Mobileof,
                MobileNo = x.MobileNo,
                AgeasperRegistration = x.AgeasperRegistration,
                Address = x.Address,
                Delivery = x.Delivery,
                MaternalDeath = x.MaternalDeath,
                DeliveryPlace = x.DeliveryPlace,
                DeliveryPlaceName = x.DeliveryPlaceName,
                
                BirthCertificateId = x.BirthCertificateId,
                AadhaarCardNumber = x.AadhaarCardNumber,
                RationCardNumber = x.RationCardNumber,
                CasteCertificateNumber = x.CasteCertificateNumber,
                AyushmanCardNumber = x.AyushmanCardNumber
            };
        }
        // 11 update a rationcard
        public void UpdateRationCard(long rchid, string rationCardNumber)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);

            if (data == null)
                throw new Exception("Record not found for given RCHID");

            // 1️⃣ Check Birth Certificate
            if (string.IsNullOrWhiteSpace(data.BirthCertificateId))
                throw new Exception("Write BirthCertificateId first.");

            // 2️⃣ Check Aadhaar Number
            if (string.IsNullOrWhiteSpace(data.AadhaarCardNumber))
                throw new Exception("Write AadhaarCardNumber first.");

            // 3️⃣ Update Ration Card Number
            data.RationCardNumber = rationCardNumber;

            _context.SaveChanges();
        }

        // 12 update a ayushmancard
        public void UpdateAyushmanCard(long rchid, string ayushmanCardNumber)
        {
            var data = _context.Childrecords.FirstOrDefault(x => x.Rchid == rchid);

            if (data == null)
                throw new Exception("Record not found for given RCHID");

            // 1️⃣ Check Birth Certificate
            if (string.IsNullOrWhiteSpace(data.BirthCertificateId))
                throw new Exception("Write BirthCertificateId first.");

            // 2️⃣ Check Aadhaar Number
            if (string.IsNullOrWhiteSpace(data.AadhaarCardNumber))
                throw new Exception("Write AadhaarCardNumber first.");

            // 3️⃣ Check Ration Card
            if (string.IsNullOrWhiteSpace(data.RationCardNumber))
                throw new Exception("Write RationCardNumber first.");

            // 4️⃣ Update Ayushman Card
            data.AyushmanCardNumber = ayushmanCardNumber;

            _context.SaveChanges();
        }

        // 13 fetch by birthcertificate,adhaarcard,rationcard
        public ChildrecordQueryModel GetByBC_AadhaarLast4_Ration( string birthCertificateId, string lastFourDigits,string rationCardNumber)
        {
            if (string.IsNullOrWhiteSpace(birthCertificateId))
                throw new Exception("Please enter Birth Certificate ID.");

            if (string.IsNullOrWhiteSpace(lastFourDigits))
                throw new Exception("Please enter last 4 digits of Aadhaar.");

            if (string.IsNullOrWhiteSpace(rationCardNumber))
                throw new Exception("Please enter Ration Card Number.");

            var data = _context.Childrecords.FirstOrDefault(x =>
                x.BirthCertificateId == birthCertificateId &&
                x.RationCardNumber == rationCardNumber &&
                x.AadhaarCardNumber != null &&
                x.AadhaarCardNumber.Replace(" ", "").EndsWith(lastFourDigits)
            );

            if (data == null)
                throw new Exception("No record found with the given details.");

            return new ChildrecordQueryModel
            {
                Sno = data.Sno,
                District = data.District,
                HealthBlock = data.HealthBlock,
                HealthSubfacility = data.HealthSubfacility,
                Village = data.Village,
                Rchid = data.Rchid,
                MotherName = data.MotherName,
                HusbandName = data.HusbandName,
                Mobileof = data.Mobileof,
                MobileNo = data.MobileNo,
                AgeasperRegistration = data.AgeasperRegistration,
                Address = data.Address,
                Delivery = data.Delivery,
                MaternalDeath = data.MaternalDeath,
                DeliveryPlace = data.DeliveryPlace,
                DeliveryPlaceName = data.DeliveryPlaceName,
                 
                BirthCertificateId = data.BirthCertificateId,
                AadhaarCardNumber = data.AadhaarCardNumber,
                RationCardNumber = data.RationCardNumber,
                CasteCertificateNumber = data.CasteCertificateNumber,
                AyushmanCardNumber = data.AyushmanCardNumber
            };
        }
        // 14 fetch by birthcertificate 
        public ChildrecordQueryModel GetByBirthCert(string birthCertificateId)
        {
            return _context.Childrecords
                .Where(x => x.BirthCertificateId == birthCertificateId)
                .Select(x => new ChildrecordQueryModel
                {
                    Sno = x.Sno,
                    District = x.District,
                    HealthBlock = x.HealthBlock,
                    HealthSubfacility = x.HealthSubfacility,
                    Village = x.Village,
                    Rchid = x.Rchid,
                    MotherName = x.MotherName,  
                    HusbandName = x.HusbandName,
                    Mobileof = x.Mobileof,
                    MobileNo = x.MobileNo,
                    AgeasperRegistration = x.AgeasperRegistration,
                    Address = x.Address,
                    Delivery = x.Delivery,
                    MaternalDeath = x.MaternalDeath,
                    DeliveryPlace = x.DeliveryPlace,
                    DeliveryPlaceName = x.DeliveryPlaceName,

                    BirthCertificateId = x.BirthCertificateId,
                    AadhaarCardNumber = x.AadhaarCardNumber,
                    RationCardNumber = x.RationCardNumber,
                    CasteCertificateNumber = x.CasteCertificateNumber,
                    AyushmanCardNumber = x.AyushmanCardNumber
                })
                .FirstOrDefault();
        }
        // 15 list of birthcertificate entered
        public List<Childrecord> GetAllWithBirthCertificate()
        {
            return _context.Childrecords
                .Where(x => !string.IsNullOrEmpty(x.BirthCertificateId))
                .ToList();

        }

        // 16 list by not birthcertificate enterd
        public List<Childrecord> GetAllWithoutBirthCertificate()
        {
            return _context.Childrecords
                .Where(x => string.IsNullOrEmpty(x.BirthCertificateId))
                .ToList();
        }
        // 17 count birthcertificate enterd
        public int CountBirthCertificateEntered()
        {
            return _context.Childrecords
                .Count(x => !string.IsNullOrEmpty(x.BirthCertificateId));
        }

        // 18 list by castecertificate enterd
        public List<Childrecord> GetAllWithCasteCertificate()
        {
            return _context.Childrecords
                .Where(x => !string.IsNullOrEmpty(x.CasteCertificateNumber))
                .ToList();

        }

        // 19 list by not castecertificate enterd
        public List<Childrecord> GetAllWithoutCasteCertificate()
        {
            return _context.Childrecords
                .Where(x => string.IsNullOrEmpty(x.CasteCertificateNumber))
                .ToList();
        }

        // 20 count castecertificate enterd
        public int CountCasteCertificateEntered()
        {
            return _context.Childrecords
                .Count(x => !string.IsNullOrEmpty(x.CasteCertificateNumber));
        }

        // 21 list by Aadharcard enterd
        public List<Childrecord> GetAllWithAadharCard()
        {
            return _context.Childrecords
                .Where(x => !string.IsNullOrEmpty(x.AadhaarCardNumber))
                .ToList();

        }

        // 22 list by not Aadharcard enterd
        public List<Childrecord> GetAllWithoutAadharCard()
        {
            return _context.Childrecords
                .Where(x => string.IsNullOrEmpty(x.AadhaarCardNumber))
                .ToList();
        }

        // 23 count Aadharcard enterd
        public int CountAadharCardEntered()
        {
            return _context.Childrecords
                .Count(x => !string.IsNullOrEmpty(x.AadhaarCardNumber));
        }

        // 24 list by RationCard enterd
        public List<Childrecord> GetAllWithRationCard()
        {
            return _context.Childrecords
                .Where(x => !string.IsNullOrEmpty(x.RationCardNumber))
                .ToList();

        }

        // 25 list by not RationCard enterd
        public List<Childrecord> GetAllWithoutRationCard()
        {
            return _context.Childrecords
                .Where(x => string.IsNullOrEmpty(x.RationCardNumber))
                .ToList();
        }

        // 26 count RationCard enterd
        public int CountRationCardEntered()
        {
            return _context.Childrecords
                .Count(x => !string.IsNullOrEmpty(x.RationCardNumber));
        }

        // 27 list by AyushmanCard enterd
        public List<Childrecord> GetAllWithAyushmanCard()
        {
            return _context.Childrecords
                .Where(x => !string.IsNullOrEmpty(x.AyushmanCardNumber))
                .ToList();

        }

        // 28 list by not AyushmanCard enterd
        public List<Childrecord> GetAllWithoutAyushmanCard()
        {
            return _context.Childrecords
                .Where(x => string.IsNullOrEmpty(x.AyushmanCardNumber))
                .ToList();
        }

        // 29 count AyushmanCard enterd
        public int CountAyushmanCardEntered()
        {
            return _context.Childrecords
                .Count(x => !string.IsNullOrEmpty(x.AyushmanCardNumber));
        }

        // 30 count all record 
        public int CountAll()
        {
            return _context.Childrecords.Count();
        }
    }
}
