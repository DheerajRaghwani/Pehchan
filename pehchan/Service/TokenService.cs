using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using pehchan.Interface;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;

    public string GenerateToken(int userId, string userName, string loginRole, int? hospitalId = null)
    {
        var jwtSection = _config.GetSection("Jwt");

        var key = jwtSection["Key"];
        var issuer = jwtSection["Issuer"];
        var audience = jwtSection["Audience"];
        var expiryMinutes = jwtSection.GetValue<int>("ExpiryMinutes");

        // 👇 Unified naming for claims
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userName ?? ""),
            new Claim("UserId", userId.ToString()),
            new Claim(ClaimTypes.Name, userName ?? "")
        };

        // 👇 Add Role
        if (!string.IsNullOrEmpty(loginRole))
        {
            claims.Add(new Claim(ClaimTypes.Role, loginRole));
        }

        // 👇 Add HospitalId as JWT claim (important)
        if (hospitalId.HasValue)
        {
            claims.Add(new Claim("HospitalId", hospitalId.Value.ToString()));
        }

        var keyBytes = Encoding.UTF8.GetBytes(key);
        var securityKey = new SymmetricSecurityKey(keyBytes);
        var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
