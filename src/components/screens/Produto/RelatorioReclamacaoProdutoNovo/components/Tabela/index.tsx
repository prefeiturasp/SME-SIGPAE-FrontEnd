export const Tabela = ({ ...props }) => {
  const { produtos } = props;

  return (
    <div className="tabela-relatorio-reclamacoes-produto">
      {produtos?.length > 0 && (
        <table>
          <tr>
            <th>Edital</th>
            <th>Nome do Produto</th>
            <th>Marca</th>
            <th>Fabricante</th>
            <th>Reclamações</th>
            <th>Status Produto</th>
          </tr>
          {produtos.map((produto, key: number) => {
            return (
              <tr key={key}>
                <td></td>
                <td>{produto.nome}</td>
                <td>{produto.marca.nome}</td>
                <td>{produto.fabricante.nome}</td>
                <td>{produto.ultima_homologacao.reclamacoes.length}</td>
                <div>{produto.ultima_homologacao.status_titulo}</div>
              </tr>
            );
          })}
        </table>
      )}
      {produtos?.length === 0 && (
        <div>Não foram encontrados resultados para estes filtros.</div>
      )}
    </div>
  );
};
