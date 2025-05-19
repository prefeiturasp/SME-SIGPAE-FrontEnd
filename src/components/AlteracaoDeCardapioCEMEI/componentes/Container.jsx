import { SigpaeLogoLoader } from "components/Shareable/SigpaeLogoLoader";
import { MeusDadosContext } from "context/MeusDadosContext";
import { dataParaUTC } from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import React, { useContext, useEffect, useState } from "react";
import { getMotivosAlteracaoCardapio } from "services/alteracaoDeCardapio";
import { getQuantidadeAlunosCEMEIporCEIEMEI } from "services/aluno.service";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
import { getDiasUteis } from "services/diasUteis.service";
import { AlteracaoDeCardapioCEMEI } from "..";
import { backgroundLabelPeriodo } from "../helpers";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [motivos, setMotivos] = useState();
  const [periodos, setPeriodos] = useState();
  const [vinculos, setVinculos] = useState();
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();

  const [erro, setErro] = useState("");

  const getQuantidadeAlunosCEMEIporCEIEMEIAsync = async (escola) => {
    const response = await getQuantidadeAlunosCEMEIporCEIEMEI(
      escola.codigo_eol
    );
    if (response.status === HTTP_STATUS.OK) {
      setPeriodos(backgroundLabelPeriodo(response.data));
    } else {
      setErro(
        "Erro ao carregar períodos escolares. Tente novamente mais tarde."
      );
    }
  };

  const getVinculosTipoAlimentacaoPorEscolaAsync = async (escola) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola.uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar vinculos do tipo de alimentação. Tente novamente mais tarde."
      );
    }
  };

  const getMotivosAlteracaoCardapioAsync = async () => {
    const response = await getMotivosAlteracaoCardapio();
    if (response.status === HTTP_STATUS.OK) {
      setMotivos(response.data.results);
    } else {
      setErro(
        "Erro ao carregar motivos de alteração de cardápio. Tente novamente mais tarde."
      );
    }
  };

  const getDiasUteisAsync = async () => {
    const response = await getDiasUteis({
      escola_uuid: meusDados.vinculo_atual.instituicao.uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setProximosCincoDiasUteis(
        dataParaUTC(new Date(response.data.proximos_cinco_dias_uteis))
      );
      setProximosDoisDiasUteis(
        dataParaUTC(new Date(response.data.proximos_dois_dias_uteis))
      );
    } else {
      setErro("Erro ao carregar dias úteis. Tente novamente mais tarde.");
    }
  };

  const requisicoesPreRenderComMeusDados = async () => {
    const escola = meusDados.vinculo_atual.instituicao;
    await Promise.all([
      getDiasUteisAsync(),
      getQuantidadeAlunosCEMEIporCEIEMEIAsync(escola),
      getVinculosTipoAlimentacaoPorEscolaAsync(escola),
    ]);
  };

  const requisicoesPreRender = async () => {
    await Promise.all([getMotivosAlteracaoCardapioAsync()]);
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    if (meusDados) {
      requisicoesPreRenderComMeusDados();
    }
  }, [meusDados]);

  const REQUISICOES_CONCLUIDAS =
    !!meusDados &&
    !!motivos &&
    !!vinculos &&
    !!periodos &&
    !!proximosDoisDiasUteis &&
    !!proximosCincoDiasUteis;

  return (
    <div>
      {!REQUISICOES_CONCLUIDAS && !erro && <SigpaeLogoLoader />}
      {!!erro && <div>{erro}</div>}
      {REQUISICOES_CONCLUIDAS && (
        <AlteracaoDeCardapioCEMEI
          meusDados={meusDados}
          motivos={motivos}
          periodos={periodos}
          vinculos={vinculos}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
        />
      )}
    </div>
  );
};

export default Container;
