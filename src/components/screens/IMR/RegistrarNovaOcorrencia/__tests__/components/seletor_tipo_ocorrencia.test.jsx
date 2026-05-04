import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Form } from "react-final-form";
import { SeletorTipoOcorrencia } from "../../components/SeletorTipoOcorrencia";

describe("Testes de comportamentos componente - SeletorTipoOcorrencia", () => {
  const setTipoOcorrencia = jest.fn();

  const form = {
    change: jest.fn(),
  };

  const tiposOcorrencia = [
    {
      uuid: "tipo-1",
      titulo: "Tipo 1",
      descricao: "Desc",
      aceita_multiplas_respostas: false,
      posicao: 1,
      parametrizacoes: [],
      penalidade: {},
      categoria: { uuid: "cat-1", nome: "Categoria 1" },
    },
    {
      uuid: "tipo-2",
      titulo: "Tipo 2",
      descricao: "Desc",
      aceita_multiplas_respostas: false,
      posicao: 2,
      parametrizacoes: [],
      penalidade: {},
      categoria: { uuid: "cat-1", nome: "Categoria 1" },
    },
  ];

  const tiposOcorrenciaDaCategoria = [...tiposOcorrencia];

  const renderComponent = (values = { categoria: "cat-1" }) =>
    render(
      <Form
        onSubmit={jest.fn()}
        render={() => (
          <SeletorTipoOcorrencia
            setTipoOcorrencia={setTipoOcorrencia}
            tiposOcorrencia={tiposOcorrencia}
            tiposOcorrenciaDaCategoria={tiposOcorrenciaDaCategoria}
            values={values}
            form={form}
          />
        )}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o label e opções", () => {
    renderComponent();

    expect(screen.getByText("Tipos de Ocorrência")).toBeInTheDocument();

    expect(
      screen.getByText("Selecione um tipo de ocorrência"),
    ).toBeInTheDocument();

    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);

    expect(options[1]).toHaveValue("tipo-1");
    expect(options[2]).toHaveValue("tipo-2");
  });

  it("deve estar desabilitado quando não houver categoria", () => {
    renderComponent({ categoria: "" });

    const select = screen.getByRole("combobox");

    expect(select).toBeDisabled();
  });

  it("deve estar habilitado quando houver categoria", () => {
    renderComponent({ categoria: "cat-1" });

    const select = screen.getByRole("combobox");

    expect(select).not.toBeDisabled();
  });

  it("deve chamar setTipoOcorrencia e form.change ao selecionar um tipo", async () => {
    renderComponent();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {
      target: { value: "tipo-1" },
    });

    await waitFor(() => {
      expect(setTipoOcorrencia).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: "tipo-1",
        }),
      );
    });

    expect(form.change).toHaveBeenCalledWith("grupos", [{}]);
  });

  it("deve passar undefined para setTipoOcorrencia se não encontrar o tipo", async () => {
    renderComponent();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {
      target: { value: "inexistente" },
    });

    await waitFor(() => {
      expect(setTipoOcorrencia).toHaveBeenCalledWith(undefined);
    });

    expect(form.change).toHaveBeenCalledWith("grupos", [{}]);
  });
});
