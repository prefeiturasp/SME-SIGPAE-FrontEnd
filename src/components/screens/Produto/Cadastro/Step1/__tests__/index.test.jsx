import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createRef } from "react";

import {
  getFabricantesProdutos,
  getMarcasProdutos,
  getNomeDeProdutosEdital,
} from "src/services/produto.service";
import Step1 from "../index";

jest.mock("redux-form", () => ({
  Field: ({ component: Componente, children, ...props }) => {
    const React = require("react");

    if (typeof Componente === "string") {
      return React.createElement(Componente, props, children);
    }

    return <Componente {...props}>{children}</Componente>;
  },
}));

jest.mock("antd", () => {
  const Select = ({ children }) => <>{children}</>;
  Select.Option = ({ children }) => <>{children}</>;

  return { Select };
});

jest.mock("src/components/Shareable/MakeField", () => ({
  ASelect: ({ children, filterOption, name, onBlur, onSelect }) => {
    const React = require("react");
    const opcoes = React.Children.toArray(children).filter(Boolean);

    return (
      <>
        <input
          aria-label={`filtrar-${name}`}
          onChange={(event) =>
            opcoes.forEach((opcao) => filterOption(event.target.value, opcao))
          }
        />
        <select
          aria-label={name}
          defaultValue=""
          onBlur={onBlur}
          onChange={(event) => onSelect(event.target.value)}
        >
          <option value="">Selecione</option>
          {opcoes.map((opcao) => {
            const valor = String(opcao.key).replace(/^\.\$/, "");
            return (
              <option key={valor} value={valor}>
                {opcao.props.children}
              </option>
            );
          })}
        </select>
      </>
    );
  },
}));

