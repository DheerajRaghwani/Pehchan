using pehchan.CommandModel;
using pehchan.Models;
using pehchan.QueryModel;

namespace pehchan.Interface
{
    public interface IMotherschemerecord
    {
        void add(MotherschemerecordCommandModel model);

        // 2️⃣ Delete child record by RCHID
        void DeleteByRchid(long rchid);

        // 3 update child record by RCHID
        void UpdateByRchid(long rchid, MotherschemerecordCommandModel model);

        // 4 getall
        List<MotherschemerecordQueryModel> GetAll();

        // 5️⃣ View specific  motherrecord by RCHID
        MotherschemerecordQueryModel GetByRchid(long rchid);

        // 6️⃣ Import Excel with Duplicate Check -- in controller part written

        // 7 update a MBY
        public bool UpdateMby(long rchid, sbyte? mby, string? remarkMby);

        // 8 update a JSY
        public bool UpdateJsy(long rchid, sbyte? jsy, string? remarkJsy);

        // 9 update a JSSY
        public bool UpdateJssy(long rchid, sbyte? jssy, string? remarkJssy);

        // 10 update a PMMVY
        public bool UpdatePmmvy(long rchid, sbyte? pmmvy, string? remarkPmmvy);

        // 11 update a Mmjy
        public bool UpdateMmjy(long rchid, sbyte? mmjy, string? remarkMmjy);

        // 12 list of yes mby 
        public List<Motherschemerecord> GetMbyYesList();
       
        // 13 list of yes jsy 
        public List<Motherschemerecord> GetJsyYesList();
        
        // 14 list of yes jssy 
        public List<Motherschemerecord> GetJssyYesList();

        // 15 list of yes pmmvy 
        public List<Motherschemerecord> GetPmmvyYesList();

        // 16 list of yes mmjy 
        public List<Motherschemerecord> GetMmjyYesList();

        // 17 list of No mby 
        public List<Motherschemerecord> GetMbyNoList();

        // 18 list of No jsy 
        public List<Motherschemerecord> GetJsyNoList();

        // 19 list of No jssy 
        public List<Motherschemerecord> GetJssyNoList();

        // 20 list of No pmmvy 
        public List<Motherschemerecord> GetPmmvyNoList();

        // 21 list of No mmjy 
        public List<Motherschemerecord> GetMmjyNoList();

        // 22 list of Null mby 
        public List<Motherschemerecord> GetMbyNullList();

        // 23 list of Null jsy 
        public List<Motherschemerecord> GetJsyNullList();

        // 24 list of Null jssy 
        public List<Motherschemerecord> GetJssyNullList();

        // 25 list of Null pmmvy 
        public List<Motherschemerecord> GetPmmvyNullList();

        // 26 list of Null mmjy 
        public List<Motherschemerecord> GetMmjyNullList();

        // 27 count mby
        public int GetMbyYesCount();
        
        // 28 count jsy
        public int GetJsyYesCount();

        // 29 count jssy
        public int GetJssyYesCount();

        // 30 count pmmvy
        public int GetPmmvyYesCount();

        // 31 count mmjy
        public int GetMmjyYesCount();

        // 32 list of all scheme is yes 
        public List<Motherschemerecord> GetAllSchemesYes();

        // 33 count of all scheme is yes
        public int GetAllSchemesYesCount();


        // 34 count all record in table
        public int CountAll();
    }
}
 