import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentForm } from "@/components/forms/equipment-form";

export default function NovoEquipamentoPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Novo Equipamento</h1>
          <p className="text-gray-600 mt-2">
            Cadastre um novo equipamento no sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Equipamento</CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentForm mode="create" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
