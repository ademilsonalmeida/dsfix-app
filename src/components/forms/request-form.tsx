"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRequest } from "@/lib/actions/requests";
import { uploadPhoto } from "@/lib/actions/upload";
import type { Equipamento } from "@/types/database";

interface RequestFormProps {
  equipamento: Equipamento;
}

export default function RequestForm({ equipamento }: RequestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const [formData, setFormData] = useState({
    solicitanteNome: "",
    solicitanteDepartamento: "",
    descricao: "",
    urgencia: "MEDIA" as "ALTA" | "MEDIA" | "BAIXA",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadPhoto(formData);

      if (result.success && result.url) {
        setPhotoUrl(result.url);
      } else {
        setError(result.error || "Erro ao fazer upload da foto");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Erro ao fazer upload da foto");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await createRequest({
        equipamentoId: equipamento.id,
        ...formData,
        fotoUrl: photoUrl || "",
      });

      if (result.success && result.data) {
        router.push("/confirmacao/" + result.data.id);
      } else {
        setError(result.error || "Erro ao criar solicitação");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Erro ao criar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Equipamento Selecionado</h3>
        <p className="text-sm">
          <strong>Nome:</strong> {equipamento.nome}
        </p>
        <p className="text-sm">
          <strong>Local:</strong> {equipamento.local}
        </p>
        <p className="text-sm">
          <strong>Categoria:</strong> {equipamento.categoria}
        </p>
      </div>

      <div>
        <Label htmlFor="solicitanteNome">Seu Nome *</Label>
        <Input
          id="solicitanteNome"
          type="text"
          value={formData.solicitanteNome}
          onChange={(e) =>
            setFormData({ ...formData, solicitanteNome: e.target.value })
          }
          required
          minLength={2}
          maxLength={100}
          placeholder="Ex: João Silva"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="solicitanteDepartamento">Departamento *</Label>
        <Input
          id="solicitanteDepartamento"
          type="text"
          value={formData.solicitanteDepartamento}
          onChange={(e) =>
            setFormData({ ...formData, solicitanteDepartamento: e.target.value })
          }
          required
          minLength={2}
          maxLength={50}
          placeholder="Ex: Desenvolvimento"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição do Problema *</Label>
        <textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) =>
            setFormData({ ...formData, descricao: e.target.value })
          }
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          placeholder="Descreva o problema em detalhes..."
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <div>
        <Label htmlFor="urgencia">Urgência *</Label>
        <select
          id="urgencia"
          value={formData.urgencia}
          onChange={(e) =>
            setFormData({
              ...formData,
              urgencia: e.target.value as "ALTA" | "MEDIA" | "BAIXA",
            })
          }
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Média</option>
          <option value="ALTA">Alta</option>
        </select>
      </div>

      <div>
        <Label htmlFor="foto">Foto do Problema (opcional)</Label>
        <Input
          id="foto"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handlePhotoUpload}
          disabled={uploading}
          className="mt-1"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Enviando foto...</p>}
        {photoUrl && (
          <div className="mt-2">
            <img
              src={photoUrl}
              alt="Foto do problema"
              className="max-w-xs rounded border"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>
      )}

      <Button type="submit" className="w-full" disabled={loading || uploading}>
        {loading ? "Enviando..." : "Enviar Solicitação"}
      </Button>
    </form>
  );
}
