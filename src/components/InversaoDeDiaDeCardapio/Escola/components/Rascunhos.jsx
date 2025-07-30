export const Rascunhos = ({ ...props }) => {
  const { rascunhos, removerRascunho, carregarRascunho, form } = props;
  return (
    <div>
      {rascunhos?.map((inversaoDeDiaDeCardapio, key) => {
        const { uuid, id_externo } = inversaoDeDiaDeCardapio;
        let backgroundColor = "#DADADA";
        return (
          <div key={key} className="draft bg-white border rounded mt-1 p-2">
            <div className="mt-2">
              <label className="bold ms-3">
                Inversão de dia de Cardápio {`# ${id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                {"RASCUNHO"}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {inversaoDeDiaDeCardapio.criado_em}
              <span onClick={() => removerRascunho(id_externo, uuid)}>
                <i className="fas fa-trash" />
              </span>
              <span
                onClick={() => carregarRascunho(inversaoDeDiaDeCardapio, form)}
              >
                <i className="fas fa-edit" />
              </span>
            </div>
            <div className="ms-3">
              <p>
                Substituição do dia:{" "}
                <b>
                  {inversaoDeDiaDeCardapio.cardapio_de
                    ? inversaoDeDiaDeCardapio.cardapio_de.data
                    : inversaoDeDiaDeCardapio.data_de_inversao}
                </b>{" "}
                <i
                  className={"fa fa-arrow-right ms-2 me-2"}
                  style={{ color: "#2881BB" }}
                />{" "}
                para o dia:
                <b>
                  {" "}
                  {inversaoDeDiaDeCardapio.cardapio_para
                    ? inversaoDeDiaDeCardapio.cardapio_para.data
                    : inversaoDeDiaDeCardapio.data_para_inversao}
                </b>
                {inversaoDeDiaDeCardapio.data_para_inversao_2 && (
                  <p>
                    Substituição do dia:{" "}
                    <b>
                      {inversaoDeDiaDeCardapio.cardapio_de
                        ? inversaoDeDiaDeCardapio.cardapio_de.data
                        : inversaoDeDiaDeCardapio.data_de_inversao_2}
                    </b>{" "}
                    <i
                      className={"fa fa-arrow-right ms-2 me-2"}
                      style={{ color: "#2881BB" }}
                    />{" "}
                    para o dia:
                    <b>
                      {" "}
                      {inversaoDeDiaDeCardapio.cardapio_para
                        ? inversaoDeDiaDeCardapio.cardapio_para.data
                        : inversaoDeDiaDeCardapio.data_para_inversao_2}
                    </b>
                  </p>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
