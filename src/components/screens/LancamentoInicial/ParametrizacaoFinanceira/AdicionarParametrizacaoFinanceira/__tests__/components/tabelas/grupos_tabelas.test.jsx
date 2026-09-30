import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import { mockGetVinculosTipoAlimentacaoPorEscola } from "src/mocks/cadastroTipoAlimentacao.service/mockGetVinculosTipoAlimentacaoPorEscola";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import TabelasGrupoCEI from "../../../components/Tabelas/TabelasGrupoCEI";
import TabelasGrupoCEMEI from "../../../components/Tabelas/TabelasGrupoCEMEI";
import TabelasGrupoCIEJA from "../../../components/Tabelas/TabelasGrupoCIEJA";
import TabelasGrupoEMEBS from "../../../components/Tabelas/TabelasGrupoEMEBS";
import TabelasGrupoEMEF from "../../../components/Tabelas/TabelasGrupoEMEF";
import TabelasGruposEMEI from "../../../components/Tabelas/TabelasGruposEMEI";

const tipos = mockGetVinculosTipoAlimentacaoPorEscola.results.find(
  (vinculo) => vinculo.tipo_unidade_escolar.iniciais === "EMEI",
).tipos_alimentacao;
const kit = { ...tipos[0], nome: "Kit Lanche" };
const tiposComKit = [...tipos, kit];
const faixas = mockFaixasEtarias.results;

const renderGrupo = (ui) => {
  render(<Form onSubmit={jest.fn()} render={({ form }) => ui(form)} />);
};

const valorOculto = (nome) =>
  document.querySelector(`input[name="${nome}"]`)?.value;

describe("Grupos de tabelas da parametrização financeira", () => {
  it("renderiza o grupo CEI", () => {
    renderGrupo((form) => (
      <TabelasGrupoCEI
        form={form}
        faixasEtarias={faixas}
        grupoSelecionado="Grupo 1"
      />
    ));

    expect(screen.getAllByText(/Período Integral/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Período Parcial/i).length).toBeGreaterThan(0);
  });

  it("inclui Kit Lanche quando o tipo ainda não existe", () => {
    renderGrupo((form) => (
      <TabelasGruposEMEI
        form={form}
        tiposAlimentacao={tipos}
        grupoSelecionado="Grupo 3"
      />
    ));

    expect(
      valorOculto(
        "tabelas[Preço das Alimentações].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe("Kit Lanche");
  });

  it("mantém o Kit Lanche já informado nos grupos EMEI, CIEJA, CEMEI e EMEBS", () => {
    const { unmount } = render(
      <Form
        onSubmit={jest.fn()}
        render={({ form }) => (
          <TabelasGruposEMEI
            form={form}
            tiposAlimentacao={tiposComKit}
            grupoSelecionado="Grupo 3"
            bloqueiaEdicao
          />
        )}
      />,
    );
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe(kit.uuid);
    unmount();

    renderGrupo((form) => (
      <TabelasGrupoCIEJA
        form={form}
        tiposAlimentacao={tiposComKit}
        grupoSelecionado="Grupo 6"
      />
    ));
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe(kit.uuid);

    const cemeiSemKit = render(
      <Form
        onSubmit={jest.fn()}
        render={({ form }) => (
          <TabelasGrupoCEMEI
            form={form}
            tiposAlimentacao={tipos}
            faixasEtarias={faixas}
            grupoSelecionado="Grupo 2"
          />
        )}
      />,
    );
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe("Kit Lanche");
    cemeiSemKit.unmount();

    renderGrupo((form) => (
      <TabelasGrupoCEMEI
        form={form}
        tiposAlimentacao={tiposComKit}
        faixasEtarias={faixas}
        grupoSelecionado="Grupo 2"
      />
    ));
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações - Turma Infantil - EMEI].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe(kit.uuid);

    renderGrupo((form) => (
      <TabelasGrupoEMEBS
        form={form}
        tiposAlimentacao={tiposComKit}
        grupoSelecionado="Grupo 5"
        bloqueiaEdicao
      />
    ));
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações - EMEBS Fundamental].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe(kit.uuid);
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações - EMEBS Infantil].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe(kit.uuid);
  });

  it("renderiza o grupo EMEF separando refeição e EJA", () => {
    renderGrupo((form) => (
      <TabelasGrupoEMEF
        form={form}
        tiposAlimentacao={tipos}
        grupoSelecionado="Grupo 4"
        bloqueiaEdicao
      />
    ));

    expect(
      screen.getByText("Refeição - CEU EMEF, CEU GESTÃO, EMEF, EMEFM"),
    ).toBeInTheDocument();
    expect(screen.getByText("Refeição - EJA")).toBeInTheDocument();
    expect(
      valorOculto(
        "tabelas[Preço das Alimentações].Kit Lanche.tipo_alimentacao",
      ),
    ).toBe("Kit Lanche");
  });
});
