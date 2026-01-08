import "dotenv/config";
import { db } from "../src/lib/db";
import { equipamentos, solicitacoes, historicoStatus, adminUsers } from "../src/lib/db/schema";
import { createAdminUser } from "../src/lib/actions/auth";
import { eq } from "drizzle-orm";

async function seedData() {
  console.log("🌱 Seeding database with sample data...\n");

  try {
    // 1. Create additional admin users
    console.log("1️⃣  Creating admin users...");
    const adminResult1 = await createAdminUser(
      "joao.silva@dsfix.com",
      "senha123",
      "João Silva"
    );
    const adminResult2 = await createAdminUser(
      "maria.santos@dsfix.com",
      "senha123",
      "Maria Santos"
    );
    
    if (adminResult1.success) {
      console.log("  ✓ Created admin: João Silva");
    }
    if (adminResult2.success) {
      console.log("  ✓ Created admin: Maria Santos");
    }

    // Get all admin users for assignment
    const allAdmins = await db.select().from(adminUsers);
    console.log("  ✓ Total admin users:", allAdmins.length, "\n");

    // 2. Create sample equipment
    console.log("2️⃣  Creating sample equipment...");
    const equipmentData = [
      { codigo: "CAF001", nome: "Máquina de Café - Recepção", categoria: "Máquina de Café", local: "Recepção - Térreo" },
      { codigo: "CAF002", nome: "Máquina de Café - Desenvolvimento", categoria: "Máquina de Café", local: "Sala Dev - 2º Andar" },
      { codigo: "IMP001", nome: "Impressora HP LaserJet", categoria: "Impressora", local: "Administração - 1º Andar" },
      { codigo: "IMP002", nome: "Impressora Multifuncional Canon", categoria: "Impressora", local: "Recepção - Térreo" },
      { codigo: "AR001", nome: "Ar Condicionado - Sala de Reuniões 1", categoria: "Ar Condicionado", local: "Sala Reunião 1 - 2º Andar" },
      { codigo: "AR002", nome: "Ar Condicionado - Desenvolvimento", categoria: "Ar Condicionado", local: "Sala Dev - 2º Andar" },
      { codigo: "BEB001", nome: "Bebedouro Gelado - Recepção", categoria: "Bebedouro", local: "Recepção - Térreo" },
      { codigo: "BEB002", nome: "Bebedouro - Copa", categoria: "Bebedouro", local: "Copa - 1º Andar" },
      { codigo: "TV001", nome: "TV Samsung 55\" - Recepção", categoria: "Televisão", local: "Recepção - Térreo" },
      { codigo: "TV002", nome: "TV LG 65\" - Sala de Reuniões", categoria: "Televisão", local: "Sala Reunião 1 - 2º Andar" },
      { codigo: "MIC001", nome: "Micro-ondas Panasonic", categoria: "Micro-ondas", local: "Copa - 1º Andar" },
      { codigo: "WIFI001", nome: "Roteador Wi-Fi Principal", categoria: "Rede", local: "Sala de Servidores - Térreo" },
      { codigo: "WIFI002", nome: "Repetidor Wi-Fi - 2º Andar", categoria: "Rede", local: "Corredor - 2º Andar" },
      { codigo: "ELEV001", nome: "Elevador Principal", categoria: "Elevador", local: "Térreo/1º/2º Andar" },
      { codigo: "PORT001", nome: "Portão Eletrônico", categoria: "Segurança", local: "Entrada Principal" },
    ];

    const createdEquipment = [];
    for (const eq of equipmentData) {
      const [equipment] = await db.insert(equipamentos).values({
        ...eq,
        observacoes: null,
        ativo: true,
      }).returning();
      createdEquipment.push(equipment);
      console.log("  ✓ Created:", eq.nome);
    }
    console.log("  ✓ Total equipment:", createdEquipment.length, "\n");

    // 3. Create sample requests
    console.log("3️⃣  Creating sample maintenance requests...");
    
    const requestsData = [
      {
        equipamentoId: createdEquipment[0].id,
        solicitanteNome: "Carlos Mendes",
        solicitanteDepartamento: "Desenvolvimento",
        descricao: "A máquina de café não está esquentando a água. Café sai frio.",
        urgencia: "ALTA",
        status: "PENDENTE",
      },
      {
        equipamentoId: createdEquipment[2].id,
        solicitanteNome: "Ana Paula",
        solicitanteDepartamento: "Administração",
        descricao: "Impressora apresenta erro de papel atolado constantemente.",
        urgencia: "MEDIA",
        status: "EM_ANDAMENTO",
        responsavelId: allAdmins[0]?.id,
      },
      {
        equipamentoId: createdEquipment[4].id,
        solicitanteNome: "Pedro Santos",
        solicitanteDepartamento: "Vendas",
        descricao: "Ar condicionado está fazendo barulho estranho e não está gelando.",
        urgencia: "ALTA",
        status: "EM_ANDAMENTO",
        responsavelId: allAdmins[1]?.id || allAdmins[0]?.id,
      },
      {
        equipamentoId: createdEquipment[6].id,
        solicitanteNome: "Juliana Costa",
        solicitanteDepartamento: "RH",
        descricao: "Bebedouro não está gelando a água.",
        urgencia: "MEDIA",
        status: "FINALIZADO",
        responsavelId: allAdmins[0]?.id,
        finalizadoEm: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        equipamentoId: createdEquipment[1].id,
        solicitanteNome: "Roberto Lima",
        solicitanteDepartamento: "Desenvolvimento",
        descricao: "Café saindo muito fraco, possível problema no filtro.",
        urgencia: "BAIXA",
        status: "PENDENTE",
      },
      {
        equipamentoId: createdEquipment[8].id,
        solicitanteNome: "Fernanda Alves",
        solicitanteDepartamento: "Recepção",
        descricao: "TV não liga, apenas LED vermelho piscando.",
        urgencia: "BAIXA",
        status: "FINALIZADO",
        responsavelId: allAdmins[0]?.id,
        finalizadoEm: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        equipamentoId: createdEquipment[13].id,
        solicitanteNome: "Lucas Ferreira",
        solicitanteDepartamento: "Segurança",
        descricao: "Elevador está fazendo barulho ao subir e parando entre andares ocasionalmente.",
        urgencia: "ALTA",
        status: "PENDENTE",
      },
      {
        equipamentoId: createdEquipment[11].id,
        solicitanteNome: "Patricia Oliveira",
        solicitanteDepartamento: "Desenvolvimento",
        descricao: "Internet muito lenta no 2º andar, Wi-Fi cai frequentemente.",
        urgencia: "ALTA",
        status: "EM_ANDAMENTO",
        responsavelId: allAdmins[0]?.id,
      },
    ];

    const createdRequests = [];
    for (let i = 0; i < requestsData.length; i++) {
      const reqData = requestsData[i];
      const numero = "REQ-" + Date.now().toString(36).toUpperCase() + "-" + i.toString().padStart(3, "0");
      
      const [request] = await db.insert(solicitacoes).values({
        numero,
        ...reqData,
      }).returning();
      
      createdRequests.push(request);
      
      // Create initial history
      await db.insert(historicoStatus).values({
        solicitacaoId: request.id,
        statusAnterior: null,
        statusNovo: "PENDENTE",
        alteradoPorId: null,
        observacao: "Solicitação criada",
      });

      // For requests not PENDENTE, create history for status change
      if (reqData.status !== "PENDENTE") {
        await db.insert(historicoStatus).values({
          solicitacaoId: request.id,
          statusAnterior: "PENDENTE",
          statusNovo: reqData.status,
          alteradoPorId: reqData.responsavelId || null,
          observacao: reqData.status === "EM_ANDAMENTO" ? "Iniciado atendimento" : "Concluído com sucesso",
        });
      }
      
      console.log("  ✓ Created request:", numero, "-", reqData.status);
    }
    console.log("  ✓ Total requests:", createdRequests.length, "\n");

    console.log("✅ Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log("  - Admin users:", allAdmins.length);
    console.log("  - Equipment:", createdEquipment.length);
    console.log("  - Requests:", createdRequests.length);
    console.log("    • Pendente:", requestsData.filter(r => r.status === "PENDENTE").length);
    console.log("    • Em Andamento:", requestsData.filter(r => r.status === "EM_ANDAMENTO").length);
    console.log("    • Finalizado:", requestsData.filter(r => r.status === "FINALIZADO").length);

  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    throw error;
  }
}

seedData()
  .then(() => {
    console.log("\n✅ Seed script finished successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed script failed:", error);
    process.exit(1);
  });
