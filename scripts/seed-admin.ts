import { createAdminUser } from "../src/lib/actions/auth";

async function seedAdmin() {
  console.log("🌱 Seeding initial admin user...");

  const result = await createAdminUser(
    "admin@dsfix.com",
    "admin123",
    "Administrator"
  );

  if (result.success) {
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@dsfix.com");
    console.log("Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
  } else {
    console.log("❌ Error:", result.error);
  }
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  });
