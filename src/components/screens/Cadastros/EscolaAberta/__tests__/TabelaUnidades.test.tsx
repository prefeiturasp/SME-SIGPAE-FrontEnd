import { fireEvent, render, screen } from "@testing-library/react";
import { TabelaUnidades } from "../components/TabelaUnidades";

jest.mock("../components/LinhaUnidade", () => ({
  LinhaUnidade: ({ participante }: any) => (
    <tr data-testid="linha-unidade">
      <td>{participante?.id}</td>
    </tr>
  ),
}));

jest.mock("../components/ModalRemoverUnidadeEducacional", () => ({
  ModalRemoverUnidadeEducacional: () => null,
}));

jest.mock("src/components/Shareable/Paginacao", () => ({
  Paginacao: ({ current, total, pageSize, onChange }: any) => (
    <div data-testid="mock-paginacao">
      <span data-testid="pag-current">{current}</span>
      <span data-testid="pag-total">{total}</span>
      <span data-testid="pag-pagesize">{pageSize}</span>
      <button data-testid="btn-pag-2" onClick={() => onChange(2)}>
        2
      </button>
      <button data-testid="btn-pag-3" onClick={() => onChange(3)}>
        3
      </button>
    </div>
  ),
}));

const gerarUnidades = (qtd: number) =>
  Array.from({ length: qtd }, (_, i) => ({ id: `ue-${i + 1}` }));

const renderTabela = (props: any = {}) => {
  const unidades = props.unidades ?? gerarUnidades(25);
  const fields = {
    name: "unidades_participantes",
    value: unidades,
    remove: jest.fn(),
  };

  return render(
    <TabelaUnidades
      editable={true}
      fields={fields as any}
      form={{} as any}
      page={1}
      setPage={jest.fn()}
      pageSize={10}
      {...props}
    />,
  );
};

describe("TabelaUnidades - paginação", () => {
  it("deve exibir apenas os itens da primeira página", () => {
    renderTabela({ page: 1 });

    const linhas = screen.getAllByTestId("linha-unidade");
    expect(linhas).toHaveLength(10);
    expect(screen.getByText("ue-1")).toBeInTheDocument();
    expect(screen.getByText("ue-10")).toBeInTheDocument();
    expect(screen.queryByText("ue-11")).not.toBeInTheDocument();
  });

  it("deve exibir apenas os itens restantes na última página", () => {
    renderTabela({ page: 3 });

    const linhas = screen.getAllByTestId("linha-unidade");
    expect(linhas).toHaveLength(5);
    expect(screen.getByText("ue-21")).toBeInTheDocument();
    expect(screen.getByText("ue-25")).toBeInTheDocument();
  });

  it("deve ajustar para a primeira página quando page é menor que 1", () => {
    renderTabela({ page: 0 });

    expect(screen.getAllByTestId("linha-unidade")).toHaveLength(10);
    expect(screen.getByText("ue-1")).toBeInTheDocument();
  });

  it("deve chamar setPage ao trocar de página", () => {
    const setPage = jest.fn();
    renderTabela({ page: 1, setPage });

    fireEvent.click(screen.getByTestId("btn-pag-2"));

    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("não deve renderizar linhas quando a lista está vazia", () => {
    renderTabela({ unidades: [] });

    expect(screen.queryAllByTestId("linha-unidade")).toHaveLength(0);
    expect(screen.getByTestId("pag-total")).toHaveTextContent("0");
  });

  it("deve paginar a lista de participantes no modo não editável", () => {
    render(
      <TabelaUnidades
        editable={false}
        participantes={gerarUnidades(12)}
        page={2}
        pageSize={10}
      />,
    );

    const linhas = screen.getAllByTestId("linha-unidade");
    expect(linhas).toHaveLength(2);
    expect(screen.getByText("ue-11")).toBeInTheDocument();
    expect(screen.getByText("ue-12")).toBeInTheDocument();
  });
});
