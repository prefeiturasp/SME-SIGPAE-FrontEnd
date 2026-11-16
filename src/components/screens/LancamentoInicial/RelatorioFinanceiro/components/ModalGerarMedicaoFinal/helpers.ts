export const MSG_ERRO_GERAR = "Erro ao gerar a Medição Final. Tente novamente.";

const primeiroTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor)) return valor.find((v) => typeof v === "string");
  return undefined;
};

/**
 * Interpreta erros do POST gerar-medicao-final (formato DRF):
 * - { rf_responsavel_conferencia: [...] } -> erro do campo RF
 * - { non_field_errors: [...] } | { detail: "..." } | { <campo>: [...] }
 *   -> mensagem para toast
 */
export const interpretarErroGerarMedicaoFinal = (
  data: unknown,
): { erroRf?: string; mensagem: string } => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { mensagem: MSG_ERRO_GERAR };
  }
  const corpo = data as Record<string, unknown>;
  const erroRf = primeiroTexto(corpo.rf_responsavel_conferencia);
  if (erroRf) return { erroRf, mensagem: erroRf };

  const mensagem =
    primeiroTexto(corpo.non_field_errors) ??
    primeiroTexto(corpo.detail) ??
    Object.values(corpo).map(primeiroTexto).find(Boolean) ??
    MSG_ERRO_GERAR;
  return { mensagem };
};
