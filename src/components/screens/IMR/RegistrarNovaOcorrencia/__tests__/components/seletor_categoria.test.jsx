import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "react-final-form";
import { SeletorCategoria } from "../../components/SeletorCategoria";

describe("Testes de comportamentos componente - SeletorCategoria", () => {
  const setTiposOcorrenciaDaCategoria = jest.fn();

  const categorias = [
    { nome: "Categoria 1", uuid: "categoria-1" },
    { nome: "Categoria 2", uuid: "categoria-2" },
  ];

  const tiposOcorrencia = [
    {
      uuid: "tipo-1",
      titulo: "Tipo Ocorrência 1",
      descricao: "Descrição 1",
      aceita_multiplas_respostas: false,
      posicao: 1,
      parametrizacoes: [],
      penalidade: {},
      categoria: { uuid: "categoria-1", nome: "Categoria 1" },
    },
    {
      uuid: "tipo-2",
      titulo: "Tipo Ocorrência 2",
      descricao: "Descrição 2",
      aceita_multiplas_respostas: true,
      posicao: 2,
      parametrizacoes: [],
      penalidade: {},
      categoria: { uuid: "categoria-2", nome: "Categoria 2" },
    },
  ];

  const setup = () =>
    render(
      <Form
        onSubmit={jest.fn()}
        render={() => (
          <SeletorCategoria
            categorias={categorias}
            setTiposOcorrenciaDaCategoria={setTiposOcorrenciaDaCategoria}
            tiposOcorrencia={tiposOcorrencia}
          />
        )}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o campo de seleção com o label correto", () => {
    setup();

    expect(screen.getByText("Categoria da Ocorrência")).toBeInTheDocument();
  });

  it("deve renderizar a opção padrão e as categorias", () => {
    setup();

    expect(screen.getByText("Selecione uma categoria")).toBeInTheDocument();
    expect(screen.getByText("Categoria 1")).toBeInTheDocument();
    expect(screen.getByText("Categoria 2")).toBeInTheDocument();
  });

  it("deve filtrar os tipos de ocorrência ao selecionar uma categoria", () => {
    setup();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {
      target: { value: "categoria-1" },
    });

    expect(setTiposOcorrenciaDaCategoria).toHaveBeenCalledWith([
      expect.objectContaining({
        uuid: "tipo-1",
        nome: "Tipo Ocorrência 1",
      }),
    ]);
  });

  it("deve retornar array vazio quando nenhuma categoria correspondente for encontrada", () => {
    setup();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, {
      target: { value: "categoria-inexistente" },
    });

    expect(setTiposOcorrenciaDaCategoria).toHaveBeenCalledWith([]);
  });
});
