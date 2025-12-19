using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace pehchan.Models;

public partial class PenchanContext : DbContext
{
    public PenchanContext()
    {
    }

    public PenchanContext(DbContextOptions<PenchanContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Childrecord> Childrecords { get; set; }

    public virtual DbSet<Userlogin> Userlogins { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;user=root;password=1111;database=penchan;port=3306", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.17-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Childrecord>(entity =>
        {
            entity.HasKey(e => e.Rchid).HasName("PRIMARY");

            entity.ToTable("childrecord");

            entity.Property(e => e.Rchid)
                .ValueGeneratedNever()
                .HasColumnType("bigint(30)")
                .HasColumnName("RCHID");
            entity.Property(e => e.AadhaarCardNumber).HasMaxLength(12);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.AgeasperRegistration).HasPrecision(10, 2);
            entity.Property(e => e.AyushmanCardNumber).HasMaxLength(45);
            entity.Property(e => e.BirthCertificateId).HasMaxLength(45);
            entity.Property(e => e.CasteCertificateNumber).HasMaxLength(45);
            entity.Property(e => e.DeliveryPlace).HasMaxLength(150);
            entity.Property(e => e.DeliveryPlaceName).HasMaxLength(150);
            entity.Property(e => e.District).HasMaxLength(100);
            entity.Property(e => e.HealthBlock).HasMaxLength(100);
            entity.Property(e => e.HealthSubfacility).HasMaxLength(100);
            entity.Property(e => e.HusbandName).HasMaxLength(100);
            entity.Property(e => e.MaternalDeath).HasMaxLength(10);
            entity.Property(e => e.MobileNo).HasMaxLength(45);
            entity.Property(e => e.Mobileof).HasMaxLength(45);
            entity.Property(e => e.MotherName).HasMaxLength(100);
            entity.Property(e => e.RationCardNumber).HasMaxLength(45);
            entity.Property(e => e.Sno)
                .HasColumnType("int(11)")
                .HasColumnName("SNo");
            entity.Property(e => e.Village).HasMaxLength(100);
        });

        modelBuilder.Entity<Userlogin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("userlogin");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnType("int(11)");
            entity.Property(e => e.LoginRole).HasMaxLength(255);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.UserName).HasMaxLength(45);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
