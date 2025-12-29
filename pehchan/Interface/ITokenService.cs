namespace pehchan.Interface
{
    public interface ITokenService
    {
        string GenerateToken(int userId, string userName, string loginRole, int? hospitalId = null);
    }
}
