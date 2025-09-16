import PropTypes from "prop-types";
import { HeaderCorpoRelatorio } from "src/components/GestaoDeAlimentacao/Relatorios/RelatorioGenerico/components/HeaderCorpoRelatorio";
import { statusEnum } from "src/constants/shared";
import {
  ehEscolaTipoCEMEI,
  justificativaAoNegarSolicitacao,
  stringSeparadaPorVirgulas,
} from "src/helpers/utilities";
import { getDetalheInversaoCardapio } from "src/services/relatorios";

export const CorpoRelatorio = (props) => {
  const { solicitacao } = props;

  const justificativaNegacao = justificativaAoNegarSolicitacao(
    solicitacao.logs
  );

  return (
    <div>
      <HeaderCorpoRelatorio
        getRelatorio={getDetalheInversaoCardapio}
        {...props}
      />
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

CorpoRelatorio.propTypes = {
  solicitacao: PropTypes.object.isRequired,
  prazoDoPedidoMensagem: PropTypes.string.isRequired,
};

export default CorpoRelatorio;
