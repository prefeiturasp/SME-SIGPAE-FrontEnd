import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { normalizaLabelValueEmpresaSocial } from "src/components/screens/Cadastros/EditaisContratos/helper";
import { CardLogo } from "src/components/Shareable/CardLogo/CardLogo";
import IconeDietaEspecial from "src/components/Shareable/Icones/IconeDietaEspecial";
import { IconeGestaoDeAlimentacao } from "src/components/Shareable/Icones/IconeGestaoDeAlimentacao";
import IconeGestaoDeProduto from "src/components/Shareable/Icones/IconeGestaoDeProduto";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import FiltrosEmails from "./FiltrosEmails";
import ListagemEmails from "./ListagemSolicitacoes";
import {
  getEmailsTerceirizadasPorModulo,
  listaSimplesTerceirizadas,
} from "src/services/terceirizada.service";
import "./style.scss";
import { Paginacao } from "src/components/Shareable/Paginacao";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [terceirizadas, setTerceirizadas] = useState();
  const [ativos, setAtivos] = useState([]);
  const [total, setTotal] = useState();
  const [page, setPage] = useState();
  const [modulo, setModulo] = useState("");
  const [resultados, setResultados] = useState(false);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    getTerceirizadas();
  }, []);

  const getTerceirizadas = async () => {
    const responseEmpresa = await listaSimplesTerceirizadas();
    if (responseEmpresa.data) {
      setEmpresas(
        normalizaLabelValueEmpresaSocial(responseEmpresa.data.results),
      );
    }
  };

  const buscarTerceirizadas = async (page, mod, busca) => {
    setCarregando(true);
    const response = await getEmailsTerceirizadasPorModulo({
      page: page,
      modulo: mod,
      busca: busca,
    });
    if (response.status === HTTP_STATUS.OK) {
      if (response.data.results.length) {
        setTerceirizadas(response.data.results);
        setTotal(response.data.count);
      } else {
        setTotal(response.data.count);
        setTerceirizadas([]);
      }
    } else {
      toastError("Erro ao buscar!");
    }
    setModulo(mod);
    setResultados(true);
    setAtivos([]);
    setCarregando(false);
  };

  const nextPage = (page) => {
    setPage(page);
    buscarTerceirizadas(page, modulo);
  };

  const onPesquisaChanged = (values) => {
    if (values.buscar) {
      if (values.buscar.length > 2) {
        buscarTerceirizadas(1, modulo, values.buscar);
      }
    } else {
      buscarTerceirizadas(1, modulo);
    }
  };

  const atualizaTabela = () => {
    buscarTerceirizadas(page ? page : 1, modulo);
  };

  const escolheModulo = (mod) => {
    if (modulo !== mod) {
      buscarTerceirizadas(1, mod);
    }
  };

  return (
    <div>
      <div className="row mt-3">
        <div
          className={`${
            modulo === "Gestão de Alimentação" ? "card-verde" : "card-cinza"
          } col-3`}
        >
          <CardLogo
            titulo={"Gestão de Alimentação"}
            onClick={() => {
              escolheModulo("Gestão de Alimentação");
            }}
            data-testid="card-logo-gestao-alimentacao"
          >
            <IconeGestaoDeAlimentacao />
          </CardLogo>
        </div>
        <div
          className={`${
            modulo === "Dieta Especial" ? "card-verde" : "card-cinza"
          } col-3`}
        >
          <CardLogo
            titulo={"Dieta Especial"}
            onClick={() => {
              escolheModulo("Dieta Especial");
            }}
            data-testid="card-logo-dieta-especial"
          >
            <IconeDietaEspecial />
          </CardLogo>
        </div>
        <div
          className={`${
            modulo === "Gestão de Produto" ? "card-verde" : "card-cinza"
          } col-3`}
        >
          <CardLogo
            titulo={"Gestão de Produto"}
            onClick={() => {
              escolheModulo("Gestão de Produto");
            }}
            data-testid="card-logo-gestao-produto"
          >
            <IconeGestaoDeProduto />
          </CardLogo>
        </div>
      </div>
      <div className="mt-3">
        <span>
          <center>
            Selecione um dos módulos acima para{" "}
            <b>Gerenciar os e-mails Cadastrados</b>
          </center>
        </span>
      </div>
      {resultados && (
        <>
          <Spin tip="Carregando..." spinning={carregando}>
            <div className="card mt-3">
              <div className="card-body gestao-requisicao-entrega">
                <FiltrosEmails
                  modulo={modulo}
                  empresas={empresas}
                  onChange={onPesquisaChanged}
                  atualizaTabela={atualizaTabela}
                  data-testid="filtros-emails"
                />
                <ListagemEmails
                  empresas={empresas}
                  buscarTerceirizadas={buscarTerceirizadas}
                  terceirizadas={terceirizadas}
                  ativos={ativos}
                  setAtivos={setAtivos}
                  modulo={modulo}
                  data-testid="listagem-emails"
                />
                <Paginacao
                  className="mt-3 mb-3"
                  current={page || 1}
                  total={total}
                  showSizeChanger={false}
                  onChange={nextPage}
                  pageSize={10}
                  data-testid="paginacao"
                />
              </div>
            </div>
          </Spin>
        </>
      )}
    </div>
  );
};
