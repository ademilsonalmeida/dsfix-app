import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">DSFix - Gestão de Manutenções</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sistema de gestão de solicitações de manutenção de equipamentos
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/solicitar"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Solicitar Manutenção
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Acesso Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
