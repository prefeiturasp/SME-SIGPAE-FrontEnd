import { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { FluxoDeStatus } from "src/components/Shareable/FluxoDeStatus";
import { fluxoPartindoEscola } from "src/components/Shareable/FluxoDeStatus/helper";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { statusEnum } from "src/constants/shared";
import {
  corDaMensagem,
  ehEscolaTipoCEMEI,
  justificativaAoNegarSolicitacao,
  stringSeparadaPorVirgulas,
} from "src/helpers/utilities";
import { getDetalheInversaoCardapio } from "src/services/relatorios";

export const CorpoRelatorio = (props) => {
  const [imprimindo, setimprimindo] = useState(false);
  const { solicitacao, prazoDoPedidoMensagem } = props;

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    solicitacao.logs
  );

  const btnImprimirRelatorio = async () => {
    setimprimindo(true);
    try {
      await getDetalheInversaoCardapio(
        solicitacao.uuid,
        solicitacao?.escola?.nome
      );
    } catch {
      toastError("Houve um erro ao imprimir o relatório");
    }
    setimprimindo(false);
  };

  return (
    <div>
      <div className="row">
        <p
          className={`col-12 title-message ${corDaMensagem(
            prazoDoPedidoMensagem
          )}`}
        >
          {prazoDoPedidoMensagem}
          <Botao
            type={BUTTON_TYPE.BUTTON}
            dataTestId="botao-imprimir"
            titulo="imprimir"
            style={imprimindo ? BUTTON_STYLE.GREEN_OUTLINE : BUTTON_STYLE.GREEN}
            icon={imprimindo ? BUTTON_ICON.LOADING : BUTTON_ICON.PRINT}
            disabled={imprimindo}
            className="float-end"
            onClick={() => btnImprimirRelatorio()}
          />
        </p>
        <div className="col-2">
          <span className="badge-sme badge-secondary-sme">
            <span className="id-of-solicitation-dre">
              # {solicitacao.id_externo}
            </span>
            <br />{" "}
            <span className="number-of-order-label">Nº DA SOLICITAÇÃO</span>
          </span>
        </div>
        <div className="ps-2 my-auto offset-1 col-5">
          <span className="requester">Escola Solicitante</span>
          <br />
          <span className="dre-name">
            {solicitacao.escola && solicitacao.escola.nome}
          </span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">
            {solicitacao.escola && solicitacao.escola.codigo_eol}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacao.escola &&
              solicitacao.escola.diretoria_regional &&
              solicitacao.escola.diretoria_regional.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Lote</p>
          <p className="value-important">{solicitacao.escola?.lote?.nome}</p>
        </div>
        <div className="col-3 report-label-value">
          <p>Tipo de Gestão</p>
          <p className="value-important">
            {solicitacao.escola?.tipo_gestao?.nome}
          </p>
        </div>
        <div className="col-3 report-label-value">
          <p>Empresa</p>
          <p className="value-important">
            {solicitacao.rastro_terceirizada &&
              solicitacao.rastro_terceirizada.nome_fantasia}
          </p>
        </div>
      </div>
      <hr />
      {solicitacao.logs && (
        <div className="row">
          <FluxoDeStatus
            listaDeStatus={solicitacao.logs}
            fluxo={fluxoPartindoEscola}
            eh_gestao_alimentacao={true}
          />
        </div>
      )}
      <hr />
      {solicitacao.tipos_alimentacao.length > 0 && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Tipos de Alimentação para inversão:</p>
            <p className="fw-bold">
              {stringSeparadaPorVirgulas(solicitacao.tipos_alimentacao, "nome")}
            </p>
          </div>
        </div>
      )}
      <table className="table-report mt-4">
        <tr>
          <th className="col-3">Data de Inversão</th>
          <th className="col-3">Referência:</th>
          <th className="col-3">Aplicar em:</th>
          {ehEscolaTipoCEMEI(solicitacao.escola) && (
            <th className="col-3">Alunos</th>
          )}
        </tr>
        <tr>
          <td />
          <td className="pe-5">{solicitacao.data_de_inversao}</td>
          <td>{solicitacao.data_para_inversao}</td>
          {ehEscolaTipoCEMEI(solicitacao.escola) && (
            <td className="col-3">{solicitacao.alunos_da_cemei}</td>
          )}
        </tr>
        {solicitacao.data_de_inversao_2 && (
          <tr>
            <td />
            <td className="pe-5">{solicitacao.data_de_inversao_2}</td>
            <td>{solicitacao.data_para_inversao_2}</td>
            {ehEscolaTipoCEMEI(solicitacao.escola) && (
              <td className="col-3">{solicitacao.alunos_da_cemei_2}</td>
            )}
          </tr>
        )}
      </table>
      <div className="row">
        <div className="col-12 report-label-value">
          <p>Motivo</p>
          <p
            className="value fw-bold"
            dangerouslySetInnerHTML={{
              __html: solicitacao.motivo,
            }}
          />
        </div>
      </div>
      {solicitacao.observacao && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Observações</p>
            <p
              className="fw-bold value"
              dangerouslySetInnerHTML={{
                __html: solicitacao.observacao,
              }}
            />
          </div>
        </div>
      )}
      {solicitacao.logs &&
        solicitacao.status === statusEnum.CODAE_AUTORIZADO && (
          <div className="row">
            <div className="col-12 report-label-value">
              <p>
                <b>Autorizou</b>
              </p>
              <div>
                {solicitacao.logs[solicitacao.logs.length - 1].criado_em} -
                Informações da CODAE
              </div>
              {solicitacao.logs[solicitacao.logs.length - 1].justificativa !==
              "" ? (
                <p
                  className="value"
                  dangerouslySetInnerHTML={{
                    __html:
                      solicitacao.logs[solicitacao.logs.length - 1]
                        .justificativa,
                  }}
                />
              ) : (
                <p>Sem observações por parte da CODAE</p>
              )}
            </div>
          </div>
        )}
      {justificativaNegacao && (
        <div className="row">
          <div className="col-12 report-label-value">
            <p>Justificativa da negação</p>
            <p
              className="value"
              dangerouslySetInnerHTML={{
                __html: justificativaNegacao,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CorpoRelatorio;
