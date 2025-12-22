import React, { ReactElement } from "react";
import { NavLink } from "react-router-dom";
import "./styles.scss";
import { DocumentosRecebimento } from "src/interfaces/pre_recebimento.interface";
import {
  PRE_RECEBIMENTO,
  DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
  CORRIGIR_DOCUMENTOS_RECEBIMENTO,
} from "../../../../../../configs/constants";
import { downloadArquivoLaudoAssinado } from "src/services/documentosRecebimento.service";
import { Tooltip } from "antd";
import { truncarString } from "../../../../../../helpers/utilities";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

interface Props {
  objetos: Array<DocumentosRecebimento>;
  setCarregando: React.Dispatch<React.SetStateAction<boolean>>;
}

const Listagem: React.FC<Props> = ({ objetos, setCarregando }) => {
  const renderizarStatus = (status: string) => {
    const perfilFornecedor =
      JSON.parse(localStorage.getItem("perfil")) === "ADMINISTRADOR_EMPRESA";

    return perfilFornecedor && status === "Enviado para Correção" ? (
      <span className="orange">Solicitada Correção</span>
    ) : (
      status
    );
  };

  const renderizarAcoes = (objeto: DocumentosRecebimento): ReactElement => {
    const botaoDetalharVerde = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${DETALHAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Detalhar" className="fas fa-eye green" />
        </span>
      </NavLink>
    );

    const botaoBaixarLaudo = (
      <span className="link-acoes px-2">
        <button onClick={() => baixarArquivoLaudo(objeto)}>
          <i title="Baixar Laudo" className="fas fa-file-download green" />
        </button>
      </span>
    );

    const botaoCorrigirLaranja = (
      <NavLink
        className="float-start"
        to={`/${PRE_RECEBIMENTO}/${CORRIGIR_DOCUMENTOS_RECEBIMENTO}?uuid=${objeto.uuid}`}
      >
        <span className="link-acoes px-2">
          <i title="Corrigir" className="fas fa-edit orange" />
        </span>
      </NavLink>
    );

    return (
      <>
        {["Enviado para Análise", "Aprovado"].includes(objeto.status) &&
          botaoDetalharVerde}
        {objeto.status === "Enviado para Correção" && botaoCorrigirLaranja}
        {objeto.status === "Aprovado" && botaoBaixarLaudo}
      </>
    );
  };

  const baixarArquivoLaudo = async (objeto: DocumentosRecebimento) => {
    setCarregando(true);
    try {
      downloadArquivoLaudoAssinado(objeto.uuid, objeto.numero_cronograma);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="listagem-documentos-recebimento">
      <header>
        <div className="row mt-3">
          <div className="col-5 px-0">
            <div className="titulo-verde">Documentos Cadastrados</div>
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
          <div>Nº do Cronograma</div>
          <div>Nº do Laudo</div>
          <div>Nº do Pregão/Chamada Pública</div>
          <div>Nome do Produto</div>
          <div>Data de Cadastro</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {objetos.map((objeto) => {
          return (
            <>
              <div key={objeto.uuid} className="grid-table body-table">
                <div>{objeto.numero_cronograma}</div>
                <div>{objeto.numero_laudo}</div>
                <div>{objeto.pregao_chamada_publica}</div>
                <div className="d-flex align-items-center justify-content-between">
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
                  {objeto.programa_leve_leite && (
                    <TagLeveLeite className="ms-2" />
                  )}
                </div>

                <div>{objeto.criado_em}</div>
                <div>{renderizarStatus(objeto.status)}</div>
                <div className="actions">{renderizarAcoes(objeto)}</div>
              </div>
            </>
          );
        })}
      </article>
    </div>
  );
};

export default Listagem;
