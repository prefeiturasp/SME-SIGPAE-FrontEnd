import React, { Dispatch, SetStateAction, ReactElement } from "react";
import { Tooltip } from "antd";
import { NavLink } from "react-router-dom";

import { truncarString } from "src/helpers/utilities";
import { imprimirFichaRecebimento } from "src/services/fichaRecebimento.service";
import { FichaDeRecebimentoItemListagem } from "../../interfaces";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

import "./styles.scss";
import {
  CADASTRO_FICHA_RECEBIMENTO,
  DETALHAR_FICHA_RECEBIMENTO,
  EDITAR_FICHA_RECEBIMENTO,
  RECEBIMENTO,
} from "src/configs/constants";

import { usuarioEhRecebimento } from "src/helpers/utilities";

interface Props {
  objetos: FichaDeRecebimentoItemListagem[];
  setCarregando: Dispatch<SetStateAction<boolean>>;
}

const TAMANHO_MAXIMO = 30;

const Listagem: React.FC<Props> = ({ objetos, setCarregando }) => {
  const imprimirFicha = async (
    uuid: string,
    numero: string,
    setCarregando: Dispatch<SetStateAction<boolean>>,
  ) => {
    setCarregando(true);
    await imprimirFichaRecebimento(uuid, numero);
    setCarregando(false);
  };

  const renderizarAcoes = (
    objeto: FichaDeRecebimentoItemListagem,
  ): ReactElement => {
    const iconeEditar = (
      <span className="link-acoes px-1">
        <i title="Editar" className="fas fa-edit green" />
      </span>
    );
    const iconeDetalhar = (
      <span className="link-acoes px-1">
        <i title="Detalhar" className="fas fa-eye green" />
      </span>
    );

    const botaoEditar =
      objeto.status === "Rascunho" ? (
        <NavLink
          className="float-start"
          to={`/${RECEBIMENTO}/${CADASTRO_FICHA_RECEBIMENTO}?uuid=${objeto.uuid}`}
        >
          {iconeEditar}
        </NavLink>
      ) : (
        <NavLink
          className="float-start"
          to={`/${RECEBIMENTO}/${EDITAR_FICHA_RECEBIMENTO}?uuid=${objeto.uuid}`}
        >
          {iconeEditar}
        </NavLink>
      );

    const botaoDetalhar = (
      <NavLink
        className="float-start"
        to={`/${RECEBIMENTO}/${DETALHAR_FICHA_RECEBIMENTO}?uuid=${objeto.uuid}`}
      >
        {iconeDetalhar}
      </NavLink>
    );

    const botaoImprimir = (
      <span className="link-acoes px-1">
        <button
          type="button"
          title="Imprimir"
          onClick={() =>
            imprimirFicha(objeto.uuid, objeto.numero_cronograma, setCarregando)
          }
          aria-label="Imprimir"
          className="button-icon px-0"
        >
          <i className="fas fa-print green" />
        </button>
      </span>
    );

    return (
      <div className="d-flex border-0">
        {objeto.status === "Assinado CODAE" && botaoDetalhar}
        {usuarioEhRecebimento() && (
          <>
            {botaoEditar}
            {objeto.status === "Assinado CODAE" && botaoImprimir}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="listagem-fichas-recebimento">
      <div className="titulo-verde mt-4 mb-3">Recebimentos Cadastrados</div>

      <article>
        <div className="grid-table header-table">
          <div>Nº do Cronograma</div>
          <div>Nome do Produto</div>
          <div>Fornecedor</div>
          <div>Nº do Pregão / Chamada Pública</div>
          <div>Data do Recebimento</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_cronograma}</div>
                <div className="d-flex align-items-center justify-content-between">
                  <Tooltip title={objeto.nome_produto}>
                    {truncarString(objeto.nome_produto, TAMANHO_MAXIMO)}
                  </Tooltip>
                  {objeto.programa_leve_leite && <TagLeveLeite />}
                </div>
                <div>
                  <Tooltip title={objeto.fornecedor}>
                    {truncarString(objeto.fornecedor, TAMANHO_MAXIMO)}
                  </Tooltip>
                </div>
                <div>{objeto.pregao_chamada_publica}</div>
                <div>{objeto.data_recebimento}</div>
                <div>{objeto.status}</div>
                <div>{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
