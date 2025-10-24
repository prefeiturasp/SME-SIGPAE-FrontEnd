import React, { Fragment, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  getFiltros,
  filtrarAlunosMatriculados,
} from "src/services/alunosMatriculados.service";
import { formataOpcoes, formataLista } from "./helpers";
import { Filtros } from "./componentes/Filtros";
import { TabelaResultado } from "./componentes/TabelaResultado";
import { Spin } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { deepCopy } from "src/helpers/utilities";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { formataOpcoesDropdown } from "./helpers";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  gerarPDFRelatorioAlunosMatriculados,
  gerarXLSRelatorioAlunosMatriculados,
} from "src/services/relatorios.service";
import "./style.scss";

export const AlunosMatriculados = () => {
  const [carregando, setCarregando] = useState(true);
  const [filtrando, setFiltrando] = useState(false);
  const [listaOpcoes, setListaOpcoes] = useState(undefined);
  const [dres, setDres] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [tiposUnidades, setTiposUnidades] = useState([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);
  const [tiposTurmas, setTiposTurmas] = useState([]);
  const [total, setTotal] = useState(undefined);
  const [page, setPage] = useState(10);
  const [resultado, setResultado] = useState(undefined);
  const [filtros, setFiltros] = useState(undefined);
  const [faixasEtarias, setFaixasEtarias] = useState(undefined);
  const [showPeridosFaixas, setShowPeriodosFaixas] = useState([]);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const getOpcoesFiltros = async () => {
    const response = await getFiltros();
    if (response.status === HTTP_STATUS.OK) {
      setListaOpcoes(response.data);
      setLotes(formataOpcoes(response.data.lotes));
      setDres(formataOpcoes(response.data.diretorias_regionais));
      setTiposUnidades(formataOpcoes(response.data.tipos_unidade_escolar));
      setUnidadesEducacionais(formataOpcoes(response.data.escolas));
      setTiposTurmas(formataLista(response.data.tipos_turmas));
    } else {
      toastError("Erro ao carregar filtros.");
    }
    setCarregando(false);
  };

  const getTodasFaixasEtarias = async () => {
    const response = await getFaixasEtarias();
    if (response.status === HTTP_STATUS.OK) {
      setFaixasEtarias(response.data.results);
    } else {
      toastError("Erro ao carregar faixas etárias.");
    }
  };

  const onPageChanged = async (page, values) => {
    setFiltrando(true);
    let _values = deepCopy(values);
    _values["limit"] = 10;
    _values["offset"] = (page - 1) * _values["limit"];
    setPage(page);

    const response = await filtrarAlunosMatriculados(_values);
    if (response.status === HTTP_STATUS.OK) {
      setResultado(response.data.results);
      setShowPeriodosFaixas(formataOpcoesDropdown(response.data.results));
    } else {
      toastError(
        "Houve um erro ao trocar de página, tente novamente mais tarde",
      );
    }
    setFiltrando(false);
  };

  const exportarPDF = async () => {
    setFiltrando(true);
    const response = await gerarPDFRelatorioAlunosMatriculados(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
    setFiltrando(false);
  };

  const exportarXLS = async () => {
    setFiltrando(true);
    const response = await gerarXLSRelatorioAlunosMatriculados(filtros);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar xls. Tente novamente mais tarde.");
    }
    setFiltrando(false);
  };

  useEffect(() => {
    getOpcoesFiltros();
    getTodasFaixasEtarias();
  }, []);

  return (
    <div className="card relatorio-solicitacoes-alimentacao mt-3">
      <div className="card-body">
        <Spin tip="Carregando..." spinning={carregando}>
          <Filtros
            dres={dres}
            lotes={lotes}
            tiposUnidades={tiposUnidades}
            unidadesEducacionais={unidadesEducacionais}
            tiposTurmas={tiposTurmas}
            listaOpcoes={listaOpcoes}
            setFiltrando={(value) => setFiltrando(value)}
            setPage={(value) => setPage(value)}
            setFiltros={(value) => setFiltros(value)}
            setResultado={(value) => setResultado(value)}
            setTotal={(value) => setTotal(value)}
            setShowPeriodosFaixas={(lista) => setShowPeriodosFaixas(lista)}
          />
        </Spin>
        <Spin tip="Filtrando..." spinning={filtrando}>
          {total > 0 && resultado && resultado.length > 0 && (
            <Fragment>
              <TabelaResultado
                resultado={resultado}
                faixasEtarias={faixasEtarias}
                showPeridosFaixas={showPeridosFaixas}
                setShowPeriodosFaixas={(lista) => setShowPeriodosFaixas(lista)}
              />
              <Paginacao
                onChange={(page) => onPageChanged(page, filtros)}
                total={total}
                pageSize={10}
                current={page}
              />
              <div className="row">
                <div className="col-12 text-end">
                  <Botao
                    className="me-2"
                    texto="Baixar EXCEL"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    icon={BUTTON_ICON.FILE_EXCEL}
                    type={BUTTON_TYPE.BUTTON}
                    disabled={filtrando}
                    onClick={() => exportarXLS()}
                  />
                  <Botao
                    texto="Baixar PDF"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    icon={BUTTON_ICON.FILE_PDF}
                    type={BUTTON_TYPE.BUTTON}
                    disabled={filtrando}
                    onClick={() => exportarPDF()}
                  />
                  {exibirModalCentralDownloads && (
                    <ModalSolicitacaoDownload
                      show={exibirModalCentralDownloads}
                      setShow={setExibirModalCentralDownloads}
                    />
                  )}
                </div>
              </div>
            </Fragment>
          )}
        </Spin>
        {!filtrando && resultado && resultado.length === 0 && (
          <div className="sem-resultado-alunos-matriculados">
            Não há alunos matriculados para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
};
