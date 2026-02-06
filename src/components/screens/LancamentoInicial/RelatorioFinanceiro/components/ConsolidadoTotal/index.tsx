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
      <h2 className="consolidado-titulo">{titulo}</h2>
      <div className="consolidado-conteudo">
        <div className="bloco">
          <span className="bloco-titulo">QUANTIDADE SERVIDA (A + B + C):</span>
          <div className="caixa quantidade">
            <span className="valor">{quantidade}</span>
            <span className="unidade">ALIMENTAÇÕES</span>
          </div>
        </div>
        <div className="bloco bloco-grande">
          <span className="bloco-titulo">
            VALOR DO FATURAMENTO TOTAL (A + B + C):
          </span>
          <div className="caixa valor">
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
