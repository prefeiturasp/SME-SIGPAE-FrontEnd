import { render, screen, fireEvent } from "@testing-library/react";
import { saveAs } from "file-saver";
import { OPTIONS_STATUS } from "src/components/screens/Configuracoes/CargasUsuarios/constants";
import ListagemPlanilhas from "..";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

describe("Testes de comportamento do componente de Listagem de Planilhas", () => {
  const executarCarga = jest.fn();
  const buscarPlanilhas = jest.fn();
  const setShowRemocao = jest.fn();

  const baseProps = {
    filtros: { modelo: "SERVIDOR" },
    page: 1,
    executarCarga,
    buscarPlanilhas,
    setShowRemocao,
  };

  const criarPlanilha = (status, overrides = {}) => ({
    uuid: "uuid-1",
    conteudo: "http://teste.com/arquivo.xlsx",
    criado_em: "01/01/2024",
    alterado_em: "01/01/2024",
    resultado: "http://teste.com/resultado.xlsx",
    status,
    ...overrides,
  });

  const setup = (props = {}) =>
    render(
      <ListagemPlanilhas
        {...baseProps}
        planilhas={[criarPlanilha(OPTIONS_STATUS[0].uuid)]}
        {...props}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar título corretamente", () => {
    setup();

    expect(screen.getByText("Usuários Servidores")).toBeInTheDocument();
  });

  it("deve renderizar dados da planilha", () => {
    setup();

    expect(screen.getByText("arquivo.xlsx")).toBeInTheDocument();
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  it("deve chamar executarCarga quando clicar no botão executar", () => {
    setup({
      planilhas: [criarPlanilha(OPTIONS_STATUS[0].uuid)],
    });

    const botao = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector(".fa-play-circle"));

    fireEvent.click(botao);

    expect(executarCarga).toHaveBeenCalledWith("uuid-1");
  });

  it("deve chamar buscarPlanilhas quando status for processamento", () => {
    setup({
      planilhas: [criarPlanilha(OPTIONS_STATUS[1].uuid)],
    });

    const botao = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector(".fa-sync"));

    fireEvent.click(botao);

    expect(buscarPlanilhas).toHaveBeenCalledWith(1);
  });

  it("deve baixar arquivo de erro quando status for erro com resultado", () => {
    setup({
      planilhas: [criarPlanilha(OPTIONS_STATUS[4].uuid)],
    });

    const botoes = screen.getAllByRole("button");

    fireEvent.click(botoes[0]);

    expect(saveAs).toHaveBeenCalledWith("https://teste.com/resultado.xlsx");
  });

  it("deve baixar arquivo original", () => {
    setup();

    const botoes = screen.getAllByRole("button");

    fireEvent.click(botoes[botoes.length - 2]);

    expect(saveAs).toHaveBeenCalledWith("https://teste.com/arquivo.xlsx");
  });

  it("deve chamar setShowRemocao ao clicar em remover", () => {
    setup();

    const botoes = screen.getAllByRole("button");

    fireEvent.click(botoes[botoes.length - 1]);

    expect(setShowRemocao).toHaveBeenCalledWith("uuid-1");
  });

  it("deve desabilitar download quando status for erro crítico", () => {
    setup({
      planilhas: [criarPlanilha(OPTIONS_STATUS[3].uuid)],
    });

    const botoes = screen.getAllByRole("button");

    const botaoDownload = botoes.find((btn) => btn.disabled);

    expect(botaoDownload).toBeDisabled();
  });

  it("não deve renderizar ações quando status for bloqueado", () => {
    setup({
      planilhas: [criarPlanilha(OPTIONS_STATUS[5].uuid)],
    });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
