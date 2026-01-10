import { strict as assert } from "assert";
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  type CreateEquipmentInput,
  type UpdateEquipmentInput,
} from "../equipment";

console.log("Running Equipment Validation Schema Tests...\n");

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

// Validation Schema Tests
describe("Equipment Validation Schemas - createEquipmentSchema", () => {
  describe("Valid Data", () => {
    test("should accept valid equipment data with all fields", () => {
      const validData = {
        codigo: "EQ-001",
        nome: "Equipamento Teste",
        categoria: "Eletrônicos",
        local: "Sala 101",
        observacoes: "Observações de teste",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.deepStrictEqual(result.data, validData);
      }
    });

    test("should accept valid data without observacoes field", () => {
      const validData = {
        codigo: "EQ-002",
        nome: "Outro Equipamento",
        categoria: "Ferramentas",
        local: "Almoxarifado",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept codigo with uppercase letters only", () => {
      const validData = {
        codigo: "ABCDEF",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept codigo with numbers only", () => {
      const validData = {
        codigo: "123456",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept codigo with hyphens", () => {
      const validData = {
        codigo: "EQ-2024-001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept observacoes with empty string", () => {
      const validData = {
        codigo: "EQ-003",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
        observacoes: "",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept minimum length strings for all fields", () => {
      const validData = {
        codigo: "A",
        nome: "AB",
        categoria: "CD",
        local: "EF",
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept maximum length strings for all fields", () => {
      const validData = {
        codigo: "A".repeat(20),
        nome: "B".repeat(100),
        categoria: "C".repeat(50),
        local: "D".repeat(100),
        observacoes: "E".repeat(500),
      };

      const result = createEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });
  });

  describe("Invalid Codigo Field", () => {
    test("should reject empty codigo", () => {
      const invalidData = {
        codigo: "",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e => e.message === "Código é obrigatório"));
      }
    });

    test("should reject codigo with lowercase letters", () => {
      const invalidData = {
        codigo: "eq-001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Código deve conter apenas letras maiúsculas, números e hífens"
        ));
      }
    });

    test("should reject codigo with special characters", () => {
      const invalidData = {
        codigo: "EQ@001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Código deve conter apenas letras maiúsculas, números e hífens"
        ));
      }
    });

    test("should reject codigo with spaces", () => {
      const invalidData = {
        codigo: "EQ 001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Código deve conter apenas letras maiúsculas, números e hífens"
        ));
      }
    });

    test("should reject codigo exceeding 20 characters", () => {
      const invalidData = {
        codigo: "A".repeat(21),
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Código deve ter no máximo 20 caracteres"
        ));
      }
    });
  });

  describe("Invalid Nome Field", () => {
    test("should reject nome with less than 2 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "A",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Nome deve ter pelo menos 2 caracteres"
        ));
      }
    });

    test("should reject nome exceeding 100 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "A".repeat(101),
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Nome deve ter no máximo 100 caracteres"
        ));
      }
    });

    test("should reject missing nome field", () => {
      const invalidData = {
        codigo: "EQ-001",
        categoria: "Categoria",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });
  });

  describe("Invalid Categoria Field", () => {
    test("should reject categoria with less than 2 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        categoria: "A",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Categoria deve ter pelo menos 2 caracteres"
        ));
      }
    });

    test("should reject categoria exceeding 50 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        categoria: "A".repeat(51),
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Categoria deve ter no máximo 50 caracteres"
        ));
      }
    });

    test("should reject missing categoria field", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        local: "Local",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });
  });

  describe("Invalid Local Field", () => {
    test("should reject local with less than 2 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "A",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Local deve ter pelo menos 2 caracteres"
        ));
      }
    });

    test("should reject local exceeding 100 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "A".repeat(101),
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Local deve ter no máximo 100 caracteres"
        ));
      }
    });

    test("should reject missing local field", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        categoria: "Categoria",
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });
  });

  describe("Invalid Observacoes Field", () => {
    test("should reject observacoes exceeding 500 characters", () => {
      const invalidData = {
        codigo: "EQ-001",
        nome: "Equipamento",
        categoria: "Categoria",
        local: "Local",
        observacoes: "A".repeat(501),
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Observações devem ter no máximo 500 caracteres"
        ));
      }
    });
  });

  describe("Error Messages in Portuguese", () => {
    test("all error messages should be in Portuguese", () => {
      const invalidData = {
        codigo: "",
        nome: "A",
        categoria: "B",
        local: "C",
        observacoes: "D".repeat(501),
      };

      const result = createEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        result.error.errors.forEach(error => {
          // Check that error messages contain Portuguese characters or common Portuguese words
          const portuguesePattern = /[áàâãéêíóôõúç]|deve|no máximo|pelo menos|obrigatório|inválido/i;
          assert.ok(
            portuguesePattern.test(error.message),
            `Error message should be in Portuguese: ${error.message}`
          );
        });
      }
    });
  });
});

