import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ModalHistorico from "src/components/Shareable/ModalHistorico";

const log = {
  uuid: "2b166c5d-86a9-45a0-853f-283909fae165",
  criado_em: "04/09/2026 10:30:00",
  status_evento_explicacao: "Escola/Nutricionista reclamou do produto",
  tipo_solicitacao_explicacao: "Reclamação de Produto",
  justificativa: "Produto em desacordo",
  usuario: {
    nome: "Usuário de Teste",
    tipo_usuario: "escola",
    registro_funcional: "1234567",
  },
};

const renderizarModal = (props = {}) =>
  render(
    <MemoryRouter>
      <ModalHistorico
        visible
        onOk={jest.fn()}
        onCancel={jest.fn()}
        logs={[log]}
        getHistorico={() => [log]}
        {...props}
      />
    </MemoryRouter>,
  );

describe("ModalHistorico com ações personalizadas", () => {
  it("renderiza as ações referentes ao log selecionado", () => {
    const renderizarAcoesLog = jest.fn(() => (
      <button>Baixar arquivo da reclamação</button>
    ));
    renderizarModal({ renderizarAcoesLog });

    fireEvent.click(screen.getByTestId("log-item-0"));

    expect(renderizarAcoesLog).toHaveBeenCalledWith(log);
    expect(
      screen.getByRole("button", { name: "Baixar arquivo da reclamação" }),
    ).toBeInTheDocument();
  });

  it("mantém a impressão do histórico disponível", () => {
    const imprimirHistorico = jest.fn();
    renderizarModal({ printHistorico: imprimirHistorico });

    fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));

    expect(imprimirHistorico).toHaveBeenCalledTimes(1);
  });
});
