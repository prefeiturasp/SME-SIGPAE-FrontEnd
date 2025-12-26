import { fluxoMedicaoInicial } from "src/components/Shareable/FluxoDeStatus/helper.jsx";

describe("fluxoMedicaoInicial", () => {
  test('não deve conter "Aguardando encerramento pela CODAE"', () => {
    const statusExcluido = fluxoMedicaoInicial.find(
      (item) =>
        item.status_evento_explicacao === "Aguardando encerramento pela CODAE",
    );

    expect(statusExcluido).toBeUndefined();
  });

  test("deve ter apenas 1 item após remoção", () => {
    expect(fluxoMedicaoInicial).toHaveLength(1);
  });

  test('deve manter o item "Solicitação de Medição não Iniciada"', () => {
    const itemRestante = fluxoMedicaoInicial.find(
      (item) =>
        item.status_evento_explicacao === "Solicitação de Medição não Iniciada",
    );

    expect(itemRestante).toBeDefined();
    expect(itemRestante.titulo).toBe("Solicitação de Medição não Iniciada");
  });

  test("todos os itens devem ter status_evento_explicacao diferente do excluído", () => {
    const valoresExplicacao = fluxoMedicaoInicial.map(
      (item) => item.status_evento_explicacao,
    );

    expect(valoresExplicacao).not.toContain(
      "Aguardando encerramento pela CODAE",
    );
    expect(valoresExplicacao).toContain("Solicitação de Medição não Iniciada");
  });
});

describe("Estrutura do fluxoMedicaoInicial", () => {
  test("deve ter a estrutura correta para o item restante", () => {
    expect(fluxoMedicaoInicial[0]).toEqual({
      titulo: "Solicitação de Medição não Iniciada",
      status: "",
      criado_em: "",
      usuario: null,
      status_evento_explicacao: "Solicitação de Medição não Iniciada",
    });
  });

  test("cada item deve ter todas as propriedades necessárias", () => {
    fluxoMedicaoInicial.forEach((item) => {
      expect(item).toHaveProperty("titulo");
      expect(item).toHaveProperty("status");
      expect(item).toHaveProperty("criado_em");
      expect(item).toHaveProperty("usuario");
      expect(item).toHaveProperty("status_evento_explicacao");
    });
  });
});
