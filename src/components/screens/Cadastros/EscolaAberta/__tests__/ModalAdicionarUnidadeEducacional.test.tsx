import { act, fireEvent, render, screen } from "@testing-library/react";
import { ModalAdicionarUnidadeEducacional } from "../components/ModalAdicionarUnidadeEducacional";
import * as hooks from "../hooks/useModalUnidades";

const mockFormApi = { change: jest.fn(), mutators: { push: jest.fn() } };

let mockFormValues: any = {};
let mockDecorators: any[] = [];

jest.mock("react-final-form", () => ({
  Form: ({ render, decorators }: any) => {
    mockDecorators = decorators || [];
    return render({
      values: mockFormValues,
      form: mockFormApi,
      submitting: false,
    });
  },
  Field: ({ component: Component, ...rest }: any) => <Component {...rest} />,
}));

jest.mock("../hooks/useModalUnidades", () => ({
  useLotes: jest.fn(),
  useTiposUnidade: jest.fn(),
  useAlimentacao: jest.fn(),
  useUnidadesEducacionais: jest.fn(),
  extractDreUuid: jest.fn(),
}));

jest.mock("src/components/Shareable/Select", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("src/components/Shareable/MultiselectRaw", () => ({
  MultiselectRaw: ({ name, options = [], onSelectedChanged }: any) => (
    <div>
      {options.map((o: any) => (
        <span key={o.value}>{o.label}</span>
      ))}
      <button
        type="button"
        data-testid={`trigger-${name}`}
        onClick={() =>
          onSelectedChanged([{ value: "ue-1" }, { value: "ue-2" }])
        }
      />
    </div>
  ),
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, disabled, dataTestId }: any) => (
    <button
      type="button"
      data-testid={dataTestId}
      disabled={disabled}
      onClick={onClick}
    >
      {texto}
    </button>
  ),
}));

const mockLotes = [
  { uuid: "lote-1", nome: "Lote 1", nome_exibicao: "DRE Sul - Lote 1" },
  { uuid: "lote-2", nome: "Lote 2" }, // sem nome_exibicao
];

const mockAlimentacaoApi = {
  participantes: [
    { value: "alim-1", label: "Desjejum" },
    { value: "alim-2", label: "Almoço" },
    { value: "alim-3", label: "Lanche Emergencial" },
    { value: "alim-4" }, // sem label
  ] as any,
  reset: jest.fn(),
  loadAlimentacao: jest.fn(),
};

const mockUnidadesApi = {
  unidadesFiltradas: [
    { value: "ue-1", label: "Unidade 1", codigo_eol: "001" },
    { value: "ue-2", label: "Unidade 2", codigo_eol: "002" },
  ],
  fetchUnidades: jest.fn(),
  resetUnidades: jest.fn(),
};

const renderComponent = (props: any = {}) =>
  render(
    <ModalAdicionarUnidadeEducacional
      showModal
      closeModal={jest.fn()}
      submitting={false}
      form={mockFormApi as any}
      {...props}
    />,
  );

const setupDecorator = (getFieldState: jest.Mock = jest.fn(() => ({}))) => {
  let notify: any;
  const formApi = {
    subscribe: jest.fn((cb: any) => {
      notify = cb;
      return jest.fn();
    }),
    change: jest.fn(),
    resetFieldState: jest.fn(),
    getFieldState,
  };
  mockDecorators.forEach((d) => d(formApi));
  return { formApi, notify: (values: any) => act(() => notify({ values })) };
};

