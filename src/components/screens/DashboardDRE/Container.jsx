import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { TIPOS_SOLICITACAO_LISTA_DRE } from "src/constants/shared";
import { formatarOpcoesLote } from "src/helpers/utilities";
import DashboardDRE from ".";
import { getLotesSimples } from "src/services/lote.service";
import { Spin } from "antd";
import { MeusDadosContext } from "src/context/MeusDadosContext";

export const Container = () => {
  const [visaoPor] = useState([
    {
      nome: "Tipo de Solicitação",
      uuid: "tipo_solicitacao",
    },
    {
      nome: "DRE",
      uuid: "dre",
    },
    {
      nome: "Lote",
      uuid: "lote",
    },
  ]);
  const [filtroPor] = useState([
    {
      nome: "Sem filtro",
      uuid: "sem_filtro",
    },
    {
      nome: "Semana",
      uuid: "daqui_a_7_dias",
    },
    {
      nome: "Mês",
      uuid: "daqui_a_30_dias",
    },
  ]);

  const [lotes, setLotes] = useState(null);
  const [erro, setErro] = useState("");

  const { meusDados } = useContext(MeusDadosContext);

  const LOADING = !meusDados || !lotes;

  const getLotesAsync = async () => {
    const uuid = meusDados.vinculo_atual.instituicao.uuid;
    const response = await getLotesSimples({ diretoria_regional__uuid: uuid });
    if (response.status === HTTP_STATUS.OK) {
      setLotes(formatarOpcoesLote(response.data.results));
    } else {
      setErro("Erro ao carregar lotes");
    }
  };

  useEffect(() => {
    if (meusDados) {
      getLotesAsync();
    }
  }, [meusDados]);

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && (
        <Spin tip="Carregando..." spinning={LOADING}>
          {!LOADING && (
            <DashboardDRE
              filtroPor={filtroPor}
              visaoPor={visaoPor}
              meusDados={meusDados}
              lotes={lotes}
              cards={TIPOS_SOLICITACAO_LISTA_DRE}
              tiposSolicitacao={TIPOS_SOLICITACAO_LISTA_DRE}
            />
          )}
        </Spin>
      )}
    </>
  );
};
