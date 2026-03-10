import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { localStorageMock } from "src/mocks/localStorageMock";
import { PeriodoLancamentoMedicaoInicialCEI } from "src/components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI";
import { mockLocationStateGrupoEmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockStateRecreio";
import { getMeusDados } from "src/services/perfil.service";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockMeusDadosEscolaCEMEI";
import { mockFaixasEtarias } from "src/mocks/faixaEtaria.service/mockGetFaixasEtarias";
import { mockCategoriasMedicaoCEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/mockCategoriasMedicaoCEI";
import { mockDiasLetivosRecreio } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/diasLetivosRecreio";
import { mockValoresMedicaoEmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockValoresMedicao";
import { mockSalvaLancamentoSemana1EmeiDaCEMEI } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicialCEI/RecreioNasFerias/CEMEI/mockSalvarLancamentos";

import { getListaDiasSobremesaDoce } from "src/services/medicaoInicial/diaSobremesaDoce.service";
import {
  getCategoriasDeMedicao,
  getDiasLetivosRecreio,
  getDiasParaCorrecao,
  getFeriadosNoMes,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesAutorizadasEscola,
  getSolicitacoesSuspensoesAutorizadasEscola,
  getValoresPeriodosLancamentos,
  updateValoresPeriodosLancamentos,
  getLogDietasAutorizadasRecreioNasFeriasCEI,
  getLogDietasAutorizadasPeriodo,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getPermissoesLancamentosEspeciaisMesAnoPorPeriodo } from "src/services/medicaoInicial/permissaoLancamentosEspeciais.service";
import mock from "src/services/_mock";

jest.mock("src/services/perfil.service.jsx");
jest.mock("src/services/medicaoInicial/diaSobremesaDoce.service.jsx");
jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/medicaoInicial/periodoLancamentoMedicao.service");
jest.mock("src/services/medicaoInicial/permissaoLancamentosEspeciais.service");

describe("Teste <PeriodoLancamentoMedicaoInicialCEI> para o Grupo Recreio nas Férias - de 0 a 3 anos e 11 meses - CEMEI", () => {
  beforeEach(async () => {
    getMeusDados.mockResolvedValue({
      data: mockMeusDadosEscolaCEMEI,
      status: 200,
    });
    mock.onGet("/faixas-etarias/").reply(200, mockFaixasEtarias);

    getListaDiasSobremesaDoce.mockResolvedValue({ data: [], status: 200 });

    getSolicitacoesInclusoesAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola.mockResolvedValue({
      data: { results: [] },
      status: 200,
    });

    getSolicitacoesSuspensoesAutorizadasEscola.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });

    getCategoriasDeMedicao.mockResolvedValue({
      data: mockCategoriasMedicaoCEI,
      status: 200,
    });

    getDiasLetivosRecreio.mockResolvedValue({
      data: mockDiasLetivosRecreio,
      status: 200,
    });
    getLogDietasAutorizadasRecreioNasFeriasCEI.mockResolvedValue({
      data: [],
      status: 200,
    });

    getValoresPeriodosLancamentos.mockResolvedValue({
      data: mockValoresMedicaoEmeiDaCEMEI,
      status: 200,
    });

    getDiasParaCorrecao.mockResolvedValue({
      data: [],
      status: 200,
    });

    getFeriadosNoMes.mockResolvedValue({
      data: { results: ["01", "25"] },
      status: 200,
    });

    updateValoresPeriodosLancamentos.mockResolvedValue({
      data: mockSalvaLancamentoSemana1EmeiDaCEMEI,
      status: 200,
    });

    getTiposDeAlimentacao.mockResolvedValue({
      data: { data: { results: [] }, status: 200 },
      status: 200,
    });

    getLogDietasAutorizadasPeriodo.mockResolvedValue({
      data: [],
      status: 200,
    });

    getPermissoesLancamentosEspeciaisMesAnoPorPeriodo.mockResolvedValue({
      data: {
        results: {
          alimentacoes_lancamentos_especiais: [],
          permissoes_por_dia: [],
          data_inicio_permissoes: null,
        },
      },
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("eh_cemei", "true");
    await act(async () => {
      render(
        <MemoryRouter
          initialEntries={[
            { pathname: "/", state: mockLocationStateGrupoEmeiDaCEMEI },
          ]}
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <PeriodoLancamentoMedicaoInicialCEI />
          <ToastContainer />
        </MemoryRouter>,
      );
    });
  });
});
