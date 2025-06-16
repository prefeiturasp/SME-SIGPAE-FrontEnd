import React, { useState, useEffect } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

import ModalCancelamento from "../ModalCancelamento";
import { TIPO_SOLICITACAO_DIETA } from "../../../../../../constants/shared";
import SolicitacaoVigente from "../../../Escola/componentes/SolicitacaoVigente";
import { getSolicitacoesDietaEspecial } from "src/services/dietaEspecial.service";
import { gerarParametrosConsulta } from "src/helpers/utilities";
import { getStatusSolicitacoesInativas } from "src/helpers/dietaEspecial";

export default ({
  dieta,
  bordas,
  ativos,
  setAtivos,
  icone,
  filtros,
  setFiltros,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [solicitacoesVigentes, setSolicitacoesVigentes] = useState(null);

  useEffect(() => {
    const params = gerarParametrosConsulta({
      ativo: false,
      status: getStatusSolicitacoesInativas(),
      aluno: dieta.aluno.uuid,
    });
    getSolicitacoesDietaEspecial(params).then((response) => {
      setSolicitacoesVigentes(response.data.results);
    });
  }, []);

  const getTipoSolicitacao = () => {
    if (dieta.tipo_solicitacao === TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO)
      return "Dieta Especial - Não Matriculados";
    else if (dieta.tipo_solicitacao === TIPO_SOLICITACAO_DIETA.ALTERACAO_UE)
      return "Dieta Especial - Alteração de U.E";
    else return "Dieta Especial";
  };

  return (
    <>
      <div className="grid-dieta-cancelamento-table body-table-produtos">
        <div className={`${bordas}`}># {dieta.id_externo}</div>
        <div className={`${bordas} text-uppercase`}>{dieta.aluno.nome}</div>
        <div className={`${bordas}`}>{getTipoSolicitacao()}</div>
        <div className={`${bordas}`}>
          <i
            className={`fas fa-${icone}`}
            onClick={() => {
              ativos && ativos.includes(dieta.uuid)
                ? setAtivos(ativos.filter((el) => el !== dieta.uuid))
                : setAtivos(ativos ? [...ativos, dieta.uuid] : [dieta.uuid]);
            }}
          />
        </div>
      </div>
      {ativos && ativos.includes(dieta.uuid) && (
        <section className="resultado-busca-detalhe-produto">
          <br />
          <div className="row">
            {dieta.tipo_solicitacao ===
            TIPO_SOLICITACAO_DIETA.ALUNO_NAO_MATRICULADO ? (
              <div className="col-md-3">
                <p className="label-dieta-cancelamento">CPF do Aluno</p>
                <p className="value-dieta-cancelamento">{dieta.aluno.cpf}</p>
              </div>
            ) : (
              <div className="col-md-3">
                <p className="label-dieta-cancelamento">Cód. EOL do Aluno</p>
                <p className="value-dieta-cancelamento">
                  {dieta.aluno.codigo_eol}
                </p>
              </div>
            )}

            <div className="col-md-3">
              <p className="label-dieta-cancelamento">Data de Nascimento</p>
              <p className="value-dieta-cancelamento">
                {dieta.aluno.data_nascimento}
              </p>
            </div>
          </div>
          <form>
            {solicitacoesVigentes && (
              <SolicitacaoVigente
                titulo="Dietas Inativas"
                semSolicitacoesTexto="Não há dietas inativas para este aluno."
                solicitacoesVigentes={solicitacoesVigentes}
              />
            )}
          </form>

          <hr />
          <div className="row">
            {dieta.nome_completo_pescritor && (
              <div className="col-8 ">
                <p className="label-dieta-cancelamento">
                  Nome do Prescritor do laudo (médico, nutricionista,
                  fonoaudiólogo)
                </p>
                <p className="value-dieta-cancelamento">
                  {dieta.nome_completo_pescritor}
                </p>
              </div>
            )}
            {dieta.registro_funcional_pescritor && (
              <div className="col-4">
                <p className="label-dieta-cancelamento">
                  Registro Funcional (CRM/CRN/CRFa/RMS)
                </p>
                <p className="value-dieta-cancelamento">
                  {dieta.registro_funcional_pescritor}
                </p>
              </div>
            )}
          </div>
          <section className="row attachments">
            <div className="col-8">
              <p className="value-dieta-cancelamento">Laudo</p>
              <p className="label-dieta-cancelamento">
                O laudo fornecido pelo profissional. Sem ele, a solicitação de
                Dieta Especial será negada.
              </p>
            </div>
            <div className="col-4">
              <p className="value-dieta-cancelamento">Anexos</p>
              {dieta.anexos.map((anexo, key) => {
                return (
                  <div key={key}>
                    <a
                      href={anexo.arquivo_url}
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
          </section>
          <hr />

          <div className="row">
            <div className="col-md-12">
              <p className="label-dieta-cancelamento">Observações</p>
              <p
                className="label-dieta-cancelamento"
                dangerouslySetInnerHTML={{
                  __html: dieta.observacoes,
                }}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <Botao
                texto="Solicitar Cancelamento"
                className="float-end ms-3"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                onClick={() => setShowModal(true)}
              />
            </div>
          </div>

          <br />
        </section>
      )}

      <ModalCancelamento
        dieta={dieta}
        showModal={showModal}
        setShowModal={setShowModal}
        filtros={filtros}
        setFiltros={setFiltros}
      />
    </>
  );
};
