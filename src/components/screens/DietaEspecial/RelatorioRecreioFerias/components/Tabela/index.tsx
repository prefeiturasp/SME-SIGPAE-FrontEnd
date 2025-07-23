export const Tabela = ({ ...props }) => {
  const { total, dietas } = props;

  return (
    <>
      <div className="titulo">
        Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS PARA RECREIO NAS
        FÉRIAS: {total}
      </div>
      <table>
        <thead>
          <tr>
            <th>Cod. EOL e Nome do Aluno</th>
            <th>UE de Origem</th>
            <th>UE de Destino</th>
            <th>Classificação</th>
            <th>Vigência</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {dietas?.map((dieta, key) => {
            return [
              <tr key={key}>
                <td>{dieta}</td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </>
  );
};
