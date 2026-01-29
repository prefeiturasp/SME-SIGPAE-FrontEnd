import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import ListagemPlanilhas from "./components/ListagemPlanilhas";
import Filtros from "./components/Filtros";
import {
  createExcelCoreSSOExterno,
  createExcelCoreSSOServidor,
  createExcelCoreSSOUEParceira,
  executarCargaPlanilhaExterno,
  executarCargaPlanilhaServidor,
  executarCargaPlanilhaUEParceira,
  getPlanilhasNaoServidor,
  getPlanilhasServidor,
  getPlanilhasUEParceira,
  removerPlanilhaExterno,
  removerPlanilhaServidor,
  removerPlanilhaUEParceira,
} from "src/services/cargaUsuario.service";
import ModalCadastroPlanilha from "./components/ModalCadastroPlanilha";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import ModalRemocaoPlanilha from "./components/ModalRemocaoPlanilha";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default ({ servidores }) => {
  const [carregando, setCarregando] = useState(false);
  const [planilhas, setPlanilhas] = useState([]);
  const [filtros, setFiltros] = useState();
  const [totalPlanilhas, setTotalPlanilhas] = useState(0);
  const [page, setPage] = useState(1);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showRemocao, setShowRemocao] = useState(false);
  const [tipoPlanilha, setTipoPlanilha] = useState();

  const buscarPlanilhas = async (page) => {
    setCarregando(true);
    setTipoPlanilha(filtros?.modelo);

    let payload = gerarParametrosConsulta({ page, ...filtros });
    let data;
    if (filtros.modelo === "SERVIDOR") {
      data = await getPlanilhasServidor(payload);
    } else if (filtros.modelo === "NAO_SERVIDOR") {
      data = await getPlanilhasNaoServidor(payload);
    } else if (filtros.modelo === "UE_PARCEIRA") {
      data = await getPlanilhasUEParceira(payload);
    }

    setPlanilhas(data.results);
    setTotalPlanilhas(data.count);
    setCarregando(false);
  };

  const nextPage = (page) => {
    buscarPlanilhas(page);
    setPage(page);
  };

  const createPlanilha = async (tipoPlanilha, arquivo) => {
    setCarregando(true);
    let res = await fetch(arquivo[0].arquivo);
    let blob = await res.blob();
    let file = new File([blob], arquivo[0].nome, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    let payload = {
      conteudo: file,
    };
    let response;
    if (tipoPlanilha === "NAO_SERVIDOR") {
      response = await createExcelCoreSSOExterno(payload);
    } else if (tipoPlanilha === "SERVIDOR") {
      response = await createExcelCoreSSOServidor(payload);
    } else if (tipoPlanilha === "UE_PARCEIRA") {
      response = await createExcelCoreSSOUEParceira(payload);
    }
    if (response.status === 201) {
      toastSuccess("Planilha inserida com sucesso!");
      setShowCadastro(false);
      setFiltros({ modelo: tipoPlanilha });
      setCarregando(false);
    } else {
      toastError("Erro ao adicionar acesso!");
      setCarregando(false);
    }
  };

  const removePlanilha = async () => {
    setCarregando(true);
    let response;
    if (tipoPlanilha === "SERVIDOR") {
      response = await removerPlanilhaServidor(showRemocao);
    } else if (tipoPlanilha === "NAO_SERVIDOR") {
      response = await removerPlanilhaExterno(showRemocao);
    } else if (tipoPlanilha === "UE_PARCEIRA") {
      response = await removerPlanilhaUEParceira(showRemocao);
    }

    if (response.status === 200) {
      toastSuccess("Arquivo removido com sucesso!");
      setShowRemocao(false);
      buscarPlanilhas(page);
      setCarregando(false);
    } else {
      toastError("Erro ao remover arquivo!");
      setCarregando(false);
    }
  };

  const executarCarga = async (uuid) => {
    setCarregando(true);
    let response;
    if (tipoPlanilha === "SERVIDOR") {
      response = await executarCargaPlanilhaServidor(uuid);
    } else if (tipoPlanilha === "NAO_SERVIDOR") {
      response = await executarCargaPlanilhaExterno(uuid);
    } else if (tipoPlanilha === "UE_PARCEIRA") {
      response = await executarCargaPlanilhaUEParceira(uuid);
    }

    if (response.status === 200) {
      setShowRemocao(false);
      buscarPlanilhas(page);
      setCarregando(false);
    } else {
      toastError("Erro ao remover arquivo!");
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (filtros) {
      buscarPlanilhas(1);
      setPage(1);
    }
  }, [filtros]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cargas-usuarios">
        <ModalCadastroPlanilha
          show={showCadastro}
          setShow={setShowCadastro}
          onSubmit={(tipoPlanilha, arquivo) => {
            createPlanilha(tipoPlanilha, arquivo);
          }}
          servidores={servidores}
        />
        <ModalRemocaoPlanilha
          show={showRemocao}
          setShow={setShowRemocao}
          removerPlanilha={removePlanilha}
        />
        <div className="card-body cargas-usuarios">
          <Filtros
            setFiltros={setFiltros}
            setPlanilhas={setPlanilhas}
            setShowCadastro={setShowCadastro}
            servidores={servidores}
          />
          {planilhas && planilhas.length > 0 && (
            <>
              <hr className="mt-4" />
              <ListagemPlanilhas
                planilhas={planilhas}
                filtros={filtros}
                buscarPlanilhas={buscarPlanilhas}
                page={page}
                setShowRemocao={setShowRemocao}
                executarCarga={executarCarga}
              />
              <div className="row">
                <div className="col">
                  <Paginacao
                    className="mt-3 mb-3"
                    current={page}
                    total={totalPlanilhas}
                    showSizeChanger={false}
                    onChange={nextPage}
                    pageSize={10}
                  />
                </div>
              </div>
              {totalPlanilhas === 0 && (
                <div className="text-center mt-5">
                  Não existem acessos para os critérios de busca utilizados.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
