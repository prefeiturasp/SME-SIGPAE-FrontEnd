import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Formulario } from "../Formulario";

jest.mock("react-final-form", () => ({
  Field: ({ disabled, id, type, value }) => (
    <input
      aria-label={id}
      disabled={disabled}
      id={id}
      type={type}
      value={value}
      readOnly
    />
  ),
}));

jest.mock("react-final-form-arrays", () => ({
  FieldArray: ({ children, name }) =>
    children({ fields: [`${name}[0]`, `${name}[1]`] }),
}));

jest.mock("../Formulario/components/Ocorrencia", () => ({
  Ocorrencia: ({ indexFieldArray, name_grupos, somenteLeitura }) => (
    <tr>
      <td>
        Ocorrência {name_grupos} - índice {indexFieldArray} -
        {somenteLeitura ? " somente leitura" : " edição"}
      </td>
    </tr>
  ),
}));

jest.mock("../Formulario/components/OcorrenciaNaoSeAplica", () => ({
  OcorrenciaNaoSeAplica: ({ tipoOcorrencia }) => (
    <tr>
      <td>Justificativa para {tipoOcorrencia.titulo}</td>
    </tr>
  ),
}));

jest.mock("../Formulario/components/BotaoAdicionar", () => ({
  AdicionarResposta: ({ nameFieldArray, push }) => (
    <button type="button" onClick={() => push(nameFieldArray)}>
      Adicionar resposta para {nameFieldArray}
    </button>
  ),
}));

const UUID_ESCOLA = "7b7c3eb0-06c0-4919-af72-5c68bb09b928";
const UUID_CATEGORIA = "b6885eb3-7b2f-479f-b099-702cb21a3ecf";
const UUID_OCORRENCIA = "43d218f7-d6f8-46ac-b5ca-e58006360d12";
const UUID_OCORRENCIA_MESMA_POSICAO = "a83ad8e2-5928-4a82-aede-605193215040";
const UUID_OUTRA_OCORRENCIA = "032f6ec4-f93a-4b7c-9677-e70bcb563f97";
const UUID_PARAMETRIZACAO = "55fab9f0-10b5-470c-b9cc-02b893e2e486";
const UUID_RESPOSTA = "af9c1d5f-a043-4386-a2ac-3c95c7be24b2";

const categoria = {
  gera_notificacao: true,
  nome: "Higiene e organização",
  uuid: UUID_CATEGORIA,
};

const criarTipoOcorrencia = ({
  aceitaMultiplasRespostas = true,
  categoriaOcorrencia = categoria,
  posicao = 1,
  titulo = "Higienização dos equipamentos",
  uuid = UUID_OCORRENCIA,
} = {}) => ({
  aceita_multiplas_respostas: aceitaMultiplasRespostas,
  categoria: categoriaOcorrencia,
  descricao: "Verificar as condições de higienização.",
  parametrizacoes: [{ uuid: UUID_PARAMETRIZACAO }],
  penalidade: {
    numero_clausula: "Cláusula A",
    obrigacoes: ["Obrigação A"],
  },
  posicao,
  titulo,
  uuid,
});

const escolaSelecionada = {
  edital: "8c85a22d-b58f-49cc-93aa-ff43af07b7f7",
  label: "123456 - EMEF Teste",
  uuid: UUID_ESCOLA,
  value: "123456 - EMEF Teste",
};

const renderizarFormulario = ({
  form = { change: jest.fn() },
  push = jest.fn(),
  respostasOcorrenciaNaoSeAplica = [],
  respostasOcorrencias = [],
  somenteLeitura = false,
  tiposOcorrencia = [criarTipoOcorrencia()],
  values = {},
} = {}) => {
  render(
    <Formulario
      escolaSelecionada={escolaSelecionada}
      form={form}
      push={push}
      respostasOcorrenciaNaoSeAplica={respostasOcorrenciaNaoSeAplica}
      respostasOcorrencias={respostasOcorrencias}
      somenteLeitura={somenteLeitura}
      tiposOcorrencia={tiposOcorrencia}
      values={values}
    />,
  );

  return { form, push };
};

