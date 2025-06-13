import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";
import { Form } from "react-final-form";
import FormBuscaProduto from "src/components/Shareable/FormBuscaProduto";

jest.mock("src/helpers/fieldValidators", () => ({
  required: () => undefined,
}));

jest.mock("src/services/produto.service", () => ({
  getNomesUnicosProdutos: jest.fn(() =>
    Promise.resolve({ data: { results: ["ARROZ SELVAGEM"] } })
  ),
  getNomesUnicosMarcas: jest.fn(() =>
    Promise.resolve({ data: { results: ["Coca Cola"] } })
  ),
  getNomesUnicosFabricantes: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getNomesUnicosEditais: jest.fn(() =>
    Promise.resolve({
      data: { results: ["Edital de Pregão n° 36/SME/2022"] },
    })
  ),
  getNomesTerceirizadas: jest.fn(() =>
    Promise.resolve({ data: { results: [] } })
  ),
  getEditaisDre: jest.fn(() =>
    Promise.resolve({ status: 200, data: { results: [] } })
  ),
}));

jest.mock("src/helpers/utilities", () => ({
  usuarioEhEscolaTerceirizadaDiretor: () => false,
  usuarioEhEscolaTerceirizada: () => false,
  usuarioEhEmpresaTerceirizada: () => false,
  usuarioEhCODAEGestaoAlimentacao: () => false,
  usuarioEhNutricionistaSupervisao: () => false,
  usuarioEhCODAENutriManifestacao: () => false,
  usuarioEhCODAEGabinete: () => false,
  ehUsuarioRelatorios: () => false,
  usuarioEhGticCODAE: () => false,
  usuarioEhDRE: () => false,
  dateDelta: () => new Date(),
}));

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("FormBuscaProduto - Testes unificados", () => {
  it("preenche o edital, clica em consultar e depois limpa os filtros", async () => {
    const mockSubmit = jest.fn();
    const mockLimpar = jest.fn();

    render(
      <Router>
        <FormBuscaProduto onSubmit={mockSubmit} onLimparDados={mockLimpar} />
      </Router>
    );

    const editalInputs = await screen.findAllByRole("combobox");
    const editalInput = editalInputs[0];

    fireEvent.change(editalInput, {
      target: { value: "Edital de Pregão n° 36/SME/2022" },
    });

    fireEvent.blur(editalInput);

    const consultarBtn = screen.getByRole("button", { name: /consultar/i });
    fireEvent.click(consultarBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    const limparBtn = screen.getByRole("button", { name: /limpar filtros/i });
    fireEvent.click(limparBtn);

    expect(mockLimpar).toHaveBeenCalled();
  });

  it('digita "Coca Cola" na marca do produto e clica em "Limpar Filtros"', async () => {
    const mockLimpar = jest.fn();

    render(
      <MemoryRouter>
        <FormBuscaProduto
          onSubmit={jest.fn()}
          onLimparDados={mockLimpar}
          naoExibirRowTerceirizadas={true}
          statusSelect={false}
          exibirBotaoVoltar={false}
          naoExibirLimparFiltros={false}
          valoresIniciais={{}}
          setErroAPI={jest.fn()}
        />
      </MemoryRouter>
    );

    const comboBoxes = await screen.findAllByRole("combobox");
    const inputMarca = comboBoxes[1];

    fireEvent.change(inputMarca, { target: { value: "Coca Cola" } });

    const btnLimpar = screen.getByRole("button", { name: /limpar filtros/i });
    fireEvent.click(btnLimpar);

    await waitFor(() => {
      expect(mockLimpar).toHaveBeenCalled();
    });
  });

  it('digita "ARROZ SELVAGEM" no campo Nome do Produto e seleciona', async () => {
    render(
      <MemoryRouter>
        <FormBuscaProduto onSubmit={jest.fn()} onLimparDados={jest.fn()} />
      </MemoryRouter>
    );

    const inputs = await screen.findAllByRole("combobox");
    const nomeProdutoInput = inputs[inputs.length - 1];

    fireEvent.change(nomeProdutoInput, {
      target: { value: "ARROZ SELVAGEM" },
    });

    const opcoes = await screen.findAllByText("ARROZ SELVAGEM");
    fireEvent.click(opcoes[0]);

    await waitFor(() => {
      expect(nomeProdutoInput.value).toBe("ARROZ SELVAGEM");
    });
  });

  it("marca e desmarca corretamente o checkbox Visão agrupada por nome e marca", async () => {
    render(
      <MemoryRouter>
        <Form
          onSubmit={() => {}}
          render={() => (
            <FormBuscaProduto
              onSubmit={() => {}}
              onLimparDados={() => {}}
              naoExibirRowTerceirizadas={true}
            />
          )}
        />
      </MemoryRouter>
    );

    const checkbox = await screen.findByRole("checkbox");

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
