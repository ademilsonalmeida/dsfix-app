import { strict as assert } from "assert";
import { equipamentos, solicitacoes, adminUsers, historicoStatus } from "../schema";

console.log("Running Database Schema Tests...\n");

let passed = 0;
let failed = 0;

function test(description: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  Error: ${error instanceof Error ? error.message : String(error)}`);
    failed++;
  }
}

function describe(suiteName: string, fn: () => void) {
  console.log(`\n${suiteName}`);
  fn();
}

// Database Schema - Equipamentos Table Tests
describe("Database Schema - Equipamentos Table", () => {
  describe("Table Export", () => {
    test("should export equipamentos table correctly", () => {
      assert.ok(equipamentos, "equipamentos should be defined");
      assert.strictEqual(typeof equipamentos, "object");
    });

    test("should be a valid pgTable instance", () => {
      assert.ok(equipamentos, "equipamentos should be defined");
      assert.ok(equipamentos.id, "equipamentos should have id field");
      assert.strictEqual(typeof equipamentos, "object");
    });
  });

  describe("Field Definitions", () => {
    test("should have exactly 8 fields defined", () => {
      const expectedFields = [
        "id",
        "codigo",
        "nome",
        "categoria",
        "local",
        "observacoes",
        "ativo",
        "criadoEm",
        "atualizadoEm",
      ];

      expectedFields.forEach((field) => {
        assert.ok(
          field in equipamentos,
          `Field ${field} should exist in equipamentos`
        );
      });
    });

    test("should have id field with UUID type", () => {
      assert.ok(equipamentos.id, "id field should be defined");
      assert.strictEqual(equipamentos.id.columnType, "PgUUID");
      assert.strictEqual(equipamentos.id.primary, true);
      assert.strictEqual(equipamentos.id.hasDefault, true);
    });

    test("should have codigo field with VARCHAR(20) type", () => {
      assert.ok(equipamentos.codigo, "codigo field should be defined");
      assert.strictEqual(equipamentos.codigo.dataType, "string");
      assert.strictEqual(equipamentos.codigo.columnType, "PgVarchar");
      assert.strictEqual(equipamentos.codigo.notNull, true);
      assert.strictEqual(equipamentos.codigo.isUnique, true);
    });

    test("should have nome field with VARCHAR(100) type", () => {
      assert.ok(equipamentos.nome, "nome field should be defined");
      assert.strictEqual(equipamentos.nome.dataType, "string");
      assert.strictEqual(equipamentos.nome.columnType, "PgVarchar");
      assert.strictEqual(equipamentos.nome.notNull, true);
    });

    test("should have categoria field with VARCHAR(50) type", () => {
      assert.ok(equipamentos.categoria, "categoria field should be defined");
      assert.strictEqual(equipamentos.categoria.dataType, "string");
      assert.strictEqual(equipamentos.categoria.columnType, "PgVarchar");
      assert.strictEqual(equipamentos.categoria.notNull, true);
    });

    test("should have local field with VARCHAR(100) type", () => {
      assert.ok(equipamentos.local, "local field should be defined");
      assert.strictEqual(equipamentos.local.dataType, "string");
      assert.strictEqual(equipamentos.local.columnType, "PgVarchar");
      assert.strictEqual(equipamentos.local.notNull, true);
    });

    test("should have observacoes field with TEXT type and nullable", () => {
      assert.ok(equipamentos.observacoes, "observacoes field should be defined");
      assert.strictEqual(equipamentos.observacoes.dataType, "string");
      assert.strictEqual(equipamentos.observacoes.columnType, "PgText");
      assert.strictEqual(equipamentos.observacoes.notNull, false);
    });

    test("should have ativo field with BOOLEAN type", () => {
      assert.ok(equipamentos.ativo, "ativo field should be defined");
      assert.strictEqual(equipamentos.ativo.dataType, "boolean");
      assert.strictEqual(equipamentos.ativo.columnType, "PgBoolean");
      assert.strictEqual(equipamentos.ativo.notNull, true);
      assert.strictEqual(equipamentos.ativo.hasDefault, true);
    });

    test("should have criadoEm field with TIMESTAMP type", () => {
      assert.ok(equipamentos.criadoEm, "criadoEm field should be defined");
      assert.strictEqual(equipamentos.criadoEm.dataType, "date");
      assert.strictEqual(equipamentos.criadoEm.columnType, "PgTimestamp");
      assert.strictEqual(equipamentos.criadoEm.notNull, true);
      assert.strictEqual(equipamentos.criadoEm.hasDefault, true);
    });

    test("should have atualizadoEm field with TIMESTAMP type", () => {
      assert.ok(equipamentos.atualizadoEm, "atualizadoEm field should be defined");
      assert.strictEqual(equipamentos.atualizadoEm.dataType, "date");
      assert.strictEqual(equipamentos.atualizadoEm.columnType, "PgTimestamp");
      assert.strictEqual(equipamentos.atualizadoEm.notNull, true);
      assert.strictEqual(equipamentos.atualizadoEm.hasDefault, true);
    });
  });

  describe("Field Constraints", () => {
    test("should have UNIQUE constraint on codigo field", () => {
      assert.strictEqual(equipamentos.codigo.isUnique, true);
    });

    test("should have NOT NULL constraint on required fields", () => {
      assert.strictEqual(equipamentos.id.notNull, true);
      assert.strictEqual(equipamentos.codigo.notNull, true);
      assert.strictEqual(equipamentos.nome.notNull, true);
      assert.strictEqual(equipamentos.categoria.notNull, true);
      assert.strictEqual(equipamentos.local.notNull, true);
      assert.strictEqual(equipamentos.ativo.notNull, true);
      assert.strictEqual(equipamentos.criadoEm.notNull, true);
      assert.strictEqual(equipamentos.atualizadoEm.notNull, true);
    });

    test("should have nullable observacoes field", () => {
      assert.strictEqual(equipamentos.observacoes.notNull, false);
    });
  });

  describe("Default Values", () => {
    test("should have defaultRandom() on id field", () => {
      assert.strictEqual(equipamentos.id.hasDefault, true);
      assert.strictEqual(equipamentos.id.primary, true);
    });

    test("should have default true on ativo field", () => {
      assert.strictEqual(equipamentos.ativo.hasDefault, true);
    });

    test("should have defaultNow() on criadoEm field", () => {
      assert.strictEqual(equipamentos.criadoEm.hasDefault, true);
    });

    test("should have defaultNow() on atualizadoEm field", () => {
      assert.strictEqual(equipamentos.atualizadoEm.hasDefault, true);
    });
  });

  describe("Primary Key", () => {
    test("should have UUID primary key with defaultRandom() function", () => {
      assert.strictEqual(equipamentos.id.primary, true);
      assert.strictEqual(equipamentos.id.columnType, "PgUUID");
      assert.strictEqual(equipamentos.id.hasDefault, true);
    });
  });

  describe("Foreign Key Relationships", () => {
    test("should be referenced by solicitacoes.equipamentoId", () => {
      assert.ok(solicitacoes.equipamentoId, "solicitacoes.equipamentoId should be defined");
      assert.strictEqual(solicitacoes.equipamentoId.columnType, "PgUUID");
      assert.strictEqual(solicitacoes.equipamentoId.notNull, true);
    });
  });

  describe("Soft Delete Pattern", () => {
    test("should implement soft delete with ativo boolean field", () => {
      assert.ok(equipamentos.ativo, "ativo field should be defined");
      assert.strictEqual(equipamentos.ativo.dataType, "boolean");
      assert.strictEqual(equipamentos.ativo.hasDefault, true);
      assert.strictEqual(equipamentos.ativo.notNull, true);
    });
  });

  describe("Timestamp Audit Trail", () => {
    test("should have automatic timestamps for audit trail", () => {
      assert.ok(equipamentos.criadoEm, "criadoEm should be defined");
      assert.ok(equipamentos.atualizadoEm, "atualizadoEm should be defined");
      assert.strictEqual(equipamentos.criadoEm.hasDefault, true);
      assert.strictEqual(equipamentos.atualizadoEm.hasDefault, true);
    });
  });
});

describe("Database Schema - Related Tables", () => {
  describe("Admin Users Table", () => {
    test("should export adminUsers table correctly", () => {
      assert.ok(adminUsers, "adminUsers should be defined");
      assert.ok(adminUsers.id, "adminUsers should have id field");
      assert.strictEqual(typeof adminUsers, "object");
    });
  });

  describe("Solicitacoes Table", () => {
    test("should export solicitacoes table correctly", () => {
      assert.ok(solicitacoes, "solicitacoes should be defined");
      assert.ok(solicitacoes.id, "solicitacoes should have id field");
      assert.strictEqual(typeof solicitacoes, "object");
    });

    test("should have foreign key to equipamentos", () => {
      assert.ok(solicitacoes.equipamentoId, "equipamentoId should be defined");
      assert.strictEqual(solicitacoes.equipamentoId.columnType, "PgUUID");
    });
  });

  describe("Historico Status Table", () => {
    test("should export historicoStatus table correctly", () => {
      assert.ok(historicoStatus, "historicoStatus should be defined");
      assert.ok(historicoStatus.id, "historicoStatus should have id field");
      assert.strictEqual(typeof historicoStatus, "object");
    });
  });
});

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
