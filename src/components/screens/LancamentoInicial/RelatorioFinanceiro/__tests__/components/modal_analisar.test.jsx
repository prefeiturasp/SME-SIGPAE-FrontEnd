import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModalAnalisar from "../../components/ModalAnalisar";
import mock from "src/services/_mock";

describe("Testes de comportamentos - ModalAnalisar", () => {
  const setShowModal = jest.fn();
  const onAnalisar = jest.fn();
  const onVisualizar = jest.fn();

  const uuid = "123e4567-e89b-12d3-a456-426614174000";

  const renderComponent = (showModal = true) =>
    render(
      <MemoryRouter>
        <ModalAnalisar
          showModal={showModal}
          setShowModal={setShowModal}
          uuidRelatorio={uuid}
          onAnalisar={onAnalisar}
          onVisualizar={onVisualizar}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o texto do modal quando showModal = true", () => {
    renderComponent(true);

    expect(
      screen.getByText("Analisar ou Visualizar Medição"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Ao acessar o relatório financeiro você poderá apenas visualizar/i,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal = false", () => {
    renderComponent(false);

    expect(
      screen.queryByText("Analisar ou Visualizar Medição"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    renderComponent(true);

    const botaoFechar = screen.getByRole("button", {
      name: /close/i,
    });
    fireEvent.click(botaoFechar);

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve clicar em 'Apenas Visualizar' e chamar onVisualizar", () => {
    renderComponent(true);

    const visualizarButton = screen.getByTestId("botao-visualizar");
    fireEvent.click(visualizarButton);

    expect(onVisualizar).toHaveBeenCalledTimes(1);
  });

  it("deve clicar em 'Analisar Ateste Financeiro' e chamar onAnalisar quando a API retornar 200", async () => {
    mock
      .onPatch(`/medicao-inicial/relatorio-financeiro/${uuid}/`)
      .reply(200, {});

    renderComponent(true);

    const analisarButton = screen.getByTestId("botao-analisar");
    fireEvent.click(analisarButton);

    await waitFor(() => {
      expect(onAnalisar).toHaveBeenCalledTimes(1);
    });

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("deve chamar onAnalisar diretamente quando não existir uuidRelatorio", async () => {
    render(
      <MemoryRouter>
        <ModalAnalisar
          showModal={true}
          setShowModal={setShowModal}
          uuidRelatorio={undefined}
          onAnalisar={onAnalisar}
          onVisualizar={onVisualizar}
        />
      </MemoryRouter>,
    );

    const analisarButton = screen.getByRole("button", {
      name: /Analisar Ateste Financeiro/i,
    });

    fireEvent.click(analisarButton);

    await waitFor(() => {
      expect(onAnalisar).toHaveBeenCalledTimes(1);
    });
  });
});