describe("ModalAdicionarUnidadeEducacional", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormValues = {};
    mockDecorators = [];
    (hooks.useLotes as jest.Mock).mockReturnValue({
      lotes: mockLotes,
      lotesOpts: [],
    });
    (hooks.useTiposUnidade as jest.Mock).mockReturnValue({ tiposOpts: [] });
    (hooks.useAlimentacao as jest.Mock).mockReturnValue(mockAlimentacaoApi);
    (hooks.useUnidadesEducacionais as jest.Mock).mockReturnValue(
      mockUnidadesApi,
    );
    (hooks.extractDreUuid as jest.Mock).mockReturnValue("dre-1");
  });

  it("renderiza, filtra lanche emergencial, desabilita Adicionar e reseta no mount", () => {
    renderComponent();

    expect(
      screen.getByText("Adicionar Unidades Educacionais"),
    ).toBeInTheDocument();
    expect(screen.getByText("Desjejum")).toBeInTheDocument();
    expect(screen.queryByText("Lanche Emergencial")).not.toBeInTheDocument();
    expect(screen.getByTestId("modal-adicionar-botao")).toBeDisabled();
    expect(mockAlimentacaoApi.reset).toHaveBeenCalled();
    expect(mockUnidadesApi.resetUnidades).toHaveBeenCalled();
  });

  it("renderiza sem opções quando participantes não foi carregado", () => {
    (hooks.useAlimentacao as jest.Mock).mockReturnValue({
      ...mockAlimentacaoApi,
      participantes: undefined,
    });

    renderComponent();

    expect(screen.queryByText("Desjejum")).not.toBeInTheDocument();
  });

  it("decorator: reseta dependentes ao trocar DRE/tipo e busca unidades", () => {
    renderComponent();
    const { formApi, notify } = setupDecorator(
      jest.fn().mockReturnValueOnce({}).mockReturnValueOnce(undefined),
    );

    notify({ dres_lote: "lote-1" }); // field state existe -> reseta
    expect(formApi.resetFieldState).toHaveBeenCalledTimes(1);
    expect(formApi.change).toHaveBeenCalledWith("tipos_unidades", undefined);
    expect(formApi.change).toHaveBeenCalledWith("unidades_educacionais", []);
    expect(formApi.change).toHaveBeenCalledWith(
      "tipos_alimentacao_participantes",
      [],
    );

    notify({ dres_lote: "lote-2" }); // field state inexistente -> não reseta
    expect(formApi.resetFieldState).toHaveBeenCalledTimes(1);

    notify({ dres_lote: "lote-2", tipos_unidades: "tipo-1" }); // troca de tipo
    expect(mockUnidadesApi.fetchUnidades).toHaveBeenCalledWith(
      "dre-1",
      "tipo-1",
    );
    expect(mockAlimentacaoApi.loadAlimentacao).toHaveBeenCalledWith("tipo-1");

    formApi.change.mockClear();
    notify({ dres_lote: "lote-2", tipos_unidades: "tipo-1" }); // nada mudou
    expect(formApi.change).not.toHaveBeenCalled();
  });

  it("não busca unidades quando a DRE do lote não é encontrada", () => {
    (hooks.extractDreUuid as jest.Mock).mockReturnValue(undefined);
    renderComponent();
    const { notify } = setupDecorator();

    notify({ dres_lote: "lote-1" });
    notify({ dres_lote: "lote-1", tipos_unidades: "tipo-1" });

    expect(mockUnidadesApi.fetchUnidades).not.toHaveBeenCalled();
    expect(mockAlimentacaoApi.loadAlimentacao).not.toHaveBeenCalled();
  });

  it("propaga seleções dos multiselects e adiciona as unidades ao formulário", () => {
    mockFormValues = {
      dres_lote: "lote-1",
      tipos_unidades: "tipo-1",
      unidades_educacionais: ["ue-1", "ue-2"],
      tipos_alimentacao_participantes: ["alim-1", "alim-2"],
    };
    const closeModal = jest.fn();
    renderComponent({ closeModal });

    fireEvent.click(screen.getByTestId("trigger-unidades_educacionais"));
    expect(mockFormApi.change).toHaveBeenCalledWith("unidades_educacionais", [
      "ue-1",
      "ue-2",
    ]);
    fireEvent.click(
      screen.getByTestId("trigger-tipos_alimentacao_participantes"),
    );
    expect(mockFormApi.change).toHaveBeenCalledWith(
      "tipos_alimentacao_participantes",
      ["ue-1", "ue-2"],
    );

    fireEvent.click(screen.getByTestId("modal-adicionar-botao"));

    expect(mockFormApi.mutators.push).toHaveBeenCalledTimes(2);
    expect(mockFormApi.mutators.push).toHaveBeenNthCalledWith(
      1,
      "unidades_participantes",
      expect.objectContaining({
        id: expect.any(String),
        loteUuid: "lote-1",
        dreLoteNome: "DRE Sul - Lote 1",
        unidadeEducacionalUuid: "ue-1",
        unidadeEducacional: "Unidade 1",
        unidadeEducacionalCodigoEol: "001",
        tiposAlimentacaoParticipantesUuids: ["alim-1", "alim-2"],
        alimentacaoParticipantes: "Desjejum, Almoço",
      }),
    );
    expect(closeModal).toHaveBeenCalled();
  });
});
