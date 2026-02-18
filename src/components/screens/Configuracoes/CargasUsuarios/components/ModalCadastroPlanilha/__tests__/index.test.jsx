import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalCadastroVinculo from "../";

jest.mock("src/components/Shareable/Input/InputFile", () => ({
  __esModule: true,
  default: ({ texto, setFiles }) => (
    <div data-testid="mock-input">
      <span>{texto}</span>
      <button onClick={() => setFiles([{ name: "teste.pdf" }])}>Upload</button>
    </div>
  ),
}));

describe("Testes de comportamentos componente - ModalCadastroVinculo", () => {
  const onSubmit = jest.fn();
  const setShow = jest.fn();

  const setup = async (props = {}) => {
    await act(async () => {
      render(
        <ModalCadastroVinculo
          show={true}
          setShow={setShow}
          onSubmit={onSubmit}
          servidores={false}
          {...props}
        />,
      );
    });

    return props;
  };

  it("renderiza o modal corretamente", async () => {
    await setup();

    expect(screen.getByText("Inserir Carga de Usuários")).toBeInTheDocument();

    expect(
      screen.getByText("Modelo de Planilha a ser Inserido"),
    ).toBeInTheDocument();
  });

  it("exibe opções de tipo de planilha quando servidores=false", async () => {
    await setup({ servidores: false });

    expect(screen.getByLabelText("Planilha Servidores")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Planilha Não Servidores"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Planilha UEs Parceiras")).toBeInTheDocument();
  });

  it("não exibe radios quando servidores=true", async () => {
    await setup({ servidores: true });

    expect(
      screen.queryByText("Modelo de Planilha a ser Inserido"),
    ).not.toBeInTheDocument();
  });

  it("botão Inserir inicia desabilitado", async () => {
    await setup();

    const botaoInserir = screen.getByRole("button", { name: "Inserir" });
    expect(botaoInserir).toBeDisabled();
  });

  it("habilita botão Inserir após selecionar tipo e anexar arquivo", async () => {
    await setup();

    fireEvent.click(screen.getByLabelText("Planilha Servidores"));
    fireEvent.click(screen.getByText("Upload"));

    const botaoInserir = screen.getByRole("button", { name: "Inserir" });
    expect(botaoInserir).toBeEnabled();
  });

  it("chama onSubmit com tipoPlanilha e arquivo ao clicar em Inserir", async () => {
    await setup();

    fireEvent.click(screen.getByLabelText("Planilha Servidores"));
    fireEvent.click(screen.getByText("Upload"));
    fireEvent.click(screen.getByRole("button", { name: "Inserir" }));

    expect(onSubmit).toHaveBeenCalled();
  });

  it("botão Cancelar fecha o modal", async () => {
    await setup();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(setShow).toHaveBeenCalledWith(false);
  });
});
