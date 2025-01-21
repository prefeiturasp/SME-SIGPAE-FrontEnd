import React from "react";
import { Field } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import MaskedInputText from "components/Shareable/Input/MaskedInputText";
import { telefoneMask } from "constants/shared";

export const ContatoFormSet = ({
  ehDistribuidor,
  contatosPessoaEmpresa,
  setContatosPessoaEmpresa,
  values,
}) => {
  const adicionaContatoPessoaEmpresa = () => {
    contatosPessoaEmpresa = contatosPessoaEmpresa.concat([
      {
        nome: "",
        telefone: "",
        email: "",
      },
    ]);
    setContatosPessoaEmpresa(contatosPessoaEmpresa);
  };

  const setaContatosPessoaEmpresa = (
    input,
    value,
    indice,
    contatosPessoaEmpresa
  ) => {
    contatosPessoaEmpresa[indice][input] = value ? value : "";
    setContatosPessoaEmpresa(contatosPessoaEmpresa);
  };

  const removeContato = (index) => {
    let newContatos = [...contatosPessoaEmpresa];
    newContatos.splice(index, 1);
    setContatosPessoaEmpresa(newContatos);

    let lastIndex;
    newContatos.forEach((contato, index) => {
      values[`nome_contato_${index}`] = contato.nome;
      values[`telefone_contato_${index}`] = contato.telefone;
      values[`email_contato_${index}`] = contato.email;
      lastIndex = index + 1;
    });
    delete values[`nome_contato_${lastIndex}`];
    delete values[`telefone_contato_${lastIndex}`];
    delete values[`email_contato_${lastIndex}`];
  };

  return (
    <>
      {ehDistribuidor && (
        <>
          <hr className="linha-form" />
          <div className="card-body">
            <div className="card-title green">Contatos</div>
            <div className="container-fields row">
              <div className="col-11">
                {contatosPessoaEmpresa.map((contatoEmpresa, indiceEmpresa) => {
                  return (
                    <div key={indiceEmpresa}>
                      <div className="fields-set-contatos" key={indiceEmpresa}>
                        <div>
                          <Field
                            id={`nome_contato_${indiceEmpresa}`}
                            name={`nome_contato_${indiceEmpresa}`}
                            component={InputText}
                            label="Nome"
                            maxlength="140"
                            inputOnChange={(e) => {
                              const value = e.target.value;
                              setaContatosPessoaEmpresa(
                                "nome",
                                value,
                                indiceEmpresa,
                                contatosPessoaEmpresa
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Field
                            component={MaskedInputText}
                            mask={telefoneMask}
                            name={`telefone_contato_${indiceEmpresa}`}
                            label="Telefone"
                            id={`telefone_contato_${indiceEmpresa}`}
                            indice={indiceEmpresa}
                            cenario="contatoEmpresa"
                            maxlength="140"
                            inputOnChange={(e) => {
                              const value = e.target.value;
                              setaContatosPessoaEmpresa(
                                "telefone",
                                value,
                                indiceEmpresa,
                                contatosPessoaEmpresa
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Field
                            name={`email_contato_${indiceEmpresa}`}
                            component={InputText}
                            label="E-mail"
                            maxlength="140"
                            id={`email_contato_${indiceEmpresa}`}
                            inputOnChange={(e) => {
                              const value = e.target.value;
                              setaContatosPessoaEmpresa(
                                "email",
                                value,
                                indiceEmpresa,
                                contatosPessoaEmpresa
                              );
                            }}
                          />
                        </div>
                        <div>
                          {indiceEmpresa !== 0 && (
                            <Botao
                              className="deletar-contato"
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              icon="fas fa-trash"
                              dataTestId="btn-delete-contato"
                              onClick={() => {
                                removeContato(indiceEmpresa);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={`col-1 mt-auto mb-1`}>
                <Botao
                  texto="+"
                  className="adicionar-contato"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  dataTestId="btn-add-contato"
                  onClick={() => {
                    adicionaContatoPessoaEmpresa();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
