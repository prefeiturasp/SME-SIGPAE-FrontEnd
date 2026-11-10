import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CardLancamento } from "..";

const mensagemPendencia =
  "Existem atendimentos de Escola Aberta cadastrados no período. " +
  "Não é possível finalizar a medição sem lançamentos.";

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <CardLancamento
        grupo="Escola Aberta"
        cor="#3D9DAD"
        tipos_alimentacao={[{ uuid: "uuid-lanche", nome: "Lanche" }]}
        periodoSelecionado={new Date(2026, 8, 1)}
        solicitacaoMedicaoInicial={{
          uuid: "uuid-solicitacao",
          status: "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE",
        }}
        quantidadeAlimentacoesLancadas={[]}
        errosAoSalvar={[]}
        {...props}
      />
    </MemoryRouter>,
  );

describe("CardLancamento Escola Aberta", () => {
  it("exibe os tipos de alimentação dinâmicos", () => {
    renderCard();

    expect(screen.getByText("Escola Aberta")).toBeInTheDocument();
    expect(screen.getByText(/Lanche/)).toBeInTheDocument();
  });

  it("destaca o bloco e exibe a mensagem de pendência", () => {
    renderCard({
      errosAoSalvar: [
        {
          periodo_escolar: "Escola Aberta",
          erro: mensagemPendencia,
        },
      ],
    });

    const card = screen
      .getByText("Escola Aberta")
      .closest(".lancamento-por-periodo-card");

    expect(card).toHaveClass("border-danger");
    expect(screen.getByText(mensagemPendencia)).toBeInTheDocument();
  });
});
