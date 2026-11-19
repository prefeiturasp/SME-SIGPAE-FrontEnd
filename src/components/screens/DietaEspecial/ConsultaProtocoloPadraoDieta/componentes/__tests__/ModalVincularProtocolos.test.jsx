import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import { mockListaProtocolosLiberados } from "src/mocks/services/dietaEspecial.service/listaProtocolosLiberados";
import mock from "src/services/_mock";
import { ModalVincularProtocolos } from "../ModalVincularProtolocos";

const URL_PROTOCOLOS_POR_EDITAL =
  "/protocolo-padrao-dieta-especial/lista-protocolos-liberados-por-edital/";
const URL_VINCULAR = "/protocolo-padrao-dieta-especial/atualizar-editais/";
const MENSAGEM_SUCESSO = "Protocolos Padrão vinculados com sucesso!";
const MENSAGEM_ERRO_FILTRO = "Houve um erro ao tentar filtrar os Protocolos";
const MENSAGEM_ERRO_VINCULO =
  "Houve um erro ao tentar vincular os Protocolos Padrão";

const editais = mockListaNumeros.results;
const editalOrigem = editais.find((edital) => edital.numero === "PARCEIRA");
const editalDestino = editais.find((edital) => edital.numero === "456/SME2024");
const protocolo = mockListaProtocolosLiberados.results.find(
  (item) => item.nome_protocolo === "ALERGIA A CAMARÃO",
);

const renderizaModal = (props = {}) => {
  const closeModal = jest.fn();
  const buscar = jest.fn();
  render(
    <>
      <ModalVincularProtocolos
        showModal
        closeModal={closeModal}
        buscar={buscar}
        editais={editais}
        editaisDestino={editais}
        {...props}
      />
      <ToastContainer />
    </>,
  );
  return { closeModal, buscar };
};

const obterMultiSelect = (label) =>
  screen
    .getAllByText(label)
    .find((element) => element.tagName === "LABEL")
    .closest(".final-form-multi-select");

const abrirMultiSelect = async (label) => {
  fireEvent.click(obterMultiSelect(label).querySelector(".dropdown-heading"));
  return screen.findByRole("listbox");
};

const fecharMultiSelect = () => {
  fireEvent.mouseDown(document.body);
  fireEvent.click(document.body);
};

const selecionarNoMultiSelect = async (label, opcao) => {
  const listbox = await abrirMultiSelect(label);
  fireEvent.click(within(listbox).getByText(opcao));
  fecharMultiSelect();
};

const selecionarEditalOrigem = (uuid) => {
  fireEvent.change(
    document.querySelector('select[data-cy="Edital de Origem"]'),
    {
      target: { value: uuid },
    },
  );
};

const preencherFormulario = async () => {
  selecionarEditalOrigem(editalOrigem.uuid);
  await waitFor(() => expect(mock.history.get).toHaveLength(1));
  await selecionarNoMultiSelect("Protocolos Padrão", protocolo.nome_protocolo);
  await selecionarNoMultiSelect("Edital de Destino", editalDestino.numero);
};

const botaoVincular = () => screen.getByRole("button", { name: "Vincular" });