describe("Equipment Validation Schemas - updateEquipmentSchema", () => {
  describe("Valid Update Data", () => {
    test("should accept valid update data with all fields", () => {
      const validData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        codigo: "EQ-001",
        nome: "Equipamento Atualizado",
        categoria: "Nova Categoria",
        local: "Novo Local",
        observacoes: "Novas observações",
      };

      const result = updateEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.deepStrictEqual(result.data, validData);
      }
    });

    test("should accept partial update with only id and one field", () => {
      const validData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        nome: "Novo Nome",
      };

      const result = updateEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept partial update with only id and codigo", () => {
      const validData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        codigo: "NEW-CODE",
      };

      const result = updateEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });

    test("should accept partial update with multiple fields", () => {
      const validData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        nome: "Novo Nome",
        categoria: "Nova Categoria",
      };

      const result = updateEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });
  });

  describe("UUID Validation", () => {
    test("should require id field", () => {
      const invalidData = {
        nome: "Equipamento",
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });

    test("should reject invalid UUID format", () => {
      const invalidData = {
        id: "invalid-uuid",
        nome: "Equipamento",
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e => e.message === "ID inválido"));
      }
    });

    test("should reject non-UUID string", () => {
      const invalidData = {
        id: "12345",
        nome: "Equipamento",
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });

    test("should accept valid UUID v4", () => {
      const validData = {
        id: "a3bb189e-8bf9-3888-9912-ace4e6543002",
        nome: "Equipamento",
      };

      const result = updateEquipmentSchema.safeParse(validData);
      assert.strictEqual(result.success, true);
    });
  });

  describe("Partial Field Validation", () => {
    test("should validate codigo when provided in update", () => {
      const invalidData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        codigo: "invalid-code",
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Código deve conter apenas letras maiúsculas, números e hífens"
        ));
      }
    });

    test("should validate nome when provided in update", () => {
      const invalidData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        nome: "A",
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error.errors.some(e =>
          e.message === "Nome deve ter pelo menos 2 caracteres"
        ));
      }
    });

    test("should validate categoria when provided in update", () => {
      const invalidData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        categoria: "A".repeat(51),
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });

    test("should validate local when provided in update", () => {
      const invalidData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        local: "L",
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });

    test("should validate observacoes when provided in update", () => {
      const invalidData = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        observacoes: "O".repeat(501),
      };

      const result = updateEquipmentSchema.safeParse(invalidData);
      assert.strictEqual(result.success, false);
    });
  });
});

describe("TypeScript Type Exports", () => {
  test("CreateEquipmentInput type should be exported", () => {
    const validData: CreateEquipmentInput = {
      codigo: "EQ-001",
      nome: "Equipamento",
      categoria: "Categoria",
      local: "Local",
    };

    assert.ok(validData);
    assert.strictEqual(typeof validData.codigo, "string");
    assert.strictEqual(typeof validData.nome, "string");
    assert.strictEqual(typeof validData.categoria, "string");
    assert.strictEqual(typeof validData.local, "string");
  });

  test("UpdateEquipmentInput type should be exported", () => {
    const validData: UpdateEquipmentInput = {
      id: "550e8400-e29b-41d4-a716-446655440000",
    };

    assert.ok(validData);
    assert.strictEqual(typeof validData.id, "string");
  });

  test("CreateEquipmentInput should allow optional observacoes", () => {
    const dataWithObs: CreateEquipmentInput = {
      codigo: "EQ-001",
      nome: "Equipamento",
      categoria: "Categoria",
      local: "Local",
      observacoes: "Obs",
    };

    const dataWithoutObs: CreateEquipmentInput = {
      codigo: "EQ-002",
      nome: "Equipamento",
      categoria: "Categoria",
      local: "Local",
    };

    assert.ok(dataWithObs);
    assert.ok(dataWithoutObs);
  });
});

describe("Edge Cases and Boundary Testing", () => {
  test("should handle exact boundary values for codigo", () => {
    const validData = {
      codigo: "12345678901234567890", // exactly 20 chars
      nome: "Equipamento",
      categoria: "Categoria",
      local: "Local",
    };

    const result = createEquipmentSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  test("should handle exact boundary values for nome", () => {
    const validData = {
      codigo: "EQ-001",
      nome: "AB", // exactly 2 chars (minimum)
      categoria: "Categoria",
      local: "Local",
    };

    const result = createEquipmentSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  test("should handle exact maximum length for all fields", () => {
    const validData = {
      codigo: "X".repeat(20),
      nome: "N".repeat(100),
      categoria: "C".repeat(50),
      local: "L".repeat(100),
      observacoes: "O".repeat(500),
    };

    const result = createEquipmentSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  test("should reject when exceeding max length by 1 character", () => {
    const invalidData = {
      codigo: "X".repeat(21), // 21 chars
      nome: "Equipamento",
      categoria: "Categoria",
      local: "Local",
    };

    const result = createEquipmentSchema.safeParse(invalidData);
    assert.strictEqual(result.success, false);
  });

  test("should handle Unicode characters in allowed fields", () => {
    const validData = {
      codigo: "EQ-001",
      nome: "Equipamento com acentuação éêíóú",
      categoria: "Categoria ção",
      local: "Almoxarifado São Paulo",
      observacoes: "Observações com caracteres especiais: àáâãèéêìíòóôõùúç",
    };

    const result = createEquipmentSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  test("should reject codigo with Unicode characters", () => {
    const invalidData = {
      codigo: "ÉQ-001",
      nome: "Equipamento",
      categoria: "Categoria",
      local: "Local",
    };

    const result = createEquipmentSchema.safeParse(invalidData);
    assert.strictEqual(result.success, false);
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
