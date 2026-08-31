import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolasTercTotal,
  getQuantidadeAlunosMatriculadosPorData,
} from "src/services/escola.service";
import {
  exportarPDFRelatorioFiscalizacao,
  getPeriodosVisita,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { Cabecalho } from "../Cabecalho";

jest.mock("antd", () => ({
  Spin: ({ children }) => <>{children}</>,
}));

jest.mock("react-final-form", () => ({
  Field: ({ component: Componente, ...props }) => {
    if (Componente === "input") {
      const propriedadesCampo = { ...props };
      delete propriedadesCampo.validate;

      return <input {...propriedadesCampo} aria-label={props.id} />;
    }

    return <Componente {...props} />;
  },
}));

jest.mock("src/components/Shareable/Select", () =>
  jest.fn(({ label, onChangeEffect, options = [] }) => (
    <label>
      {label}
      <select
        aria-label={label}
        onChange={(evento) => onChangeEffect?.(evento)}
      >
        {options.map((opcao) => (
          <option key={opcao.uuid} value={opcao.uuid}>
            {opcao.nome}
          </option>
        ))}
      </select>
    </label>
  )),
);

jest.mock("src/components/Shareable/AutoCompleteField", () =>
  jest.fn(({ inputOnChange, label, options = [] }) => (
    <div>
      <label>
        {label}
        <input
          aria-label={label}
          onChange={(evento) => inputOnChange(evento.target.value)}
        />
      </label>
      <div>{options.map((opcao) => opcao.label).join("|")}</div>
    </div>
  )),
);

jest.mock("src/components/Shareable/DatePicker", () => ({
  InputComData: ({ inputOnChange, label }) => (
    <label>
      {label}
      <input
        aria-label={label}
        onChange={(evento) => inputOnChange(evento.target.value)}
      />
    </label>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  InputText: () => null,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  Botao: ({ onClick }) => (
    <button
      aria-label="Exportar relatório em PDF"
      onClick={onClick}
      type="button"
    >
      Exportar PDF
    </button>
  ),
}));

jest.mock("src/components/Shareable/ModalSolicitacaoDownload", () =>
  jest.fn(({ show }) =>
    show ? <div>Solicitação enviada para a Central de Downloads</div> : null,
  ),
);

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
}));

jest.mock("src/helpers/utilities", () => ({
  composeValidators: jest.fn(() => jest.fn()),
  converterDDMMYYYYparaYYYYMMDD: jest.fn(() => "2026-08-20"),
}));

jest.mock("src/services/diretoriaRegional.service", () => ({
  getDiretoriaregionalSimplissima: jest.fn(),
}));

jest.mock("src/services/escola.service", () => ({
  getEscolasTercTotal: jest.fn(),
  getQuantidadeAlunosMatriculadosPorData: jest.fn(),
}));

jest.mock("src/services/imr/relatorioFiscalizacaoTerceirizadas", () => ({
  exportarPDFRelatorioFiscalizacao: jest.fn(),
  getPeriodosVisita: jest.fn(),
}));

const UUID_DRE = "ee0fb879-5225-46b8-a14e-2395873416db";
const UUID_ESCOLA = "28649d3e-b46c-45f3-a60f-87bd1968c26a";
const UUID_EDITAL = "62d4dc6a-c51f-47e8-a0fb-a9d5f9e97d36";
const UUID_PERIODO = "4ff87974-519d-4613-bf29-7d7440707444";
const UUID_RELATORIO = "c2092fe5-fc87-4480-9b97-f003809e1e36";

const escola = {
  codigo_eol: "123456",
  lote_obj: {
    contratos_do_lote: [
      { edital: "edital-encerrado", encerrado: true },
      { edital: UUID_EDITAL, encerrado: false },
    ],
    nome: "Lote 01",
  },
  nome: "EMEF Teste",
  terceirizada: "Empresa Terceirizada",
  uuid: UUID_ESCOLA,
};