describe("ModalVincularProtocolos", () => {
  beforeEach(() => {
    mock
      .onGet(URL_PROTOCOLOS_POR_EDITAL)
      .reply(200, mockListaProtocolosLiberados);
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it("renderiza o formulário com o vínculo bloqueado até o preenchimento", () => {
    renderizaModal();

    expect(
      screen.getByText("Selecionar protocolos padrão aos editais"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Selecione um edital" }),
    ).toBeInTheDocument();
    editais.forEach(({ numero }) => {
      expect(screen.getByRole("option", { name: numero })).toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText("Selecione o edital de origem"),
    ).toBeDisabled();
    expect(screen.getByTestId("ckeditor-mock")).toBeInTheDocument();
    expect(botaoVincular()).toBeDisabled();
  });

  it("não renderiza o conteúdo quando o modal está fechado", () => {
    renderizaModal({ showModal: false });

    expect(
      screen.queryByText("Selecionar protocolos padrão aos editais"),
    ).not.toBeInTheDocument();
  });

  it("renderiza sem opções de edital de origem quando a lista não foi carregada", () => {
    renderizaModal({ editais: undefined });

    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(botaoVincular()).toBeDisabled();
  });

  it("busca os protocolos liberados do edital de origem selecionado", async () => {
    renderizaModal();

    selecionarEditalOrigem(editalOrigem.uuid);

    await waitFor(() => expect(mock.history.get).toHaveLength(1));
    expect(mock.history.get[0].params).toEqual({
      edital_uuid: editalOrigem.uuid,
    });

    const listbox = await abrirMultiSelect("Protocolos Padrão");
    expect(within(listbox).getAllByRole("checkbox")).toHaveLength(
      mockListaProtocolosLiberados.results.length + 1,
    );
    expect(
      within(listbox).getByText(protocolo.nome_protocolo),
    ).toBeInTheDocument();
  });

  it("não busca protocolos quando o edital de origem selecionado é vazio", () => {
    renderizaModal();

    selecionarEditalOrigem("");

    expect(mock.history.get).toHaveLength(0);
  });

  it("não lista o edital de origem entre os editais de destino", async () => {
    renderizaModal();
    selecionarEditalOrigem(editalOrigem.uuid);
    await waitFor(() => expect(mock.history.get).toHaveLength(1));

    const listbox = await abrirMultiSelect("Edital de Destino");

    expect(
      within(listbox).queryByText(editalOrigem.numero),
    ).not.toBeInTheDocument();
    expect(within(listbox).getByText(editalDestino.numero)).toBeInTheDocument();
  });

  it("exibe erro quando a busca de protocolos do edital falha", async () => {
    mock.onGet(URL_PROTOCOLOS_POR_EDITAL).reply(500);
    renderizaModal();

    selecionarEditalOrigem(editalOrigem.uuid);

    expect(await screen.findByText(MENSAGEM_ERRO_FILTRO)).toBeInTheDocument();
  });

  it("mantém a lista de protocolos vazia quando a busca não retorna 200", async () => {
    mock.onGet(URL_PROTOCOLOS_POR_EDITAL).reply(204, {});
    renderizaModal();

    selecionarEditalOrigem(editalOrigem.uuid);
    await waitFor(() => expect(mock.history.get).toHaveLength(1));

    const listbox = await abrirMultiSelect("Protocolos Padrão");
    expect(
      within(listbox).queryByText(protocolo.nome_protocolo),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(MENSAGEM_ERRO_FILTRO)).not.toBeInTheDocument();
  });

  it("vincula os protocolos aos editais de destino e fecha o modal", async () => {
    mock.onPut(URL_VINCULAR).reply(200, {});
    const { closeModal, buscar } = renderizaModal();
    await preencherFormulario();

    expect(botaoVincular()).toBeEnabled();
    fireEvent.click(botaoVincular());

    expect(await screen.findByText(MENSAGEM_SUCESSO)).toBeInTheDocument();
    expect(JSON.parse(mock.history.put[0].data)).toEqual({
      edital_origem: editalOrigem.uuid,
      protocolos_padrao: [protocolo.uuid],
      editais_destino: [editalDestino.uuid],
    });
    expect(buscar).toHaveBeenCalledTimes(1);
    expect(closeModal).toHaveBeenCalledWith(false);
  });

  it("não fecha o modal quando o vínculo não retorna 200", async () => {
    mock.onPut(URL_VINCULAR).reply(201, {});
    const { closeModal, buscar } = renderizaModal();
    await preencherFormulario();

    fireEvent.click(botaoVincular());

    await waitFor(() => expect(mock.history.put).toHaveLength(1));
    await waitFor(() => expect(botaoVincular()).toBeEnabled());
    expect(screen.queryByText(MENSAGEM_SUCESSO)).not.toBeInTheDocument();
    expect(screen.queryByText(MENSAGEM_ERRO_VINCULO)).not.toBeInTheDocument();
    expect(buscar).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("exibe erro quando o vínculo dos protocolos falha", async () => {
    mock.onPut(URL_VINCULAR).reply(500);
    const { closeModal, buscar } = renderizaModal();
    await preencherFormulario();

    fireEvent.click(botaoVincular());

    expect(await screen.findByText(MENSAGEM_ERRO_VINCULO)).toBeInTheDocument();
    expect(buscar).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
  });

  it("fecha o modal ao clicar em Cancelar", () => {
    const { closeModal } = renderizaModal();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(closeModal).toHaveBeenCalledWith(false);
  });
});
