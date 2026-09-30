import "@testing-library/jest-dom";
import { CODAE, DRE, TERCEIRIZADA } from "src/configs/constants";
import { statusEnum, TIPO_PERFIL, PERFIL } from "src/constants/shared";
import { localStorageMock } from "src/mocks/localStorageMock";
import {
  exibeBotaoAprovar,
  exibeBotaoNaoAprovar,
  exibirBotaoMarcarConferencia,
  exibirBotaoQuestionamento,
  exibirModalAutorizacaoAposQuestionamento,
} from "src/components/GestaoDeAlimentacao/Relatorios/logicaExibirBotoes.helper";

Object.defineProperty(global, "localStorage", { value: localStorageMock });

const setPerfil = (tipoPerfil, perfil) => {
  localStorage.clear();
  localStorage.setItem("tipo_perfil", tipoPerfil);
  if (perfil) localStorage.setItem("perfil", perfil);
};

describe("logicaExibirBotoes.helper", () => {
  it("exibe botão não aprovar para terceirizada com solicitação questionada", () => {
    setPerfil(TIPO_PERFIL.TERCEIRIZADA, PERFIL.NUTRI_EMPRESA);

    expect(
      exibeBotaoNaoAprovar(
        {
          prioridade: "LIMITE",
          status: statusEnum.CODAE_QUESTIONADO,
        },
        "Não",
      ),
    ).toBeTruthy();
  });

  it("exibe botão aprovar para lanche emergencial na visão CODAE", () => {
    setPerfil(
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    expect(
      exibeBotaoAprovar(
        {
          status: statusEnum.DRE_VALIDADO,
          motivo: { nome: "Lanche Emergencial" },
          logs: [],
        },
        CODAE,
        "Autorizar",
      ),
    ).toBe(true);
  });

  it("exibe botão aprovar para perfil que não é de terceirizada", () => {
    setPerfil(TIPO_PERFIL.DIRETORIA_REGIONAL, PERFIL.COGESTOR_DRE);

    expect(
      exibeBotaoAprovar(
        {
          prioridade: "REGULAR",
          status: statusEnum.DRE_VALIDADO,
          logs: [],
        },
        DRE,
        "Validar",
      ),
    ).toBe(true);
  });

  it("não exibe botão aprovar quando o texto é Ciente", () => {
    setPerfil(TIPO_PERFIL.TERCEIRIZADA, PERFIL.NUTRI_EMPRESA);

    expect(
      exibeBotaoAprovar(
        {
          prioridade: "REGULAR",
          status: statusEnum.CODAE_AUTORIZADO,
          logs: [],
        },
        TERCEIRIZADA,
        "Ciente",
      ),
    ).toBeFalsy();
  });

  it("exibirBotaoQuestionamento usa o tipoPerfil padrão do módulo", () => {
    setPerfil(
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    expect(
      exibirBotaoQuestionamento(
        {
          prioridade: "LIMITE",
          status: statusEnum.DRE_VALIDADO,
        },
        CODAE,
      ),
    ).toBeTruthy();
  });

  it("exibirBotaoQuestionamento retorna false para lanche emergencial", () => {
    setPerfil(
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    expect(
      exibirBotaoQuestionamento(
        {
          prioridade: "LIMITE",
          status: statusEnum.DRE_VALIDADO,
          motivo: { nome: "Lanche Emergencial" },
        },
        CODAE,
      ),
    ).toBeFalsy();
  });

  it("exibirModalAutorizacaoAposQuestionamento retorna false para lanche emergencial", () => {
    setPerfil(
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    expect(
      exibirModalAutorizacaoAposQuestionamento(
        {
          prioridade: "LIMITE",
          status: statusEnum.DRE_VALIDADO,
          motivo: { nome: "Lanche Emergencial" },
          logs: [{ resposta_sim_nao: false }],
        },
        CODAE,
      ),
    ).toBeFalsy();
  });

  it("não exibe botão marcar conferência para usuário empresa", () => {
    setPerfil(TIPO_PERFIL.TERCEIRIZADA, PERFIL.USUARIO_EMPRESA);

    expect(
      exibirBotaoMarcarConferencia(
        {
          status: statusEnum.CODAE_AUTORIZADO,
        },
        TERCEIRIZADA,
      ),
    ).toBeFalsy();
  });
});
