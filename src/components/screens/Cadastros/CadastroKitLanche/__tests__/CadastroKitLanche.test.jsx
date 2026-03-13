import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as toast from "src/components/Shareable/Toast/dialogs";
import * as tipoService from "src/services/cadastroTipoAlimentacao.service";
import * as codaeService from "src/services/codae.service";
import * as editalService from "src/services/edital.service";
import KitLanche from "../index";

jest.mock("src/services/edital.service");
jest.mock("src/services/codae.service");
jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/components/Shareable/Toast/dialogs");

jest.mock("src/helpers/fieldValidators", () => ({
  required: jest.fn(() => undefined),
  selectValidate: jest.fn(() => undefined),
  textAreaRequired: jest.fn(() => undefined),
  requiredMultiselect: jest.fn(() => undefined),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("KitLanche", () => {
  const mockGetNumerosEditais = editalService.getNumerosEditais;
  const mockCreateKit = codaeService.createKitLanche;
  const mockUpdateKit = codaeService.updateKitLanche;
  const mockChecaNome = codaeService.checaNomeKitLanche;
  const mockGetKit = codaeService.getKitLanches;
  const mockGetTipos = tipoService.getTiposUnidadeEscolar;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetNumerosEditais.mockResolvedValue({
      status: 200,
      data: { results: [{ uuid: "edital-1", numero: "001/2024" }] },
    });

    mockGetTipos.mockResolvedValue({
      status: 200,
      data: { results: [{ uuid: "tipo-1", iniciais: "EMEF" }] },
    });

    mockCreateKit.mockResolvedValue({ status: 201 });
    mockUpdateKit.mockResolvedValue({ status: 200 });
    mockChecaNome.mockResolvedValue({ status: 404 });
  });

  const renderComponent = async (uuid = null) => {
    await act(async () => {
      render(
        <MemoryRouter>
          <KitLanche uuid={uuid} />
        </MemoryRouter>,
      );
    });
  };

  it("deve atualizar kit existente", async () => {
    mockGetKit.mockResolvedValue({
      status: 200,
      data: {
        uuid: "123",
        nome: "Kit Antigo",
        edital: "edital-1",
        status: "ATIVO",
        tipos_unidades: ["tipo-1"],
        descricao: "Desc",
      },
    });

    await renderComponent("123");

    await waitFor(() => {
      expect(screen.getByDisplayValue("Kit Antigo")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("button", { name: /Salvar/i }).closest("form"),
      );
    });

    await waitFor(() => {
      expect(mockUpdateKit).toHaveBeenCalled();
    });
  });

  it("deve validar se o nome do kit já existe ao perder o foco (onBlur)", async () => {
    mockChecaNome.mockResolvedValue({ status: 200 });

    mockGetKit.mockResolvedValue({
      status: 200,
      data: {
        uuid: "123",
        nome: "",
        edital: "edital-1",
        tipos_unidades: ["tipo-1"],
        descricao: "Desc",
        status: "ATIVO",
      },
    });

    await renderComponent("123");

    const inputNome = document.querySelector('input[data-cy="nome"]');
    fireEvent.change(inputNome, { target: { value: "Kit Duplicado" } });

    await act(async () => {
      fireEvent.blur(inputNome);
    });

    await waitFor(() => {
      expect(mockChecaNome).toHaveBeenCalled();
      expect(toast.toastError).toHaveBeenCalledWith(
        "Esse nome de kit lanche já existe para edital e tipo de unidade selecionados",
      );
    });
  });

  it("deve limpar o formulário e voltar ao clicar em cancelar", async () => {
    await renderComponent();

    const botaoCancelar = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(botaoCancelar);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("deve exibir erro se falhar ao carregar editais", async () => {
    mockGetNumerosEditais.mockResolvedValue({ status: 500 });

    await renderComponent();

    await waitFor(() => {
      expect(toast.toastError).toHaveBeenCalledWith(
        "Houve um erro ao carregar dados",
      );
    });
  });
});
