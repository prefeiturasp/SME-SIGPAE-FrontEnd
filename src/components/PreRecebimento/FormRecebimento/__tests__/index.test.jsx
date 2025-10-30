import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Form } from "react-final-form";
import { MemoryRouter } from "react-router-dom";
import FormRecebimento from "../index";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCronograma } from "src/mocks/PreRecebimento/CadastroCronograma/mockMeusDadosCronograma";
import mock from "src/services/_mock";

describe("Testes no componente de FormRecebimento - PreRecebimento", () => {
  const setRecebimentos = jest.fn();
  const props = {
    values: {
      empresa: "PETISTICO PET LTDA",
      contrato: "34a23e02-723b-4a1a-a66f-59064433d57e",
      numero_processo: "4325354",
      numero_pregao_chamada_publica: "",
      ata: "",
    },
    etapas: [{ nome: "Etapa 1" }],
    recebimentos: [{}],
    setRecebimentos,
  };

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCronograma);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosCronograma,
              setMeusDados: jest.fn(),
            }}
          >
            <Form
              onSubmit={() => {}}
              initialValues={props.values}
              render={() => <FormRecebimento {...props} />}
            />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("deve renderizar os elementos principais do formulário", async () => {
    expect(screen.getByText("Dados do Recebimento")).toBeInTheDocument();
    expect(screen.getByText("+ Adicionar Recebimento")).toBeInTheDocument();
  });

  it("não deve exibir botão de remover quando há apenas um recebimento", async () => {
    const botao = screen.queryByTestId("botao_remover_0");
    expect(botao).toBeNull();
  });

  it("deve adicionar um novo preenchimento de recebimento ao clicar em '+ Adicionar Recebimento'", async () => {
    const botao = screen.getByTestId("botao-adicionar");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(setRecebimentos).toHaveBeenCalledWith([{}, {}]);
    });

    fireEvent.click(botao);
    await waitFor(() => {
      expect(setRecebimentos).toHaveBeenCalledTimes(2);
    });
  });

  it("deve deletar um recebimento quando houver mais de um", async () => {
    const propsNovo = {
      ...props,
      recebimentos: [{}, {}],
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <Form
            onSubmit={() => {}}
            initialValues={props.values}
            render={() => <FormRecebimento {...propsNovo} />}
          />
        </MemoryRouter>,
      );
    });

    const botao = screen.getByTestId("botao_remover_1");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(setRecebimentos).toHaveBeenCalledWith([{}]);
    });
  });

  it("deve alternar o estado de collapse ao clicar no botão de toggle", async () => {
    const toggleButton = screen.getByRole("button", { name: "" });

    fireEvent.click(toggleButton);
    expect(toggleButton.querySelector("i").className).toContain(
      "fa-chevron-up",
    );

    fireEvent.click(toggleButton);
    expect(toggleButton.querySelector("i").className).toContain(
      "fa-chevron-down",
    );
  });

  it("deve preencher os campo de carga no formulário e verificar o valor", async () => {
    const campo = screen.getByTestId("carga_select_0");
    const select = campo.querySelector("select");
    fireEvent.change(select, {
      target: { value: "PALETIZADA" },
    });

    await waitFor(() => {
      expect(select.value).toBe("PALETIZADA");
    });
  });
});
