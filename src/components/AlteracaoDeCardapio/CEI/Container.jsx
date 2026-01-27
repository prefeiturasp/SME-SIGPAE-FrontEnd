import React, { useContext, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { agregarDefault, dataParaUTC } from "src/helpers/utilities";
import {
  getMotivosAlteracaoCardapio,
  getPeriodosComMatriculadosPorUE,
} from "src/services/alteracaoDeCardapio";
import { getDiasUteis, getFeriadosAno } from "src/services/diasUteis.service";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { useEffect } from "react";
import { AlteracaoDoTipoDeAlimentacaoCEI } from ".";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [motivos, setMotivos] = useState();
  const [vinculos, setVinculos] = useState();
  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();
  const [periodosValidos, setPeriodosValidos] = useState([]);
  const [feriadosAno, setFeriadosAno] = useState();

  const [erroAPI, setErroAPI] = useState("");

  const getMotivosAlteracaoCardapioAsync = async () => {
    const response = await getMotivosAlteracaoCardapio();
    if (response.status === HTTP_STATUS.OK) {
      setMotivos(agregarDefault(response.data.results));
    } else {
      setErroAPI(
        "Erro ao carregar motivos de alteração de dia de alimentação. Tente novamente mais tarde.",
      );
    }
  };

  const getPeriodosValidos = async (escola_uuid) => {
    const response = await getPeriodosComMatriculadosPorUE(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosValidos(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar períodos válidos. Tente novamente mais tarde.",
      );
    }
  };

  const getVinculosTipoAlimentacaoPorEscolaAsync = async (escola_uuid) => {
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      setVinculos(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar vínculos de tipo de alimentação. Tente novamente mais tarde.",
      );
    }
    getPeriodosValidos(escola_uuid);
  };

  const getDiasUteisAsync = async () => {
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
      setErroAPI(
        "Erro ao carregar dias úteis para a solicitação. Tente novamente mais tarde.",
      );
    }
  };

  const getFeriadosAnoAsync = async () => {
    const response = await getFeriadosAno();
    if (response.status === HTTP_STATUS.OK) {
      setFeriadosAno(response.data.results);
    } else {
      setErroAPI("Erro ao carregar feriados. Tente novamente mais tarde.");
    }
  };

  const requisicoesPreRender = async () => {
    await Promise.all([
      getMotivosAlteracaoCardapioAsync(),
      getFeriadosAnoAsync(),
    ]);
  };

  const requisicoesPreRenderComMeusDados = async () => {
    await Promise.all([
      getDiasUteisAsync(),
      getVinculosTipoAlimentacaoPorEscolaAsync(
        meusDados.vinculo_atual.instituicao.uuid,
      ),
    ]);
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    if (meusDados) {
      requisicoesPreRenderComMeusDados();
    }
  }, [meusDados]);

  const filtroPeriodos = () => {
    return meusDados.vinculo_atual.instituicao.periodos_escolares.filter(
      (periodo) => periodosValidos.includes(periodo.nome),
    );
  };

  const filtroVinculos = () => {
    if (!Array.isArray(vinculos)) return [];

    return vinculos.filter(
      (vinculo) => vinculo.periodo_escolar.nome === "INTEGRAL",
    );
  };

  const LOADING =
    !meusDados ||
    !proximosCincoDiasUteis ||
    !proximosDoisDiasUteis ||
    !motivos ||
    !vinculos ||
    !feriadosAno;

  return (
    <>
      {LOADING && !erroAPI && <SigpaeLogoLoader />}
      {!!erroAPI && <div>{erroAPI}</div>}
      {!LOADING && !erroAPI && (
        <AlteracaoDoTipoDeAlimentacaoCEI
          meusDados={meusDados}
          motivos={motivos}
          periodos={filtroPeriodos()}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          vinculos={filtroVinculos()}
          feriadosAno={feriadosAno}
        />
      )}
    </>
  );
};
export default Container;
