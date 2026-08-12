import "dotenv/config";
import { db } from "../lib/db";
import { schemaStatements } from "./schema";

/**
 * Additive migrations for existing databases (idempotent).
 * ALTER TABLE ... ADD COLUMN fails if the column already exists — that error is ignored.
 */
const additiveMigrations: string[] = [
  "ALTER TABLE Dish ADD COLUMN Price REAL",
];

async function migrate() {
  console.log("Running Aaharika_Catering migrations...");
  for (const statement of schemaStatements) {
    await db.execute(statement);
  }
  console.log(`✔ Applied ${schemaStatements.length} schema statements.`);

  for (const statement of additiveMigrations) {
    try {
      await db.execute(statement);
      console.log(`✔ ${statement}`);
    } catch (err) {
      const msg = String((err as Error)?.message || err);
      if (/duplicate column name/i.test(msg)) {
        console.log(`• Skipped (already applied): ${statement}`);
      } else {
        throw err;
      }
    }
  }

  console.log("Migration complete.");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
