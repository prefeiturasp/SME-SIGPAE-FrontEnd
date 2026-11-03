import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  PRE_RECEBIMENTO,
  CADASTRAR_FICHA_TECNICA,
  DETALHAR_FICHA_TECNICA,
  ALTERAR_FICHA_TECNICA,
  CRIAR_COPIA_FICHA_TECNICA,
} from "src/configs/constants";
import { FichaTecnica } from "src/interfaces/pre_recebimento.interface";
import "./styles.scss";

import { Tooltip } from "antd";
import {
  acionaComEnterOuEspaco,
  truncarString,
} from "../../../../../../helpers/utilities";
import { imprimirFicha } from "../../helpers";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import { ehFLV } from "src/helpers/preRecebimento";

interface Props {
  objetos: Array<FichaTecnica>;
  setCarregando: Dispatch<SetStateAction<boolean>>;
}

const Listagem: React.FC<Props> = ({ objetos, setCarregando }) => {
  const navigate = useNavigate();
  const [fichaParaCopiar, setFichaParaCopiar] = useState<FichaTecnica | null>(
    null,
  );

  const confirmarCriacaoCopia = () => {
    if (!fichaParaCopiar) return;

    navigate(
      `/${PRE_RECEBIMENTO}/${CRIAR_COPIA_FICHA_TECNICA}?uuid=${fichaParaCopiar.uuid}`,
    );
    setFichaParaCopiar(null);
  };

  const renderizarStatus = (status: string) =>
    status === "Enviada para Correção" ? (
      <span className="orange">Solicitação de Alteração</span>
    ) : (
      status
    );

  const baixarPDFFichaTecnica = (ficha: FichaTecnica) => {
    setCarregando(true);
    imprimirFicha(ficha.uuid, ficha.numero, setCarregando);
  };

  const renderizarAcoes = (objeto: FichaTecnica): ReactElement => {
    const botaoContinuarCadastro = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${CADASTRAR_FICHA_TECNICA}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Continuar Cadastro" className="fas fa-edit green" />
        </span>
      </NavLink>
    );

    const botaoDetalhar = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${DETALHAR_FICHA_TECNICA}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Detalhar" className="fas fa-eye green" />
        </span>
      </NavLink>
    );

    const botaoAlterar = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${ALTERAR_FICHA_TECNICA}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Alterar" className="fas fa-edit orange" />
        </span>
      </NavLink>
    );

    const botaoImprimir = (
      <span
        className="float-start ms-1 link-acoes green"
        role="button"
        tabIndex={0}
        onClick={() => baixarPDFFichaTecnica(objeto)}
        onKeyDown={(e) =>
          acionaComEnterOuEspaco(e, () => baixarPDFFichaTecnica(objeto))
        }
        data-testid="btnImprimir"
      >
        <i className="fas fa-print" title="Ficha em PDF" />
      </span>
    );

    const botaoCriarCopia = (
      <span
        className="float-start ms-1 link-acoes green"
        role="button"
        tabIndex={0}
        onClick={() => setFichaParaCopiar(objeto)}
        onKeyDown={(e) =>
          acionaComEnterOuEspaco(e, () => setFichaParaCopiar(objeto))
        }
        data-testid="btnCriarCopia"
      >
        <i className="fas fa-copy" title="Criar Cópia" />
      </span>
    );

    return (
      <div className="d-flex">
        {objeto.status === "Rascunho" && botaoContinuarCadastro}
        {["Enviada para Análise", "Aprovada"].includes(objeto.status) &&
          botaoDetalhar}
        {objeto.status === "Enviada para Correção" && botaoAlterar}
        {["Enviada para Análise", "Aprovada"].includes(objeto.status) &&
          botaoImprimir}
        {objeto.status === "Aprovada" && botaoCriarCopia}
      </div>
    );
  };

  return (
    <div className="listagem-fichas-tecnicas">
      <header>
        <div className="row mt-3">
          <div className="col-5 px-0">
            <div className="titulo-verde">Fichas Técnicas Cadastradas</div>
          </div>
          <div className="col-7 px-0 text-end">
            <p className="mb-0">
              <i className="fa fa-info-circle me-2" />
              Veja a descrição do produto passando o mouse sobre o nome.
            </p>
          </div>
        </div>
      </header>

      <article>
        <div className="grid-table header-table">
          <div>Nº da Ficha</div>
          <div>Nome do Produto</div>
          <div>Nº Pregão/Chamada Pública</div>
          <div>Data do Cadastro</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          const classNameVerde = ehFLV(objeto.categoria) ? "green" : "";
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div className={classNameVerde}>{objeto.numero}</div>
                <div
                  className={`d-flex align-items-center justify-content-between ${classNameVerde}`}
                >
                  <Tooltip
                    color="#42474a"
                    overlayStyle={{
                      maxWidth: "320px",
                      fontSize: "12px",
                      fontWeight: "700",
                    }}
                    title={objeto.nome_produto}
                  >
                    {truncarString(objeto.nome_produto, 30)}
                  </Tooltip>
                  {objeto.programa === "LEVE_LEITE" && <TagLeveLeite />}
                </div>
                <div className={classNameVerde}>
                  {objeto.pregao_chamada_publica}
                </div>
                <div className={classNameVerde}>{objeto.criado_em}</div>
                <div className={classNameVerde}>
                  {renderizarStatus(objeto.status)}
                </div>
                <div className="p-0">{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>

      <ModalGenerico
        show={Boolean(fichaParaCopiar)}
        handleClose={() => setFichaParaCopiar(null)}
        handleSim={confirmarCriacaoCopia}
        titulo="Copiar Ficha Técnica"
        texto="Você realmente deseja criar uma Cópia da Ficha Técnica?"
        textoBotaoClose="Não"
        textoBotaoSim="Sim, Criar Cópia"
      />
    </div>
  );
};

export default Listagem;
