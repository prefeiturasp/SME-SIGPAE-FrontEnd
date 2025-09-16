import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaCEMEI } from "src/mocks/meusDados/escola/CEMEI";
import { mockInversaoDiaCardapioAValidarCEMEI } from "src/mocks/services/inversaoDiaCardapio.service/Escola/CEMEI/inversaoAValidar";
import { mockMotivosDRENaoValida } from "src/mocks/services/relatorios.service/mockMotivosDRENaoValida";
import * as RelatoriosInversaoDiaCardapio from "src/pages/InversaoDeDiaDeCardapio/RelatorioPage";
import mock from "src/services/_mock";

describe("Relatório Inversão - Visão Escola - Erro parâmetro UUID", () => {
  const uuidInversao = mockInversaoDiaCardapioAValidarCEMEI.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosEscolaCEMEI);
    mock
      .onGet(`/inversoes-dia-cardapio/${uuidInversao}/`)
      .reply(200, mockInversaoDiaCardapioAValidarCEMEI);
    mock.onGet("/motivos-dre-nao-valida/").reply(200, mockMotivosDRENaoValida);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("nome_instituicao", `"CEMEI SUZANA CAMPOS TAUIL"`);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
    localStorage.setItem("eh_cemei", "true");

    const search = `?ehInclusaoContinua=false&tipoSolicitacao=solicitacao-normal&card=undefined`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <RelatoriosInversaoDiaCardapio.RelatorioEscola />
        </MemoryRouter>
      );
    });
  });

  it("renderiza erro `Parâmetro `uuid` é obrigatório na URL para carregar a página corretamente.`", async () => {
    expect(
      screen.getByText(
        "Parâmetro `uuid` é obrigatório na URL para carregar a página corretamente."
      )
    ).toBeInTheDocument();
  });
});
