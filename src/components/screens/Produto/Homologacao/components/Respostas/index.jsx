import JustificativaAnalise from "./JustificativaAnalise";
import InformativoReclamacao from "src/components/Shareable/InformativoReclamacao";
import { MotivoRecusa } from "./MotivoRecusa";

const TIPOS_RECUSAS = [
  {
    tipo: "CODAE_SUSPENDEU",
    titulo: "Motivo da suspensão",
    status: "CODAE suspendeu o produto",
  },
  {
    tipo: "CODAE_QUESTIONADO",
    titulo: "Motivo da solicitação de correção do produto",
    status: "Questionamento pela CODAE",
  },
  {
    tipo: "CODAE_NAO_HOMOLOGADO",
    titulo: "Motivo da recusa de homologação",
    status: "CODAE não homologou",
  },
  {
    tipo: "TERCEIRIZADA_CANCELOU_SOLICITACAO_HOMOLOGACAO",
    titulo: "Motivo do cancelamento da homologação",
    status: "Terceirizada cancelou solicitação de homologação de produto",
  },
];

export const Respostas = ({ homologacao, logAnaliseSensorial }) => {
  const recusa = TIPOS_RECUSAS.find(({ tipo }) => tipo === homologacao.status);
  return (
    <>
      {homologacao.status === "CODAE_AUTORIZOU_RECLAMACAO" && (
        <InformativoReclamacao homologacao={homologacao} />
      )}
      {recusa && (
        <MotivoRecusa
          logs={homologacao.logs || []}
          titulo={recusa.titulo}
          motivo={recusa.status}
        />
      )}
      {homologacao.protocolo_analise_sensorial &&
        logAnaliseSensorial.length > 0 && (
          <JustificativaAnalise
            homologacao={homologacao}
            logAnaliseSensorial={logAnaliseSensorial}
          />
        )}
    </>
  );
};
export default Respostas;