const escolaFormatada = {
  edital: UUID_EDITAL,
  label: "123456 - EMEF Teste",
  lote_nome: "Lote 01",
  terceirizada: "Empresa Terceirizada",
  uuid: UUID_ESCOLA,
  value: "123456 - EMEF Teste",
};

const criarFormulario = (initialValues) => ({
  change: jest.fn(),
  getState: jest.fn(() => ({ initialValues })),
});

const renderizarComponente = ({
  form = criarFormulario(),
  values = {
    acompanhou_visita: "nao",
    data: "20/08/2026",
    diretoria_regional: UUID_DRE,
    total_matriculados_por_data: 300,
  },
} = {}) => {
  const setEscolaSelecionada = jest.fn();
  const setTiposOcorrencia = jest.fn();
  const getTiposOcorrenciaPorEditalNutrisupervisaoAsync = jest
    .fn()
    .mockResolvedValue(undefined);

  render(
    <Cabecalho
      escolaSelecionada={escolaFormatada}
      form={form}
      getTiposOcorrenciaPorEditalNutrisupervisaoAsync={
        getTiposOcorrenciaPorEditalNutrisupervisaoAsync
      }
      setEscolaSelecionada={setEscolaSelecionada}
      setTiposOcorrencia={setTiposOcorrencia}
      values={values}
    />,
  );

  return {
    form,
    getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
    setEscolaSelecionada,
  };
};

