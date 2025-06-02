import React, { useState } from "react";
import {
  cadastrarProdutoEdital,
  atualizarProdutoEdital,
} from "src/services/produto.service";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { Select } from "src/components/Shareable/Select";
import { Spin } from "antd";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  required,
  alphaNumericAndSingleSpaceBetweenCharacters,
  noSpaceStartOrEnd,
} from "src/helpers/fieldValidators";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { composeValidators, statusProdutos } from "src/helpers/utilities";
import "./style.scss";
import { CADASTROS, CONFIGURACOES, PRODUTOS } from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default () => {
  const [produto, setProduto] = useState();
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setProduto(location.state.produto);
    }
  }, [location]);

  const voltarParaProdutos = () =>
    navigate(`/${CONFIGURACOES}/${CADASTROS}/${PRODUTOS}`);

  const onSubmit = async (formValues) => {
    setCarregando(true);
    const payload = {
      nome: formValues.nome,
      ativo: formValues.status,
      tipo_produto: "LOGISTICA",
    };
    if (produto) {
      await atualizarProdutoEdital(payload, produto.uuid)
        .then(() => {
          toastSuccess("Produto atualizado com sucesso!");
          voltarParaProdutos();
        })
        .catch((error) => {
          toastError(error.response.data[0]);
        });
    } else {
      await cadastrarProdutoEdital(payload)
        .then(() => {
          toastSuccess("Produto cadastrado com sucesso!");
          voltarParaProdutos();
        })
        .catch((error) => {
          toastError(error.response.data[0]);
        });
    }

    setCarregando(false);
  };

  return (
    <div className="card mt-3 card-cadastro-produto">
      <div className="card-body">
        <Spin tip="Carregando..." spinning={carregando}>
          <div className="titulo-verde">Dados do Produto</div>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-5">
                    <Field
                      name="nome"
                      label="Nome do Produto"
                      placeholder="Digite o nome do Produto"
                      defaultValue={produto ? produto.nome : undefined}
                      component={InputText}
                      required
                      validate={composeValidators(
                        required,
                        alphaNumericAndSingleSpaceBetweenCharacters,
                        noSpaceStartOrEnd
                      )}
                      toUppercaseActive
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      name="status"
                      label="Status"
                      placeholder="Selecione o Status"
                      component={Select}
                      defaultValue={
                        produto ? produto.status : statusProdutos[0].uuid
                      }
                      options={statusProdutos}
                      required
                      naoDesabilitarPrimeiraOpcao
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      name="data_cadastro"
                      label="Data do Cadastro"
                      defaultValue={
                        produto
                          ? produto.criado_em
                          : new Date().toLocaleDateString()
                      }
                      component={InputText}
                      required
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <Botao
                      texto="Salvar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      disabled={submitting}
                    />
                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={() => voltarParaProdutos()}
                    />
                  </div>
                </div>
              </form>
            )}
          />
        </Spin>
      </div>
    </div>
  );
};
