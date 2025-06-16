import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";

import { getTiposDeContagem } from "src/services/dietaEspecial.service";

import "./styles.scss";
import { OK } from "http-status-codes";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { updateEscolaSimples } from "src/services/escola.service";

import "./styles.scss";

export default ({ escola }) => {
  const [tiposDeContagem, setTiposDeContagem] = useState([]);
  const [dadosIniciais, setDadosIniciais] = useState({});

  const onFormUpdate = async (tiposContagem) => {
    const resposta = await updateEscolaSimples(escola.uuid, {
      tipos_contagem: tiposContagem,
    });
    if (resposta.status !== OK) {
      toastError("Erro ao atualizar o tipo de contagem");
    }
  };

  useEffect(() => {
    async function fetch() {
      const response = await getTiposDeContagem();
      setTiposDeContagem(response.data);
      setDadosIniciais(
        escola.tipos_contagem && {
          tipos_contagem: escola.tipos_contagem.map(
            (tipoContagem) => tipoContagem.uuid
          ),
        }
      );
    }
    fetch();
  }, []);

  return (
    <div className="seletor-tipo-contagem">
      <div className="row">
        <div className="col report-label-value">
          <p className="value">Contagem de refeições</p>
        </div>
      </div>
      <Form
        onSubmit={() => {}}
        initialValues={dadosIniciais}
        render={() => (
          <div className="row">
            <div className="col-4">
              <form>
                {dadosIniciais &&
                  tiposDeContagem.map((tipoContagem, index) => (
                    <p key={index}>
                      <span
                        onClick={(e) => {
                          const value = e.target.value;
                          onFormUpdate(value);
                        }}
                      >
                        <Field
                          component={"input"}
                          name="tipos_contagem"
                          type="checkbox"
                          value={tipoContagem.uuid}
                        />
                      </span>
                      {tipoContagem.nome}
                    </p>
                  ))}
              </form>
            </div>
          </div>
        )}
      />
    </div>
  );
};
