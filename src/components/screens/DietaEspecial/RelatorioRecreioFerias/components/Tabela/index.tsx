import { deepCopy } from "src/helpers/utilities";
import { IRelatorioDietaRecreioFerias } from "../../interfaces";
import "./style.scss";

export const Tabela = ({ ...props }) => {
  const { total, dietas, setDietas } = props;

  const setCollapse = (key: number) => {
    const copyDietas = deepCopy(dietas);
    copyDietas[key].collapsed = !copyDietas[key].collapsed;
    setDietas(copyDietas);
  };

  return (
    <>
      <div className="titulo">
        Resultado da pesquisa - TOTAL DE DIETAS AUTORIZADAS PARA RECREIO NAS
        FÉRIAS: {total}
      </div>
      <table>
        <thead>
          <tr className="row">
            <th className="col-3">Cod. EOL e Nome do Aluno</th>
            <th className="col-3">UE de Origem</th>
            <th className="col-3">UE de Destino</th>
            <th className="col-1">Classificação</th>
            <th className="col-1">Vigência</th>
            <th className="col-1" />
          </tr>
        </thead>
        <tbody>
          {dietas?.map((dieta: IRelatorioDietaRecreioFerias, key: number) => {
            return [
              <tr key={key}>
                <td>
                  {dieta.aluno.codigo_eol} - {dieta.aluno.nome}
                </td>
                <td>{dieta.escola.nome}</td>
                <td>{dieta.escola_destino.nome}</td>
                <td>{dieta.classificacao.nome}</td>
                <td>
                  De {dieta.data_inicio} até {dieta.data_termino}
                </td>
                <td onClick={() => setCollapse(key)}>
                  <i
                    className={
                      dieta.collapsed
                        ? "fas fa-chevron-up"
                        : "fas fa-chevron-down"
                    }
                  />
                </td>
              </tr>,
              dieta.collapsed && (
                <tr key={`${key}_collapsed`}>
                  <td>
                    Relação por Diagnóstico:{" "}
                    {dieta.alergias_intolerancias
                      .map((item) => item.descricao)
                      .join(", ")}
                  </td>
                </tr>
              ),
            ];
          })}
        </tbody>
      </table>
    </>
  );
};
