using System;
using System.Collections.Generic;

namespace pehchan.Models;

public partial class Motherschemerecord
{
    public int Sno { get; set; }

    public string? District { get; set; }

    public string? HealthBlock { get; set; }

    public string? HealthFacility { get; set; }

    public string? HealthSubFacility { get; set; }

    public string? Village { get; set; }

    public long Rchid { get; set; }

    public string? MotherName { get; set; }

    public string? HusbandName { get; set; }

    public string? Mobileof { get; set; }

    public string? MobileNo { get; set; }

    public decimal? AgeAsPerRegistration { get; set; }

    public DateOnly? MotherBirthDate { get; set; }

    public string? Address { get; set; }

    public string? Anmname { get; set; }

    public string? Ashaname { get; set; }

    public DateOnly? RegistrationDate { get; set; }

    public DateOnly? Lmd { get; set; }

    public DateOnly? Edd { get; set; }

    public sbyte? Mby { get; set; }

    public string? RemarkMby { get; set; }

    public sbyte? Jsy { get; set; }

    public string? RemarkJsy { get; set; }

    public sbyte? Jssy { get; set; }

    public string? RemarkJssy { get; set; }

    public sbyte? Pmmvy { get; set; }

    public string? RemarkPmmvy { get; set; }

    public sbyte? Mmjy { get; set; }

    public string? RemarkMmjy { get; set; }
}
