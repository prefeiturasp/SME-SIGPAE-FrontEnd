import HTTP_STATUS from "http-status-codes";
import React, { useContext, useEffect, useState } from "react";
import {
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
  getVinculosTipoAlimentacaoPorEscola,
} from "src/services/cadastroTipoAlimentacao.service";
import {
  buscaPeriodosEscolares,
  getQuantidaDeAlunosPorPeriodoEEscola,
} from "src/services/escola.service";
import InclusaoDeAlimentacao from "..";
import {
  dataParaUTC,
  escolaEhCei,
  tiposAlimentacaoETEC,
} from "src/helpers/utilities";
import { getDiasUteis } from "src/services/diasUteis.service";
import {
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
} from "src/services/inclusaoDeAlimentacao";
import {
  abstraiPeriodosComAlunosMatriculados,
  exibeMotivoETEC,
  formatarPeriodos,
  formatarPeriodosEspecificosEMEF,
} from "../../../helper";
import {
  MotivoContinuoInterface,
  MotivoSimplesInterface,
  PeriodosInclusaoInterface,
} from "../interfaces";
import { PeriodoEscolarRascunhosInterface } from "src/interfaces/rascunhos.interface";
import {
  ResponseQuantidadeAlunosEscolaInterface,
  ResponseVinculosTipoAlimentacaoPorEscolaInterface,
} from "src/interfaces/responses.interface";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import { MeusDadosContext } from "src/context/MeusDadosContext";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [motivosSimples, setMotivosSimples] =
    useState<Array<MotivoSimplesInterface>>(undefined);
  const [motivosContinuos, setMotivosContinuos] = useState<
    Array<MotivoContinuoInterface>
  >(escolaEhCei() ? [] : undefined);
  const [periodos, setPeriodos] =
    useState<Array<PeriodosInclusaoInterface>>(undefined);
  const [periodosMotivoEspecifico, setPeriodosMotivoEspecifico] =
    useState<Array<PeriodosInclusaoInterface>>(undefined);
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] =
    useState<Date>(undefined);
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] =
    useState<Date>(null);
  const [periodoNoite, setPeriodoNoite] = useState<
    PeriodoEscolarRascunhosInterface | boolean
  >(exibeMotivoETEC() ? undefined : true);

  const [erro, setErro] = useState("");

  const getQuantidaDeAlunosPorPeriodoEEscolaAsync = async (
    periodos: Array<PeriodosInclusaoInterface>,
    escola_uuid: string,
  ): Promise<void> => {
    const response: ResponseQuantidadeAlunosEscolaInterface =
      await getQuantidaDeAlunosPorPeriodoEEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      const periodos_: Array<any> = abstraiPeriodosComAlunosMatriculados(
        periodos,
        response.data.results,
        false,
      );
      const vinculos: ResponseVinculosTipoAlimentacaoPorEscolaInterface =
        await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
      if (vinculos.status === HTTP_STATUS.OK) {
        periodos_.forEach((periodo) => {
          return (periodo.tipos_alimentacao = vinculos.data.results.find(
            (v) => v.periodo_escolar.nome === periodo.nome,
          ).tipos_alimentacao);
        });
        setPeriodos(
          abstraiPeriodosComAlunosMatriculados(
            periodos,
            response.data.results,
            false,
          ),
        );
      } else {
        setErro(
          "Erro ao carregar vinculos do tipo de alimentação da escola. Tente novamente mais tarde.",
        );
      }
    } else {
      setErro(
        "Erro ao carregar quantidade de alunos da escola. Tente novamente mais tarde.",
      );
    }
  };

  const getMotivosInclusaoContinuaAsync = async (): Promise<void> => {
    const response = await getMotivosInclusaoContinua();
    if (response.status === HTTP_STATUS.OK) {
      if (!exibeMotivoETEC()) {
        response.data.results = response.data.results.filter(
          (motivo) => motivo.nome !== "ETEC",
        );
      }
      setMotivosContinuos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar motivos de inclusão normal. Tente novamente mais tarde.",
      );
    }
  };

  const getMotivosInclusaoNormalAsync = async () => {
    const response = await getMotivosInclusaoNormal();
    if (response.status === HTTP_STATUS.OK) {
      setMotivosSimples(response.data.results);
    } else {
      setErro(
        "Erro ao carregar motivos de inclusão contínua. Tente novamente mais tarde.",
      );
    }
  };

  const getDiasUteisAsync = async (): Promise<void> => {
    const response = await getDiasUteis({
      escola_uuid: meusDados.vinculo_atual.instituicao.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setProximosCincoDiasUteis(
        dataParaUTC(new Date(response.data.proximos_cinco_dias_uteis)),
      );
      setProximosDoisDiasUteis(
        dataParaUTC(new Date(response.data.proximos_dois_dias_uteis)),
      );
    } else {
      setErro("Erro ao carregar dias úteis. Tente novamente mais tarde.");
    }
  };

  const getBuscaPeriodosEscolaresAsync = async (): Promise<void> => {
    const response = await buscaPeriodosEscolares({ nome: "NOITE" });
    if (
      response.status === HTTP_STATUS.OK &&
      response.data.results.length > 0
    ) {
      response.data.results[0].tipos_alimentacao =
        response.data.results[0].tipos_alimentacao
          .filter(
            (tipo_alimentacao) =>
              tipo_alimentacao.nome !== "Lanche Emergencial",
          )
          .filter((tipo_alimentacao) =>
            tiposAlimentacaoETEC().includes(tipo_alimentacao.nome),
          );
      setPeriodoNoite(formatarPeriodos(response.data.results));
    } else {
      setErro(
        "Erro ao carregar períodos escolares. Tente novamente mais tarde.",
      );
    }
  };

  const requisicoesPreRender = async (): Promise<void> => {
    await Promise.all([
      !escolaEhCei() && getMotivosInclusaoContinuaAsync(),
      getMotivosInclusaoNormalAsync(),
      exibeMotivoETEC() && getBuscaPeriodosEscolaresAsync(),
    ]);
  };

  const requisicoesPreRenderComMeusDados = async (): Promise<void> => {
    const periodos = formatarPeriodos(
      meusDados.vinculo_atual.instituicao.periodos_escolares,
    );
    const escola_uuid = meusDados.vinculo_atual.instituicao.uuid;
    const tipo_unidade_escolar_iniciais =
      meusDados.vinculo_atual.instituicao.tipo_unidade_escolar_iniciais;

    await Promise.all([
      getQuantidaDeAlunosPorPeriodoEEscolaAsync(periodos, escola_uuid),
      getVinculosTipoAlimentacaoMotivoInclusaoEspecifico({
        tipo_unidade_escolar_iniciais,
      }),
    ]).then(([, vinculosTipoAlimentacaoMotivoInclusaoEspecifico]) => {
      let periodosMotivoInclusaoEspecifico = [];
      vinculosTipoAlimentacaoMotivoInclusaoEspecifico.data.forEach(
        (vinculo) => {
          let periodo = vinculo.periodo_escolar;
          periodo.tipos_alimentacao = vinculo.tipos_alimentacao;
          periodo.maximo_alunos = null;
          periodosMotivoInclusaoEspecifico.push(periodo);
        },
      );
      setPeriodosMotivoEspecifico(
        formatarPeriodosEspecificosEMEF(periodosMotivoInclusaoEspecifico),
      );
    });
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    if (meusDados) {
      getDiasUteisAsync();
      requisicoesPreRenderComMeusDados();
    }
  }, [meusDados]);

  const REQUISICOES_CONCLUIDAS =
    meusDados &&
    motivosContinuos &&
    motivosSimples &&
    periodos &&
    proximosDoisDiasUteis &&
    proximosCincoDiasUteis &&
    periodoNoite;

  return (
    <div>
      {!REQUISICOES_CONCLUIDAS && !erro && <SigpaeLogoLoader />}
      {!!erro && <div>{erro}</div>}
      {REQUISICOES_CONCLUIDAS && (
        <InclusaoDeAlimentacao
          meusDados={meusDados}
          motivosSimples={motivosSimples}
          motivosContinuos={motivosContinuos}
          periodos={periodos}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
          periodoNoite={periodoNoite}
          periodosMotivoEspecifico={periodosMotivoEspecifico}
        />
      )}
    </div>
  );
};

export default Container;
