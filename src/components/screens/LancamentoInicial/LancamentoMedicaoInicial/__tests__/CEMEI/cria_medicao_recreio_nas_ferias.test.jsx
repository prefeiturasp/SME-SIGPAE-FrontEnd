import "@testing-library/jest-dom";
import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {
  PANORAMA_ESCOLA,
  SOLICITACOES_DIETA_ESPECIAL,
} from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockEscolaSimplesCEMEI } from "src/mocks/services/escola.service/CEMEI/escolaSimples";
import { mockRecreioNasFeriasEMEFDezembro2025 } from "src/mocks/services/medicaoInicial.service/EMEF/Dezembro2025/recreioNasFerias";
import { mockPanoramaEscolaCEMEIDezembro2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/CEMEI/Dezembro2025/panoramaEscola";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário CEMEI - Cria Medição com Recreio nas Ferias", () => {
  const escolaUuid = mockMeusDadosEscolaCEMEI.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onPost(`/${SOLICITACOES_DIETA_ESPECIAL}/${PANORAMA_ESCOLA}/`)
      .reply(200, mockPanoramaEscolaCEMEIDezembro2025);
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesCEMEI);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, mockRecreioNasFeriasEMEFDezembro2025);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaCEMEI,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });
});