describe("Cabecalho", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getDiretoriaregionalSimplissima.mockResolvedValue({
      data: { results: [{ nome: "DRE Teste", uuid: UUID_DRE }] },
      status: 200,
    });
    getPeriodosVisita.mockResolvedValue({
      data: { results: [{ nome: "Manhã", uuid: UUID_PERIODO }] },
      status: 200,
    });
    getEscolasTercTotal.mockResolvedValue({ data: [escola], status: 200 });
    getQuantidadeAlunosMatriculadosPorData.mockResolvedValue({
      data: 300,
      status: 200,
    });
    exportarPDFRelatorioFiscalizacao.mockResolvedValue({ status: 200 });
  });

  it("preenche os dados relacionados ao selecionar uma escola", async () => {
    const {
      form,
      getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
      setEscolaSelecionada,
    } = renderizarComponente();

    fireEvent.change(
      await screen.findByLabelText("Diretoria Regional de Educação"),
      { target: { value: UUID_DRE } },
    );
    await screen.findByText(escolaFormatada.label);
    fireEvent.change(screen.getByLabelText("Unidade Educacional"), {
      target: { value: escolaFormatada.value },
    });

    await waitFor(() => {
      expect(setEscolaSelecionada).toHaveBeenCalledWith(escolaFormatada);
      expect(
        getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
      ).toHaveBeenCalledWith(form, escolaFormatada);
      expect(getQuantidadeAlunosMatriculadosPorData).toHaveBeenCalledWith({
        data: "2026-08-20",
        escola_uuid: UUID_ESCOLA,
      });
    });
    expect(form.change).toHaveBeenCalledWith("lote", "Lote 01");
    expect(form.change).toHaveBeenCalledWith(
      "terceirizada",
      "Empresa Terceirizada",
    );
    expect(form.change).toHaveBeenCalledWith(
      "total_matriculados_por_data",
      300,
    );
  });

  it("limpa a escola selecionada quando o texto não corresponde a uma opção", async () => {
    const { setEscolaSelecionada } = renderizarComponente();

    fireEvent.change(
      await screen.findByLabelText("Diretoria Regional de Educação"),
      { target: { value: UUID_DRE } },
    );
    await screen.findByText(escolaFormatada.label);
    fireEvent.change(screen.getByLabelText("Unidade Educacional"), {
      target: { value: "Escola inexistente" },
    });

    expect(setEscolaSelecionada).toHaveBeenCalledWith(undefined);
  });

  it("filtra as escolas sem diferenciar letras maiúsculas e minúsculas", async () => {
    renderizarComponente();

    await screen.findByLabelText("Unidade Educacional");

    const ultimaChamada = AutoCompleteField.mock.calls.length - 1;
    const { filterOption } = AutoCompleteField.mock.calls[ultimaChamada][0];
    const opcao = { label: "123456 - EMEF Teste" };

    expect(filterOption("emef", opcao)).toBe(true);
    expect(filterOption("escola inexistente", opcao)).toBe(false);
  });

  it("restaura a escola dos valores iniciais durante a edição", async () => {
    const escolaInicial = {
      codigo_eol: escola.codigo_eol,
      lote: "Lote 01",
      nome: escola.nome,
      terceirizada: escola.terceirizada,
      uuid: UUID_ESCOLA,
    };
    const form = criarFormulario({ escola: escolaInicial });
    const {
      getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
      setEscolaSelecionada,
    } = renderizarComponente({ form });

    await waitFor(() => {
      expect(form.change).toHaveBeenCalledWith("escola", "123456 - EMEF Teste");
      expect(setEscolaSelecionada).toHaveBeenCalledWith(escolaInicial);
      expect(
        getTiposOcorrenciaPorEditalNutrisupervisaoAsync,
      ).toHaveBeenCalledWith(form, escolaInicial);
    });
  });

  it("exporta o PDF de um relatório enviado", async () => {
    renderizarComponente({
      values: {
        acompanhou_visita: "nao",
        data: "20/08/2026",
        diretoria_regional: UUID_DRE,
        status: "ENVIADO_PARA_CODAE",
        total_matriculados_por_data: 300,
        uuid: UUID_RELATORIO,
      },
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Exportar relatório em PDF",
      }),
    );

    await waitFor(() => {
      expect(exportarPDFRelatorioFiscalizacao).toHaveBeenCalledWith({
        uuid: UUID_RELATORIO,
      });
      expect(
        screen.getByText("Solicitação enviada para a Central de Downloads"),
      ).toBeInTheDocument();
    });
  });

  it("informa erro quando não consegue exportar o PDF", async () => {
    exportarPDFRelatorioFiscalizacao.mockResolvedValue({ status: 500 });
    renderizarComponente({
      values: {
        acompanhou_visita: "nao",
        status: "ENVIADO_PARA_CODAE",
        total_matriculados_por_data: 300,
        uuid: UUID_RELATORIO,
      },
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Exportar relatório em PDF",
      }),
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Erro ao baixar PDF. Tente novamente mais tarde",
      );
    });
  });

  it("apresenta erro quando não consegue carregar as DREs", async () => {
    getDiretoriaregionalSimplissima.mockResolvedValue({ status: 500 });

    renderizarComponente();

    expect(
      await screen.findByText(
        "Erro ao carregar DREs. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });

  it("apresenta erro quando não consegue carregar as escolas", async () => {
    getEscolasTercTotal.mockResolvedValue({ status: 500 });
    renderizarComponente();

    fireEvent.change(
      await screen.findByLabelText("Diretoria Regional de Educação"),
      { target: { value: UUID_DRE } },
    );

    expect(
      await screen.findByText(
        "Erro ao carregar escolas. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });

  it("apresenta erro quando não consegue carregar o total de matriculados", async () => {
    getQuantidadeAlunosMatriculadosPorData.mockResolvedValue({ status: 500 });
    renderizarComponente();

    fireEvent.change(await screen.findByLabelText("Data da Visita"), {
      target: { value: "21/08/2026" },
    });

    expect(
      await screen.findByText(
        "Erro ao carregar quantidade alunos matriculados por data. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });

  it("apresenta erro quando não consegue carregar os períodos", async () => {
    getPeriodosVisita.mockResolvedValue({ status: 500 });

    renderizarComponente();

    expect(
      await screen.findByText(
        "Erro ao carregar Períodos de Visita. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});
