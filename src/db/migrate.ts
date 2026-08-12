import "dotenv/config";
import { db } from "../lib/db";
import { schemaStatements } from "./schema";

async function migrate() {
  console.log("Running Aaharika_Catering migrations...");
  for (const statement of schemaStatements) {
    await db.execute(statement);
  }
  console.log(`✔ Applied ${schemaStatements.length} schema statements.`);
  console.log("Migration complete.");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
