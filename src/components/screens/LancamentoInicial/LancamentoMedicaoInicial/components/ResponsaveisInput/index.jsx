import { Input } from "antd";

function ResponsaveisInputs({
  responsaveis,
  setaResponsavel,
  emEdicao,
  verificarInput,
}) {
  return (
    <>
      {responsaveis.map((responsavel, index) => (
        <div className="row col-12 pe-0 mt-2" key={index}>
          <div className="col-8">
            <Input
              className="mt-2"
              name={`responsavel_nome_${index}`}
              data-testid={`input-responsavel-nome-${index}`}
              value={responsavel.nome}
              onChange={(e) => setaResponsavel("nome", e.target.value, index)}
              disabled={!emEdicao}
            />
          </div>
          <div className="col-4 pe-0">
            <Input
              maxLength={7}
              className="mt-2"
              name={`responsavel_rf_${index}`}
              data-testid={`input-responsavel-rf-${index}`}
              onKeyPress={(event) => verificarInput(event, index)}
              onChange={(event) =>
                setaResponsavel("rf", event.target.value, index)
              }
              value={responsavel.rf}
              disabled={!emEdicao}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default ResponsaveisInputs;
