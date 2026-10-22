import React from "react";
import { render, screen } from "@testing-library/react";
import { HOME } from "src/constants/config";
import {
  EDITAR_OCORRENCIA,
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { EditarOcorrenciaPage } from "src/pages/IMR/EditarOcorrenciaPage";

const EDITAL_UUID = "11111111-1111-4111-8111-111111111111";
const SOLICITACAO_UUID = "22222222-2222-4222-8222-222222222222";
const OCORRENCIA_UUID = "33333333-3333-4333-8333-333333333333";
const TIPO_OCORRENCIA_UUID = "44444444-4444-4444-8444-444444444444";

const mockParametrosBusca = jest.fn();

jest.mock("react-router-dom", () => ({
  useSearchParams: () => mockParametrosBusca(),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: ({ botaoVoltar, titulo, children }) => (
    <main>
      <span data-testid="titulo">{titulo}</span>
      <span data-testid="botao-voltar">{String(botaoVoltar)}</span>
      {children}
    </main>
  ),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: ({ home, atual, anteriores }) => (
    <div data-testid="breadcrumb">
      <span data-testid="breadcrumb-home">{home}</span>
      <span data-testid="atual-href">{atual.href}</span>
      <span data-testid="atual-titulo">{atual.titulo}</span>

      {anteriores.map((anterior, indice) => (
        <div key={indice}>
          <span data-testid={`anterior-${indice}-titulo`}>
            {anterior.titulo}
          </span>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("src/components/screens/IMR/RegistrarNovaOcorrencia", () => ({
  RegistrarNovaOcorrencia: (props: Record<string, any>) => (
    <div
      data-testid="registrar-ocorrencia"
      data-props={JSON.stringify(props)}
    />
  ),
}));

describe("EditarOcorrenciaPage", () => {
  beforeEach(() => {
    mockParametrosBusca.mockReturnValue([
      new URLSearchParams({
        ano: "2026",
        mes: "9",
        editalUuid: EDITAL_UUID,
        solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
        ocorrenciaUuid: OCORRENCIA_UUID,
        tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
        grupo: "1",
      }),
    ]);
  });

  it("apresenta o título, o breadcrumb e repassa os dados da ocorrência", () => {
    render(<EditarOcorrenciaPage />);

    expect(screen.getByTestId("titulo")).toHaveTextContent("Editar Ocorrência");
    expect(screen.getByTestId("botao-voltar")).toHaveTextContent("true");
    expect(screen.getByTestId("breadcrumb-home")).toHaveTextContent(HOME);
    expect(screen.getByTestId("atual-href")).toHaveTextContent(
      `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${EDITAR_OCORRENCIA}`,
    );
    expect(screen.getByTestId("atual-titulo")).toHaveTextContent(
      "Editar Ocorrência",
    );
    expect(screen.getByTestId("anterior-0-titulo")).toHaveTextContent(
      "Medição Inicial",
    );
    expect(screen.getByTestId("anterior-1-titulo")).toHaveTextContent(
      "Lançamento Medição Inicial",
    );
    expect(screen.getByTestId("anterior-2-titulo")).toHaveTextContent(
      "Registrar Ocorrências",
    );

    const props = JSON.parse(
      screen.getByTestId("registrar-ocorrencia").dataset.props as string,
    );

    expect(props).toEqual({
      modoEdicao: true,
      ocorrenciaUuid: OCORRENCIA_UUID,
      tipoOcorrenciaUuid: TIPO_OCORRENCIA_UUID,
      grupo: 1,
      editalUuid: EDITAL_UUID,
      solicitacaoMedicaoInicialUuid: SOLICITACAO_UUID,
      mes: "9",
      ano: "2026",
    });
  });
});
