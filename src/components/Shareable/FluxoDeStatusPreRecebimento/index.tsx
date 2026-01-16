import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  DETALHAR_ALTERACAO_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import { LogSolicitacoesUsuarioSimples } from "src/interfaces/dados_comuns.interface";
import { tipoDeStatusClasse } from "./helper";
import "./style.scss";

interface FluxoDeStatusPreRecebimentoProps {
  listaDeStatus: LogSolicitacoesUsuarioSimples[];
  itensClicaveisCronograma?: boolean;
}

export const FluxoDeStatusPreRecebimento = ({
  listaDeStatus,
  itensClicaveisCronograma,
}: FluxoDeStatusPreRecebimentoProps) => {
  const navigate = useNavigate();
  const listaRef = useRef<HTMLDivElement>(null);
  const [temOverflow, setTemOverflow] = useState(false);

  const verificarOverflow = () => {
    const atual = listaRef.current;
    if (atual) {
      const { scrollWidth, clientWidth } = atual;
      setTemOverflow(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    verificarOverflow();
    window.addEventListener("resize", verificarOverflow);
    return () => {
      window.removeEventListener("resize", verificarOverflow);
    };
  }, [listaDeStatus]);

  const rolar = (scrollOffset: number) => {
    if (listaRef.current) {
      listaRef.current.scrollLeft += scrollOffset;
    }
  };

  let ultimoStatus = listaDeStatus.slice(-1)[0];

  if (
    ultimoStatus.status_evento_explicacao === "Alteração enviada ao fornecedor"
  ) {
    listaDeStatus.push({
      status_evento_explicacao: "Fornecedor Ciente",
      criado_em: "",
      usuario: { nome: "", uuid: "" },
      justificativa: "",
    });
  }

  const item = (status: LogSolicitacoesUsuarioSimples, key: number) => {
    const content = (
      <>
        {status.criado_em}
        <br />
        {status.usuario && <span>{status.usuario.nome}</span>}
      </>
    );

    const uuidValido = status.justificativa;

    return (
      <li
        key={key}
        className={`${tipoDeStatusClasse(status)}`}
        style={{
          cursor:
            itensClicaveisCronograma && uuidValido ? "pointer" : "default",
        }}
        onClick={() => {
          itensClicaveisCronograma &&
            uuidValido &&
            navigate(
              `/${PRE_RECEBIMENTO}/${DETALHAR_ALTERACAO_CRONOGRAMA}?uuid=${status.justificativa}`,
            );
        }}
      >
        {content}
      </li>
    );
  };

  return (
    <div className="fluxo-status-wrapper">
      {temOverflow && (
        <i
          className="fas fa-chevron-left seta-esquerda"
          onClick={() => rolar(-300)}
        />
      )}
      <div className="fluxo-scroll-container" ref={listaRef}>
        <ul className={`progressbar-titles fluxos`}>
          {listaDeStatus.map((status, key) => (
            <li key={key}>{status.status_evento_explicacao}</li>
          ))}
        </ul>
        <ul className="progressbar-dados">
          {listaDeStatus.map((status, key) => item(status, key))}
        </ul>
      </div>
      {temOverflow && (
        <i
          className="fas fa-chevron-right seta-direita"
          onClick={() => rolar(300)}
        />
      )}
    </div>
  );
};
