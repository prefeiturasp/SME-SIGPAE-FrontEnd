import React, { useContext, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import DashboardTerceirizada from "./DashboardTerceirizada";
import { TIPOS_SOLICITACAO_LISTA } from "src/constants/shared";
import { formatarLotesParaVisao } from "src/helpers/utilities";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { Spin } from "antd";
import { getMeusLotes } from "src/services/lote.service";

export const Container = () => {
  const [listaLotes, setListaLotes] = useState(null);
  const [erro, setErro] = useState("");

  const getMeusLotesAsync = async () => {
    const response = await getMeusLotes();
    if (response.status === HTTP_STATUS.OK) {
      setListaLotes(
        [{ nome: "Selecione um lote", uuid: "" }].concat(response.data.results)
      );
    } else {
      setErro("Erro ao carregar lotes");
    }
  };

  const { meusDados } = useContext(MeusDadosContext);

  useEffect(() => {
    getMeusLotesAsync();
  }, []);

  const LOADING = !meusDados || !listaLotes;

  return (
    <>
      {erro && <div>{erro}</div>}
      {!erro && (
        <Spin tip="Carregando..." spinning={LOADING}>
          {!LOADING && (
            <DashboardTerceirizada
              meusDados={meusDados}
              lotes={formatarLotesParaVisao(
                meusDados.vinculo_atual.instituicao.lotes
              )}
              cards={TIPOS_SOLICITACAO_LISTA}
              listaLotes={listaLotes}
              tiposSolicitacao={TIPOS_SOLICITACAO_LISTA}
            />
          )}
        </Spin>
      )}
    </>
  );
};
