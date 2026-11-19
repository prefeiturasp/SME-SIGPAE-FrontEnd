import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { DIETA_ESPECIAL, PROTOCOLO_PADRAO_DIETA } from "src/configs/constants";
import { mockListaNumeros } from "src/mocks/LancamentoInicial/CadastroDeClausulas/listaDeNumeros";
import {
  mockConsultaProtocoloPadrao,
  mockNomesProtocolos,
} from "src/mocks/services/dietaEspecial.service/mockConsultaProtocoloPadrao";
import mock from "src/services/_mock";
import Filtros from "../Filtros";

const URL_CONSULTA = "/protocolo-padrao-dieta-especial/";
const MENSAGEM_ERRO = "Houve um erro ao tentar filtrar os Protocolos";
const TITULO_MODAL = "Selecionar protocolos padrão aos editais";
const editais = mockListaNumeros.results;
const edital = editais.find(({ numero }) => numero === "PARCEIRA");

const renderizaFiltros = () => {
  const props = {
    setResultado: jest.fn(),
    nomes: mockNomesProtocolos.results,
    status: ["Liberado", "Não liberado"],
    setCarregando: jest.fn(),
    setTotal: jest.fn(),
    filtros: {},
    setFiltros: jest.fn(),
    setPage: jest.fn(),
    editais,
    editaisDestino: editais,
    onChangePage: jest.fn(),
  };
  render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Filtros {...props} />} />
        <Route
          path={`/${DIETA_ESPECIAL}/${PROTOCOLO_PADRAO_DIETA}`}
          element={<div>Cadastro de Protocolo Padrão</div>}
        />
      </Routes>
      <ToastContainer />
    </MemoryRouter>,
  );
  return props;
};

const campoNome = () =>
  document.querySelector(".input-busca-nome-protocolo input");
const campoStatus = () =>
  document.querySelector(".input-busca-status-protocolo input");

const preencher = (campo, valor) =>
  fireEvent.change(campo, { target: { value: valor } });

const selecionarEdital = async (numero) => {
  const multiSelect = document.querySelector(".multi-select");
  fireEvent.click(multiSelect.querySelector(".dropdown-heading"));
  const listbox = await within(multiSelect).findByRole("listbox");
  fireEvent.click(within(listbox).getByText(numero));
  fireEvent.mouseDown(document.body);
  fireEvent.click(document.body);
};

const consultar = () =>
  fireEvent.click(screen.getByRole("button", { name: "Consultar" }));

describe("Filtros da consulta de Protocolo Padrão", () => {
  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it("renderiza os campos e botões do filtro", () => {
    renderizaFiltros();

    expect(screen.getByText("Nome do Protocolo Padrão")).toBeInTheDocument();
    expect(screen.getByText("Status do Protocolo Padrão")).toBeInTheDocument();
    expect(screen.getByText("Número do Edital")).toBeInTheDocument();
    expect(screen.getByText("Selecione")).toBeInTheDocument();
    [
      "Criar Protocolo Padrão",
      "Vincular Protocolos Padrão",
      "Consultar",
      "Limpar campos",
    ].forEach((name) => {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    });
    expect(screen.queryByText(TITULO_MODAL)).not.toBeInTheDocument();
  });

  it("consulta os protocolos com os filtros informados", async () => {
    mock.onGet(URL_CONSULTA).reply(200, mockConsultaProtocoloPadrao);
    const props = renderizaFiltros();

    preencher(campoNome(), "alergia");
    preencher(campoStatus(), "Liberado");
    await selecionarEdital(edital.numero);
    consultar();

    const payloadEsperado = {
      nome_protocolo: "alergia",
      status: "LIBERADO",
      editais: [edital.uuid],
    };
    await waitFor(() =>
      expect(props.setResultado).toHaveBeenCalledWith(
        mockConsultaProtocoloPadrao,
      ),
    );
    expect(mock.history.get[0].params).toEqual(payloadEsperado);
    expect(props.setTotal).toHaveBeenCalledWith(
      mockConsultaProtocoloPadrao.count,
    );
    expect(props.setFiltros).toHaveBeenCalledWith(payloadEsperado);
    expect(props.setCarregando).toHaveBeenNthCalledWith(1, true);
    expect(props.setCarregando).toHaveBeenLastCalledWith(false);
  });

  it.each([
    ["Não liberado", "NAO_LIBERADO"],
    ["Outro", "Outro"],
  ])(
    "envia o status '%s' formatado como '%s'",
    async (statusInformado, statusEnviado) => {
      mock.onGet(URL_CONSULTA).reply(200, mockConsultaProtocoloPadrao);
      const props = renderizaFiltros();

      preencher(campoStatus(), statusInformado);
      consultar();

      await waitFor(() => expect(props.setFiltros).toHaveBeenCalled());
      expect(mock.history.get[0].params.status).toBe(statusEnviado);
    },
  );

  it("não atualiza o resultado quando a consulta não retorna 200", async () => {
    mock.onGet(URL_CONSULTA).reply(204, {});
    const props = renderizaFiltros();

    consultar();

    await waitFor(() =>
      expect(props.setCarregando).toHaveBeenLastCalledWith(false),
    );
    expect(props.setResultado).not.toHaveBeenCalled();
    expect(props.setTotal).not.toHaveBeenCalled();
    expect(props.setFiltros).not.toHaveBeenCalled();
    expect(screen.queryByText(MENSAGEM_ERRO)).not.toBeInTheDocument();
  });

  it("exibe erro quando a consulta falha", async () => {
    mock.onGet(URL_CONSULTA).reply(500);
    const props = renderizaFiltros();

    consultar();

    expect(await screen.findByText(MENSAGEM_ERRO)).toBeInTheDocument();
    expect(props.setResultado).not.toHaveBeenCalled();
    expect(props.setCarregando).toHaveBeenLastCalledWith(false);
  });

  it("limpa os campos, o resultado e a página atual", () => {
    const props = renderizaFiltros();
    preencher(campoNome(), "alergia");
    preencher(campoStatus(), "Liberado");

    fireEvent.click(screen.getByRole("button", { name: "Limpar campos" }));

    expect(campoNome()).toHaveValue("");
    expect(campoStatus()).toHaveValue("");
    expect(props.setResultado).toHaveBeenCalledWith(undefined);
    expect(props.setPage).toHaveBeenCalledWith(1);
  });

  it("navega para a criação de Protocolo Padrão", () => {
    renderizaFiltros();

    fireEvent.click(
      screen.getByRole("button", { name: "Criar Protocolo Padrão" }),
    );

    expect(
      screen.getByText("Cadastro de Protocolo Padrão"),
    ).toBeInTheDocument();
  });

  it("abre e fecha o modal de vínculo de protocolos", async () => {
    renderizaFiltros();

    fireEvent.click(
      screen.getByRole("button", { name: "Vincular Protocolos Padrão" }),
    );
    const modal = await screen.findByRole("dialog");
    expect(within(modal).getByText(TITULO_MODAL)).toBeInTheDocument();

    fireEvent.click(within(modal).getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByText(TITULO_MODAL)).not.toBeInTheDocument(),
    );
  });
});
