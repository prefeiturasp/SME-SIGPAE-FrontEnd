import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { TIPOS_SOLICITACAO_LISTA } from "src/constants/shared";
import { formatarOpcoesLote, formatarOpcoesDRE } from "src/helpers/utilities";
import DashboardCODAE from ".";
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

  const [diretoriasRegionais, setDiretoriasRegionais] = useState(null);
  const [lotes, setLotes] = useState(null);
  const [erro, setErro] = useState("");

  const { meusDados } = useContext(MeusDadosContext);

  const LOADING = !meusDados || !lotes || !diretoriasRegionais;

  const getLotesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(formatarOpcoesLote(response.data.results));
    } else {
      setErro("Erro ao carregar lotes");
    }
  };

  const getDiretoriasRegionaisAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDiretoriasRegionais(formatarOpcoesDRE(response.data.results));
    } else {
      setErro("Erro ao carregar DREs");
    }
  };

  useEffect(() => {
    getLotesAsync();
    getDiretoriasRegionaisAsync();
  }, []);

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && (
        <Spin tip="Carregando..." spinning={LOADING}>
          {!LOADING && (
            <DashboardCODAE
              filtroPor={filtroPor}
              visaoPor={visaoPor}
              meusDados={meusDados}
              lotes={lotes}
              diretoriasRegionais={diretoriasRegionais}
              cards={TIPOS_SOLICITACAO_LISTA}
              tiposSolicitacao={TIPOS_SOLICITACAO_LISTA}
            />
          )}
        </Spin>
      )}
    </>
  );
};
