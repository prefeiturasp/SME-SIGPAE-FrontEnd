import HTTP_STATUS from "http-status-codes";
import React, { useContext, useEffect, useState } from "react";
import { dataParaUTC } from "src/helpers/utilities";
import { getDiasUteis } from "src/services/diasUteis.service";
import { SolicitacaoKitLancheCEMEI } from "..";
import { getKitsLanche } from "src/services/kitLanche";
import { getDietasAtivasInativasPorAluno } from "src/services/dietaEspecial.service";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import { MeusDadosContext } from "src/context/MeusDadosContext";

export const Container = () => {
  const { meusDados } = useContext(MeusDadosContext);

  const [proximosDoisDiasUteis, setProximosDoisDiasUteis] = useState(null);
  const [proximosCincoDiasUteis, setProximosCincoDiasUteis] = useState(null);
  const [kits, setKits] = useState(null);
  const [erro, setErro] = useState(false);
  const [alunosComDietaEspecial, setAlunosComDietaEspecial] = useState(null);

  const getDietasAtivasInativasPorAlunoAsync = async () => {
    const response = await getDietasAtivasInativasPorAluno({
      incluir_alteracao_ue: true,
    });
    if (response.status === HTTP_STATUS.OK) {
      setAlunosComDietaEspecial(response.data.solicitacoes);
    } else {
      setErro(true);
    }
  };

  const getKitsAsync = async () => {
    const response = await getKitsLanche();
    if (response.status === HTTP_STATUS.OK) {
      setKits(response.data.results);
    } else {
      setErro(true);
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
      setErro(true);
    }
  };

  useEffect(() => {
    if (meusDados) {
      getDiasUteisAsync();
    }
  }, [meusDados]);

  useEffect(() => {
    getKitsAsync();
    getDietasAtivasInativasPorAlunoAsync();
  }, []);

  const REQUISICOES_CONCLUIDAS =
    meusDados &&
    proximosDoisDiasUteis &&
    proximosCincoDiasUteis &&
    kits &&
    alunosComDietaEspecial;

  return (
    <div>
      {!REQUISICOES_CONCLUIDAS && !erro && <SigpaeLogoLoader />}
      {erro && (
        <div>Erro ao carregar informações. Tente novamente mais tarde.</div>
      )}
      {REQUISICOES_CONCLUIDAS && (
        <SolicitacaoKitLancheCEMEI
          meusDados={meusDados}
          kits={kits}
          alunosComDietaEspecial={alunosComDietaEspecial}
          proximosCincoDiasUteis={proximosCincoDiasUteis}
          proximosDoisDiasUteis={proximosDoisDiasUteis}
        />
      )}
    </div>
  );
};

export default Container;
