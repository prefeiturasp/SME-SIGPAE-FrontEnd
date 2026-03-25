import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import ModalEditarEmpenhos from "../../components/ModalEditarEmpenhos";
import mock from "src/services/_mock";
import { mockDadosLiquidacao } from "src/mocks/services/relatorioFinanceiro.service/mockGetDadosLiquidacao";

describe("Testes de comportamentos formulário de Edição de Empenhos", () => {
  const setShowModal = jest.fn();
  const onSave = jest.fn();
  const unidadesEducacionais = [
    {
      uuid: "73005fcf-e02b-48ed-8542-3d1e623a63a5",
      nome: "CEI TESTE",
      codigo_eol: "535353",
      diretoria_regional: {
        uuid: "33b950cd-d8a2-4331-9f11-893cd48b5cd7",
        nome: "GUAIANASES",
      },
      tipo_unidade: {
        uuid: "1f43b785-006e-41ba-87db-8e44a5fc1ed0",
        iniciais: "CEI",
      },
      lote: null,
    },
  ];

  beforeEach(async () => {
    mock.onGet("/escolas-para-filtros/").reply(200, unidadesEducacionais);
    mock
      .onPut("/medicao-inicial/dados-liquidacao/registrar-empenhos/rel-1/")
      .reply(200, {});
  });

  const setup = (props = {}) =>
    render(
      <>
        <ModalEditarEmpenhos
          showModal={true}
          setShowModal={setShowModal}
          empenhos={[]}
          lote="lote-1"
          relatorioFinanceiro="rel-1"
          onSave={onSave}
          tiposUnidades={["1f43b785-006e-41ba-87db-8e44a5fc1ed0"]}
          {...props}
        />
        <ToastContainer />
      </>,
    );

  it("deve renderizar o modal quando showModal = true", () => {
    setup();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cadastro de Empenhos")).toBeInTheDocument();
  });

  it("deve não renderizar quando showModal = false", () => {
    setup({ showModal: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve renderizar mensagem quando não há empenhos", () => {
    setup();

    expect(
      screen.getByText(/Não encontramos empenhos cadastrados/i),
    ).toBeInTheDocument();
  });

  it("deve adicionar um novo empenho ao clicar em 'Adicionar Empenho'", () => {
    setup();

    const botaoAdicionar = screen.getByText("Adicionar Empenho");
    fireEvent.click(botaoAdicionar);

    const inputsNumero = screen.getAllByPlaceholderText(
      "Digite o Nº do empenho",
    );

    expect(inputsNumero.length).toBe(2);
  });

  it("deve remover um empenho", () => {
    setup({
      empenhos: mockDadosLiquidacao.map(
        ({ numero_empenho, tipo_empenho, unidades_educacionais }) => ({
          numero_empenho,
          tipo_empenho,
          unidades_educacionais: unidades_educacionais.map((e) => e.uuid),
        }),
      ),
    });

    const botoesRemover = screen.getByTestId("botao_remover_1");
    fireEvent.click(botoesRemover);

    expect(
      screen.getAllByPlaceholderText("Digite o Nº do empenho").length,
    ).toBe(1);
  });

  it("deve chamar setShowModal(false) ao clicar em cancelar", () => {
    setup();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  const setInput = (id, valor) => {
    const input = screen.getByTestId(id, valor);
    fireEvent.change(input, {
      target: { value: valor },
    });
  };

  const setMultiSelect = async (testId, label) => {
    const container = screen.getByTestId(testId);
    const input = container.querySelector("input");

    if (!input) throw new Error("Input do react-select não encontrado");

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const option = await screen.findByText(label);
    fireEvent.click(option);
  };

  it("deve submeter o formulário com sucesso", async () => {
    setup();

    setInput("numero_empenho_0", "123");
    setInput("tipo_empenho_0", "TESTE");
    await setMultiSelect("unidades_educacionais_0", "CEI TESTE");

    fireEvent.click(screen.getByTestId("botao-salvar"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
      expect(setShowModal).toHaveBeenCalledWith(false);
    });
  });

  it("deve fechar o modal ao clicar no botão de fechar do header", () => {
    setup();

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(setShowModal).toHaveBeenCalledWith(false);
  });
});
