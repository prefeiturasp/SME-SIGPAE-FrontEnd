import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Field, Form } from "react-final-form";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import Filtros from "./components/Filtros";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { ParametrizacaoFinanceiraPayload } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import TabelasGrupoCEI from "./components/Tabelas/TabelasGrupoCEI";
import ModalCancelar from "./components/ModalCancelar";
import ModalSalvar from "./components/ModalSalvar";
import { formataPayload } from "./helpers";

const VALORES_INICIAIS: ParametrizacaoFinanceiraPayload = {
  edital: null,
  lote: null,
  grupo_unidade_escolar: null,
  legenda:
    "Fonte: Relatório de Medição Inicial do Serviço de Alimentação e Nutrição Escolar realizada pela direção das unidades educacionais, conforme disposto no edital Pregão XXX/XXX e nas Portarias Intersecretariais SMG/SME n° 005/2006 e 001/2008.",
  data_inicial: null,
  data_final: null,
};

export default () => {
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [editalSelecionado, setEditalSelecionado] = useState("");
  const [loteSelecionado, setLoteSelecionado] = useState("");
  const [faixasEtarias, setFaixasEtarias] = useState([]);
  const [parametrizacao, setParametrizacao] = useState(VALORES_INICIAIS);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [carregarTabelas, setCarregarTabelas] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const uuidParametrizacao = searchParams.get("uuid");

  const onSubmit = async (values: ParametrizacaoFinanceiraPayload) => {
    try {
      const payload = formataPayload(values);
      if (!uuidParametrizacao) {
        await ParametrizacaoFinanceiraService.addParametrizacaoFinanceira(
          payload,
        );
        toastSuccess("Parametrização Financeira salva com sucesso!");
      } else {
        await ParametrizacaoFinanceiraService.editParametrizacaoFinanceira(
          uuidParametrizacao,
          payload,
        );
        toastSuccess("Parametrização Financeira editada com sucesso!");
      }
      navigate(-1);
    } catch (err) {
      const data = err.response.data;
      if (data) {
        if (data.non_field_errors) {
          toastError(data.non_field_errors[0]);
        } else {
          toastError(
            `Não foi possível finalizar a ${uuidParametrizacao ? "edição" : "inclusão"} da parametrização. Verifique se todos os campos da tabela foram preenchidos`,
          );
        }
      } else {
        toastError("Ocorreu um erro inesperado");
      }
    }
  };

  const exibeTabelasCEI =
    faixasEtarias.length && grupoSelecionado.toLowerCase().includes("grupo 1");

  const exibeTabelasEMEFeEMEI = ["grupo 3", "grupo 5"].some((palavra) =>
    grupoSelecionado.toLowerCase().includes(palavra),
  );

  const exibeTabelasCEMEI =
    faixasEtarias.length && grupoSelecionado.toLowerCase().includes("grupo 2");

  const exibeTabelasEMEBS = grupoSelecionado.toLowerCase().includes("grupo 4");

  return (
    <>
      <div className="adicionar-parametrizacao card mt-4">
        <div className="card-body">
          <Form
            onSubmit={(values: ParametrizacaoFinanceiraPayload) =>
              onSubmit(values)
            }
            initialValues={parametrizacao}
            destroyOnUnregister={true}
            render={({ form, handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
                <Filtros
                  setGrupoSelecionado={setGrupoSelecionado}
                  setEditalSelecionado={setEditalSelecionado}
                  setLoteSelecionado={setLoteSelecionado}
                  setFaixasEtarias={setFaixasEtarias}
                  setParametrizacao={setParametrizacao}
                  setCarregarTabelas={setCarregarTabelas}
                  form={form}
                  uuidParametrizacao={uuidParametrizacao}
                  ehCadastro
                />
                {exibeTabelasCEI && (carregarTabelas || uuidParametrizacao) ? (
                  <TabelasGrupoCEI
                    form={form}
                    faixasEtarias={faixasEtarias}
                    grupoSelecionado={grupoSelecionado}
                  />
                ) : null}
                {(exibeTabelasEMEFeEMEI ||
                  exibeTabelasCEI ||
                  exibeTabelasCEMEI ||
                  exibeTabelasEMEBS) &&
                (carregarTabelas || uuidParametrizacao) ? (
                  <div className="row mt-5">
                    <div className="col">
                      <Field
                        component={TextArea}
                        label="Legenda"
                        name="legenda"
                        maxLength={1500}
                        height="150"
                      />
                    </div>
                  </div>
                ) : null}
                <div className="d-flex justify-content-end gap-3 mt-5">
                  <Botao
                    dataTestId="botao-cancelar"
                    texto="Cancelar"
                    onClick={() => {
                      uuidParametrizacao
                        ? navigate(-1)
                        : setShowModalCancelar(true);
                    }}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    type={BUTTON_TYPE.BUTTON}
                  />
                  <Botao
                    dataTestId="botao-salvar"
                    texto="Salvar"
                    style={BUTTON_STYLE.GREEN}
                    type={BUTTON_TYPE.BUTTON}
                    disabled={submitting}
                    onClick={() => setShowModalSalvar(true)}
                  />
                </div>
                <ModalSalvar
                  showModal={showModalSalvar}
                  setShowModal={setShowModalSalvar}
                  titulo={`${editalSelecionado} - ${loteSelecionado} - ${grupoSelecionado}`}
                  onSubmit={() => handleSubmit()}
                />
              </form>
            )}
          />
        </div>
      </div>
      <ModalCancelar
        showModal={showModalCancelar}
        setShowModal={setShowModalCancelar}
      />
    </>
  );
};
