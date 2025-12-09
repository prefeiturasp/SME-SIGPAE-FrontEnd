import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import { LinhaUnidade } from "../components/LinhaUnidade";

const renderLinhaUnidade = (props: any = {}) => {
  const defaultProps = {
    name: "unidades_participantes[0]",
    participante: {
      id: "ue1",
      dreLoteNome: "DRE Teste",
      unidadeEducacional: "EMEF Teste",
      ceiOuEmei: null,
      num_inscritos: 10,
      num_colaboradores: 5,
      liberarMedicao: true,
      alimentacaoInscritos: ["Lanche"],
      alimentacaoColaboradores: ["Café"],
      alimentacaoInscritosInfantil: [],
      lote: {
        nome_exibicao: "DRE Teste",
        nome: "DRE Teste",
      },
      unidade_educacional: {
        nome: "EMEF Teste",
      },
      cei_ou_emei: null,
      liberar_medicao: true,
      tipos_alimentacao: {
        inscritos: [],
        infantil: [],
        colaboradores: [],
      },
    },
    aberto: false,
    toggleExpandir: jest.fn(),
    openRemoverModal: jest.fn(),
    readOnly: false,
    form: {
      change: jest.fn(),
    },
    temTiposAlimentacaoColaboradores: true,
    ...props,
  };

  return render(
    <Form
      onSubmit={jest.fn()}
      render={() => (
        <table>
          <tbody>
            <LinhaUnidade {...defaultProps} />
          </tbody>
        </table>
      )}
    />,
  );
};

describe("LinhaUnidade - Regra de num_colaboradores", () => {
  it("deve renderizar campo num_colaboradores habilitado quando houver tipos de alimentação", () => {
    renderLinhaUnidade({
      temTiposAlimentacaoColaboradores: true,
    });

    const input = screen.getByTestId(
      "num_colaboradores_input",
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
    expect(input.type).toBe("number");
  });

  it("deve renderizar campo num_colaboradores desabilitado quando NÃO houver tipos de alimentação", () => {
    renderLinhaUnidade({
      temTiposAlimentacaoColaboradores: false,
      participante: {
        id: "ue1",
        dreLoteNome: "DRE Teste",
        unidadeEducacional: "EMEF Teste",
        ceiOuEmei: null,
        num_inscritos: 10,
        num_colaboradores: 0,
        liberarMedicao: true,
        alimentacaoInscritos: ["Lanche"],
        alimentacaoColaboradores: [],
        alimentacaoInscritosInfantil: [],
        lote: {
          nome_exibicao: "DRE Teste",
          nome: "DRE Teste",
        },
        unidade_educacional: {
          nome: "EMEF Teste",
        },
        cei_ou_emei: null,
        liberar_medicao: true,
        tipos_alimentacao: {
          inscritos: [],
          infantil: [],
          colaboradores: [],
        },
      },
    });

    const input = screen.getByTestId(
      "num_colaboradores_input",
    ) as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).toBeDisabled();
  });

  it("deve renderizar num_inscritos sempre habilitado (regra não muda)", () => {
    renderLinhaUnidade({
      temTiposAlimentacaoColaboradores: false,
    });

    const input = screen.getByTestId("num_inscritos_input") as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });

  it("não deve renderizar inputs no modo readOnly (apenas texto)", () => {
    renderLinhaUnidade({
      readOnly: true,
      temTiposAlimentacaoColaboradores: false,
    });

    expect(
      screen.queryByTestId("num_colaboradores_input"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("DRE Teste")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
