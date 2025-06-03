import { deepCopy } from "src/helpers/utilities";
export const formataEditalContratoParaForm = (
  editalContrato,
  setSwitchAtivoImrl
) => {
  const editalContratoFormatado = deepCopy(editalContrato);
  editalContratoFormatado.contratos.forEach((contrato) => {
    contrato.terceirizada = contrato.terceirizada.uuid;
    contrato.diretorias_regionais = contrato.diretorias_regionais.map(
      (dre) => dre.uuid
    );
    contrato.lotes = contrato.lotes.map((lote) => lote.uuid);
    delete contrato.edital;
  });
  setSwitchAtivoImrl(editalContratoFormatado.eh_imr);
  return editalContratoFormatado;
};
