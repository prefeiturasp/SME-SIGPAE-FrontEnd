import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import RenderComponentByParametrizacao from "../Ocorrencia/RenderComponentByParametrizacao";
import { Ocorrencia } from "../Ocorrencia";

jest.mock("src/components/Shareable/Botao", () =>
  jest.fn(({ onClick, titulo }) => (
    <button onClick={onClick} type="button">
      {titulo}
    </button>
  )),
);

jest.mock("../Ocorrencia/RenderComponentByParametrizacao", () =>
  jest.fn(({ UUIDResposta, parametrizacao }) => (
    <div>
      {parametrizacao.titulo} - resposta {UUIDResposta || "nova"}
    </div>
  )),
);

const UUID_ESCOLA = "19eeb479-a31c-4ad6-a692-364216143689";
const UUID_OCORRENCIA = "39623502-eb01-4bb2-b8d5-0ced722f90cd";
const UUID_PARAMETRIZACAO = "88a4368e-3d2b-4592-b379-e2af14323b19";
const UUID_OUTRA_PARAMETRIZACAO = "1c91a61f-39f8-431f-9d19-579704ca8ad8";
const UUID_RESPOSTA = "f7b7f8f3-b4c7-4c96-a586-e72307c47f52";

const escolaSelecionada = {
  edital: "3e8a6924-aa00-4d0d-aadd-73989ac471a2",
  label: "123456 - EMEF Teste",
  uuid: UUID_ESCOLA,
  value: "123456 - EMEF Teste",
};

const parametrizacoes = [
  {
    tipo_pergunta: { nome: "Campo de Texto Simples" },
    titulo: "Descrição",
    uuid: UUID_PARAMETRIZACAO,
  },
  {
    tipo_pergunta: { nome: "Campo Numérico" },
    titulo: "Quantidade",
    uuid: UUID_OUTRA_PARAMETRIZACAO,
  },
];

const criarTipoOcorrencia = (parametrizacoesOcorrencia = parametrizacoes) => ({
  parametrizacoes: parametrizacoesOcorrencia,
  uuid: UUID_OCORRENCIA,
});

const criarFormulario = () => ({
  change: jest.fn(),
  getState: jest.fn(() => ({
    values: {
      [`grupos_${UUID_OCORRENCIA}`]: [
        { descricao: "Primeiro grupo" },
        { descricao: "Segundo grupo" },
        { descricao: "Terceiro grupo" },
      ],
    },
  })),
});

const renderizarOcorrencia = ({
  form = criarFormulario(),
  indexFieldArray = 0,
  respostasOcorrencias = [],
  somenteLeitura = false,
  tipoOcorrencia = criarTipoOcorrencia(),
} = {}) => {
  render(
    <table>
      <tbody>
        <Ocorrencia
          escolaSelecionada={escolaSelecionada}
          form={form}
          indexFieldArray={indexFieldArray}
          name_grupos={`grupos_${UUID_OCORRENCIA}[${indexFieldArray}]`}
          respostasOcorrencias={respostasOcorrencias}
          somenteLeitura={somenteLeitura}
          tipoOcorrencia={tipoOcorrencia}
        />
      </tbody>
    </table>,
  );

  return { form };
};

describe("Ocorrencia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("informa quando o item não possui parametrizações", () => {
    renderizarOcorrencia({ tipoOcorrencia: criarTipoOcorrencia([]) });

    expect(
      screen.getByText("Não há parametrização para esse item."),
    ).toBeInTheDocument();
    expect(RenderComponentByParametrizacao).not.toHaveBeenCalled();
  });

  it("renderiza todas as parametrizações como novas respostas", () => {
    renderizarOcorrencia();

    expect(screen.getByText("Descrição - resposta nova")).toBeInTheDocument();
    expect(screen.getByText("Quantidade - resposta nova")).toBeInTheDocument();
    expect(RenderComponentByParametrizacao).toHaveBeenCalledTimes(2);
  });

  it("associa a resposta da parametrização ao grupo correspondente", () => {
    const respostasOcorrencias = [
      {
        grupo: 1,
        parametrizacao: { uuid: UUID_PARAMETRIZACAO },
        uuid: "8912065c-88bb-4a86-aa42-d703720d192d",
      },
      {
        grupo: 2,
        parametrizacao: { uuid: UUID_PARAMETRIZACAO },
        uuid: UUID_RESPOSTA,
      },
    ];

    renderizarOcorrencia({ indexFieldArray: 1, respostasOcorrencias });

    expect(
      screen.getByText(`Descrição - resposta ${UUID_RESPOSTA}`),
    ).toBeInTheDocument();
    expect(screen.getByText("Quantidade - resposta nova")).toBeInTheDocument();
  });

  it("exclui o grupo selecionado", () => {
    const form = criarFormulario();
    renderizarOcorrencia({ form, indexFieldArray: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

    expect(form.change).toHaveBeenCalledWith(`grupos_${UUID_OCORRENCIA}`, [
      { descricao: "Primeiro grupo" },
      { descricao: "Terceiro grupo" },
    ]);
  });

  it("não apresenta exclusão para o primeiro grupo ou no modo de leitura", () => {
    const { rerender } = render(
      <table>
        <tbody>
          <Ocorrencia
            escolaSelecionada={escolaSelecionada}
            form={criarFormulario()}
            indexFieldArray={0}
            name_grupos={`grupos_${UUID_OCORRENCIA}[0]`}
            respostasOcorrencias={[]}
            somenteLeitura={false}
            tipoOcorrencia={criarTipoOcorrencia()}
          />
        </tbody>
      </table>,
    );

    expect(
      screen.queryByRole("button", { name: "Excluir" }),
    ).not.toBeInTheDocument();

    rerender(
      <table>
        <tbody>
          <Ocorrencia
            escolaSelecionada={escolaSelecionada}
            form={criarFormulario()}
            indexFieldArray={1}
            name_grupos={`grupos_${UUID_OCORRENCIA}[1]`}
            respostasOcorrencias={[]}
            somenteLeitura
            tipoOcorrencia={criarTipoOcorrencia()}
          />
        </tbody>
      </table>,
    );

    expect(
      screen.queryByRole("button", { name: "Excluir" }),
    ).not.toBeInTheDocument();
  });
});
