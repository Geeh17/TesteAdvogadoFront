export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return cpf;

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, "");

  if (cleaned.length !== 11) return telefone;

  return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}
