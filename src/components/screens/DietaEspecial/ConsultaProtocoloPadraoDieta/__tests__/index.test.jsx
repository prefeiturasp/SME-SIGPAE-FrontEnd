import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockListaProtocolosLiberados } from "src/mocks/services/dietaEspecial.service/listaProtocolosLiberados";
import {
  mockConsultaProtocoloPadrao,
  mockConsultaProtocoloPadraoPagina2,
  mockNomesProtocolos,
} from "src/mocks/services/dietaEspecial.service/mockConsultaProtocoloPadrao";
import mock from "src/services/_mock";
import ConsultaProtocoloPadraoDieta from "..";

const URL_NOMES = "/protocolo-padrao-dieta-especial/nomes/";
const URL_CONSULTA = "/protocolo-padrao-dieta-especial/";
const URL_EDITAIS = "/editais/lista-numeros/";
const URL_PROTOCOLOS_POR_EDITAL =
  "/protocolo-padrao-dieta-especial/lista-protocolos-liberados-por-edital/";
const URL_VINCULAR = "/protocolo-padrao-dieta-especial/atualizar-editais/";
const MENSAGEM_ERRO_CARREGAMENTO =
  "Erro ao carregar dados. Tente novamente mais tarde.";
const MENSAGEM_ERRO_PAGINA = "Houve um erro ao tentar trocar página";

const primeiroProtocolo = mockConsultaProtocoloPadrao.results[0];
const protocoloPagina2 = mockConsultaProtocoloPadraoPagina2.results[0];
const editalOrigem = mockListaNumeros.results.find(
  ({ numero }) => numero === "PARCEIRA",
);
const editalDestino = mockListaNumeros.results.find(
  ({ numero }) => numero === "456/SME2024",
);
const protocoloVinculado = mockListaProtocolosLiberados.results.find(
  ({ nome_protocolo }) => nome_protocolo === "ALERGIA A CAMARÃO",
);

const respostaPorPagina = (config) =>
  config.params?.page === 2
    ? [200, mockConsultaProtocoloPadraoPagina2]
    : [200, mockConsultaProtocoloPadrao];

const configurarApi = ({
  editais = [200, mockListaNumeros],
  editaisDestino = [200, mockListaNumeros],
  consulta = respostaPorPagina,
} = {}) => {
  mock.onGet(URL_NOMES).reply(200, mockNomesProtocolos);
  mock
    .onGet(URL_EDITAIS)
    .reply((config) =>
      config.params?.excluir_encerrados ? editaisDestino : editais,
    );
  mock.onGet(URL_CONSULTA).reply(consulta);
};

const requisicoesConsulta = () =>
  mock.history.get.filter(({ url }) => url === URL_CONSULTA);

const renderizaPagina = async () => {
  render(
    <MemoryRouter>
      <ConsultaProtocoloPadraoDieta />
      <ToastContainer />
    </MemoryRouter>,
  );
  await screen.findByText(primeiroProtocolo.nome_protocolo);
};

const aguardarFimDoCarregamento = () =>
  waitFor(() =>
    expect(document.querySelector(".ant-spin-spinning")).toBeNull(),
  );

const irParaPagina = async (pagina) => {
  fireEvent.click(document.querySelector(`.ant-pagination-item-${pagina}`));
  await waitFor(() =>
    expect(
      document.querySelector(`.ant-pagination-item-${pagina}`),
    ).toHaveClass("ant-pagination-item-active"),
  );
};

const selecionarNoMultiSelect = async (modal, label, opcao) => {
  const campo = within(modal)
    .getAllByText(label)
    .find((element) => element.tagName === "LABEL")
    .closest(".final-form-multi-select");
  fireEvent.click(campo.querySelector(".dropdown-heading"));
  const listbox = await within(campo).findByRole("listbox");
  fireEvent.click(within(listbox).getByText(opcao));
  fireEvent.mouseDown(document.body);
  fireEvent.click(document.body);
};

const vincularProtocolo = async () => {
  fireEvent.click(
    screen.getByRole("button", { name: "Vincular Protocolos Padrão" }),
  );
  const modal = await screen.findByRole("dialog");
  fireEvent.change(modal.querySelector('select[data-cy="Edital de Origem"]'), {
    target: { value: editalOrigem.uuid },
  });
  await waitFor(() =>
    expect(
      mock.history.get.some(({ url }) => url === URL_PROTOCOLOS_POR_EDITAL),
    ).toBe(true),
  );
  await selecionarNoMultiSelect(
    modal,
    "Protocolos Padrão",
    protocoloVinculado.nome_protocolo,
  );
  await selecionarNoMultiSelect(
    modal,
    "Edital de Destino",
    editalDestino.numero,
  );
  fireEvent.click(within(modal).getByRole("button", { name: "Vincular" }));
};

