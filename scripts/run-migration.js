/**
 * Automated SQL migration script
 * Runs the encryption keys table creation script directly in Supabase
 */

const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function runMigration() {
  console.log("🚀 Starting database migration...\n");

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "❌ Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env file"
    );
    process.exit(1);
  }

  // Read the SQL file
  const sqlFilePath = path.join(
    __dirname,
    "002_create_encryption_keys_table.sql"
  );
  const sqlContent = fs.readFileSync(sqlFilePath, "utf-8");

  console.log("📄 SQL Script loaded from:", sqlFilePath);
  console.log("🔗 Supabase URL:", supabaseUrl);
  console.log("\n📝 Executing SQL migration...\n");

  try {
    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sqlContent }),
    });

    if (!response.ok) {
      // Try alternative method using pg connection
      console.log("⚠️  REST API method failed, trying direct connection...\n");
      await runViaPg(sqlContent);
    } else {
      const result = await response.json();
      console.log("✅ Migration successful!");
      console.log("Result:", result);
    }
  } catch (error) {
    console.log("⚠️  Fetch method failed, trying direct connection...\n");
    await runViaPg(sqlContent);
  }
}

async function runViaPg(sqlContent) {
  try {
    const { Client } = require("pg");

    const client = new Client({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: { rejectUnauthorized: false },
    });

    console.log("🔌 Connecting to PostgreSQL...");
    await client.connect();
    console.log("✅ Connected!\n");

    console.log("📝 Executing SQL statements...");
    await client.query(sqlContent);

    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Verifying table creation...");

    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_encryption_keys'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Table "user_encryption_keys" created successfully!');
    } else {
      console.log("⚠️  Table not found in verification check");
    }

    await client.end();
    console.log("\n🎉 Migration complete! You can now use the /migrate page.");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(
      "\nPlease run the SQL script manually in Supabase SQL Editor:"
    );
    console.error(
      "1. Go to: https://rxebdphvvcdigmovybnx.supabase.co/project/rxebdphvvcdigmovybnx/sql"
    );
    console.error(
      "2. Copy contents from: scripts/002_create_encryption_keys_table.sql"
    );
    console.error("3. Paste and run in SQL Editor\n");
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(console.error);
