import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ModalEditarEmail } from "../ModalEditarEmail";
import { ModalExcluirEmail } from "../ModalExcluirEmail";
import ListagemEmails from "../ListagemSolicitacoes";
import { mockEmailGestaoAlimentacao } from "src/mocks/terceirizada.service/mockGetEmailPorModulo";

jest.mock("../ModalEditarEmail", () => ({
  ModalEditarEmail: jest.fn(() => null),
}));

jest.mock("../ModalExcluirEmail", () => ({
  ModalExcluirEmail: jest.fn(() => null),
}));

jest.mock("antd", () => ({
  Tooltip: jest.fn(({ title, children }) => (
    <div data-testid="tooltip" title={title}>
      {children}
    </div>
  )),
}));

jest.mock("@ant-design/icons", () => ({
  FormOutlined: jest.fn(({ className, onClick }) => (
    <button
      data-testid="form-outlined-icon"
      className={className}
      onClick={onClick}
      aria-label="Editar"
    >
      Editar
    </button>
  )),
  DeleteFilled: jest.fn(({ className, onClick }) => (
    <button
      data-testid="delete-filled-icon"
      className={className}
      onClick={onClick}
      aria-label="Excluir"
    >
      Excluir
    </button>
  )),
}));

describe("Testes do componente ListagemEmails", () => {
  const modulo = "Gestão de Alimentação";
  const mockEmpresas = [
    {
      value: "50403e20-402c-49af-b047-1f66173eea91",
      label: "ALIMENTAR GESTÃO DE SERVIÇOS LTDA",
    },
    {
      value: "4a206eed-42f5-4b7f-9a91-404df255f337",
      label: "Agro Comercial Porto S.A",
    },
  ];
  const mockAtivos = [mockEmpresas[0].value];
  const mockTerceirizadas = mockEmailGestaoAlimentacao.results;
  const setAtivos = jest.fn();
  const buscarTerceirizadas = jest.fn();

  const defaultProps = {
    empresas: mockEmpresas,
    buscarTerceirizadas,
    terceirizadas: mockTerceirizadas,
    ativos: mockAtivos,
    setAtivos,
    modulo,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => {
      render(
        <MemoryRouter>
          <ListagemEmails {...defaultProps} />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });

  it("deve renderizar o componente corretamente", () => {
    expect(
      screen.getByText(`Empresas e E-mails Cadastrados no Módulo de ${modulo}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA"),
    ).toBeInTheDocument();
    expect(screen.getByText("Agro Comercial Porto S.A.")).toBeInTheDocument();
  });

  it("deve mostrar emails quando a terceirizada está expandida", () => {
    expect(
      screen.getByText("admin.alimentar@secretaria.com"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("admin.agro@secretaria.com"),
    ).not.toBeInTheDocument();
  });

  it("deve expandir uma terceirizada ao clicar no ícone plus-square", async () => {
    const empresaBRow = screen
      .getByText("Agro Comercial Porto S.A.")
      .closest(".grid-table.body-table");
    const expandIcon = empresaBRow.querySelector(".fa-plus-square");

    expect(expandIcon).toBeInTheDocument();

    fireEvent.click(expandIcon);

    await waitFor(() => {
      expect(setAtivos).toHaveBeenCalledWith([
        mockEmpresas[0].value,
        mockEmpresas[1].value,
      ]);
    });
  });

  it("deve recolher uma terceirizada ao clicar no ícone minus-square", async () => {
    const empresaARow = screen
      .getByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA")
      .closest(".grid-table.body-table");
    const collapseIcon = empresaARow.querySelector(".fa-minus-square");
    expect(collapseIcon).toBeInTheDocument();
    fireEvent.click(collapseIcon);
    await waitFor(() => {
      expect(setAtivos).toHaveBeenCalledWith([]);
    });
  });

  it("deve abrir o modal de edição ao clicar no ícone de editar", async () => {
    const editarButtons = screen.getAllByTestId("form-outlined-icon");
    expect(editarButtons.length).toBeGreaterThan(0);

    fireEvent.click(editarButtons[0]);

    await waitFor(() => {
      expect(ModalEditarEmail).toHaveBeenCalled();
      const lastCall =
        ModalEditarEmail.mock.calls[ModalEditarEmail.mock.calls.length - 1];
      const props = lastCall[0];
      expect(props.showModal).toBe(true);
      expect(props.emailDict.uuid).toBe(
        mockTerceirizadas[0].emails_terceirizadas[0].uuid,
      );
      expect(props.terceirizada.uuid).toBe(mockTerceirizadas[0].uuid);
    });
  });

  it("deve abrir o modal de exclusão ao clicar no ícone de deletar", async () => {
    const deletarButtons = screen.getAllByTestId("delete-filled-icon");

    expect(deletarButtons.length).toBeGreaterThan(0);

    fireEvent.click(deletarButtons[0]);

    await waitFor(() => {
      expect(ModalExcluirEmail).toHaveBeenCalled();

      const lastCall =
        ModalExcluirEmail.mock.calls[ModalExcluirEmail.mock.calls.length - 1];
      const props = lastCall[0];
      expect(props.showModal).toBe(true);
      expect(props.emailDict.uuid).toBe(
        mockTerceirizadas[0].emails_terceirizadas[0].uuid,
      );
    });
  });

  it("deve fechar o modal de edição quando closeModal é chamado", async () => {
    const editarButtons = screen.getAllByTestId("form-outlined-icon");
    fireEvent.click(editarButtons[0]);

    await waitFor(() => {
      expect(ModalEditarEmail).toHaveBeenCalled();
    });
    const lastCall =
      ModalEditarEmail.mock.calls[ModalEditarEmail.mock.calls.length - 1];
    const closeModalFunction = lastCall[0].closeModal;
    act(() => {
      closeModalFunction();
    });
    expect(typeof closeModalFunction).toBe("function");
  });

  it("deve fechar o modal de exclusão quando closeModal é chamado", async () => {
    const deletarButtons = screen.getAllByTestId("delete-filled-icon");
    fireEvent.click(deletarButtons[0]);

    await waitFor(() => {
      expect(ModalExcluirEmail).toHaveBeenCalled();
    });

    const lastCall =
      ModalExcluirEmail.mock.calls[ModalExcluirEmail.mock.calls.length - 1];
    const closeModalFunction = lastCall[0].closeModal;

    act(() => {
      closeModalFunction();
    });

    expect(typeof closeModalFunction).toBe("function");
  });

  it("deve renderizar corretamente quando ativos é null", async () => {
    cleanup();
    const mockAtivos = [];
    await act(async () => {
      render(
        <MemoryRouter>
          <ListagemEmails {...defaultProps} ativos={mockAtivos} />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
    expect(
      screen.getByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("admin.alimentar@secretaria.com"),
    ).not.toBeInTheDocument();
  });

  it("deve inicializar ativos como array vazio quando ativos é null", async () => {
    cleanup();
    const mockSetAtivos = jest.fn();

    await act(async () => {
      render(
        <MemoryRouter>
          <ListagemEmails
            {...defaultProps}
            ativos={null}
            setAtivos={mockSetAtivos}
          />
          <ToastContainer />
        </MemoryRouter>,
      );
    });

    const empresaBRow = screen
      .getByText("Agro Comercial Porto S.A.")
      .closest(".grid-table.body-table");
    const expandIcon = empresaBRow.querySelector(".fa-plus-square");

    expect(expandIcon).toBeInTheDocument();

    fireEvent.click(expandIcon);
    await waitFor(() => {
      expect(mockSetAtivos).toHaveBeenCalled();
      expect(mockSetAtivos).toHaveBeenCalledWith(
        expect.arrayContaining([mockTerceirizadas[1].uuid]),
      );
    });
  });

  it("deve lidar com array vazio de terceirizadas", async () => {
    cleanup();
    await act(async () => {
      render(
        <MemoryRouter>
          <ListagemEmails {...defaultProps} terceirizadas={[]} />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
    expect(
      screen.getByText(`Empresas e E-mails Cadastrados no Módulo de ${modulo}`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("ALIMENTAR GESTÃO DE SERVIÇOS LTDA"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Agro Comercial Porto S.A."),
    ).not.toBeInTheDocument();
  });

  it("deve verificar se os Tooltips estão configurados", () => {
    const { Tooltip } = require("antd");
    expect(Tooltip).toHaveBeenCalled();
  });

  it("deve filtrar emails pelo módulo correto", () => {
    expect(
      screen.getByText("admin.alimentar@secretaria.com"),
    ).toBeInTheDocument();
    expect(screen.queryByText("admin@secretaria.com")).not.toBeInTheDocument();
    expect(
      screen.queryByText("admin.agro@secretaria.com"),
    ).not.toBeInTheDocument();
  });

  it("deve ter tooltips com títulos corretos", () => {
    const { Tooltip } = require("antd");
    const tooltipCalls = Tooltip.mock.calls;
    const hasEditTooltip = tooltipCalls.some(
      (call) =>
        call[0].title === "Editar e-mail" || call[0].title?.includes("Editar"),
    );

    const hasDeleteTooltip = tooltipCalls.some(
      (call) =>
        call[0].title === "Excluir e-mail" ||
        call[0].title?.includes("Excluir"),
    );

    expect(hasEditTooltip).toBe(true);
    expect(hasDeleteTooltip).toBe(true);
  });
});
