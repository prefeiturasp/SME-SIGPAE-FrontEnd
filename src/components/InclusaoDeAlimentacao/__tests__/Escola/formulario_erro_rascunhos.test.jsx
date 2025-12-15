import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Container } from "src/components/InclusaoDeAlimentacao/Escola/Formulario/componentes/Container";
import { PERFIL, TIPO_SOLICITACAO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockCreateGrupoInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockCreateGrupoInclusaoNormal";
import { mockInicioPedidoGrupoInclusaoAlimentacao } from "src/mocks/InclusaoAlimentacao/mockInicioPedidoGrupoInclusaoAlimentacao";
import { mockMotivoInclusaoEspecifico } from "src/mocks/InclusaoAlimentacao/mockMotivoInclusaoEspecifico";
import { mockMotivosInclusaoContinua } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoContinua";
import { mockMotivosInclusaoNormal } from "src/mocks/InclusaoAlimentacao/mockMotivosInclusaoNormal";
import { mockPeriodosEscolaresNoite } from "src/mocks/InclusaoAlimentacao/mockPeriodosEscolaresNoite";
import { mockQuantidadeAlunosPorPeriodo } from "src/mocks/InclusaoAlimentacao/mockQuantidadeAlunosPorPeriodo";
import { mockVinculosTipoAlimentacaoEPeriodoEscolar } from "src/mocks/InclusaoAlimentacao/mockVinculosTipoAlimentacaoEPeriodoescolar";
import { mockDiasUteis } from "src/mocks/diasUseisMock";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import React from "react";
import {
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "src/services/diasUteis.service";
import {
  buscaPeriodosEscolares,
  getQuantidaDeAlunosPorPeriodoEEscola,
} from "src/services/escola.service";
import {
  createInclusaoAlimentacao,
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
  iniciaFluxoInclusaoAlimentacao,
  obterMinhasSolicitacoesDeInclusaoDeAlimentacao,
  updateInclusaoAlimentacao,
} from "src/services/inclusaoDeAlimentacao";

jest.mock("src/services/cadastroTipoAlimentacao.service");
jest.mock("src/services/escola.service");
jest.mock("src/services/diasUteis.service");
jest.mock("src/services/inclusaoDeAlimentacao");

const awaitServices = async () => {
  await waitFor(() => {
    expect(getDiasUteis).toHaveBeenCalled();
    expect(getMotivosInclusaoNormal).toHaveBeenCalled();
    expect(getMotivosInclusaoContinua).toHaveBeenCalled();
    expect(buscaPeriodosEscolares).toHaveBeenCalled();
    expect(getQuantidaDeAlunosPorPeriodoEEscola).toHaveBeenCalled();
    expect(getVinculosTipoAlimentacaoPorEscola).toHaveBeenCalled();
    expect(
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
    ).toHaveBeenCalled();
  });
};

describe("Teste Formulário Inclusão de Alimentação", () => {
  beforeEach(async () => {
    getMotivosInclusaoNormal.mockResolvedValue({
      data: mockMotivosInclusaoNormal,
      status: 200,
    });
    getMotivosInclusaoContinua.mockResolvedValue({
      data: mockMotivosInclusaoContinua,
      status: 200,
    });
    buscaPeriodosEscolares.mockResolvedValue({
      data: mockPeriodosEscolaresNoite,
      status: 200,
    });
    getQuantidaDeAlunosPorPeriodoEEscola.mockResolvedValue({
      data: mockQuantidadeAlunosPorPeriodo,
      status: 200,
    });
    getVinculosTipoAlimentacaoPorEscola.mockResolvedValue({
      data: mockVinculosTipoAlimentacaoEPeriodoEscolar,
      status: 200,
    });
    getVinculosTipoAlimentacaoMotivoInclusaoEspecifico.mockResolvedValue({
      data: mockMotivoInclusaoEspecifico,
      status: 200,
    });
    getDiasUteis.mockResolvedValue({
      data: mockDiasUteis,
      status: 200,
    });
    obterMinhasSolicitacoesDeInclusaoDeAlimentacao.mockImplementation(
      (tipo) => {
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
          return Promise.resolve({
            data: {},
            status: 400,
          });
        }
        if (tipo === TIPO_SOLICITACAO.SOLICITACAO_CONTINUA) {
          return Promise.resolve({
            data: { results: [] },
            status: 200,
          });
        }
        return Promise.resolve({
          data: { results: [] },
          status: 500,
        });
      },
    );
    createInclusaoAlimentacao.mockResolvedValue({
      data: mockCreateGrupoInclusaoNormal,
      status: 201,
    });
    updateInclusaoAlimentacao.mockResolvedValue({
      data: mockCreateGrupoInclusaoNormal,
      status: 200,
    });
    iniciaFluxoInclusaoAlimentacao.mockResolvedValue({
      data: mockInicioPedidoGrupoInclusaoAlimentacao,
      status: 200,
    });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);

    await act(async () => {
      render(
        <MeusDadosContext.Provider
          value={{ meusDados: mockMeusDadosEscolaEMEFPericles }}
        >
          <Container />
        </MeusDadosContext.Provider>,
      );
    });
  });

  it("renderiza erro de rascunhos", async () => {
    await awaitServices();
    expect(screen.getByText("Nº de Matriculados")).toBeInTheDocument();
    expect(screen.getByText("524")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Informação automática disponibilizada pelo Cadastro da Unidade Escolar",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Erro ao carregar rascunhos de Inclusão de Alimentação.",
      ),
    ).toBeInTheDocument();
  });
});
