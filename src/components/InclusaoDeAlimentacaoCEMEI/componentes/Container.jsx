import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { InclusaoDeAlimentacaoCEMEI } from "..";
import { dataParaUTC, escolaEhCEMEI } from "helpers/utilities";
import { getDiasUteis } from "services/diasUteis.service";
import {
  getMotivosInclusaoContinua,
  getMotivosInclusaoNormal,
} from "services/inclusaoDeAlimentacao";
import { getMeusDados } from "services/perfil.service";
import { getQuantidadeAlunosCEMEIporCEIEMEI } from "services/aluno.service";
import {
  getVinculosTipoAlimentacaoPorEscola,
  getVinculosTipoAlimentacaoMotivoInclusaoEspecifico,
} from "services/cadastroTipoAlimentacao.service";
import {
  abstraiPeriodosComAlunosMatriculados,
  formatarPeriodos,
} from "components/InclusaoDeAlimentacao/helper";
import { getQuantidaDeAlunosPorPeriodoEEscola } from "services/escola.service";
import { SigpaeLogoLoader } from "components/Shareable/SigpaeLogoLoader";

export const Container = () => {
  const [dados, setDados] = useState(null);
  const [motivosSimples, setMotivosSimples] = useState(null);
  const [motivosContinuos, setMotivosContinuos] = useState(null);
  const [periodos, setPeriodos] = useState(null);
  const [periodosInclusaoContinua, setPeriodosInclusaoContinua] =
    useState(null);
  const [vinculos, setVinculos] = useState(null);
  const [vinculosMotivoEspecifico, setVinculosMotivoEspecifico] =
    useState(null);
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState(null);
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState(null);
  const [periodosMotivoEspecifico, setPeriodosMotivoEspecifico] =
    useState(null);

  const [erro, setErro] = useState(false);

  const getQuantidaDeAlunosPorPeriodoEEscolaAsync = async (
    periodos,
    escola_uuid
  ) => {
    const response = await getQuantidaDeAlunosPorPeriodoEEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      const periodos_ = abstraiPeriodosComAlunosMatriculados(
        periodos,
        response.data.results,
        false
      );
      const vinculos = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
      if (vinculos.status === HTTP_STATUS.OK) {
        if (escolaEhCEMEI()) {
          vinculos.data.results = vinculos.data.results.filter(
            (periodo) => periodo.tipo_unidade_escolar.iniciais === "EMEI"
          );
        }
        periodos_.map((periodo) => {
          return (periodo.tipos_alimentacao = vinculos.data.results.find(
            (v) => v.periodo_escolar.nome === periodo.nome
          ).tipos_alimentacao);
        });
        setPeriodosInclusaoContinua(
          abstraiPeriodosComAlunosMatriculados(
            periodos,
            response.data.results,
            false
          )
        );
      }
    }
  };

  const getQuantidadeAlunosCEMEIporCEIEMEIAsync = async (
    escola,
    manha_e_tarde_sempre = null
  ) => {
    const response = await getQuantidadeAlunosCEMEIporCEIEMEI(
      escola.codigo_eol,
      manha_e_tarde_sempre
    );
    if (response.status === HTTP_STATUS.OK) {
      setPeriodos(response.data);
      getVinculosMotivoEspecificoCEMEIAsync(escola, response.data);
    }
  };
  const getVinculosTipoAlimentacaoPorEscolaAsync = async (escola) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola.uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculos(response.data.results);
    }
  };

  const getVinculosMotivoEspecificoCEMEIAsync = async (
    escola,
    periodosNormais
  ) => {
    const tipo_unidade_escolar_iniciais = escola.tipo_unidade_escolar_iniciais;
    const response = await getVinculosTipoAlimentacaoMotivoInclusaoEspecifico({
      tipo_unidade_escolar_iniciais,
    });
    if (response.status === HTTP_STATUS.OK) {
      let periodosMotivoInclusaoEspecifico = [];
      response.data.forEach((vinculo) => {
        let periodo = vinculo.periodo_escolar;
        let tipos_de_alimentacao = vinculo.tipos_alimentacao;
        let periodoNormal = periodosNormais.find(
          (p) => periodo.nome === p.nome
        );
        if (!periodoNormal) {
          periodoNormal = periodosNormais.find((p) => p.nome === "INTEGRAL");
          tipos_de_alimentacao = response.data.find(
            (p) => p.periodo_escolar.nome === "INTEGRAL"
          ).tipos_alimentacao;
        }
        periodo.CEI = periodoNormal.CEI;
        periodo.EMEI = periodoNormal.EMEI;
        periodo.tipos_alimentacao = tipos_de_alimentacao;
        periodo.maximo_alunos = null;
        periodosMotivoInclusaoEspecifico.push(periodo);
      });
      const periodosOrdenados = periodosMotivoInclusaoEspecifico.sort(
        (obj1, obj2) => (obj1.posicao > obj2.posicao ? 1 : -1)
      );
      setVinculosMotivoEspecifico(response.data);
      setPeriodosMotivoEspecifico(formatarPeriodos(periodosOrdenados));
    }
  };

  const getMeusDadosAsync = async () => {
    const response = await getMeusDados();
    if (response.status === HTTP_STATUS.OK) {
      setDados(response.data);
      const escola = response.data.vinculo_atual.instituicao;
      const periodos = formatarPeriodos(
        response.data.vinculo_atual.instituicao.periodos_escolares
      );
      const escola_uuid = response.data.vinculo_atual.instituicao.uuid;
      getQuantidaDeAlunosPorPeriodoEEscolaAsync(periodos, escola_uuid);
      getQuantidadeAlunosCEMEIporCEIEMEIAsync(escola, true);
      getVinculosTipoAlimentacaoPorEscolaAsync(escola);
    } else {
      setErro(true);
    }
  };

  const getMotivosInclusaoNormalAsync = async () => {
    const response = await getMotivosInclusaoNormal();
    if (response.status === HTTP_STATUS.OK) {
      setMotivosSimples(response.data.results);
    } else {
      setErro(true);
    }
  };

  const getMotivosInclusaoContinuaAsync = async () => {
    const response = await getMotivosInclusaoContinua();
    if (response.status === HTTP_STATUS.OK) {
      setMotivosContinuos(response.data.results);
    } else {
      setErro(true);
    }
  };

  const getDiasUteisAsync = async () => {
    const response = await getDiasUteis({
      escola_uuid: dados.vinculo_atual.instituicao.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setProximosCincoDiasUteis(
        dataParaUTC(new Date(response.data.proximos_cinco_dias_uteis))
      );
      setProximosDoisDiasUteis(
        dataParaUTC(new Date(response.data.proximos_dois_dias_uteis))
      );
    } else {
      setErro(true);
    }
  };

  useEffect(() => {
    getMeusDadosAsync();
    getMotivosInclusaoNormalAsync();
    getMotivosInclusaoContinuaAsync();
  }, []);

  useEffect(() => {
    dados && getDiasUteisAsync();
  }, [dados]);

  const REQUISICOES_CONCLUIDAS =
    dados &&
    motivosSimples &&
    motivosContinuos &&
    vinculos &&
    periodos &&
    periodosInclusaoContinua &&
    proximosDoisDiasUteis &&
    proximosCincoDiasUteis &&
    periodosMotivoEspecifico;

  return (
    <div>
      {!REQUISICOES_CONCLUIDAS && !erro && <SigpaeLogoLoader />}
      {erro && (
        <div>Erro ao carregar informações. Tente novamente mais tarde.</div>
      )}
      {REQUISICOES_CONCLUIDAS && (
        <InclusaoDeAlimentacaoCEMEI
          meusDados={dados}
          motivosSimples={motivosSimples}
          motivosContinuos={motivosContinuos}
          periodos={periodos}
          periodosInclusaoContinua={periodosInclusaoContinua}
          vinculos={vinculos}
          vinculosMotivoEspecifico={vinculosMotivoEspecifico}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
          periodosMotivoEspecifico={periodosMotivoEspecifico}
        />
      )}
    </div>
  );
};

export default Container;
