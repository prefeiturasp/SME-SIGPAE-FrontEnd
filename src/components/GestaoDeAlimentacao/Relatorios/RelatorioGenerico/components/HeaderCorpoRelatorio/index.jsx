import PropTypes from "prop-types";
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
import { corDaMensagem } from "src/helpers/utilities";

export const HeaderCorpoRelatorio = ({ ...props }) => {
  const { solicitacao, prazoDoPedidoMensagem, tipoSolicitacao, getRelatorio } =
    props;

  const [baixandoPDF, setBaixandoPDF] = useState(false);

  const handleBaixarPDF = async () => {
    setBaixandoPDF(true);
    try {
      await getRelatorio(
        solicitacao.uuid,
        solicitacao?.escola?.nome,
        tipoSolicitacao
      );
    } catch {
      toastError("Houve um erro ao imprimir o relatório");
    }
    setBaixandoPDF(false);
  };

  return (
    <>
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
            style={BUTTON_STYLE.GREEN}
            icon={!baixandoPDF && BUTTON_ICON.PRINT}
            texto={
              baixandoPDF && (
                <img src="/assets/image/ajax-loader.gif" alt="ajax-loader" />
              )
            }
            disabled={baixandoPDF}
            className="float-end"
            onClick={async () => {
              await handleBaixarPDF();
            }}
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
          <span className="dre-name">{solicitacao.escola?.nome}</span>
        </div>
        <div className="my-auto col-4">
          <span className="requester">Código EOL</span>
          <br />
          <span className="dre-name">{solicitacao.escola?.codigo_eol}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-3 report-label-value">
          <p>DRE</p>
          <p className="value-important">
            {solicitacao.escola?.diretoria_regional?.nome}
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
            {solicitacao.rastro_terceirizada?.nome_fantasia}
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
    </>
  );
};

HeaderCorpoRelatorio.propTypes = {
  solicitacao: PropTypes.object.isRequired,
  prazoDoPedidoMensagem: PropTypes.string.isRequired,
  tipoSolicitacao: PropTypes.string.isRequired,
  getRelatorio: PropTypes.func.isRequired,
};
