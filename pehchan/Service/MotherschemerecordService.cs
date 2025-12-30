using pehchan.CommandModel;
using pehchan.Interface;
using pehchan.Models;
using pehchan.QueryModel;

namespace pehchan.Service
{
    public class MotherschemerecordService : IMotherschemerecord
{
    private readonly PenchanContext _context;

    public MotherschemerecordService(PenchanContext context)
    {
        _context = context;
    }

    public void add(MotherschemerecordCommandModel model)
    {

        int nextSno = _context.Motherschemerecords.Any()
         ? _context.Motherschemerecords.Max(x => x.Sno) + 1
    : 1;
        var entity = new Motherschemerecord
        {

            Sno = nextSno, // ✅ Auto-set Sno here
            District = model.District,
            HealthBlock = model.HealthBlock,
            HealthFacility = model.HealthFacility,
            HealthSubFacility = model.HealthSubFacility,
            Village = model.Village,
            Rchid = model.Rchid,
            MotherName = model.MotherName,
            HusbandName = model.HusbandName,
            Mobileof = model.Mobileof,
            MobileNo = model.MobileNo,
            AgeAsPerRegistration = model.AgeAsPerRegistration,
            MotherBirthDate = model.MotherBirthDate,
            Address = model.Address,
            Anmname = model.Anmname,
            Ashaname = model.Ashaname,
            RegistrationDate = model.RegistrationDate,
            Lmd = model.Lmd,
            Edd = model.Edd,
        };

        _context.Motherschemerecords.Add(entity);
        _context.SaveChanges();
    }

    public void DeleteByRchid(long rchid)
    {
        var entity = _context.Motherschemerecords.FirstOrDefault(x => x.Rchid == rchid);
        if (entity != null)
        {
            _context.Motherschemerecords.Remove(entity);
            _context.SaveChanges();
        }
    }

    public void UpdateByRchid(long rchid, MotherschemerecordCommandModel model)
    {
        var entity = _context.Motherschemerecords.FirstOrDefault(x => x.Rchid == rchid);
        if (entity != null)
        {
            entity.District = model.District;
            entity.HealthBlock = model.HealthBlock;
            entity.HealthFacility = model.HealthFacility;
            entity.HealthSubFacility = model.HealthSubFacility;
            entity.Village = model.Village;
            entity.MotherName = model.MotherName;
            entity.HusbandName = model.HusbandName;
            entity.Mobileof = model.Mobileof;
            entity.MobileNo = model.MobileNo;
            entity.AgeAsPerRegistration = model.AgeAsPerRegistration;
            entity.MotherBirthDate = model.MotherBirthDate;
            entity.Address = model.Address;
            entity.Anmname = model.Anmname;
            entity.Ashaname = model.Ashaname;
            entity.RegistrationDate = model.RegistrationDate;
            entity.Lmd = model.Lmd;
            entity.Edd = model.Edd;

            _context.SaveChanges();
        }
    }

    public List<MotherschemerecordQueryModel> GetAll()
    {
        return _context.Motherschemerecords
            .Select(x => new MotherschemerecordQueryModel
            {
                Sno = x.Sno,
                District = x.District,
                HealthBlock = x.HealthBlock,
                HealthFacility = x.HealthFacility,
                HealthSubFacility = x.HealthSubFacility,
                Village = x.Village,
                Rchid = x.Rchid,
                MotherName = x.MotherName,
                HusbandName = x.HusbandName,
                Mobileof = x.Mobileof,
                MobileNo = x.MobileNo,
                AgeAsPerRegistration = x.AgeAsPerRegistration,
                MotherBirthDate = x.MotherBirthDate,
                Address = x.Address,
                Anmname = x.Anmname,
                Ashaname = x.Ashaname,
                RegistrationDate = x.RegistrationDate,
                Lmd = x.Lmd,
                Edd = x.Edd,
                Mby = x.Mby,
                RemarkMby = x.RemarkMby,
                Jsy = x.Jsy,
                RemarkJsy = x.RemarkJsy,
                Jssy = x.Jssy,
                RemarkJssy = x.RemarkJssy,
                Pmmvy = x.Pmmvy,
                RemarkPmmvy = x.RemarkPmmvy,
                Mmjy=x.Mmjy,
                RemarkMmjy=x.RemarkMmjy
            }).ToList();
    }

