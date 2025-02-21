import React, { useState, Fragment } from "react";
import "./style.scss";
import { STATUS_RECLAMACAO } from "configs/constants";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import ModalResponderReclamacao from "../ModalResponderReclamacao";
import { RECLAMACAO_PRODUTO_STATUS_EXPLICACAO } from "constants/shared";
import { getReclamacoesTerceirizadaPorFiltro } from "services/produto.service";
import { corrigeLinkAnexo } from "helpers/utilities";

const obterTituloLog = (status_evento) => {
  switch (status_evento) {
    case "Terceirizada respondeu a reclamação":
      return "Resposta terceirizada";

    case "Aguardando resposta da terceirizada":
      return "Questionamento CODAE";

    default:
      return status_evento;
  }
};

const obterRotuloDataLog = (log) => {
  if (
    log.status_evento_explicacao ===
    RECLAMACAO_PRODUTO_STATUS_EXPLICACAO.CODAE_QUESTIONOU_TERCEIRIZADA
  )
    return "Data quest. CODAE";
  return "Data reclamação";
};

const LogReclamacao = ({ log }) => {
  return (
    <div className="linha linha-3">
      <div />
      <div className="item">
        <div className="label-item">{obterRotuloDataLog(log)}</div>
        <div className="value-item">{log.criado_em.split(" ")[0]}</div>
      </div>
      <div className="item">
        <div className="label-item">
          {obterTituloLog(log.status_evento_explicacao)}
        </div>
        <div
          className="value-item value-uppercase"
          dangerouslySetInnerHTML={{ __html: log.justificativa }}
        />
        {log.anexos && log.anexos.length > 0 && (
          <div className="mb-3">
            <div key={1}>
              <p className="botao-reclamacao-title">Anexos da resposta</p>
            </div>
            <div key={2}>
              {log.anexos.map((anexo, key) => {
                return (
                  <div key={key}>
                    <a
                      href={corrigeLinkAnexo(anexo.arquivo)}
                      className="value-important link"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {`Anexo ${key + 1}`}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Reclamacao = ({
  reclamacao,
  indexProduto,
  setAtivos,
  produtos,
  produto,
  setProdutos,
  setCarregando,
  rastro_terceirizada,
}) => {
  const [exibirModal, setExibirModal] = useState(null);

  const atualizarProduto = () => {
    async function fetchData() {
      setAtivos([]);
      setCarregando(true);
      const uuid = produtos[indexProduto].ultima_homologacao.uuid;
      const response = await getReclamacoesTerceirizadaPorFiltro({
        uuid: uuid,
      });
      if (response.data.results.length)
        produtos[indexProduto] = response.data.results[0];
      else produtos.splice(indexProduto, 1);
      setProdutos(produtos);
      setCarregando(false);
    }
    fetchData();
  };

  const responder_deve_aparecer = (reclamacao_status) => {
    if (rastro_terceirizada === null) {
      return true;
    } else if (
      `"${rastro_terceirizada.nome_fantasia}"` !==
      localStorage.getItem("nome_instituicao")
    ) {
      return true;
    } else if (
      reclamacao_status !== STATUS_RECLAMACAO.AGUARDANDO_RESPOSTA_TERCEIRIZADA
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Fragment>
      <ModalResponderReclamacao
        showModal={exibirModal}
        closeModal={() => setExibirModal(null)}
        reclamacao={reclamacao}
        produto={produto}
        atualizarProduto={() => atualizarProduto()}
      />

      <div className="detalhes-reclamacao">
        <div className="linha linha-1">
          <div className="item">
            <div className="label-item">
              <div className="label-item">
                Reclamação #{reclamacao.id_externo}
              </div>
            </div>
          </div>
          <div className="item item-horizontal">
            <div className="label-item">Status Reclamação:</div>
            <div className="value-item">&nbsp; {reclamacao.status_titulo}</div>
          </div>
        </div>
        <div className="linha linha-2">
          <div className="item">
            <div className="label-item">Nome reclamante</div>
            <div className="value-item">{reclamacao.reclamante_nome}</div>
          </div>
          <div className="item">
            <div className="label-item">RF</div>
            <div className="value-item">
              {reclamacao.reclamante_registro_funcional}
            </div>
          </div>
          <div className="item">
            <div className="label-item">Nome Escola</div>
            <div className="value-item">{reclamacao.escola.nome}</div>
          </div>
          <div className="item">
            <div className="label-item">Cód. EOL</div>
            <div className="value-item">{reclamacao.escola.codigo_eol}</div>
          </div>
        </div>
        <div className="linha linha-3">
          <div />
          <div className="item">
            <div className="label-item">Data reclamação</div>
            <div className="value-item">
              {reclamacao.criado_em.split(" ")[0]}
            </div>
          </div>
          <div className="item">
            <div className="label-item">Justificativa reclamação</div>
            <div
              className="value-item value-uppercase"
              dangerouslySetInnerHTML={{ __html: reclamacao.reclamacao }}
            />
          </div>
        </div>
        {reclamacao.logs.map((log, index) => {
          return <LogReclamacao key={index} log={log} />;
        })}
      </div>
      <div className="text-end">
        {responder_deve_aparecer(reclamacao.status) && (
          <Botao
            texto="Responder"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            onClick={() => setExibirModal(true)}
            className="ms-3 me-3"
          />
        )}
      </div>
    </Fragment>
  );
};

export default Reclamacao;
