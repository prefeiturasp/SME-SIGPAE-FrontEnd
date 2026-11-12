import HTTP_STATUS from "http-status-codes";
import { useRef, useState } from "react";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { buscarResponsavelConferencia } from "src/services/medicaoInicial/relatorioFinanceiro.service";

export const MSG_RF_NAO_LOCALIZADO =
  "RF não localizado. Verifique o número informado.";

export const apenasDigitos = (valor?: string) =>
  (valor ?? "").replace(/\D/g, "");

export function useResponsavelConferencia() {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const [buscando, setBuscando] = useState(false);
  const rfAtual = useRef("");
  const rfConsultado = useRef("");

  const aoAlterarRf = (rf: string) => {
    rfAtual.current = rf;
    rfConsultado.current = "";
    setNome("");
    setErro("");
    setBuscando(false);
  };

  const definirErro = (mensagem: string) => {
    setNome("");
    setErro(mensagem);
  };

  const aoSairDoRf = async (rf: string) => {
    if (!rf || rf === rfConsultado.current) return;

    rfAtual.current = rf;
    rfConsultado.current = rf;
    setBuscando(true);

    const response = await buscarResponsavelConferencia(rf);

    if (rfAtual.current !== rf) return;

    setBuscando(false);
    if (response?.status === HTTP_STATUS.OK) {
      setNome(response.data.nome);
    } else if (response?.status === HTTP_STATUS.NOT_FOUND) {
      setErro(MSG_RF_NAO_LOCALIZADO);
    } else {
      rfConsultado.current = "";
      toastError("Erro ao buscar o responsável pelo RF. Tente novamente.");
    }
  };

  return { nome, erro, buscando, aoAlterarRf, aoSairDoRf, definirErro };
}
