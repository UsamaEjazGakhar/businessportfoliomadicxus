const mysql = require("mysql2/promise");

const COMMON_PASSWORDS = [
  "",          // Blank (default for XAMPP/WampServer)
  "root",      // "root" (common for MAMP/Docker/standalone MySQL)
  "admin",     // "admin"
  "password",  // "password"
  "123456",    // "123456"
  "12345678",  // "12345678"
];

async function testConnection(password) {
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3307,
      user: "root",
      password: password,
    });
    await connection.end();
    return { success: true };
  } catch (error) {
    return { success: false, code: error.code, message: error.message };
  }
}

async function run() {
  console.log("🔍 Scanning localhost:3306 MySQL credentials for user 'root'...\n");
  
  let found = false;
  for (const pwd of COMMON_PASSWORDS) {
    const displayPwd = pwd === "" ? "(blank)" : `"${pwd}"`;
    process.stdout.write(`Testing root with password ${displayPwd}... `);
    
    const result = await testConnection(pwd);
    if (result.success) {
      console.log("🟢 SUCCESS! Connected successfully!\n");
      console.log("==========================================");
      console.log(`🎉 VALID CREDENTIALS FOUND!`);
      console.log(`Username: root`);
      console.log(`Password: ${pwd === "" ? "Leave blank in .env" : pwd}`);
      console.log(`Connection URL syntax:`);
      console.log(`mysql://root:${pwd}@localhost:3306/businessportfoliomadixcusdata`);
      console.log("==========================================");
      found = true;
      break;
    } else {
      console.log(`🔴 FAILED (${result.code})`);
    }
  }

  if (!found) {
    console.log("\n❌ Could not connect with any common default passwords.");
    console.log("Please check your local database management tool (XAMPP/WampServer control panel or MySQL command line) to verify your credentials.");
  }
}

run();
