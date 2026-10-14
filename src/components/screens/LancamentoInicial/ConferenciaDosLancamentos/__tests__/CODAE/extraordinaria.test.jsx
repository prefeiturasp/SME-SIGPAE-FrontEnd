import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioSetembro2025CMCT } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/CMCT/Setembro2025/diasCalendario";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetVinculosTipoAlimentacaoPorEscolaCMCT } from "src/mocks/services/cadastroTipoAlimentacao.service/CMCT/mockGetVinculosTipoAlimentacaoPorEscolaCMCT";
import { mockPeriodosGruposMedicaoSolicitarCorrecaoCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/periodosGruposMedicaoSolicitarCorrecao";
import { mockSolicitacaoMedicaoInicialCMCTSetembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/CMCT/Setembro2025/solicitacaoMedicaoInicial";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";
import mock from "src/services/_mock";

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: () => (
    <textarea
      data-testid="ckeditor-mock"
      name="justificativa"
      required={false}
    />
  ),
}));

const GRUPO_EXTRAORDINARIO = "Solicitações de Alimentação Extraordinárias";

describe("Conferência de Lançamentos - bloco Solicitações de Alimentação Extraordinárias", () => {
  const solicitacao = {
    ...mockSolicitacaoMedicaoInicialCMCTSetembro2025,
    lanche_emergencial_extraordinario: true,
  };

  beforeEach(async () => {
    process.env.IS_TEST = true;

    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/periodos-grupos-medicao/",
      )
      .reply(200, mockPeriodosGruposMedicaoSolicitarCorrecaoCMCTSetembro2025);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacao.uuid}/`,
      )
      .reply(200, solicitacao);
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes-com-nome/")
      .reply(200, { results: [] });
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioSetembro2025CMCT);
    mock.onGet("/dias-letivos/calendario/").reply(200, []);
    mock.onGet("dias-suspensao-atividades/lista-dias/").reply(200, []);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${solicitacao.escola_uuid}/`,
      )
      .reply(200, mockGetVinculosTipoAlimentacaoPorEscolaCMCT);
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.MEDICAO);
    localStorage.setItem("perfil", PERFIL.ADMINITRADOR_MEDICAO);

    window.history.pushState({}, "", `?uuid=${solicitacao.uuid}`);

    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/",
              state: {
                ano: "2025",
                mes: "09",
                escolaUuid: solicitacao.escola_uuid,
              },
            },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ToastContainer />
          <ConferenciaDosLancamentosPage />
        </MemoryRouter>,
      );
    });
  });

  it("exibe o bloco de correção com a seção extraordinária quando a flag é true", () => {
    expect(
      screen.getByText("Solicitação de Correção pela CODAE"),
    ).toBeInTheDocument();
    expect(screen.getByText(GRUPO_EXTRAORDINARIO)).toBeInTheDocument();
  });

  it("ao visualizar, mostra as linhas Lanche Emergencial e Observações sem Kit Lanche", async () => {
    fireEvent.click(
      screen.getByTestId(`visualizar-lancamento-${GRUPO_EXTRAORDINARIO}`),
    );

    await waitFor(() => {
      expect(screen.getByText("Lanche Emergencial")).toBeInTheDocument();
      expect(screen.getByText("Observações")).toBeInTheDocument();
    });

    expect(screen.queryByText("Kit Lanche")).not.toBeInTheDocument();
  });
});
