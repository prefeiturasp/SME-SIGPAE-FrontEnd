import React, { useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { Field, Form } from "react-final-form";
import InputText from "components/Shareable/Input/InputText";
import { SMEPrefeituraEmail } from "helpers/fieldValidators";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { getDadosUsuarioEOLCompleto } from "services/permissoes.service";
import { formataCPFCensurado } from "helpers/utilities";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import Botao from "components/Shareable/Botao";
import { alterarEmailCore } from "services/vinculos.service";

export default () => {
  const [carregando, setCarregando] = useState(false);
  const [rfBuscado, setRfBuscado] = useState(false);

  const buscaEOL = async (values) => {
    let response = await getDadosUsuarioEOLCompleto(values.registro_funcional);

    if (response.status === 200) {
      const usuarioEOL = response.data;
      values.nome_servidor = usuarioEOL.nome ? usuarioEOL.nome : undefined;
      values.cargo_servidor = usuarioEOL.cargo ? usuarioEOL.cargo : undefined;
      values.email_servidor = usuarioEOL.email ? usuarioEOL.email : undefined;
      values.cpf = usuarioEOL.cpf;
      values.cpf_servidor = usuarioEOL.cpf
        ? formataCPFCensurado(usuarioEOL.cpf)
        : undefined;
      values.codigo_eol_unidade = usuarioEOL.codigo_eol_unidade;

      let t = document.getElementById("inputRF");
      t.focus();
      setRfBuscado(true);
    } else {
      if (values.registro_funcional) {
        toastError(
          `API do EOL não retornou nada para o RF ${values.registro_funcional}`
        );
      }
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-atualizacao-email">
        <div className="card-body atualizacao-email">
          <Form
            onSubmit={async (values) => {
              setCarregando(true);
              let payload = {
                username: values.registro_funcional,
                email: values.email_atualizado,
              };
              let response = await alterarEmailCore(payload);

              if (response.status === 200) {
                toastSuccess("E-mail atualizado com sucesso no EOL!");
              } else {
                toastError("Erro ao alterar e-mail");
              }
              setCarregando(false);
            }}
            initialValues={{}}
            render={({ form, handleSubmit, values }) => (
              <>
                <form onSubmit={handleSubmit} className="">
                  <div className="subtitulo">Dados do usuário</div>
                  <div className="row">
                    <div className="col-6">
                      <Field
                        component={InputText}
                        id="inputRF"
                        label="Pesquisar RF"
                        name="registro_funcional"
                        placeholder="Digite o RF do Servidor"
                        className="input-busca-produto"
                      />
                    </div>
                    <div className="col-6 pl-0">
                      <Botao
                        texto=""
                        icon="fas fa-search"
                        type={BUTTON_TYPE.BUTTON}
                        onClick={() => buscaEOL(values)}
                        style={BUTTON_STYLE.GREEN}
                        className="botao-rf"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-7">
                      <Field
                        component={InputText}
                        label="Nome do Usuário"
                        name="nome_servidor"
                        className="input-busca-produto"
                        disabled={true}
                      />
                    </div>
                    <div className="col-5">
                      <Field
                        component={InputText}
                        label="Cargo"
                        name="cargo_servidor"
                        className="input-busca-produto"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-7">
                      <Field
                        component={InputText}
                        label="E-mail"
                        name="email_servidor"
                        className="input-busca-produto"
                        disabled={true}
                      />
                    </div>
                    <div className="col-5">
                      <Field
                        component={InputText}
                        label="CPF"
                        name="cpf_servidor"
                        className="input-busca-produto"
                        disabled={true}
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="subtitulo">Seção de alteração</div>

                  <div className="texto">
                    Preencha com o E-mail <strong>institucional</strong> do
                    servidor
                  </div>

                  <div className="row">
                    <div className="col-7">
                      <Field
                        component={InputText}
                        label="E-mail"
                        name="email_atualizado"
                        placeholder="@sme.prefeitura.sp.gov.br"
                        className="input-busca-produto"
                        disabled={!rfBuscado}
                        validate={SMEPrefeituraEmail}
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="mt-4 mb-4">
                    <Botao
                      texto="Salvar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                    />

                    <Botao
                      texto="Limpar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={() => {
                        form.restart({});
                        setRfBuscado(false);
                      }}
                    />
                  </div>
                </form>
              </>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
