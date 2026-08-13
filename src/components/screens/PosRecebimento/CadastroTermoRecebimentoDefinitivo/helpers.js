export const TEXTO_PADRAO_TERMO = `<p>Pelo presente, em face do encerramento da execução do objeto a que se refere o contrato em epígrafe, emitimos nos termos do art. 73 da Lei 8.666/93, o presente TERMO DE RECEBIMENTO DEFINITIVO, após a verificação da qualidade e quantidade do produto [PRODUTO] e sua consequente aceitação. Ressaltamos que...</p>

<p>O presente instrumento tem eficácia liberatória de todas as obrigações do contratado, exceto as garantias legais (art. 73, § 2º, da Lei: 8.666/93), bem como autorizamos a restituição de todas as garantias e/ou caução prestadas, conforme ressalva abaixo:</p>

<ol>
  <li>O produto poderá ser recusado, parcial ou totalmente, a qualquer momento após o seu recebimento, até que sua validade se extinga, nos termos do Edital, sujeitando a Contratada à obrigatoriedade de reposição e às penalidades cabíveis.</li>
</ol>`;

export const PLACEHOLDER_PRODUTO = "[PRODUTO]";

export const gerarTextoTermo = (produtos) => {
  const nomeProdutos =
    produtos && produtos.length > 0 ? produtos.join(", ") : PLACEHOLDER_PRODUTO;
  return TEXTO_PADRAO_TERMO.split(PLACEHOLDER_PRODUTO).join(nomeProdutos);
};

export const converterValorParaDecimal = (valor) => {
  if (valor === null || valor === undefined || valor === "") return "0.00";
  const limpo = String(valor).replace(/\./g, "").replace(",", ".");
  const numero = parseFloat(limpo);
  return (isNaN(numero) ? 0 : numero).toFixed(2);
};

export const cronogramasParaBloco = (
  disponiveis,
  selecionados,
  selecionadoDoBloco = "",
) =>
  disponiveis.filter(
    (cronograma) =>
      !selecionados.includes(cronograma.numero) ||
      cronograma.numero === selecionadoDoBloco,
  );
