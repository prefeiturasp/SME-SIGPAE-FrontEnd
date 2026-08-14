import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { mockListaMarcas } from "src/mocks/produto.service/mockGetNomesMarcas";
import { mockListaFabricantes } from "src/mocks/produto.service/mockGetNomesFabricantes";
import { mockGetNomesProdutosReclamacao } from "src/mocks/produto.service/mockGetResponderReclamacaoNomesProdutos";
import { mockListaTerceirizadas } from "src/mocks/Produto/BuscaAvancada/listas";

import userEvent from "@testing-library/user-event";
import FormBuscaProduto from "../index";
import HTTP_STATUS from "http-status-codes";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/AutoCompleteField", () => (props) => (
  <input
    data-testid={props.dataTestId}
    value={props.input.value || ""}
    onChange={(e) => props.input.onChange(e.target.value)}
  />
));

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: (props) => (
    <input
      data-testid={props.dataTestId}
      placeholder={props.placeholder}
      value={props.input.value || ""}
      onChange={(e) => props.input.onChange(e.target.value)}
    />
  ),
}));

describe("Teste do Formulário de Busca do Produto", () => {
  const onSubmit = jest.fn();

  const setup = () => {
    return render(
      <MemoryRouter>
        <FormBuscaProduto onSubmit={onSubmit} />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mock.reset();

    mock.onGet("/marcas/lista-nomes/").reply(HTTP_STATUS.OK, mockListaMarcas);
    mock
      .onGet("/fabricantes/lista-nomes/")
      .reply(HTTP_STATUS.OK, mockListaFabricantes);
    mock
      .onGet("/produtos/lista-nomes/")
      .reply(HTTP_STATUS.OK, mockGetNomesProdutosReclamacao);
    mock
      .onGet("/terceirizadas/lista-nomes/")
      .reply(HTTP_STATUS.OK, mockListaTerceirizadas);
    mock
      .onGet("/produtos/filtro-relatorio-em-analise-sensorial/")
      .reply(HTTP_STATUS.OK, {
        results: [
          {
            nome: "PATINHO",
            marca: {
              nome: "Carrera",
            },
            fabricante: {
              nome: "Carrera S.A.",
            },
            criado_em: "2026-08-01 10:00:00",

            ultima_homologacao: {
              log_solicitacao_analise: {
                criado_em: "2026-08-05 14:30:00",
                justificativa: "Produto enviado para análise sensorial.",
              },

              rastro_terceirizada: {
                nome_fantasia: "Agroporto",
              },

              resposta_analise: {
                data: "10/08/2026",
                hora: "14:00",
                responsavel_produto: "João da Silva",
                registro_funcional: "123456",
                criado_em: "2026-08-11 16:00:00",
                observacao: "Produto recebido e analisado.",
              },

              protocolo_analise_sensorial: "AS-2026-0001",
            },
          },
        ],
      });
  });

  const preencherFormulario = async () => {
    const nomeProduto = await screen.findByTestId("nome-produto");
    const nomeTerceirizada = screen.getByTestId("nome-terceirizada");
    const nomeMarca = screen.getByTestId("nome-marca");
    const nomeFabricante = screen.getByTestId("nome-fabricante");
    const dataInicial = screen.getByTestId("data-inicial");
    const dataFinal = screen.getByTestId("data-final");

    await userEvent.type(nomeProduto, "PATINHO");
    await userEvent.type(nomeTerceirizada, "Agroporto");
    await userEvent.type(nomeMarca, "Carrera");
    await userEvent.type(nomeFabricante, "Carrera S.A.");
    await userEvent.type(dataInicial, "01/08/2026");
    await userEvent.type(dataFinal, "10/08/2026");
  };

  it("deve renderizar todos os campos iniciais do formulário", async () => {
    setup();

    const campos = [
      "nome-produto",
      "nome-terceirizada",
      "nome-marca",
      "nome-fabricante",
      "data-inicial",
      "data-final",
      "botao-consultar",
      "botao-limpar-filtros",
    ];

    for (const campo of campos) {
      expect(await screen.findByTestId(campo)).toBeInTheDocument();
    }
  });

  it("deve permitir preencher todos os campos do formulário", async () => {
    setup();

    await preencherFormulario();

    expect(screen.getByTestId("nome-produto")).toHaveValue("PATINHO");
    expect(screen.getByTestId("nome-terceirizada")).toHaveValue("Agroporto");
    expect(screen.getByTestId("nome-marca")).toHaveValue("Carrera");
    expect(screen.getByTestId("nome-fabricante")).toHaveValue("Carrera S.A.");
    expect(screen.getByTestId("data-inicial")).toHaveValue("01/08/2026");
    expect(screen.getByTestId("data-final")).toHaveValue("10/08/2026");
  });

  it("deve limpar os campos preenchidos ao clicar em Limpar Filtros", async () => {
    setup();

    const nomeProduto = await screen.findByTestId("nome-produto");
    const dataInicial = screen.getByTestId("data-inicial");

    await userEvent.type(nomeProduto, "PATINHO");
    await userEvent.type(dataInicial, "01/08/2026");

    expect(nomeProduto).toHaveValue("PATINHO");
    expect(dataInicial).toHaveValue("01/08/2026");

    await userEvent.click(screen.getByTestId("botao-limpar-filtros"));

    expect(nomeProduto).toHaveValue("");
    expect(dataInicial).toHaveValue("");
  });

  it("deve exibir os dados do produto ao submeter o formulário preenchido", async () => {
    setup();

    await preencherFormulario();

    await userEvent.click(screen.getByTestId("botao-consultar"));

    expect(await screen.findByText("PATINHO")).toBeInTheDocument();
    expect(screen.getByText("Carrera")).toBeInTheDocument();
    expect(screen.getByText("Carrera S.A.")).toBeInTheDocument();
    expect(screen.getByText("Agroporto")).toBeInTheDocument();
  });

  it("deve limpar as opções do filtro quando o texto da pesquisa for removido", async () => {
    setup();

    const nomeProduto = await screen.findByTestId("nome-produto");

    await userEvent.type(nomeProduto, "PATINHO");

    expect(nomeProduto).toHaveValue("PATINHO");

    await userEvent.clear(nomeProduto);

    expect(nomeProduto).toHaveValue("");
  });
});
