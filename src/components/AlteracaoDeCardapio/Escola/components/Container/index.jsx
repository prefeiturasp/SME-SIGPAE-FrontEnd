import HTTP_STATUS from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { agregarDefault, dataParaUTC, deepCopy } from "src/helpers/utilities";
import { getMotivosAlteracaoCardapio } from "src/services/alteracaoDeCardapio";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "src/services/diasUteis.service";
import { getQuantidaDeAlunosPorPeriodoEEscola } from "src/services/escola.service";
import { AlteracaoCardapio } from "../..";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [motivos, setMotivos] = useState();
  const [periodos, setPeriodos] = useState();
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();

  const [erro, setErro] = useState("");

  const getVinculosAsync = async () => {
    const escolaUuid = meusDados.vinculo_atual.instituicao.uuid;
    const periodosEscolares =
      meusDados.vinculo_atual.instituicao.periodos_escolares;

    const response = await getVinculosTipoAlimentacaoPorEscola(escolaUuid, {
      pega_atualmente: true,
    });
    if (response.status === HTTP_STATUS.OK) {
      for (const vinculo of response.data.results) {
        let periodo = periodosEscolares.find(
          (periodo) => periodo.uuid === vinculo.periodo_escolar.uuid,
        );
        periodo.tipos_alimentacao = vinculo.tipos_alimentacao;
      }
      setPeriodos(periodosEscolares);
    } else {
      setErro(
        "Erro ao carregar vinculos dos períodos escolares da escola. Tente novamente mais tarde.",
      );
    }
  };

  const setQuantidadeAlunosPorPeriodoAsync = async () => {
    const escolaUuid = meusDados.vinculo_atual.instituicao.uuid;
    const response = await getQuantidaDeAlunosPorPeriodoEEscola(escolaUuid);

    if (response.status === HTTP_STATUS.OK) {
      const periodosEscolares_ = deepCopy(periodos);

      for (const periodo of periodosEscolares_) {
        periodo.maximo_alunos = response.data.results.find(
          (result) => result.periodo_escolar.uuid === periodo.uuid,
        ).quantidade_alunos;
      }
      setPeriodos(periodosEscolares_);
    } else {
      setErro(
        "Erro ao carregar quantidades de alunos por período escolar. Tente novamente mais tarde.",
      );
    }
  };

  const getMotivosAlteracaoCardapioAsync = async () => {
    const response = await getMotivosAlteracaoCardapio();
    if (response.status === HTTP_STATUS.OK) {
      setMotivos(agregarDefault(response.data.results));
    } else {
      setErro(
        "Erro ao carregar motivos de alteração de cardápio. Tente novamente mais tarde.",
      );
    }
  };

  const getDiasUteisAsync = async () => {
    const response = await getDiasUteis({
      escola_uuid: meusDados.vinculo_atual.instituicao.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setProximosDoisDiasUteis(
        dataParaUTC(new Date(response.data.proximos_dois_dias_uteis)),
      );
      setProximosCincoDiasUteis(
        dataParaUTC(new Date(response.data.proximos_cinco_dias_uteis)),
      );
    } else {
      setErro(
        "Erro ao carregar quais são os dias úteis deste tipo de unidade. Tente novamente mais tarde.",
      );
    }
  };

  const requisicoesPreRender = async () => {
    await Promise.all([getMotivosAlteracaoCardapioAsync()]);
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    if (meusDados) {
      getDiasUteisAsync();
      getVinculosAsync();
    }
  }, [meusDados]);

  useEffect(() => {
    if (
      periodos &&
      meusDados.vinculo_atual.instituicao.possui_alunos_regulares &&
      !periodos.some((periodo) => periodo.maximo_alunos)
    ) {
      setQuantidadeAlunosPorPeriodoAsync();
    }
  }, [periodos]);

  const REQUISICOES_CONCLUIDAS =
    meusDados &&
    motivos &&
    periodos &&
    proximosDoisDiasUteis &&
    proximosCincoDiasUteis;

  return (
    <div className="mt-3">
      {!REQUISICOES_CONCLUIDAS && !erro && <div>Carregando...</div>}
      {!!erro && <div>{erro}</div>}
      {REQUISICOES_CONCLUIDAS && (
        <AlteracaoCardapio
          meusDados={meusDados}
          motivos={motivos}
          periodos={periodos}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
        />
      )}
    </div>
  );
};
