import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { getMotivosSuspensaoCardapio } from "src/services/suspensaoDeAlimentacao.service";
import { getDiasUteis } from "src/services/diasUteis.service";
import { agregarDefault, dataParaUTC } from "src/helpers/utilities";
import SuspensaoAlimentacaoDeCEI from "./Index";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import { MeusDadosContext } from "src/context/MeusDadosContext";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();
  const [motivos, setMotivos] = useState();
  const [periodos, setPeriodos] = useState();

  const [erro, setErro] = useState("");

  const getMotivosSuspensaoCardapioAsync = async () => {
    const response = await getMotivosSuspensaoCardapio();
    if (response.status === HTTP_STATUS.OK) {
      setMotivos(agregarDefault(response.data.results));
    } else {
      setErro(
        "Erro ao carregar motivos de suspensão. Tente novamente mais tarde."
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

  useEffect(() => {
    getMotivosSuspensaoCardapioAsync();
  }, []);

  useEffect(() => {
    if (meusDados) {
      getDiasUteisAsync();
      setPeriodos(meusDados.vinculo_atual.instituicao.periodos_escolares);
    }
  }, [meusDados]);

  const LOADING =
    !meusDados ||
    !proximosCincoDiasUteis ||
    !proximosDoisDiasUteis ||
    !motivos ||
    !periodos;

  return (
    <>
      {LOADING && !erro && <SigpaeLogoLoader />}
      {!!erro && <div>{erro}</div>}
      {!LOADING && !erro && (
        <SuspensaoAlimentacaoDeCEI
          meusDados={meusDados}
          motivos={motivos}
          periodos={periodos}
          proximos_dois_dias_uteis={proximosDoisDiasUteis}
          proximos_cinco_dias_uteis={proximosCincoDiasUteis}
        />
      )}
    </>
  );
};
