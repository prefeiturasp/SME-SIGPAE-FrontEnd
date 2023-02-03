import React, { useState, useEffect } from "react";
import HTTP_STATUS from "http-status-codes";
import { toastError } from "components/Shareable/Toast/dialogs";
import {
  getNomesTerceirizadas,
  getHomologacaoProduto,
  getNumeroProtocoloAnaliseSensorial
} from "services/produto.service";
import { getNumerosEditais } from "services/edital.service";
import { Homologacao } from "../index";
import { formataEditais, formataValoresBooleanos } from "../helper";

export const Container = () => {
  const [erro, setErro] = useState(false);
  const [terceirizadas, setTerceirizadas] = useState(undefined);
  const [editaisOptions, setEditaisOptions] = useState(undefined);
  const [protocoloAnalise, setProtocoloAnalise] = useState(undefined);
  const [homologacao, setHomologacao] = useState(undefined);
  const [produto, setProduto] = useState(undefined);
  const [formValues, setFormValues] = useState(undefined);

  const getNomesTerceirizadasAsync = async () => {
    const response = await getNomesTerceirizadas();
    if (response.status === HTTP_STATUS.OK) {
      setTerceirizadas(response.data.results);
    } else {
      toastError("Erro ao carregar terceirizadas");
      setErro(true);
    }
  };

  const getNumerosEditaisAsync = async () => {
    const response = await getNumerosEditais();
    if (response.status === HTTP_STATUS.OK) {
      setEditaisOptions(response.data.results);
    } else {
      toastError("Erro ao carregar editais");
      setErro(true);
    }
  };

  const getNumeroProtocoloAnaliseSensorialAsync = async () => {
    const response = await getNumeroProtocoloAnaliseSensorial();
    if (response.status === HTTP_STATUS.OK) {
      setProtocoloAnalise(response.data);
    } else {
      toastError("Erro ao carregar numero de protocolo da análise sensorial");
      setErro(true);
    }
  };

  const setInitialValuesForm = (data, card_suspensos) => {
    let values = {
      ...data,
      produto: {
        ...data.produto,
        editais: formataEditais(
          data.produto.vinculos_produto_edital,
          card_suspensos
        ),
        dieta_especial: formataValoresBooleanos(
          data.produto.eh_para_alunos_com_dieta
        ),
        aditivos_alergicos: formataValoresBooleanos(
          data.produto.tem_aditivos_alergenicos
        ),
        tem_gluten: formataValoresBooleanos(data.produto.tem_gluten)
      },
      necessita_analise_sensorial: "1"
    };
    setFormValues(values);
  };

  const getHomologacaoProdutoAsync = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const card_suspensos = urlParams.get("card_suspensos");

    const response = await getHomologacaoProduto(uuid);
    if (response.status === HTTP_STATUS.OK) {
      setHomologacao(response.data);
      setProduto(response.data.produto);
      setInitialValuesForm(response.data, card_suspensos);
    } else {
      toastError("Erro ao carregar homologação do produto");
      setErro(true);
    }
  };

  useEffect(() => {
    getNomesTerceirizadasAsync();
    getNumerosEditaisAsync();
    getHomologacaoProdutoAsync();
    getNumeroProtocoloAnaliseSensorialAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const REQUISICOES_CONCLUIDAS =
    terceirizadas &&
    editaisOptions &&
    homologacao &&
    produto &&
    protocoloAnalise &&
    formValues;

  return (
    <div>
      {!REQUISICOES_CONCLUIDAS && !erro && <div>Carregando...</div>}
      {erro && (
        <div>Erro ao carregar informações. Tente novamente mais tarde.</div>
      )}
      {REQUISICOES_CONCLUIDAS && (
        <Homologacao
          terceirizadas={terceirizadas}
          editaisOptions={editaisOptions}
          homologacao={homologacao}
          produto={produto}
          protocoloAnalise={protocoloAnalise}
          getHomologacaoProdutoAsync={() => getHomologacaoProdutoAsync()}
          formValues={formValues}
        />
      )}
    </div>
  );
};
export default Container;
