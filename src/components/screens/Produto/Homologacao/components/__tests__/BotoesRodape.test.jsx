import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { BotoesRodape } from "../BotoesRodape";
import { PAINEL_GESTAO_PRODUTO } from "src/configs/constants";
import { usuarioEhCODAEGestaoProduto } from "src/helpers/utilities";
import {
  CODAECancelaAnaliseSensorialProduto,
  imprimeFichaIdentificacaoProduto,
} from "src/services/produto.service";

const mockNavigate = jest.fn();
const mockModalPadrao = jest.fn(() => <div data-testid="modal-padrao" />);

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ disabled, onClick, texto }) => (
    <button type="button" disabled={disabled} onClick={onClick}>
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/ModalPadrao", () => ({
  ModalPadrao: (props) => mockModalPadrao(props),
}));

jest.mock("src/helpers/utilities", () => ({
  usuarioEhCODAEGestaoProduto: jest.fn(),
}));

jest.mock("src/services/produto.service", () => ({
  CODAECancelaAnaliseSensorialProduto: jest.fn(),
  imprimeFichaIdentificacaoProduto: jest.fn(),
}));

describe("BotoesRodape", () => {
  const homologacao = {
    uuid: "2c5f8669-b655-4884-b52f-153c4554bc2c",
    status: "CODAE_PEDIU_ANALISE_SENSORIAL",
  };

  const renderizarComponente = (props = {}) =>
    render(<BotoesRodape homologacao={{ ...homologacao, ...props }} />);

  const obterUltimasPropsModal = () =>
    mockModalPadrao.mock.calls[mockModalPadrao.mock.calls.length - 1][0];

  beforeEach(() => {
    jest.clearAllMocks();
    usuarioEhCODAEGestaoProduto.mockReturnValue(false);
  });

  it("configura o modal de cancelamento da análise sensorial", () => {
    renderizarComponente();

    expect(obterUltimasPropsModal()).toEqual(
      expect.objectContaining({
        showModal: false,
        toastSuccessMessage: "Análise Sensorial cancelada com sucesso",
        modalTitle:
          "Deseja cancelar a solicitação de amostra para análise sensorial deste produto?",
        labelJustificativa: "Justificativa",
        uuid: homologacao.uuid,
        cancelaAnaliseSensorial: homologacao,
        endpoint: CODAECancelaAnaliseSensorialProduto,
      }),
    );
  });

  it("imprime a ficha de identificação do produto", () => {
    renderizarComponente();

    fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));

    expect(imprimeFichaIdentificacaoProduto).toHaveBeenCalledWith(
      homologacao.uuid,
    );
  });

  it("retorna para a página anterior", () => {
    renderizarComponente();

    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it.each([
    [false, "CODAE_PEDIU_ANALISE_SENSORIAL", false],
    [true, "CODAE_HOMOLOGADO", false],
    [true, "CODAE_PEDIU_ANALISE_SENSORIAL", true],
  ])(
    "controla o cancelamento para perfil CODAE %s e status %s",
    (ehUsuarioCODAE, status, deveExibir) => {
      usuarioEhCODAEGestaoProduto.mockReturnValue(ehUsuarioCODAE);

      renderizarComponente({ status });

      const botaoCancelar = screen.queryByRole("button", {
        name: "Cancelar Análise Sensorial",
      });
      if (deveExibir) {
        expect(botaoCancelar).toBeInTheDocument();
      } else {
        expect(botaoCancelar).not.toBeInTheDocument();
      }
    },
  );

  it("abre e fecha o modal de cancelamento", () => {
    usuarioEhCODAEGestaoProduto.mockReturnValue(true);
    renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", { name: "Cancelar Análise Sensorial" }),
    );
    let propsModal = obterUltimasPropsModal();
    expect(propsModal.showModal).toBe(true);

    act(() => propsModal.closeModal());
    propsModal = obterUltimasPropsModal();
    expect(propsModal.showModal).toBe(false);
  });

  it("direciona para o painel após cancelar a análise sensorial", () => {
    renderizarComponente();

    obterUltimasPropsModal().loadSolicitacao();

    expect(mockNavigate).toHaveBeenCalledWith(`/${PAINEL_GESTAO_PRODUTO}`);
  });
});
