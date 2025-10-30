import { act, render, screen } from "@testing-library/react";
import { TabelaEspecificacoesProduto } from "../index";
import {
  RECLAMACAO_PRODUTO_STATUS_EXPLICACAO,
  TIPO_PERFIL,
} from "src/constants/shared";
import { mockHomologacao } from "src/mocks/Produto/Homologacao/mockHomologacao";

describe("Testes de comportamentos componente de Tabela de Especificações do Produto", () => {
  const especificacoesMock = mockHomologacao.produto.especificacoes;
  const ultimaHomologacao = mockHomologacao.produto.ultima_homologacao;

  const setup = async (props = {}) => {
    await act(async () => {
      render(
        <TabelaEspecificacoesProduto
          homologacao={props.homologacao}
          especificacoes={props.especificacoes}
        />,
      );
    });
  };

  it("não deve renderizar nada se props.especificacoes não existir", async () => {
    await setup({
      homologacao: ultimaHomologacao,
    });

    expect(screen.queryByText("Volume")).not.toBeInTheDocument();
    expect(screen.queryByText("Unidade de Medida")).not.toBeInTheDocument();
  });

  it("deve renderizar título como <p> quando não for perfil terceirizada aguardando análise sensorial", async () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);

    await setup({
      homologacao: ultimaHomologacao,
      especificacoes: especificacoesMock,
    });

    expect(
      screen.getByText("Informações referentes ao volume e unidade de medida"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Informações referentes ao volume e unidade de medida")
        .tagName,
    ).toBe("P");
  });

  it("deve renderizar título como <label> quando for perfil terceirizada aguardando análise sensorial", async () => {
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);

    await setup({
      homologacao: {
        ...ultimaHomologacao,
        ultimo_log: {
          status_evento_explicacao:
            RECLAMACAO_PRODUTO_STATUS_EXPLICACAO.AGUARDANDO_ANALISE_SENSORIAL,
        },
      },
      especificacoes: especificacoesMock,
    });

    expect(
      screen.getByText("Informações referentes ao volume e unidade de medida")
        .tagName,
    ).toBe("LABEL");
  });

  it("deve renderizar todas as linhas da tabela com os dados corretos", async () => {
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    await setup({
      homologacao: ultimaHomologacao,
      especificacoes: especificacoesMock,
    });

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(2);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("CAIXA")).toBeInTheDocument();
    expect(screen.getByText("BIG BAG")).toBeInTheDocument();
  });

  it("deve truncar texto e usar Tooltip quando o nome da embalagem tiver mais de 40 caracteres", async () => {
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    const especificacoesMockNome = [
      {
        ...especificacoesMock[0],
        nome: "Embalagem Extremamente Longa Que Excede Quarenta Caracteres",
      },
    ];

    await setup({
      homologacao: ultimaHomologacao,
      especificacoes: especificacoesMockNome,
    });

    const nomeTruncado = especificacoesMockNome[0].embalagem_produto.nome.slice(
      0,
      40,
    );
    expect(screen.getByText(nomeTruncado)).toBeInTheDocument();
  });
});
