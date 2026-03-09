import "./style.scss";
import extenso from "extenso";
import { formataMilharDecimal, formataMilhar } from "src/helpers/utilities";
import { capitalize } from "src/helpers/utilities";

type Props = {
  titulo: string;
  tituloQuantidade?: string;
  quantidade: number;
  tituloValor?: string;
  valor: number;
};

export function ConsolidadoTotal({
  titulo,
  tituloQuantidade = "QUANTIDADE SERVIDA (A + B + C):",
  quantidade,
  tituloValor = "VALOR DO FATURAMENTO TOTAL (A + B + C):",
  valor,
}: Props) {
  return (
    <div className="consolidado-total">
      <h2 className="consolidado-titulo">{titulo}</h2>
      <div className="consolidado-conteudo">
        <div className="bloco">
          <span className="bloco-titulo">{tituloQuantidade}</span>
          <div className="caixa quantidade">
            <span className="valor">{formataMilhar(quantidade)}</span>
            <span className="unidade">ALIMENTAÇÕES</span>
          </div>
        </div>
        <div className="bloco bloco-grande">
          <span className="bloco-titulo">{tituloValor}</span>
          <div className="caixa valor">
            <span className="valor">R$ {formataMilharDecimal(valor)}</span>
            <span className="extenso">
              {`(${capitalize(
                extenso(valor, {
                  mode: "currency",
                  locale: "br",
                }),
              )}.)`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