describe("ConsultaProtocoloPadraoDieta", () => {
  afterEach(() => {
    mock.reset();
  });

  it("carrega os protocolos, os nomes e os editais ao abrir a tela", async () => {
    configurarApi();
    await renderizaPagina();

    expect(
      await screen.findByRole("button", { name: "Consultar" }),
    ).toBeInTheDocument();
    mockConsultaProtocoloPadrao.results.forEach(({ nome_protocolo }) => {
      expect(screen.getByText(nome_protocolo)).toBeInTheDocument();
    });
    expect(screen.getByText("1, 456/SME2024")).toBeInTheDocument();
    expect(requisicoesConsulta()[0].params).toEqual({});
    expect(mock.history.get.some(({ url }) => url === URL_NOMES)).toBe(true);

    const chamadasEditais = mock.history.get.filter(
      ({ url }) => url === URL_EDITAIS,
    );
    expect(chamadasEditais).toHaveLength(2);
    expect(chamadasEditais[1].params).toEqual({ excluir_encerrados: true });

    await aguardarFimDoCarregamento();
    expect(
      screen.queryByText(MENSAGEM_ERRO_CARREGAMENTO),
    ).not.toBeInTheDocument();
  });

  it.each([
    ["editais", { editais: [400, {}] }],
    ["editais de destino", { editaisDestino: [400, {}] }],
  ])(
    "exibe mensagem de erro quando a busca de %s falha",
    async (_, respostasEditais) => {
      configurarApi(respostasEditais);
      await renderizaPagina();

      expect(
        await screen.findByText(MENSAGEM_ERRO_CARREGAMENTO),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Consultar" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText(primeiroProtocolo.nome_protocolo),
      ).toBeInTheDocument();
      expect(document.querySelector(".ant-spin-spinning")).toBeNull();
    },
  );

  it("busca a página selecionada na paginação", async () => {
    configurarApi();
    await renderizaPagina();

    await irParaPagina(2);

    expect(
      await screen.findByText(protocoloPagina2.nome_protocolo),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(primeiroProtocolo.nome_protocolo),
    ).not.toBeInTheDocument();
    expect(requisicoesConsulta()[1].params).toEqual({ page: 2 });
  });

  it("mantém os filtros aplicados ao trocar de página", async () => {
    configurarApi();
    await renderizaPagina();
    await aguardarFimDoCarregamento();

    fireEvent.change(
      document.querySelector(".input-busca-nome-protocolo input"),
      { target: { value: "ALERGIA" } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Consultar" }));
    await waitFor(() => expect(requisicoesConsulta()).toHaveLength(2));
    await aguardarFimDoCarregamento();

    await irParaPagina(2);

    await screen.findByText(protocoloPagina2.nome_protocolo);
    expect(requisicoesConsulta()[2].params).toEqual({
      nome_protocolo: "ALERGIA",
      page: 2,
    });
  });

  it("refaz a busca da página atual após vincular protocolos", async () => {
    configurarApi();
    mock
      .onGet(URL_PROTOCOLOS_POR_EDITAL)
      .reply(200, mockListaProtocolosLiberados);
    mock.onPut(URL_VINCULAR).reply(200, {});
    await renderizaPagina();
    await irParaPagina(2);
    await screen.findByText(protocoloPagina2.nome_protocolo);

    await vincularProtocolo();

    expect(
      await screen.findByText("Protocolos Padrão vinculados com sucesso!"),
    ).toBeInTheDocument();
    await waitFor(() => expect(requisicoesConsulta()).toHaveLength(3));
    expect(requisicoesConsulta()[2].params).toEqual({ page: 2 });
    await waitFor(() =>
      expect(
        screen.queryByText("Selecionar protocolos padrão aos editais"),
      ).not.toBeInTheDocument(),
    );
  });

  it("remove o resultado ao limpar os campos do filtro", async () => {
    configurarApi();
    await renderizaPagina();
    await aguardarFimDoCarregamento();

    fireEvent.click(screen.getByRole("button", { name: "Limpar campos" }));

    expect(
      screen.queryByText(primeiroProtocolo.nome_protocolo),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".ant-pagination")).toBeNull();
  });

  it("mantém o resultado atual quando a troca de página não retorna 200", async () => {
    configurarApi({
      consulta: (config) =>
        config.params?.page ? [204, {}] : [200, mockConsultaProtocoloPadrao],
    });
    await renderizaPagina();

    await irParaPagina(2);

    await waitFor(() => expect(requisicoesConsulta()).toHaveLength(2));
    await aguardarFimDoCarregamento();
    expect(
      screen.getByText(primeiroProtocolo.nome_protocolo),
    ).toBeInTheDocument();
    expect(screen.queryByText(MENSAGEM_ERRO_PAGINA)).not.toBeInTheDocument();
  });

  it("exibe erro quando a troca de página falha", async () => {
    configurarApi({
      consulta: (config) =>
        config.params?.page ? [500, {}] : [200, mockConsultaProtocoloPadrao],
    });
    await renderizaPagina();

    await irParaPagina(2);

    expect(await screen.findByText(MENSAGEM_ERRO_PAGINA)).toBeInTheDocument();
    expect(
      screen.getByText(primeiroProtocolo.nome_protocolo),
    ).toBeInTheDocument();
    await aguardarFimDoCarregamento();
  });
});