describe("Formulario", () => {
  it("restaura respostas, justificativas e ocorrências conformes", async () => {
    const tiposOcorrencia = [
      criarTipoOcorrencia(),
      criarTipoOcorrencia({
        posicao: 2,
        titulo: "Organização do estoque",
        uuid: UUID_OCORRENCIA_MESMA_POSICAO,
      }),
      criarTipoOcorrencia({
        posicao: 3,
        titulo: "Controle de validade",
        uuid: UUID_OUTRA_OCORRENCIA,
      }),
    ];
    const respostasOcorrencias = [
      {
        grupo: 1,
        parametrizacao: {
          tipo_ocorrencia: UUID_OCORRENCIA,
          uuid: UUID_PARAMETRIZACAO,
        },
        resposta: "Equipamento sem higienização",
        uuid: UUID_RESPOSTA,
      },
    ];
    const respostasOcorrenciaNaoSeAplica = [
      {
        descricao: "Item não existente na unidade.",
        tipo_ocorrencia: UUID_OCORRENCIA_MESMA_POSICAO,
      },
    ];
    const { form } = renderizarFormulario({
      respostasOcorrenciaNaoSeAplica,
      respostasOcorrencias,
      tiposOcorrencia,
    });

    await waitFor(() => {
      expect(form.change).toHaveBeenCalledWith(
        `ocorrencia_${UUID_OCORRENCIA}`,
        "nao",
      );
      expect(form.change).toHaveBeenCalledWith(
        `grupos_${UUID_OCORRENCIA}[0].tipoocorrencia_${UUID_OCORRENCIA}_parametrizacao_${UUID_PARAMETRIZACAO}_uuid_${UUID_RESPOSTA}`,
        "Equipamento sem higienização",
      );
      expect(form.change).toHaveBeenCalledWith(
        `ocorrencia_${UUID_OCORRENCIA_MESMA_POSICAO}`,
        "nao_se_aplica",
      );
      expect(form.change).toHaveBeenCalledWith(
        `descricao_${UUID_OCORRENCIA_MESMA_POSICAO}`,
        "Item não existente na unidade.",
      );
      expect(form.change).toHaveBeenCalledWith(
        `ocorrencia_${UUID_OUTRA_OCORRENCIA}`,
        "sim",
      );
    });
  });

  it("renderiza ocorrências, justificativa e botão para adicionar respostas", () => {
    const tiposOcorrencia = [
      criarTipoOcorrencia(),
      criarTipoOcorrencia({
        titulo: "Organização do estoque",
        uuid: UUID_OCORRENCIA_MESMA_POSICAO,
      }),
    ];
    const values = {
      [`grupos_${UUID_OCORRENCIA}`]: [{}, {}],
      [`grupos_${UUID_OCORRENCIA_MESMA_POSICAO}`]: [{}],
      [`ocorrencia_${UUID_OCORRENCIA}`]: "nao",
      [`ocorrencia_${UUID_OCORRENCIA_MESMA_POSICAO}`]: "nao_se_aplica",
    };
    const { push } = renderizarFormulario({ tiposOcorrencia, values });

    expect(
      screen.getByText(
        `Ocorrência grupos_${UUID_OCORRENCIA}[0] - índice 0 - edição`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Justificativa para Organização do estoque"),
    ).toBeInTheDocument();

    const botaoAdicionar = screen.getByRole("button", {
      name: `Adicionar resposta para grupos_${UUID_OCORRENCIA}`,
    });
    fireEvent.click(botaoAdicionar);

    expect(push).toHaveBeenCalledWith(`grupos_${UUID_OCORRENCIA}`);

    const celulaIndice = screen.getByText("1").closest("td");
    expect(celulaIndice).toHaveAttribute("rowspan", "6");
  });

  it("calcula o rowspan de uma ocorrência com múltiplas respostas", () => {
    renderizarFormulario({
      values: {
        [`grupos_${UUID_OCORRENCIA}`]: [{}, {}, {}],
        [`ocorrencia_${UUID_OCORRENCIA}`]: "nao",
      },
    });

    const celulaIndice = screen.getByText("1").closest("td");

    expect(celulaIndice).toHaveAttribute("rowspan", "5");
  });

  it("não permite adicionar respostas no modo somente leitura", () => {
    renderizarFormulario({
      somenteLeitura: true,
      values: {
        [`grupos_${UUID_OCORRENCIA}`]: [{}],
        [`ocorrencia_${UUID_OCORRENCIA}`]: "nao",
      },
    });

    expect(
      screen.queryByRole("button", { name: /Adicionar resposta/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(`sim_${UUID_OCORRENCIA}`)).toBeDisabled();
    expect(
      screen.getByText(
        `Ocorrência grupos_${UUID_OCORRENCIA}[0] - índice 0 - somente leitura`,
      ),
    ).toBeInTheDocument();
  });
});
