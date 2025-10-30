import { act, render, screen } from "@testing-library/react";
import InformacaoDeReclamante from "../index";

describe("Testes de comportamentos do componente - InformacaoDeReclamante", () => {
  const mockReclamacao = {
    escola: { nome: "EMEF PERICLES EUGENIO DA SILVA RAMOS" },
    reclamante_nome: "SUPER USUARIO ESCOLA EMEF",
    reclamante_registro_funcional: "1234567",
    reclamante_cargo: "ANALISTA DE SAUDE",
    reclamacao: "<b>Produto estragado</b>",
    anexos: [
      { arquivo: "https://teste.com/anexo1.pdf" },
      { arquivo: "https://teste.com/anexo2.pdf" },
    ],
  };

  const mockQuestionamento = {
    justificativa: "<p>O fornecedor será notificado.</p>",
  };

  const setup = async (props = {}) => {
    await act(async () => {
      render(
        <InformacaoDeReclamante
          reclamacao={props.reclamacao}
          questionamento={props.questionamento}
          showTitle={props.showTitle}
        />,
      );
    });
  };

  it("deve renderizar o título quando showTitle for true", async () => {
    await setup({
      reclamacao: mockReclamacao,
      questionamento: mockQuestionamento,
      showTitle: true,
    });

    expect(screen.getByText("Informação de reclamante")).toBeInTheDocument();
  });

  it("não deve renderizar o título quando showTitle for false", async () => {
    await setup({
      reclamacao: mockReclamacao,
      questionamento: mockQuestionamento,
      showTitle: false,
    });

    expect(
      screen.queryByText("Informação de reclamante"),
    ).not.toBeInTheDocument();
  });

  it("deve exibir corretamente os dados da escola e do reclamante", async () => {
    await setup({
      reclamacao: mockReclamacao,
      questionamento: mockQuestionamento,
      showTitle: true,
    });

    expect(
      screen.getByText("EMEF PERICLES EUGENIO DA SILVA RAMOS"),
    ).toBeInTheDocument();
    expect(screen.getByText("SUPER USUARIO ESCOLA EMEF")).toBeInTheDocument();
    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("ANALISTA DE SAUDE")).toBeInTheDocument();
  });

  it("deve renderizar corretamente o HTML do campo reclamacao e questionamento", async () => {
    await setup({
      reclamacao: mockReclamacao,
      questionamento: mockQuestionamento,
      showTitle: false,
    });

    expect(screen.getByText("Produto estragado")).toBeInTheDocument();
    expect(
      screen.getByText("O fornecedor será notificado."),
    ).toBeInTheDocument();
  });

  it("deve renderizar os anexos quando existirem", async () => {
    await setup({
      reclamacao: mockReclamacao,
      questionamento: mockQuestionamento,
      showTitle: false,
    });

    expect(screen.getByText("Anexos")).toBeInTheDocument();
    expect(screen.getByText("Anexo 1")).toHaveAttribute(
      "href",
      "https://teste.com/anexo1.pdf",
    );
    expect(screen.getByText("Anexo 2")).toHaveAttribute(
      "href",
      "https://teste.com/anexo2.pdf",
    );
  });

  it("não deve renderizar a seção de anexos se reclamacao.anexos estiver vazio", async () => {
    await setup({
      reclamacao: { ...mockReclamacao, anexos: [] },
      questionamento: mockQuestionamento,
      showTitle: false,
    });

    expect(screen.queryByText("Anexos")).not.toBeInTheDocument();
  });
});
