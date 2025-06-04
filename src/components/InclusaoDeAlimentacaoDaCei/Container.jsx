import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import InclusaoDeAlimentacaoDaCei from ".";
import { backgroundLabelPeriodo } from "./helper";
import { dataParaUTC } from "src/helpers/utilities";
import { getMotivosInclusaoNormal } from "src/services/inclusaoDeAlimentacao";
import { getDiasUteis } from "src/services/diasUteis.service";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import { MeusDadosContext } from "src/context/MeusDadosContext";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [motivos, setMotivos] = useState();
  const [periodos, setPeriodos] = useState();
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();
  const [vinculosAlimentacao, setVinculosAlimentacao] = useState();

  const [erro, setErro] = useState("");

  const getVinculosAlimentacao = async (escola_uuid) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculosAlimentacao(response.data.results);
    } else {
      setErro(
        "Erro ao carregar vinculos do tipo de alimentação. Tente novamente mais tarde."
      );
    }
  };

  const getMotivosInclusaoNormalAsync = async () => {
    const response = await getMotivosInclusaoNormal();
    if (response.status === HTTP_STATUS.OK) {
      setMotivos(
        response.data.results.filter(
          (motivo) => motivo.nome !== "Evento Específico"
        )
      );
    } else {
      setErro(
        "Erro ao carregar motivos de inclusão normal. Tente novamente mais tarde."
      );
    }
  };

  const getDiasUteisAsync = async () => {
    const response = await getDiasUteis({
      escola_uuid: meusDados.vinculo_atual.instituicao.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setProximosDoisDiasUteis(
        dataParaUTC(new Date(response.data.proximos_dois_dias_uteis))
      );
      setProximosCincoDiasUteis(
        dataParaUTC(new Date(response.data.proximos_cinco_dias_uteis))
      );
    } else {
      setErro("Erro ao carregar dias úteis. Tente novamente mais tarde.");
    }
  };

  const requisicoesPreRenderComMeusDados = async () => {
    const escola = meusDados.vinculo_atual.instituicao;
    const periodosStyle = backgroundLabelPeriodo(escola.periodos_escolares);
    setPeriodos(periodosStyle);
    await Promise.all([
      getVinculosAlimentacao(escola.uuid),
      getDiasUteisAsync(),
    ]);
  };

  useEffect(() => {
    getMotivosInclusaoNormalAsync();
  }, []);

  useEffect(() => {
    if (meusDados) {
      requisicoesPreRenderComMeusDados();
    }
  }, [meusDados]);

  const REQUISICOES_CONCLUIDAS =
    meusDados &&
    motivos &&
    periodos &&
    proximosDoisDiasUteis &&
    proximosCincoDiasUteis &&
    vinculosAlimentacao;

  return (
    <div className="mt-3">
      {!REQUISICOES_CONCLUIDAS && !erro && <SigpaeLogoLoader />}
      {!!erro && <div>{erro}</div>}
      {REQUISICOES_CONCLUIDAS && (
        <InclusaoDeAlimentacaoDaCei
          meusDados={meusDados}
          motivos={motivos}
          periodos={periodos}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          vinculosAlimentacao={vinculosAlimentacao}
        />
      )}
    </div>
  );
};

export default Container;
