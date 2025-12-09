import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";

const mockFormFromFinalForm = {
  change: jest.fn(),
  resetFieldState: jest.fn(),
  mutators: {
    push: jest.fn(),
  },
};

jest.mock("react-final-form", () => {
  return {
    Form: ({ render, children }: any) => {
      const props = {
        values: {},
        form: mockFormFromFinalForm,
        submitting: false,
      };

      if (typeof render === "function") {
        return render(props);
      }

      if (typeof children === "function") {
        return children(props);
      }

      return null;
    },

    Field: ({ component: Component, ...rest }: any) => {
      return <Component {...rest} />;
    },
  };
});

import { ModalAdicionarUnidadeEducacional } from "../components/ModalAdicionarUnidadeEducacional";
import * as hooks from "../hooks/useModalUnidades";

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

jest.mock("../hooks/useModalUnidades", () => ({
  useLotes: jest.fn(),
  useTiposUnidade: jest.fn(),
  useAlimentacao: jest.fn(),
  useUnidadesEducacionais: jest.fn(),
  extractDreUuid: jest.fn(),
}));

jest.mock("src/components/Shareable/MultiselectRaw", () => ({
  MultiselectRaw: ({ label, dataTestId }: any) => (
    <div data-testid={dataTestId || `mock-multiselect-${label}`}>{label}</div>
  ),
}));

const mockFormApi = {
  mutators: {
    push: jest.fn(),
  },
  change: jest.fn(),
  resetFieldState: jest.fn(),
};

const mockLotes = [
  {
    uuid: "lote-1",
    nome: "Lote 1",
    nome_exibicao: "DRE Sul - Lote 1",
    dre_uuid: "dre-1",
  },
  {
    uuid: "lote-2",
    nome: "Lote 2",
    nome_exibicao: "DRE Norte - Lote 2",
    dre_uuid: "dre-2",
  },
];

const mockTipos = [
  { uuid: "tipo-1", nome: "CEI" },
  { uuid: "tipo-2", nome: "CEMEI" },
  { uuid: "tipo-3", nome: "EMEF" },
];

const mockUnidades = [
  { value: "ue-1", label: "Unidade 1", codigo_eol: "001" },
  { value: "ue-2", label: "Unidade 2", codigo_eol: "002" },
];

const mockAlimentacaoInscritos = [
  { value: "alim-1", label: "Desjejum" },
  { value: "alim-2", label: "Almoço" },
];

const mockAlimentacaoColaboradores = [
  { value: "alim-col-1", label: "Almoço Colaboradores" },
  { value: "alim-col-2", label: "Jantar Colaboradores" },
];

const mockAlimentacaoInfantil = [
  { value: "alim-inf-1", label: "Desjejum Infantil" },
  { value: "alim-inf-2", label: "Almoço Infantil" },
];

const setupDefaultMocks = () => {
  (hooks.useLotes as jest.Mock).mockReturnValue({
    lotes: mockLotes,
    lotesOpts: mockLotes.map((l) => ({
      value: l.uuid,
      label: l.nome_exibicao,
    })),
  });

  (hooks.useTiposUnidade as jest.Mock).mockReturnValue({
    tipos: mockTipos,
    tiposOpts: mockTipos.map((t) => ({ value: t.uuid, label: t.nome })),
    tiposMap: {},
  });

  (hooks.useAlimentacao as jest.Mock).mockReturnValue({
    inscritos: mockAlimentacaoInscritos,
    colaboradores: mockAlimentacaoColaboradores,
    inscritosInfantil: mockAlimentacaoInfantil,
    reset: jest.fn(),
    loadAlimentacao: jest.fn(),
  });

  (hooks.useUnidadesEducacionais as jest.Mock).mockReturnValue({
    unidadesFiltradas: mockUnidades,
    fetchUnidades: jest.fn(),
    resetUnidades: jest.fn(),
  });

  (hooks.extractDreUuid as jest.Mock).mockReturnValue("dre-1");
};

const renderComponent = (props: any = {}) => {
  const defaultProps = {
    showModal: true,
    closeModal: jest.fn(),
    submitting: false,
    form: mockFormApi,
  };

  return act(async () => {
    render(<ModalAdicionarUnidadeEducacional {...defaultProps} {...props} />);
  });
};

describe("ModalAdicionarUnidadeEducacional", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  it("deve renderizar o modal quando showModal é true", async () => {
    await renderComponent();

    expect(screen.getByTestId("modal-adicionar-unidade")).toBeInTheDocument();
    expect(
      screen.getByText("Adicionar Unidades Educacionais"),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando showModal é false", async () => {
    await renderComponent({ showModal: false });

    expect(
      screen.queryByTestId("modal-adicionar-unidade"),
    ).not.toBeInTheDocument();
  });

  it("deve renderizar todos os campos do formulário", async () => {
    await renderComponent();

    expect(screen.getByTestId("select-dres-lote")).toBeInTheDocument();
    expect(screen.getByTestId("select-tipos-unidades")).toBeInTheDocument();
    expect(
      screen.getByTestId("multiselect-unidades-educacionais"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByTestId("modal-adicionar-botao")).toBeInTheDocument();
  });

  it("deve desabilitar o botão Adicionar quando campos obrigatórios não estão preenchidos", async () => {
    await renderComponent();

    const botaoAdicionar = screen.getByTestId("modal-adicionar-botao");
    expect(botaoAdicionar).toBeDisabled();
  });

  it("deve chamar closeModal ao clicar em Cancelar", async () => {
    const closeModal = jest.fn();
    await renderComponent({ closeModal });

    await act(async () => {
      fireEvent.click(screen.getByText("Cancelar"));
    });

    expect(closeModal).toHaveBeenCalled();
  });
});
