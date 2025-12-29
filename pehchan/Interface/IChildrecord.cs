using pehchan.CommandModel;
using pehchan.Models;
using pehchan.QueryModel;

namespace pehchan.Interface
{
    public interface IChildrecord
    {
        void Add(ChildrecordCommandModel model);

        // 2️⃣ Delete child record by RCHID
        void DeleteByRchid(long rchid);

        // 3️⃣ Update child record by RCHID
        void UpdateByRchid(long rchid, ChildrecordCommandModel model);

        // 4️⃣ View all child records
        List<ChildrecordQueryModel> GetAll();

        // 5️⃣ View specific child record by RCHID
        ChildrecordQueryModel GetByRchid(long rchid);

        // 7 update a birthcertificate
        public void UpdateBirthCertificate(long rchid, string birthCertificateId);

        // 8 update a adhaarcard
        public void UpdateAadhaarLastFour(long rchid, string lastFourDigits);

        // 9 update a castecertificate
        public void UpdateCasteCertificate(long rchid, string casteCertificateNumber);

        // 10 fetch by birthcwertificate,adhaarcard
        public ChildrecordQueryModel GetByBirthCert_AadhaarLast4(string birthCertificateId, string lastFourDigits);

        // 11 update a rationcard
        public void UpdateRationCard(long rchid, string rationCardNumber);

        // 12 update a ayushmancard
        public void UpdateAyushmanCard(long rchid, string ayushmanCardNumber);

        // 13 fetch by birthcertificate,adhaarcard,rationcard
        public ChildrecordQueryModel GetByBC_AadhaarLast4_Ration(string birthCertificateId, string lastFourDigits, string rationCardNumber);

        // 14 fetch by birthcertificate 
        public ChildrecordQueryModel GetByBirthCert(string birthCertificateId);

        // 15 list by birthcertificate enterd
        List<Childrecord> GetAllWithBirthCertificate();
        // 16 list by not birthcertificate enterd
        List<Childrecord> GetAllWithoutBirthCertificate();

        // 17 count birthcertificate enterd
        int CountBirthCertificateEntered();

        // 18 list by castecertificate enterd
        List<Childrecord> GetAllWithCasteCertificate();

        // 19 list by not castecertificate enterd
        List<Childrecord> GetAllWithoutCasteCertificate();

        // 20 count castecertificate enterd
        public int CountCasteCertificateEntered();

        // 21 list by aadharcard enterd
        List<Childrecord> GetAllWithAadharCard();

        // 22 list by not aadharcard enterd
        List<Childrecord> GetAllWithoutAadharCard();

        // 23 count aadharcard enterd
        public int CountAadharCardEntered();

        // 24 list by rationcard enterd
        List<Childrecord> GetAllWithRationCard();

        // 25 list by not rationcard enterd
        List<Childrecord> GetAllWithoutRationCard();

        // 26 count rationcard enterd
        public int CountRationCardEntered();

        // 27 list by eayushmancard enterd
        List<Childrecord> GetAllWithAyushmanCard();

        // 28 list by not ayushmancard enterd
        List<Childrecord> GetAllWithoutAyushmanCard();

        // 29 count ayushmancard enterd
        public int CountAyushmanCardEntered();

        // 30 count all record 
        public int CountAll();
    }
}