jest.mock("src/components/Shareable/TextArea/TextArea", () => {
  return {
    TextArea: ({ label, name, onChange }) => (
      <textarea aria-label={label} name={name} onChange={onChange} />
    ),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  return {
    __esModule: true,
    default: ({ onClick, texto, type }) => (
      <button type={type} onClick={onClick}>
        {texto}
      </button>
    ),
  };
});

jest.mock("src/components/Shareable/ModalCadastrarItem", () => {
  return {
    __esModule: true,
    default: ({ changePage, closeModal, showModal }) => (
      <div data-testid="modal-cadastrar-item" data-aberto={showModal}>
        {showModal && (
          <>
            <button type="button" onClick={closeModal}>
              Fechar modal
            </button>
            <button type="button" onClick={changePage}>
              Atualizar itens
            </button>
          </>
        )}
      </div>
    ),
  };
});

jest.mock("src/services/produto.service", () => ({
  getNomeDeProdutosEdital: jest.fn(),
  getMarcasProdutos: jest.fn(),
  getFabricantesProdutos: jest.fn(),
}));

const UUID_PRODUTO = "11111111-1111-4111-8111-111111111111";
const UUID_MARCA = "22222222-2222-4222-8222-222222222222";
const UUID_FABRICANTE = "33333333-3333-4333-8333-333333333333";

const payloadInicial = () => ({
  eh_para_alunos_com_dieta: null,
  detalhes_da_dieta: null,
  nome: null,
  marca: null,
  fabricante: null,
  componentes: null,
  tem_aditivos_alergenicos: null,
  tem_gluten: null,
  aditivos: null,
});

const criarProps = (sobrescritas = {}) => ({
  payload: payloadInicial(),
  concluidoStep1: false,
  renderizaFormAlergenicos: false,
  defaultNomeDeProdutosEditalStep1: undefined,
  defaultMarcaStep1: undefined,
  defaultFabricanteStep1: undefined,
  setaAtributosPrimeiroStep: jest.fn(),
  mostrarFormAlergenico: jest.fn(),
  setDefaultMarcaStep1: jest.fn(),
  setDefaultFabricanteStep1: jest.fn(),
  ...sobrescritas,
});

const renderizarComponente = (props = criarProps()) => {
  const referencia = createRef();
  const resultado = render(<Step1 ref={referencia} {...props} />);

  return { ...resultado, props, referencia };
};

describe("Step1 do cadastro de produto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getNomeDeProdutosEdital.mockResolvedValue({
      data: {
        results: [{ nome: "ARROZ", uuid: UUID_PRODUTO }],
      },
    });
    getMarcasProdutos.mockResolvedValue({
      data: {
        results: [{ nome: "MARCA TESTE", uuid: UUID_MARCA }],
      },
    });
    getFabricantesProdutos.mockResolvedValue({
      data: {
        results: [{ nome: "FABRICANTE TESTE", uuid: UUID_FABRICANTE }],
      },
    });
  });

  it("carrega e apresenta as opções de produto, marca e fabricante", async () => {
    renderizarComponente();

    expect(screen.getByText("Identificação do Produto")).toBeInTheDocument();
    expect(screen.getByText("O produto contém glúten?")).toBeInTheDocument();

    expect(
      await screen.findByRole("option", { name: "ARROZ" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "MARCA TESTE" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "FABRICANTE TESTE" }),
    ).toBeInTheDocument();

    expect(getNomeDeProdutosEdital).toHaveBeenCalled();
    expect(getMarcasProdutos).toHaveBeenCalled();
    expect(getFabricantesProdutos).toHaveBeenCalled();
  });

  it("atualiza o payload ao selecionar produto, marca e fabricante", async () => {
    const { props } = renderizarComponente();

    const opcaoProduto = await screen.findByRole("option", { name: "ARROZ" });
    const opcaoMarca = await screen.findByRole("option", {
      name: "MARCA TESTE",
    });
    const opcaoFabricante = await screen.findByRole("option", {
      name: "FABRICANTE TESTE",
    });

    fireEvent.change(screen.getByLabelText("nome"), {
      target: { value: opcaoProduto.value },
    });
    fireEvent.change(screen.getByLabelText("marca"), {
      target: { value: opcaoMarca.value },
    });
    fireEvent.change(screen.getByLabelText("fabricante"), {
      target: { value: opcaoFabricante.value },
    });

    expect(props.setDefaultMarcaStep1).toHaveBeenCalledWith(opcaoMarca.value);
    expect(props.setDefaultFabricanteStep1).toHaveBeenCalledWith(
      opcaoFabricante.value,
    );
    expect(props.setaAtributosPrimeiroStep).toHaveBeenLastCalledWith(
      expect.objectContaining({
        nome: "ARROZ",
        marca: UUID_MARCA,
        fabricante: UUID_FABRICANTE,
      }),
    );
  });

  it("atualiza dieta especial, alergênicos, glúten e componentes", async () => {
    const { props } = renderizarComponente();

    await screen.findByRole("option", { name: "ARROZ" });
    const radios = screen.getAllByRole("radio");

    fireEvent.click(radios[0]);
    fireEvent.click(radios[1]);
    fireEvent.click(radios[0]);
    fireEvent.click(radios[2]);
    fireEvent.click(radios[4]);
    fireEvent.click(radios[5]);
    fireEvent.change(screen.getByLabelText("Nome dos componentes do produto"), {
      target: { value: "farinha e leite" },
    });

    expect(props.mostrarFormAlergenico).toHaveBeenCalledWith(true);
    expect(props.setaAtributosPrimeiroStep).toHaveBeenLastCalledWith(
      expect.objectContaining({
        eh_para_alunos_com_dieta: true,
        tem_aditivos_alergenicos: true,
        tem_gluten: false,
        componentes: "FARINHA E LEITE",
      }),
    );
  });

  it("filtra e executa o onBlur dos seletores", async () => {
    renderizarComponente();

    await screen.findByRole("option", { name: "ARROZ" });

    ["nome", "marca", "fabricante"].forEach((campo) => {
      fireEvent.change(screen.getByLabelText(`filtrar-${campo}`), {
        target: { value: "teste" },
      });
      fireEvent.blur(screen.getByLabelText(campo));
    });
  });

  it("oculta o formulário de alergênicos quando a resposta for não", async () => {
    const { props } = renderizarComponente();

    await screen.findByRole("option", { name: "ARROZ" });
    fireEvent.click(screen.getAllByRole("radio")[3]);

    expect(props.mostrarFormAlergenico).toHaveBeenCalledWith(false);
    expect(props.setaAtributosPrimeiroStep).toHaveBeenLastCalledWith(
      expect.objectContaining({ tem_aditivos_alergenicos: false }),
    );
  });

  it("atualiza os detalhes dos alergênicos quando o campo estiver visível", async () => {
    const props = criarProps({ renderizaFormAlergenicos: true });
    const { referencia } = renderizarComponente(props);

    await screen.findByRole("option", { name: "ARROZ" });
    fireEvent.change(screen.getByLabelText("Quais?"), {
      target: { value: "LEITE E DERIVADOS" },
    });

    expect(props.setaAtributosPrimeiroStep).toHaveBeenLastCalledWith(
      expect.objectContaining({ aditivos: "LEITE E DERIVADOS" }),
    );

    act(() => {
      referencia.current.setaCampoDetalhesDieta("DIETA SEM LACTOSE");
    });

    expect(props.setaAtributosPrimeiroStep).toHaveBeenLastCalledWith(
      expect.objectContaining({ detalhes_da_dieta: "DIETA SEM LACTOSE" }),
    );
  });

  it("abre, fecha e atualiza os itens cadastrados pelo modal", async () => {
    renderizarComponente();

    await screen.findByRole("option", { name: "ARROZ" });
    const modal = screen.getByTestId("modal-cadastrar-item");
    expect(modal).toHaveAttribute("data-aberto", "false");

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar Item" }));
    expect(modal).toHaveAttribute("data-aberto", "true");

    getMarcasProdutos.mockResolvedValue({
      data: {
        results: [
          {
            nome: "NOVA MARCA",
            uuid: "44444444-4444-4444-8444-444444444444",
          },
        ],
      },
    });
    getFabricantesProdutos.mockResolvedValue({
      data: {
        results: [
          {
            nome: "NOVO FABRICANTE",
            uuid: "55555555-5555-4555-8555-555555555555",
          },
        ],
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Atualizar itens" }));

    expect(
      await screen.findByRole("option", { name: "NOVA MARCA" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("option", { name: "NOVO FABRICANTE" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));
    expect(modal).toHaveAttribute("data-aberto", "false");
  });

  it("restaura o payload quando o primeiro passo já estiver concluído", async () => {
    const payload = {
      ...payloadInicial(),
      nome: "ARROZ",
      marca: UUID_MARCA,
      fabricante: UUID_FABRICANTE,
      componentes: "ARROZ",
      tem_gluten: false,
    };
    const { referencia } = renderizarComponente(
      criarProps({ concluidoStep1: true, payload }),
    );

    await screen.findByRole("option", { name: "ARROZ" });

    await act(async () => {
      referencia.current.setState({
        payloadStep1: payloadInicial(),
        retornadoAoStep: false,
      });
    });

    await waitFor(() => {
      expect(referencia.current.state.retornadoAoStep).toBe(true);
      expect(referencia.current.state.payloadStep1).toEqual(payload);
    });
  });

  it("não recarrega os dados iniciais quando as opções já estiverem preenchidas", async () => {
    const { referencia } = renderizarComponente();

    await screen.findByRole("option", { name: "ARROZ" });

    await act(async () => {
      referencia.current.setState({
        dafaultArrayProtocolo: ["carregado"],
      });
    });

    jest.clearAllMocks();

    await act(async () => {
      await referencia.current.carregarDadosIniciais();
    });

    expect(getNomeDeProdutosEdital).not.toHaveBeenCalled();
    expect(getMarcasProdutos).not.toHaveBeenCalled();
    expect(getFabricantesProdutos).not.toHaveBeenCalled();
  });
});
