import { formataMilharDecimal } from "src/helpers/utilities";
import "./style.scss";
import extenso from "extenso";

type Props = {
  titulo: string;
  quantidade: number;
  valor: number;
};

export function ConsolidadoTotal({ titulo, quantidade, valor }: Props) {
  return (
    <div className="consolidado-total">
      <div className="header">
        <h3 className="titulo">{titulo}</h3>
        <div className="linha-separadora" />
      </div>

      <div className="conteudo">
        <div className="bloco">
          <span className="bloco-titulo">QUANTIDADE SERVIDA (A + B + C):</span>
          <div className="card card-quantidade">
            <span className="valor">{quantidade}</span>
            <span className="descricao">ALIMENTAÇÕES</span>
          </div>
        </div>

        <div className="bloco bloco-grande">
          <span className="bloco-titulo">
            VALOR DO FATURAMENTO TOTAL (A + B + C):
          </span>
          <div className="card card-faturamento">
            <span className="valor">R$ {formataMilharDecimal(valor)}</span>
            <span className="extenso">
              {extenso(valor, {
                mode: "currency",
                locale: "br",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
