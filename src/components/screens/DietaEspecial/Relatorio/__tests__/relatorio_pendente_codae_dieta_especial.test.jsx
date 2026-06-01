import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CODAE } from "src/configs/constants";
import { mockDietaEspecialLevi } from "src/mocks/DietaEspecial/Relatorio/mockDietaEspecialLevi";
import { mockMotivosNegarCancelamento } from "src/mocks/DietaEspecial/Relatorio/mockMotivosNegarCancelamento";
import { localStorageMock } from "src/mocks/localStorageMock";
import {
  getAlergiasIntolerancias,
  getAlimentos,
  getClassificacoesDietaEspecial,
  getNomesProtocolosValidos,
  getProtocoloPadrao,
  getDietaEspecial,
  getSolicitacoesDietaEspecial,
} from "src/services/dietaEspecial.service";
import { getMotivosNegacaoDietaEspecial } from "src/services/painelNutricionista.service";
import Relatorio from "..";
import { mockListaProtocolosLiberados } from "src/mocks/services/dietaEspecial.service/listaProtocolosLiberados";
import { mockAlimentos } from "src/mocks/services/dietaEspecial.service/alimentos";
import { mockGetClassificacaoDieta } from "src/mocks/services/dietaEspecial.service/mockGetClassificacoesDietas";
import { mockDietaEspecialComum } from "src/mocks/DietaEspecial/mockDietaAvalidar";

jest.mock("src/services/dietaEspecial.service");
jest.mock("src/services/painelNutricionista.service");

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input }) => (
    <textarea data-testid="ckeditor-mock" value={input?.value || ""} readOnly />
  ),
}));

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDietaEspecial).toHaveBeenCalled();
    expect(getProtocoloPadrao).toHaveBeenCalled();
    expect(getMotivosNegacaoDietaEspecial).toHaveBeenCalled();
    expect(getAlergiasIntolerancias).toHaveBeenCalled();
    expect(getClassificacoesDietaEspecial).toHaveBeenCalled();
    expect(getNomesProtocolosValidos).toHaveBeenCalled();
    expect(getAlimentos).toHaveBeenCalled();
    expect(getSolicitacoesDietaEspecial).toHaveBeenCalled();
  });
};

const mockDietaEspecialLeviComProtocolo = {
  ...mockDietaEspecialLevi,
  protocolo_padrao: {
    nome_protocolo: "ALERGIA A CAMARÃO",
    uuid: "1234123-1234-1234-1234-123412341234",
  },
  informacoes_adicionais: null,
};

describe("Test <Relatorio> - Relatório de Dieta Especial - Pendente Autorização - Visão CODAE Dieta Especial", () => {
  beforeEach(async () => {
    getDietaEspecial.mockResolvedValue({
      data: mockDietaEspecialLeviComProtocolo,
      status: 200,
    });
    getProtocoloPadrao.mockResolvedValue({
      data: {},
      status: 200,
    });
    getMotivosNegacaoDietaEspecial.mockResolvedValue({
      data: mockMotivosNegarCancelamento,
      status: 200,
    });
    getAlergiasIntolerancias.mockResolvedValue({
      data: [
        { id: 127, descricao: "ARGININEMIA" },
        { id: 137, descricao: "BRONQUITE" },
      ],
      status: 200,
    });
    getClassificacoesDietaEspecial.mockResolvedValue({
      data: mockGetClassificacaoDieta,
      status: 200,
    });
    getNomesProtocolosValidos.mockResolvedValue({
      data: mockListaProtocolosLiberados,
      status: 200,
    });
    getAlimentos.mockResolvedValue({
      data: mockAlimentos,
      status: 200,
    });
    getSolicitacoesDietaEspecial.mockResolvedValue({
      data: { results: [mockDietaEspecialComum] },
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", `"dieta_especial"`);

    const search = `?uuid=1e255cfc-81bb-4cec-a64c-64d7021bd81c&card=pendentes-aut`;
    window.history.pushState({}, "", search);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[{ pathname: "/" }]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Relatorio visao={CODAE} />
        </MemoryRouter>,
      );
    });
  });

  it("deve exibir dados do relatório", async () => {
    await awaitServices();

    expect(screen.getByText("Dados do aluno")).toBeInTheDocument();

    expect(screen.getByDisplayValue("8888888")).toBeInTheDocument();
    expect(screen.getByDisplayValue("LEVI ALUNO TESTE")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Autorizar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Negar" })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Histórico" }),
    ).toBeInTheDocument();

    expect(screen.getAllByTestId("ckeditor-mock")).toHaveLength(2);
  });

  it("deve preencher informacoes_adicionais com texto padrão quando vier null", async () => {
    await awaitServices();

    const campo = screen.getAllByTestId("ckeditor-mock")[1];
    expect(campo.value).toContain(
      "NOTA: A Empresa tem prazo máximo de 3 dias úteis para o atendimento da alimentação específica",
    );
  });
});
