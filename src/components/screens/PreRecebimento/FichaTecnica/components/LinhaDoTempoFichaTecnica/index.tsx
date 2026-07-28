import React, { useEffect, useRef, useState } from "react";

import { LogFichaTecnica } from "src/interfaces/pre_recebimento.interface";

import { montarLinhaDoTempoFichaTecnica } from "./helpers";
import "./styles.scss";

interface LinhaDoTempoFichaTecnicaProps {
  logs?: LogFichaTecnica[];
}

const DESLOCAMENTO_SCROLL = 300;

const LinhaDoTempoFichaTecnica = ({
  logs = [],
}: LinhaDoTempoFichaTecnicaProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [possuiOverflow, setPossuiOverflow] = useState(false);

  const etapas = montarLinhaDoTempoFichaTecnica(logs);

  const verificarOverflow = () => {
    const container = scrollRef.current;

    if (!container) {
      setPossuiOverflow(false);
      return;
    }

    setPossuiOverflow(container.scrollWidth > container.clientWidth);
  };

  const navegar = (deslocamento: number) => {
    scrollRef.current?.scrollBy({
      left: deslocamento,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    verificarOverflow();

    window.addEventListener("resize", verificarOverflow);

    return () => {
      window.removeEventListener("resize", verificarOverflow);
    };
  }, [etapas.length]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const container = scrollRef.current;

      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    }, 200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [etapas.length]);

  if (etapas.length === 0) {
    return null;
  }

  return (
    <div
      className={`linha-do-tempo-ficha-tecnica-wrapper ${
        possuiOverflow
          ? "linha-do-tempo-ficha-tecnica-wrapper--com-overflow"
          : "linha-do-tempo-ficha-tecnica-wrapper--sem-overflow"
      }`}
      aria-label="Histórico de status da Ficha Técnica"
    >
      {possuiOverflow && (
        <button
          type="button"
          className="linha-do-tempo-ficha-tecnica__seta linha-do-tempo-ficha-tecnica__seta--esquerda"
          onClick={() => navegar(-DESLOCAMENTO_SCROLL)}
          aria-label="Visualizar status anteriores"
        >
          <i className="fas fa-arrow-left" aria-hidden="true" />
        </button>
      )}

      <div className="linha-do-tempo-ficha-tecnica__scroll" ref={scrollRef}>
        <ol className="linha-do-tempo-ficha-tecnica__titulos">
          {etapas.map((etapa, index) => (
            <li key={`${etapa.criadoEm}-${etapa.titulo}-${index}`}>
              {etapa.titulo}
            </li>
          ))}
        </ol>

        <ol className="linha-do-tempo-ficha-tecnica__progresso">
          {etapas.map((etapa, index) => {
            const ehAlerta = etapa.tipo === "alerta";

            return (
              <li
                className={`linha-do-tempo-ficha-tecnica__etapa linha-do-tempo-ficha-tecnica__etapa--${etapa.tipo}`}
                key={`${etapa.criadoEm}-${etapa.nomeUsuario}-${index}`}
              >
                <span className="linha-do-tempo-ficha-tecnica__descricao-acessivel">
                  {ehAlerta ? "Correção solicitada" : "Movimentação concluída"}
                </span>

                <div className="linha-do-tempo-ficha-tecnica__data">
                  {etapa.criadoEm}
                </div>

                <div className="linha-do-tempo-ficha-tecnica__usuario">
                  {etapa.nomeUsuario}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {possuiOverflow && (
        <button
          type="button"
          className="linha-do-tempo-ficha-tecnica__seta linha-do-tempo-ficha-tecnica__seta--direita"
          onClick={() => navegar(DESLOCAMENTO_SCROLL)}
          aria-label="Visualizar próximos status"
        >
          <i className="fas fa-arrow-right" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default LinhaDoTempoFichaTecnica;