    public MotherschemerecordQueryModel GetByRchid(long rchid)
    {
        var x = _context.Motherschemerecords.FirstOrDefault(x => x.Rchid == rchid);
        if (x == null) return null!;
        return new MotherschemerecordQueryModel
        {
            Sno = x.Sno,
            District = x.District,
            HealthBlock = x.HealthBlock,
            HealthFacility = x.HealthFacility,
            HealthSubFacility = x.HealthSubFacility,
            Village = x.Village,
            Rchid = x.Rchid,
            MotherName = x.MotherName,
            HusbandName = x.HusbandName,
            Mobileof = x.Mobileof,
            MobileNo = x.MobileNo,
            AgeAsPerRegistration = x.AgeAsPerRegistration,
            MotherBirthDate = x.MotherBirthDate,
            Address = x.Address,
            Anmname = x.Anmname,
            Ashaname = x.Ashaname,
            RegistrationDate = x.RegistrationDate,
            Lmd = x.Lmd,
            Edd = x.Edd,
            Mby = x.Mby,
            RemarkMby = x.RemarkMby,
            Jsy = x.Jsy,
            RemarkJsy = x.RemarkJsy,
            Jssy = x.Jssy,
            RemarkJssy = x.RemarkJssy,
            Pmmvy = x.Pmmvy,
            RemarkPmmvy = x.RemarkPmmvy,
            Mmjy = x.Mmjy,
            RemarkMmjy = x.RemarkMmjy
        };
    }
    // 7 update a MBY
    public bool UpdateMby(long rchid, sbyte? mby, string? remarkMby)
    {
        var record = _context.Motherschemerecords
                             .FirstOrDefault(x => x.Rchid == rchid);

        // Record not found
        if (record == null)
            return false;

        // Invalid value protection
        if (mby != null && mby != 0 && mby != 1)
            return false;

        record.Mby = mby;
        record.RemarkMby = remarkMby;

        _context.SaveChanges();
        return true;
    }
    // 8 update a JSY
    public bool UpdateJsy(long rchid, sbyte? jsy, string? remarkJsy)
    {
        var record = _context.Motherschemerecords
                             .FirstOrDefault(x => x.Rchid == rchid);

        // Record not found
        if (record == null)
            return false;

        // Invalid value protection
        if (jsy != null && jsy != 0 && jsy != 1)
            return false;

        record.Jsy = jsy;
        record.RemarkJsy = remarkJsy;

        _context.SaveChanges();
        return true;
    }

    // 9 update a JSSY
    public bool UpdateJssy(long rchid, sbyte? jssy, string? remarkJssy)
    {
        var record = _context.Motherschemerecords
                             .FirstOrDefault(x => x.Rchid == rchid);

        // Record not found
        if (record == null)
            return false;

        // Invalid value protection
        if (jssy != null && jssy != 0 && jssy != 1)
            return false;

        record.Jssy = jssy;
        record.RemarkJssy = remarkJssy;

        _context.SaveChanges();
        return true;
    }

    // 10 update a PMMVY
    public bool UpdatePmmvy(long rchid, sbyte? pmmvy, string? remarkPmmvy)
    {
        var record = _context.Motherschemerecords
                             .FirstOrDefault(x => x.Rchid == rchid);

        // Record not found
        if (record == null)
            return false;

        // Invalid value protection
        if (pmmvy != null && pmmvy != 0 && pmmvy != 1)
            return false;

        record.Pmmvy = pmmvy;
        record.RemarkPmmvy = remarkPmmvy;

        _context.SaveChanges();
        return true;
    }
    // 11 update a Mmjy
    public bool UpdateMmjy(long rchid, sbyte? mmjy, string? remarkMmjy)
    {
        var record = _context.Motherschemerecords
                             .FirstOrDefault(x => x.Rchid == rchid);

        // Record not found
        if (record == null)
            return false;

        // Invalid value protection
        if (mmjy != null && mmjy != 0 && mmjy != 1)
            return false;

        record.Mmjy = mmjy;
        record.RemarkMmjy = remarkMmjy;

        _context.SaveChanges();
        return true;
    }
    // 12 list of yes mby 
     
