import React, { ReactElement, useState } from "react";
import { Tooltip } from "antd";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  FiltrosRelatoriosVisitasInterface,
  RelatorioVisitaItemListagem,
} from "interfaces/imr.interface";
import {
  DETALHAR_RELATORIO_FISCALIZACAO,
  EDITAR_RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
  SUPERVISAO,
  TERCEIRIZADAS,
} from "src/configs/constants";
import { truncarString } from "src/helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import {
  deleteFormularioSupervisao,
  exportarPDFRelatorioFiscalizacao,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { NavLink } from "react-router-dom";
import "./styles.scss";

interface Props {
  objetos: RelatorioVisitaItemListagem[];
  perfilNutriSupervisao: boolean;
  getDashboardPainelGerencialSupervisaoAsync: () => void;
  buscarResultados: (
    _filtros_: FiltrosRelatoriosVisitasInterface,
    _pageNumber: number
  ) => void;
  filtros: FiltrosRelatoriosVisitasInterface;
  pagina: number;
}

const TAMANHO_MAXIMO = 40;

export const Listagem: React.FC<Props> = ({
  objetos,
  perfilNutriSupervisao,
  getDashboardPainelGerencialSupervisaoAsync,
  buscarResultados,
  filtros,
  pagina,
}) => {
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [requisicaoEmAndamento, setRequisicaoEmAndamento] =
    useState<string>("");

  const deParaStatus = (status: string) =>
    ["Enviado para CODAE"].includes(status) && !perfilNutriSupervisao
      ? "Enviado pela Supervisão"
      : status;

  const exportarPDF = async (uuid: string) => {
    setRequisicaoEmAndamento(uuid);
    const response = await exportarPDFRelatorioFiscalizacao({
      uuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao baixar PDF. Tente novamente mais tarde");
    }
    setRequisicaoEmAndamento("");
  };

  const excluirRelatorio = async (uuid: string) => {
    if (window.confirm("Deseja realmente excluir este relatório?")) {
      setRequisicaoEmAndamento(uuid);
      const response = await deleteFormularioSupervisao({
        uuid,
      });
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess("Relatório excluído com sucesso!");
        await getDashboardPainelGerencialSupervisaoAsync();
        await buscarResultados(filtros, pagina);
      } else {
        toastError("Erro ao excluir relatório. Tente novamente mais tarde");
      }
      setRequisicaoEmAndamento("");
    }
  };

  const renderizarAcoes = (
    objeto: RelatorioVisitaItemListagem
  ): ReactElement => {
    const botaoContinuarRelatorio = (
      <Tooltip title="Editar relatório">
        <NavLink
          className="float-start"
          to={`/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${EDITAR_RELATORIO_FISCALIZACAO}?uuid=${objeto.uuid}`}
        >
          <button className="verde">
            <i className="fas fa-edit" />
          </button>
        </NavLink>
      </Tooltip>
    );

    const botaoDetalhar = (
      <Tooltip title="Visualizar Relatório">
        <NavLink
          className="float-start"
          to={`/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${DETALHAR_RELATORIO_FISCALIZACAO}?uuid=${objeto.uuid}`}
        >
          <button className="verde">
            <i className="fas fa-eye" />
          </button>
        </NavLink>
      </Tooltip>
    );

    const botaoImprimir = (
      <Tooltip title="Relatório em PDF">
        <button
          onClick={() => exportarPDF(objeto.uuid)}
          className="verde"
          disabled={requisicaoEmAndamento === objeto.uuid}
        >
          {requisicaoEmAndamento !== objeto.uuid && (
            <i className="fas fa-download" />
          )}
          {requisicaoEmAndamento === objeto.uuid && (
            <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
          )}
        </button>
      </Tooltip>
    );

    const botaoExcluirRelatorio = (
      <Tooltip title="Excluir relatório">
        <button
          onClick={() => excluirRelatorio(objeto.uuid)}
          className="verde"
          disabled={requisicaoEmAndamento === objeto.uuid}
        >
          {requisicaoEmAndamento !== objeto.uuid && (
            <i className="fas fa-trash" />
          )}
          {requisicaoEmAndamento === objeto.uuid && (
            <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
          )}
        </button>
      </Tooltip>
    );

    return (
      <div>
        {objeto.status === "Em Preenchimento" &&
          perfilNutriSupervisao &&
          botaoContinuarRelatorio}
        {objeto.status === "Em Preenchimento" &&
          perfilNutriSupervisao &&
          botaoExcluirRelatorio}
        {objeto.status === "Enviado para CODAE" &&
          perfilNutriSupervisao &&
          botaoDetalhar}
        {objeto.status !== "Em Preenchimento" &&
          perfilNutriSupervisao &&
          botaoImprimir}
      </div>
    );
  };

  return (
    <div className="listagem-relatorios-visita">
      <div className="titulo-verde mt-5 mb-3">
        Relatórios das Visitas as Unidades Cadastrados
      </div>

      <article>
        <div className="grid-table header-table">
          <div>Diretoria Regional</div>
          <div>Unidade Educacional</div>
          <div>Data da Visita</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.diretoria_regional}</div>
                <div>
                  <Tooltip title={objeto.unidade_educacional}>
                    {truncarString(objeto.unidade_educacional, TAMANHO_MAXIMO)}
                  </Tooltip>
                </div>
                <div>{objeto.data}</div>
                <div>{deParaStatus(objeto.status)}</div>
                <div className="p-0">{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>
      <ModalSolicitacaoDownload
        show={exibirModalCentralDownloads}
        setShow={setExibirModalCentralDownloads}
      />
    </div>
  );
};
