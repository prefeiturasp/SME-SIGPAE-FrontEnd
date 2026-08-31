import React from "react";
import { render, screen } from "@testing-library/react";
import RenderComponentByParametrizacao from "../Ocorrencia/RenderComponentByParametrizacao";

function mockCriarComponente(nome) {
  return jest.fn((props) => (
    <div data-testid={nome}>{JSON.stringify(props)}</div>
  ));
}

jest.mock("../Ocorrencia/Inputs/CampoTextoLongo", () => ({
  CampoTextoLongo: mockCriarComponente("CampoTextoLongo"),
}));
jest.mock("../Ocorrencia/Inputs/CampodeTextoSimples", () => ({
  CampodeTextoSimples: mockCriarComponente("CampodeTextoSimples"),
}));
jest.mock("../Ocorrencia/Inputs/CampoNumerico", () => ({
  CampoNumerico: mockCriarComponente("CampoNumerico"),
}));
jest.mock("../Ocorrencia/Inputs/OpçoesSimNao", () => ({
  OpçoesSimNao: mockCriarComponente("OpçoesSimNao"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorDeDatas", () => ({
  SeletorDeDatas: mockCriarComponente("SeletorDeDatas"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorTipoAlimentacao", () => ({
  SeletorTipoAlimentacao: mockCriarComponente("SeletorTipoAlimentacao"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorUtensiliosCozinha", () => ({
  SeletorUtensiliosCozinha: mockCriarComponente("SeletorUtensiliosCozinha"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorUtensiliosMesa", () => ({
  SeletorUtensiliosMesa: mockCriarComponente("SeletorUtensiliosMesa"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorEquipamentos", () => ({
  SeletorEquipamentos: mockCriarComponente("SeletorEquipamentos"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorMobiliarios", () => ({
  SeletorMobiliarios: mockCriarComponente("SeletorMobiliarios"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorReparosEAdaptacoes", () => ({
  SeletorReparosEAdaptacoes: mockCriarComponente("SeletorReparosEAdaptacoes"),
}));
jest.mock("../Ocorrencia/Seletores/SeletorInsumos", () => ({
  SeletorInsumos: mockCriarComponente("SeletorInsumos"),
}));

const UUID_ESCOLA = "c96a3c98-4929-4afb-ab95-40c3f21ee9b7";
const UUID_OCORRENCIA = "e656854b-4363-47b8-869a-bd6de3fb29e7";
const UUID_PARAMETRIZACAO = "3c4808c5-fef1-4694-a256-43d96f19d3b0";
const UUID_RESPOSTA = "3e0dd4b4-a2ae-454c-bc7e-d4d9d1356d61";
const NOME_GRUPO = `grupos_${UUID_OCORRENCIA}[0]`;

const escolaSelecionada = {
  edital: "4ac9453f-2979-4339-b0e3-2a5d348a2758",
  label: "123456 - EMEF Teste",
  uuid: UUID_ESCOLA,
  value: "123456 - EMEF Teste",
};

const form = { change: jest.fn() };
const tipoOcorrencia = { uuid: UUID_OCORRENCIA };

const tiposParametrizacao = [
  ["Campo de Texto Longo", "CampoTextoLongo"],
  ["Campo de Texto Simples", "CampodeTextoSimples"],
  ["Campo Numérico", "CampoNumerico"],
  ["Opções Sim/Não", "OpçoesSimNao"],
  ["Seletor de Datas", "SeletorDeDatas"],
  ["Seletor de Tipo de Alimentação", "SeletorTipoAlimentacao"],
  ["Seletor de Utensílios de Cozinha", "SeletorUtensiliosCozinha"],
  ["Seletor de Utensílios de Mesa", "SeletorUtensiliosMesa"],
  ["Seletor de Equipamentos", "SeletorEquipamentos"],
  ["Seletor de Mobiliários", "SeletorMobiliarios"],
  ["Seletor de Reparos e Adaptações", "SeletorReparosEAdaptacoes"],
  ["Seletor de Insumos", "SeletorInsumos"],
];

const renderizarComponente = (tipoPergunta) =>
  render(
    <RenderComponentByParametrizacao
      UUIDResposta={UUID_RESPOSTA}
      escolaSelecionada={escolaSelecionada}
      form={form}
      name_grupos={NOME_GRUPO}
      parametrizacao={{
        tipo_pergunta: { nome: tipoPergunta },
        titulo: "Campo parametrizado",
        uuid: UUID_PARAMETRIZACAO,
      }}
      somenteLeitura
      tipoOcorrencia={tipoOcorrencia}
    />,
  );

describe("RenderComponentByParametrizacao", () => {
  it.each(tiposParametrizacao)(
    "renderiza %s usando o componente correspondente",
    (tipoPergunta, componenteEsperado) => {
      renderizarComponente(tipoPergunta);

      const componente = screen.getByTestId(componenteEsperado);
      const propriedades = JSON.parse(componente.textContent);

      expect(propriedades).toEqual(
        expect.objectContaining({
          escolaSelecionada,
          name: `${NOME_GRUPO}.tipoocorrencia_${UUID_OCORRENCIA}_parametrizacao_${UUID_PARAMETRIZACAO}_uuid_${UUID_RESPOSTA}`,
          name_grupos: NOME_GRUPO,
          somenteLeitura: true,
          titulo: "Campo parametrizado",
        }),
      );
    },
  );

  it("não renderiza componente para um tipo de pergunta desconhecido", () => {
    const { container } = renderizarComponente("Tipo desconhecido");

    expect(container).toBeEmptyDOMElement();
  });
});