    public List<Motherschemerecord> GetMbyYesList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mby == 1)
                       .ToList();
    }
    // 13 list of yes jsy 

    public List<Motherschemerecord> GetJsyYesList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Jsy == 1)
                       .ToList();
    } 
    // 14 list of yes jssy 

    public List<Motherschemerecord> GetJssyYesList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Jssy == 1)
                       .ToList();
    } // 15 list of yes pmmvy 

    public List<Motherschemerecord> GetPmmvyYesList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Pmmvy == 1)
                       .ToList();
    } 
    // 16 list of yes mmjy 

    public List<Motherschemerecord> GetMmjyYesList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mmjy == 1)
                       .ToList();
    }
    // 17 list of No mby 

    public List<Motherschemerecord> GetMbyNoList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mby == 0)
                       .ToList();
    }
    // 18 list of No jsy 

    public List<Motherschemerecord> GetJsyNoList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Jsy == 0)
                       .ToList();
    }
    // 19 list of No jssy 

    public List<Motherschemerecord> GetJssyNoList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Jssy == 0)
                       .ToList();
    } // 20 list of No pmmvy 

    public List<Motherschemerecord> GetPmmvyNoList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Pmmvy == 0)
                       .ToList();
    }
    // 21 list of No mmjy 

    public List<Motherschemerecord> GetMmjyNoList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mmjy == 0)
                       .ToList();
    }
    // 22 list of Null mby 

    public List<Motherschemerecord> GetMbyNullList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mby == null)
                       .ToList();
    }
    // 23 list of Null jsy 

    public List<Motherschemerecord> GetJsyNullList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Jsy == null)
                       .ToList();
    }
    // 24 list of Null jssy 

    public List<Motherschemerecord> GetJssyNullList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Jssy == null)
                       .ToList();
    } // 25 list of Null pmmvy 

    public List<Motherschemerecord> GetPmmvyNullList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Pmmvy == null)
                       .ToList();
    }
    // 26 list of Null mmjy 

    public List<Motherschemerecord> GetMmjyNullList()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mmjy == null)
                       .ToList();
    }

    // 27 count mby
    public int GetMbyYesCount()
    {
        return _context.Motherschemerecords
                       .Count(x => x.Mby == 1);
    }
    // 28 count jsy
    public int GetJsyYesCount()
    {
        return _context.Motherschemerecords
                       .Count(x => x.Jsy == 1);
    }
    // 29 count jssy
    public int GetJssyYesCount()
    {
        return _context.Motherschemerecords
                       .Count(x => x.Jssy == 1);
    }
    // 30 count pmmvy
    public int GetPmmvyYesCount()
    {
        return _context.Motherschemerecords
                       .Count(x => x.Pmmvy == 1);
    }
    // 31 count mmjy
    public int GetMmjyYesCount()
    {
        return _context.Motherschemerecords
                       .Count(x => x.Mmjy == 1);
    }

    // 32 list of all scheme is yes
    public List<Motherschemerecord> GetAllSchemesYes()
    {
        return _context.Motherschemerecords
                       .Where(x => x.Mby == 1
                                && x.Jsy == 1
                                && x.Jssy == 1
                                && x.Pmmvy == 1
                                && x.Mmjy == 1)
                       .ToList();
    }

    // 33 count of all scheme is yes
    public int GetAllSchemesYesCount()
    {
        return _context.Motherschemerecords
                       .Count(x => x.Mby == 1
                                && x.Jsy == 1
                                && x.Jssy == 1
                                && x.Pmmvy == 1
                                && x.Mmjy == 1);
    }

    // 34 count all record in table
    public int CountAll()
    {
        return _context.Motherschemerecords.Count();
    }
}
}
