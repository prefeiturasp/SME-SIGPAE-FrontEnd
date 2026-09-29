import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";

import Step2 from "../index";

jest.mock("redux-form", () => ({
  Field: ({ component: Componente, ...props }) => <Componente {...props} />,
  reduxForm: () => (Componente) => Componente,
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: ({ label, name, onBlur, onChange, placeholder }) => (
    <input
      aria-label={label || name}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

jest.mock("src/components/Shareable/ToggleExpandir", () => ({
  ToggleExpandir: ({ ativo, onClick }) => (
    <button
      aria-label="Alternar informação nutricional"
      data-ativo={ativo}
      type="button"
      onClick={onClick}
    />
  ),
}));

jest.mock("react-collapse", () => ({
  Collapse: ({ children, isOpened }) => (
    <div data-testid="conteudo-informacao" data-aberto={isOpened}>
      {children}
    </div>
  ),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ onClick, texto, type }) => (
    <button type={type} onClick={onClick}>
      {texto}
    </button>
  ),
}));

const UUID_PROTEINA = "11111111-1111-4111-8111-111111111111";
const UUID_CALORIA = "22222222-2222-4222-8222-222222222222";
const UUID_FIBRA = "33333333-3333-4333-8333-333333333333";

const criarInformacoesAgrupadas = () => [
  {
    nome: "PROTEINAS",
    active: false,
    informacoes_nutricionais: [
      {
        uuid: UUID_PROTEINA,
        nome: "Proteínas",
        medida: "g",
        check: true,
      },
    ],
  },
  {
    nome: "CALORIA",
    active: false,
    informacoes_nutricionais: [
      {
        uuid: UUID_CALORIA,
        nome: "Valor energético",
        medida: "kcal",
        check: true,
      },
    ],
  },
  {
    nome: "FIBRAS",
    active: false,
    informacoes_nutricionais: [
      {
        uuid: UUID_FIBRA,
        nome: "Fibra alimentar",
        medida: "g",
        check: true,
      },
    ],
  },
];

const criarPayload = (sobrescritas = {}) => ({
  porcao: null,
  unidade_caseira: null,
  informacoes_nutricionais: [],
  ...sobrescritas,
});

const criarProps = (sobrescritas = {}) => ({
  payload: criarPayload(),
  solicitacoesVigentes: [],
  informacoesAgrupadas: criarInformacoesAgrupadas(),
  change: jest.fn(),
  setaValoresStep2: jest.fn(),
  setBlockProximo: jest.fn(),
  handleSubmit: (funcao) => () => funcao({}),
  ...sobrescritas,
});

const renderizarComponente = (props = criarProps()) => {
  const referencia = createRef();
  const resultado = render(<Step2 ref={referencia} {...props} />);

  return { ...resultado, props, referencia };
};

const aguardarInformacoes = async () => {
  await screen.findByText("PROTEÍNAS");
};

describe("Step2 do cadastro de produto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("carrega os grupos e formata os títulos das informações nutricionais", async () => {
    const { referencia } = renderizarComponente();

    await aguardarInformacoes();

    expect(screen.getByText("CALORIAS")).toBeInTheDocument();
    expect(screen.getByText("FIBRAS")).toBeInTheDocument();
    expect(screen.getByText("Proteínas")).toBeInTheDocument();
    expect(screen.getByText("Valor energético")).toBeInTheDocument();
    expect(referencia.current.state.solicitacoesVigentes).toEqual([]);
    expect(
      referencia.current.state.informacoesAgrupadas.every((grupo) =>
        grupo.informacoes_nutricionais.every(
          (informacao) => informacao.check === false,
        ),
      ),
    ).toBe(true);
  });

  it("restaura os valores já preenchidos ao montar o componente", async () => {
    const payload = criarPayload({
      porcao: "100 g",
      unidade_caseira: "1 xícara",
      informacoes_nutricionais: [
        {
          informacao_nutricional: UUID_PROTEINA,
          quantidade_porcao: "10",
          valor_diario: "20",
        },
      ],
    });
    const props = criarProps({ payload });

    renderizarComponente(props);
    await aguardarInformacoes();

    expect(props.change).toHaveBeenCalledWith("porcao", "100 g");
    expect(props.change).toHaveBeenCalledWith("unidade_caseira", "1 xícara");
    expect(props.change).toHaveBeenCalledWith(`porcao=${UUID_PROTEINA}`, "10");
    expect(props.change).toHaveBeenCalledWith(`vd=${UUID_PROTEINA}`, "20");
  });

  it.each([
    [null, "1 xícara", [{ informacao_nutricional: UUID_PROTEINA }]],
    ["100 g", null, [{ informacao_nutricional: UUID_PROTEINA }]],
    ["100 g", "1 xícara", []],
  ])(
    "não restaura valores quando o payload estiver incompleto",
    async (porcao, unidadeCaseira, informacoesNutricionais) => {
      const props = criarProps({
        payload: criarPayload({
          porcao,
          unidade_caseira: unidadeCaseira,
          informacoes_nutricionais: informacoesNutricionais,
        }),
      });

      renderizarComponente(props);
      await aguardarInformacoes();

      expect(props.change).not.toHaveBeenCalled();
    },
  );

  it("não atualiza as solicitações vigentes quando o valor recebido já for nulo", () => {
    const props = criarProps({
      solicitacoesVigentes: null,
      informacoesAgrupadas: undefined,
    });
    const { referencia } = renderizarComponente(props);

    expect(referencia.current.state.solicitacoesVigentes).toBeNull();
    expect(screen.getByText("Informações Nutricionais")).toBeInTheDocument();
  });

  it("atualiza o campo, bloqueia o próximo passo e marca a informação como vista", async () => {
    const { props, referencia } = renderizarComponente();

    await aguardarInformacoes();
    const campoPorcao = screen.getByLabelText(`porcao=${UUID_PROTEINA}`);
    const campoValorDiario = screen.getByLabelText(`vd=${UUID_CALORIA}`);

    fireEvent.change(campoPorcao, { target: { value: "15,5" } });
    fireEvent.blur(campoPorcao);
    fireEvent.blur(campoValorDiario);

    expect(props.change).toHaveBeenCalledWith(
      `porcao=${UUID_PROTEINA}`,
      "15,5",
    );
    expect(props.setBlockProximo).toHaveBeenCalledTimes(1);
    expect(
      referencia.current.state.informacoesAgrupadas[0]
        .informacoes_nutricionais[0].check,
    ).toBe(true);
    expect(
      referencia.current.state.informacoesAgrupadas[1]
        .informacoes_nutricionais[0].check,
    ).toBe(true);
  });

  it("atualiza, adiciona e ignora informações nutricionais ao salvar", async () => {
    const payload = criarPayload({
      informacoes_nutricionais: [
        {
          informacao_nutricional: UUID_PROTEINA,
          quantidade_porcao: "1",
          valor_diario: "2",
        },
      ],
    });
    const valores = {
      porcao: "100 g",
      unidade_caseira: "1 xícara",
      [`porcao=${UUID_PROTEINA}`]: "10",
      [`vd=${UUID_PROTEINA}`]: "20",
      [`porcao=${UUID_CALORIA}`]: "30",
      [`vd=${UUID_CALORIA}`]: "40",
    };
    const props = criarProps({
      payload,
      handleSubmit: (funcao) => () => funcao(valores),
    });

    renderizarComponente(props);
    await aguardarInformacoes();
    fireEvent.click(screen.getByRole("button", { name: "salvar" }));

    expect(props.setaValoresStep2).toHaveBeenCalledWith({
      porcao: "100 g",
      unidade_caseira: "1 xícara",
      informacoes_nutricionais: [
        {
          informacao_nutricional: UUID_PROTEINA,
          quantidade_porcao: "10",
          valor_diario: "20",
        },
        {
          informacao_nutricional: UUID_CALORIA,
          quantidade_porcao: "30",
          valor_diario: "40",
        },
      ],
    });
  });

  it("atualiza os grupos quando a propriedade for alterada", async () => {
    const props = criarProps();
    const { referencia, rerender } = renderizarComponente(props);

    await aguardarInformacoes();
    const novosGrupos = [
      {
        nome: "OUTROS",
        active: true,
        informacoes_nutricionais: [
          {
            uuid: "44444444-4444-4444-8444-444444444444",
            nome: "Sódio",
            medida: "mg",
            check: true,
          },
        ],
      },
    ];

    rerender(
      <Step2 ref={referencia} {...props} informacoesAgrupadas={novosGrupos} />,
    );

    await waitFor(() => {
      expect(screen.getByText("OUTROS")).toBeInTheDocument();
      expect(
        referencia.current.state.informacoesAgrupadas[0]
          .informacoes_nutricionais[0].check,
      ).toBe(false);
    });
  });
});
