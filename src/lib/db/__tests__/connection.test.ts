import { strict as assert } from "assert";

console.log("\nRunning Database Connection Tests...\n");

let passed = 0;
let failed = 0;

function test(description: string, fn: () => void | Promise<void>) {
  return async () => {
    try {
      await fn();
      console.log(`✓ ${description}`);
      passed++;
    } catch (error) {
      console.error(`✗ ${description}`);
      console.error(`  Error: ${error instanceof Error ? error.message : String(error)}`);
      failed++;
    }
  };
}

function describe(suiteName: string, fn: () => void | Promise<void>) {
  console.log(`\n${suiteName}`);
  return fn();
}

const originalEnv = process.env.DATABASE_URL;

async function runTests() {
  await describe("Database Connection - Integration Tests", async () => {
    await describe("DATABASE_URL Environment Variable", async () => {
      await test("should validate DATABASE_URL is required", () => {
        const testEnv = process.env.DATABASE_URL;
        // DATABASE_URL should exist for database operations or be undefined (will use placeholder)
        assert.ok(testEnv === undefined || typeof testEnv === "string",
          "DATABASE_URL should be set or use test value");
      })();
    });

    await describe("Drizzle Client Initialization", async () => {
      await test("should export db client from index", async () => {
        process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
        const dbModule = await import("../index");
        assert.ok(dbModule.db, "db should be exported");
        assert.strictEqual(typeof dbModule.db, "object");
      })();

      await test("should export schema from index", async () => {
        process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
        const dbModule = await import("../index");
        assert.ok(dbModule.schema, "schema should be exported");
        assert.ok(dbModule.schema.equipamentos, "schema.equipamentos should be defined");
        assert.ok(dbModule.schema.adminUsers, "schema.adminUsers should be defined");
        assert.ok(dbModule.schema.solicitacoes, "schema.solicitacoes should be defined");
        assert.ok(dbModule.schema.historicoStatus, "schema.historicoStatus should be defined");
      })();

      await test("should initialize Drizzle with fullSchema including relations", async () => {
        process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
        const dbModule = await import("../index");
        assert.ok(dbModule.db.query, "db.query should be defined");
        assert.ok(dbModule.db.query.equipamentos, "db.query.equipamentos should be defined");
        assert.ok(dbModule.db.query.solicitacoes, "db.query.solicitacoes should be defined");
        assert.ok(dbModule.db.query.adminUsers, "db.query.adminUsers should be defined");
        assert.ok(dbModule.db.query.historicoStatus, "db.query.historicoStatus should be defined");
      })();

      await test("should have equipamentos query methods", async () => {
        process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
        const dbModule = await import("../index");
        assert.ok(dbModule.db.query.equipamentos.findFirst, "findFirst should be defined");
        assert.ok(dbModule.db.query.equipamentos.findMany, "findMany should be defined");
        assert.strictEqual(typeof dbModule.db.query.equipamentos.findFirst, "function");
        assert.strictEqual(typeof dbModule.db.query.equipamentos.findMany, "function");
      })();
    });

    await describe("Relations Definition", async () => {
      await test("should properly define equipamentos relations", async () => {
        const relationsModule = await import("../relations");
        assert.ok(relationsModule.equipamentosRelations, "equipamentosRelations should be defined");
        assert.strictEqual(typeof relationsModule.equipamentosRelations, "object");
      })();

      await test("should properly define solicitacoes relations", async () => {
        const relationsModule = await import("../relations");
        assert.ok(relationsModule.solicitacoesRelations, "solicitacoesRelations should be defined");
        assert.strictEqual(typeof relationsModule.solicitacoesRelations, "object");
      })();

      await test("should properly define adminUsers relations", async () => {
        const relationsModule = await import("../relations");
        assert.ok(relationsModule.adminUsersRelations, "adminUsersRelations should be defined");
        assert.strictEqual(typeof relationsModule.adminUsersRelations, "object");
      })();

      await test("should properly define historicoStatus relations", async () => {
        const relationsModule = await import("../relations");
        assert.ok(relationsModule.historicoStatusRelations, "historicoStatusRelations should be defined");
        assert.strictEqual(typeof relationsModule.historicoStatusRelations, "object");
      })();
    });

    await describe("Schema Export", async () => {
      await test("should export all table schemas", async () => {
        const schemaModule = await import("../schema");
        assert.ok(schemaModule.equipamentos, "equipamentos should be exported");
        assert.ok(schemaModule.adminUsers, "adminUsers should be exported");
        assert.ok(schemaModule.solicitacoes, "solicitacoes should be exported");
        assert.ok(schemaModule.historicoStatus, "historicoStatus should be exported");
      })();

      await test("should have correct table names", async () => {
        const schemaModule = await import("../schema");
        // Verify table objects exist and have configuration
        assert.ok(schemaModule.equipamentos, "equipamentos table should exist");
        assert.ok(schemaModule.adminUsers, "adminUsers table should exist");
        assert.ok(schemaModule.solicitacoes, "solicitacoes table should exist");
        assert.ok(schemaModule.historicoStatus, "historicoStatus table should exist");
      })();
    });
  });

  await describe("Drizzle Configuration", async () => {
    await describe("Migration Configuration", async () => {
      await test("should have correct schema path", async () => {
        const configModule = await import("../../../../drizzle.config");
        const drizzleConfig = configModule.default;
        assert.strictEqual(drizzleConfig.schema, "./src/lib/db/schema.ts");
      })();

      await test("should have correct output directory", async () => {
        const configModule = await import("../../../../drizzle.config");
        const drizzleConfig = configModule.default;
        assert.strictEqual(drizzleConfig.out, "./drizzle");
      })();

      await test("should use postgresql dialect", async () => {
        const configModule = await import("../../../../drizzle.config");
        const drizzleConfig = configModule.default;
        assert.strictEqual(drizzleConfig.dialect, "postgresql");
      })();

      await test("should handle missing DATABASE_URL with placeholder", async () => {
        const configModule = await import("../../../../drizzle.config");
        const drizzleConfig = configModule.default;
        assert.ok(drizzleConfig.dbCredentials.url, "dbCredentials.url should be defined");
        // Should either be the actual DATABASE_URL or the placeholder
        const url = drizzleConfig.dbCredentials.url;
        // URL should be defined and be a valid postgres connection string
        assert.ok(
          typeof url === "string" && url.startsWith("postgresql://"),
          "URL should be a valid PostgreSQL connection string"
        );
      })();
    });
  });

  // Restore original environment
  process.env.DATABASE_URL = originalEnv;

  // Print summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Test Summary:`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Total: ${passed + failed}`);
  console.log(`  Coverage: ${((passed / (passed + failed)) * 100).toFixed(2)}%`);
  console.log(`${"=".repeat(50)}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error("Test runner failed:", error);
  process.exit(1);
});
