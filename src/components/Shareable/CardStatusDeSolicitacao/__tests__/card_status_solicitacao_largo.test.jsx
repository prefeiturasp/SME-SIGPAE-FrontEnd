import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CardStatusDeSolicitacaoLargo } from "../CardStatusDeSolicitacaoLargo";
import {
  RELATORIO,
  INCLUSAO_ALIMENTACAO,
  SOLICITACAO_KIT_LANCHE,
} from "src/configs/constants";

describe("Testes de comportamentos componente - CardStatusDeSolicitacaoLargo", () => {
  const defaultProps = {
    titulo: "Solicitações Pendentes",
    tipo: "pendente",
    icone: "fa-clock",
    solicitacoes: [
      {
        descricao: "Solicitação 1",
        data_log: "01/01/2026",
        tipo_doc: "KIT_LANCHE_AVULSA",
        uuid: "123",
      },
    ],
  };

  const setup = (props = {}) => {
    return render(
      <MemoryRouter>
        <CardStatusDeSolicitacaoLargo {...defaultProps} {...props} />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o ícone corretamente", () => {
    const { container } = setup();

    expect(screen.getByText("Solicitações Pendentes")).toBeInTheDocument();

    expect(container.querySelector(".fa-clock")).toBeInTheDocument();
  });

  it("deve renderizar as informações da solicitação usando descricao e data_log", () => {
    setup();

    expect(screen.getByText("Solicitação 1")).toBeInTheDocument();

    expect(screen.getByText("01/01/2026")).toBeInTheDocument();
  });

  it("deve renderizar text e date quando descricao e data_log não forem informados", () => {
    setup({
      solicitacoes: [
        {
          text: "Texto alternativo",
          date: "02/02/2026",
          tipo_doc: "KIT_LANCHE_AVULSA",
          uuid: "456",
        },
      ],
    });

    expect(screen.getByText("Texto alternativo")).toBeInTheDocument();

    expect(screen.getByText("02/02/2026")).toBeInTheDocument();
  });

  it("deve utilizar o link informado na solicitação", () => {
    setup({
      solicitacoes: [
        {
          descricao: "Solicitação com link",
          data_log: "03/03/2026",
          link: "/link-customizado",
        },
      ],
    });

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/link-customizado");
  });

  it("deve montar a url corretamente utilizando o helper", () => {
    setup();

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      `/${SOLICITACAO_KIT_LANCHE}/${RELATORIO}?uuid=123&ehInclusaoContinua=false`,
    );
  });

  it("deve definir ehInclusaoContinua como true quando tipo_doc for INC_ALIMENTA_CONTINUA", () => {
    setup({
      solicitacoes: [
        {
          descricao: "Inclusão contínua",
          data_log: "04/04/2026",
          tipo_doc: "INC_ALIMENTA_CONTINUA",
          uuid: "789",
        },
      ],
    });

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute(
      "href",
      `/${INCLUSAO_ALIMENTACAO}/${RELATORIO}?uuid=789&ehInclusaoContinua=true`,
    );
  });

  it("deve renderizar múltiplas solicitações", () => {
    setup({
      solicitacoes: [
        {
          descricao: "Solicitação 1",
          data_log: "01/01/2026",
          tipo_doc: "KIT_LANCHE_AVULSA",
          uuid: "123",
        },
        {
          descricao: "Solicitação 2",
          data_log: "02/02/2026",
          tipo_doc: "KIT_LANCHE_AVULSA",
          uuid: "456",
        },
      ],
    });

    expect(screen.getByText("Solicitação 1")).toBeInTheDocument();

    expect(screen.getByText("Solicitação 2")).toBeInTheDocument();

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
