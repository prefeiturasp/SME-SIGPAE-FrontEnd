import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { getDiasUteis } from "services/diasUteis.service";
import { getKitLanches } from "services/kitLanche";
import { getEscolasTercTotal } from "services/escola.service";
import { dataParaUTC } from "helpers/utilities";
import SolicitacaoUnificada from ".";
import { MeusDadosContext } from "context/MeusDadosContext";
import { SigpaeLogoLoader } from "components/Shareable/SigpaeLogoLoader";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState();
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState();
  const [escolas, setEscolas] = useState();
  const [lotes, setLotes] = useState();
  const [kits, setKits] = useState();

  const [erro, setErro] = useState("");

  const getKitLanchesAsync = async () => {
    const response = await getKitLanches({ status: "ATIVO" });
    if (response.status === HTTP_STATUS.OK) {
      setKits(response.data.results);
    } else {
      setErro("Erro ao carregar kits lanche. Tente novamente mais tarde.");
    }
  };

  const getDiasUteisAsync = async () => {
    const response = await getDiasUteis({
      eh_solicitacao_unificada: true,
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

  const getEscolasTrecTotalAsync = async (dre_uuid) => {
    const response = await getEscolasTercTotal({ dre: dre_uuid });
    if (response.status === HTTP_STATUS.OK) {
      setEscolas(response.data);
    } else {
      setErro("Erro ao carregar escolas. Tente novamente mais tarde.");
    }
  };

  const requisicoesPreRender = async () => {
    await Promise.all([getKitLanchesAsync()]);
  };

  const requisicoesPreRenderComMeusDados = async () => {
    const dre_uuid = meusDados.vinculo_atual.instituicao.uuid;
    await Promise.all([
      getDiasUteisAsync(),
      setLotes(meusDados.vinculo_atual.instituicao.lotes),
      getEscolasTrecTotalAsync(dre_uuid),
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

  const LOADING =
    !meusDados ||
    !proximosCincoDiasUteis ||
    !proximosDoisDiasUteis ||
    !escolas ||
    !lotes ||
    !kits;

  return (
    <>
      {LOADING && !erro && <SigpaeLogoLoader />}
      {!!erro && <div>{erro}</div>}
      {!LOADING && !erro && (
        <SolicitacaoUnificada
          dadosUsuario={meusDados}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          escolas={escolas}
          lotes={lotes}
          kits={kits}
        />
      )}
    </>
  );
};
