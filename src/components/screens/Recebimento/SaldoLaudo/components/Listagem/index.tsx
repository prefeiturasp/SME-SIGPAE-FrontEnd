import React, { useState } from "react";
import { Tooltip } from "antd";
import { NavLink } from "react-router-dom";

import { truncarString } from "src/helpers/utilities";
import { AjusteSaldoLaudoListagem } from "../../interfaces";
import { excluirAjusteSaldo } from "src/services/ajusteSaldo.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import ModalGenerico from "src/components/Shareable/ModalGenerico";

import { EDITAR_SALDO_LAUDO, RECEBIMENTO } from "src/configs/constants";

import { agruparMilharDecimalModificado } from "src/components/Shareable/Input/InputText/helpers";

import "./styles.scss";

interface Props {
  objetos: AjusteSaldoLaudoListagem[];
  aposExcluir?: () => void;
}

const TAMANHO_MAXIMO = 30;

const Listagem: React.FC<Props> = ({ objetos, aposExcluir }) => {
  const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
  const [uuidExclusao, setUuidExclusao] = useState("");
  const [carregandoExclusao, setCarregandoExclusao] = useState(false);

  const excluirAjuste = async () => {
    setCarregandoExclusao(true);
    try {
      await excluirAjusteSaldo(uuidExclusao);
      toastSuccess("Ajuste de saldo excluído com sucesso!");
      aposExcluir?.();
    } catch {
      toastError("Erro ao excluir ajuste de saldo.");
    } finally {
      setCarregandoExclusao(false);
      setExibirModalExcluir(false);
    }
  };

  const renderizarAcoes = (objeto: AjusteSaldoLaudoListagem) => {
    const iconeEditar = (
      <span className="link-acoes px-1">
        <i title="Editar" className="fas fa-edit green" />
      </span>
    );

    const botaoEditar = (
      <NavLink
        className="float-start"
        to={`/${RECEBIMENTO}/${EDITAR_SALDO_LAUDO}?uuid=${objeto.uuid}`}
      >
        {iconeEditar}
      </NavLink>
    );

    const botaoExcluir = (
      <span className="link-acoes px-1">
        <button
          type="button"
          title="Excluir"
          aria-label="Excluir"
          onClick={() => {
            setUuidExclusao(objeto.uuid);
            setExibirModalExcluir(true);
          }}
        >
          <i className="fas fa-trash green" />
        </button>
      </span>
    );

    return (
      <div className="acoes">
        {botaoEditar}
        {botaoExcluir}
      </div>
    );
  };

  return (
    <div className="listagem-ajustes-saldo">
      <div className="titulo-verde mt-4 mb-3">Ajustes de Saldo Cadastrados</div>

      <article>
        {objetos.length === 0 ? (
          <div className="text-center mt-4 mb-4">
            Nenhum resultado encontrado
          </div>
        ) : (
          <>
            <div className="grid-table header-table">
              <div>Nº do Cronograma</div>
              <div>Produto</div>
              <div>Fornecedor</div>
              <div>Nº do Laudo</div>
              <div>Quantidade a ser Descontada</div>
              <div>Ações</div>
            </div>

            {objetos.map((objeto) => {
              return (
                <div key={objeto.uuid} className="grid-table body-table">
                  <div>{objeto.numero_cronograma}</div>
                  <div className="d-flex align-items-center justify-content-between">
                    <Tooltip title={objeto.produto}>
                      {truncarString(objeto.produto, TAMANHO_MAXIMO)}
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title={objeto.fornecedor}>
                      {truncarString(objeto.fornecedor, TAMANHO_MAXIMO)}
                    </Tooltip>
                  </div>
                  <div>{objeto.numero_laudo}</div>
                  <div>
                    {agruparMilharDecimalModificado(
                      objeto.quantidade_descontada,
                    )}{" "}
                    {objeto.unidade_medida}
                  </div>
                  <div>{renderizarAcoes(objeto)}</div>
                </div>
              );
            })}
          </>
        )}
      </article>

      <ModalGenerico
        show={exibirModalExcluir}
        handleClose={() => setExibirModalExcluir(false)}
        loading={carregandoExclusao}
        handleSim={excluirAjuste}
        textoBotaoSim="Excluir"
        titulo="Excluir Ajuste de Saldo do Laudo"
        texto="Deseja realmente excluir o Ajuste de Saldo do Laudo?"
      />
    </div>
  );
};

export default Listagem;
