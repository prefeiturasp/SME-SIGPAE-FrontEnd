import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { agregarDefault, dataParaUTC } from "helpers/utilities";
import { getMotivosAlteracaoCardapio } from "services/alteracaoDeCardapio";
import { getDiasUteis, getFeriadosAno } from "services/diasUteis.service";
import { MeusDadosContext } from "context/MeusDadosContext";
import { AlteracaoCardapio } from ".";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [motivos, setMotivos] = useState();
  const [periodos, setPeriodos] = useState();
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();
  const [feriados, setFeriados] = useState();

  const [erro, setErro] = useState("");

  const getMotivosAlteracaoCardapioAsync = async () => {
    const response = await getMotivosAlteracaoCardapio();
    if (response.status === HTTP_STATUS.OK) {
      setMotivos(agregarDefault(response.data.results));
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
      setProximosDoisDiasUteis(
        dataParaUTC(new Date(response.data.proximos_dois_dias_uteis))
      );
      setProximosCincoDiasUteis(
        dataParaUTC(new Date(response.data.proximos_cinco_dias_uteis))
      );
    } else {
      setErro(
        "Erro ao carregar quais são os dias úteis deste tipo de unidade. Tente novamente mais tarde."
      );
    }
  };

  const getFeriadosAnoAsync = async () => {
    const response = await getFeriadosAno();
    if (response.status === HTTP_STATUS.OK) {
      setFeriados(response.data.results);
    } else {
      setErro(
        "Erro ao carregar quais são os feriados deste ano. Tente novamente mais tarde."
      );
    }
  };

  const requisicoesPreRender = async () => {
    await Promise.all([
      getMotivosAlteracaoCardapioAsync(),
      getFeriadosAnoAsync(),
    ]);
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    if (meusDados) {
      setPeriodos(meusDados.vinculo_atual.instituicao.periodos_escolares);
      getDiasUteisAsync();
    }
  }, [meusDados]);

  const REQUISICOES_CONCLUIDAS =
    meusDados &&
    motivos &&
    periodos &&
    proximosDoisDiasUteis &&
    proximosCincoDiasUteis &&
    feriados;

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
          feriadosAno={feriados}
        />
      )}
    </div>
  );
};
