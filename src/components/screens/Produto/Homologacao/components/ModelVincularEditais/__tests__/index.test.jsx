import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import HTTP_STATUS from "http-status-codes";

import { ModalVincularEditais } from "../index";
import { CODAEHomologaProduto } from "src/services/produto.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/produto.service", () => ({
  CODAEHomologaProduto: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/MultiSelect/StatefulMultiSelect", () => ({
  __esModule: true,
  default: ({
    onSelectedChanged,
    options,
    overrideStrings,
    selected,
    valueRenderer,
  }) => (
    <div>
      <span data-testid="rotulo-editais">
        {valueRenderer(selected, options)}
      </span>
      <span>{overrideStrings.selectAll}</span>
      <button
        type="button"
        onClick={() => onSelectedChanged([options[0].value])}
      >
        Selecionar edital
      </button>
    </div>
  ),
}));

describe("ModalVincularEditais", () => {
  const uuidHomologacao = "a3ea4b4b-411d-4af0-8abc-1865ea64ad62";
  const uuidEditalAtivo = "869a8078-0011-4a10-9a85-0e3066837221";
  const uuidEditalSuspenso = "a25e3990-884b-44dd-adf5-754fd10c16c8";
  const uuidOutroEdital = "83dcb9db-e3c3-40b1-a650-f744603d4eca";
  const uuidHomologacaoAtualizada = "9d9d5fe5-a6d3-446c-942c-75635b929eed";

  const produto = {
    uuid: "fa6b690d-7d84-4213-a6ba-7bf4db992620",
    nome: "Arroz integral",
    marca: { nome: "Marca teste" },
    fabricante: { nome: "Fabricante teste" },
    eh_para_alunos_com_dieta: false,
    vinculos_produto_edital: [
      {
        suspenso: false,
        edital: { uuid: uuidEditalAtivo },
      },
      {
        suspenso: true,
        edital: { uuid: uuidEditalSuspenso },
      },
    ],
  };

  const editaisOptions = [
    { uuid: uuidEditalAtivo, numero: "Edital 01/2026" },
    { uuid: uuidOutroEdital, numero: "Edital 02/2026" },
    { uuid: uuidEditalSuspenso, numero: "Edital 03/2026" },
  ];

  const closeModal = jest.fn();
  const loadSolicitacao = jest.fn();
  const onChangeEditais = jest.fn();

  const propsPadrao = {
    showModal: true,
    closeModal,
    editaisOptions,
    editais: [uuidEditalAtivo],
    onChangeEditais,
    uuid: uuidHomologacao,
    loadSolicitacao,
    produto,
  };

  const renderizarModal = (props = {}) =>
    render(<ModalVincularEditais {...propsPadrao} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState(
      null,
      "",
      "/produto/homologacao?origem=consulta",
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renderiza o modal com os dados de um produto comum", () => {
    renderizarModal();

    expect(screen.getByText("Homologação do Produto")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Arroz integral")).toBeDisabled();
    expect(screen.getByDisplayValue("Marca teste")).toBeDisabled();
    expect(screen.getByDisplayValue("Fabricante teste")).toBeDisabled();
    expect(screen.getByDisplayValue("Comum")).toBeDisabled();
    expect(screen.getByText("Todos os editais")).toBeInTheDocument();
    expect(
      screen.queryByText("Justificativa de suspensão"),
    ).not.toBeInTheDocument();
  });

  it("renderiza título personalizado e tipo dieta especial", () => {
    renderizarModal({
      tituloModal: "Aceitar alterações",
      produto: {
        ...produto,
        eh_para_alunos_com_dieta: true,
      },
    });

    expect(screen.getByText("Aceitar alterações")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dieta Especial")).toBeDisabled();
  });

  it.each([
    [[], "Selecione os editais vinculados"],
    [[uuidEditalAtivo], "1 edital selecionado"],
    [[uuidEditalAtivo, uuidOutroEdital], "2 editais selecionados"],
    [
      [uuidEditalAtivo, uuidOutroEdital, uuidEditalSuspenso],
      "Todos os editais estão selecionados",
    ],
  ])(
    "exibe o resumo correto para os editais selecionados",
    (editais, texto) => {
      renderizarModal({ editais });

      expect(screen.getByTestId("rotulo-editais")).toHaveTextContent(texto);
    },
  );

  it("repassa a alteração feita no seletor de editais", () => {
    renderizarModal();

    fireEvent.click(screen.getByText("Selecionar edital"));

    expect(onChangeEditais).toHaveBeenCalledWith([uuidEditalAtivo]);
  });

  it("exige justificativa quando um edital homologado ativo é removido", () => {
    renderizarModal({ editais: [uuidOutroEdital] });

    expect(screen.getByText("Justificativa de suspensão")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Justifique o porquê da suspensão do(s) edital(is).",
      ),
    ).toBeRequired();

    fireEvent.click(screen.getByRole("button", { name: "Homologar" }));

    expect(CODAEHomologaProduto).not.toHaveBeenCalled();
  });

  it("desabilita a homologação quando nenhum edital está selecionado", () => {
    renderizarModal({ editais: [] });

    expect(screen.getByRole("button", { name: "Homologar" })).toBeDisabled();
  });

  it("fecha o modal ao clicar em Voltar", () => {
    renderizarModal();

    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("homologa o produto e recarrega a solicitação atual", async () => {
    CODAEHomologaProduto.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { uuid: uuidHomologacaoAtualizada },
    });
    renderizarModal();

    fireEvent.click(screen.getByRole("button", { name: "Homologar" }));

    await waitFor(() => {
      expect(CODAEHomologaProduto).toHaveBeenCalledWith(uuidHomologacao, {
        editais: [uuidEditalAtivo],
        justificativa: undefined,
      });
      expect(toastSuccess).toHaveBeenCalledWith(
        "Solicitação de homologado enviada com sucesso",
      );
      expect(loadSolicitacao).toHaveBeenCalledWith(uuidHomologacao);
    });
    expect(closeModal).toHaveBeenCalledTimes(1);
  });

  it("homologa com justificativa e carrega a nova solicitação no fluxo de alteração", async () => {
    const pushState = jest.spyOn(window.history, "pushState");
    CODAEHomologaProduto.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { uuid: uuidHomologacaoAtualizada },
    });
    renderizarModal({
      editais: [uuidOutroEdital],
      ehSuspensaoFluxoAlteracaoDados: true,
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Justifique o porquê da suspensão do(s) edital(is).",
      ),
      { target: { value: "Edital não deve permanecer vinculado." } },
    );
    fireEvent.click(screen.getByRole("button", { name: "Homologar" }));

    await waitFor(() => {
      expect(CODAEHomologaProduto).toHaveBeenCalledWith(uuidHomologacao, {
        editais: [uuidOutroEdital],
        justificativa: "Edital não deve permanecer vinculado.",
      });
      expect(loadSolicitacao).toHaveBeenCalledWith(uuidHomologacaoAtualizada);
    });
    expect(pushState).toHaveBeenCalledWith(
      null,
      "",
      `/produto/homologacao?origem=consulta&uuid=${uuidHomologacaoAtualizada}`,
    );
  });

  it("exibe a mensagem da API quando a homologação falha", async () => {
    CODAEHomologaProduto.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      data: { detail: "Não foi possível homologar o produto." },
    });
    renderizarModal();

    fireEvent.click(screen.getByRole("button", { name: "Homologar" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível homologar o produto.",
      );
    });
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(closeModal).not.toHaveBeenCalled();
    expect(loadSolicitacao).not.toHaveBeenCalled();
  });
});
