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
import TabelasGruposEMEI from "./components/Tabelas/TabelasGruposEMEI";
import TabelasGrupoCEMEI from "./components/Tabelas/TabelasGrupoCEMEI";
import TabelasGrupoEMEBS from "./components/Tabelas/TabelasGrupoEMEBS";
import TabelasGrupoEMEF from "./components/Tabelas/TabelasGrupoEMEF";
import TabelasGrupoCIEJA from "./components/Tabelas/TabelasGrupoCIEJA";
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

const URL_RETORNO = "/medicao-inicial/parametrizacao-financeira/";

export default () => {
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [editalSelecionado, setEditalSelecionado] = useState("");
  const [loteSelecionado, setLoteSelecionado] = useState("");
  const [faixasEtarias, setFaixasEtarias] = useState([]);
  const [tiposAlimentacao, setTiposAlimentacao] = useState([]);
  const [parametrizacao, setParametrizacao] =
    useState<ParametrizacaoFinanceiraPayload>(VALORES_INICIAIS);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [carregarTabelas, setCarregarTabelas] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uuidParametrizacao = searchParams.get("uuid");
  const uuidNovaParametrizacao = searchParams.get("nova_uuid");

  const onSubmit = async (values: ParametrizacaoFinanceiraPayload) => {
    try {
      const payload = formataPayload(values);
      if (!uuidParametrizacao && !uuidNovaParametrizacao) {
        await ParametrizacaoFinanceiraService.addParametrizacaoFinanceira(
          payload,
        );
        toastSuccess("Parametrização Financeira cadastrada com sucesso!");
        navigate(URL_RETORNO);
      } else {
        await ParametrizacaoFinanceiraService.editParametrizacaoFinanceira(
          uuidParametrizacao || uuidNovaParametrizacao,
          payload,
        );
        toastSuccess(
          `Parametrização Financeira ${uuidNovaParametrizacao ? "cadastrada" : "editada"} com sucesso!`,
        );
        navigate(URL_RETORNO);
      }
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.non_field_errors) {
        toastError(data.non_field_errors[0]);
      } else if (data) {
        toastError(
          `Não foi possível finalizar a ${
            uuidParametrizacao ? "edição" : "inclusão"
          } da parametrização. Verifique se todos os campos da tabela foram preenchidos`,
        );
      } else {
        toastError("Ocorreu um erro inesperado");
      }
    }
  };

  const onCancelar = async () => {
    try {
      if (uuidNovaParametrizacao)
        await ParametrizacaoFinanceiraService.deleteParametrizacaoFinanceira(
          uuidNovaParametrizacao,
        );
      navigate(-1);
    } catch {
      toastError("Ocorreu um erro inesperado ao cancelar a parametrização.");
    }
  };

  return (
    <>
      <div className="adicionar-parametrizacao card mt-4">
        <div className="card-body">
          <Form
            onSubmit={onSubmit}
            initialValues={parametrizacao}
            destroyOnUnregister
            render={({ form, handleSubmit, submitting }) => {
              const grupo = grupoSelecionado.toLowerCase();
              const tabelasCarregadas =
                carregarTabelas || uuidParametrizacao || uuidNovaParametrizacao;

              const TABELAS_POR_GRUPO: Record<string, React.ReactNode> = {
                "grupo 1": (
                  <TabelasGrupoCEI
                    form={form}
                    faixasEtarias={faixasEtarias}
                    grupoSelecionado={grupoSelecionado}
                  />
                ),
                "grupo 2": (
                  <TabelasGrupoCEMEI
                    form={form}
                    tiposAlimentacao={tiposAlimentacao}
                    faixasEtarias={faixasEtarias}
                    grupoSelecionado={grupoSelecionado}
                  />
                ),
                "grupo 3": (
                  <TabelasGruposEMEI
                    form={form}
                    tiposAlimentacao={tiposAlimentacao}
                    grupoSelecionado={grupoSelecionado}
                  />
                ),
                "grupo 4": (
                  <TabelasGrupoEMEF
                    form={form}
                    tiposAlimentacao={tiposAlimentacao}
                    grupoSelecionado={grupoSelecionado}
                  />
                ),
                "grupo 5": (
                  <TabelasGrupoEMEBS
                    form={form}
                    tiposAlimentacao={tiposAlimentacao}
                    grupoSelecionado={grupoSelecionado}
                  />
                ),
                "grupo 6": (
                  <TabelasGrupoCIEJA
                    form={form}
                    tiposAlimentacao={tiposAlimentacao}
                    grupoSelecionado={grupoSelecionado}
                  />
                ),
              };

              return (
                <form onSubmit={handleSubmit}>
                  <Filtros
                    setGrupoSelecionado={setGrupoSelecionado}
                    setEditalSelecionado={setEditalSelecionado}
                    setLoteSelecionado={setLoteSelecionado}
                    setFaixasEtarias={setFaixasEtarias}
                    setTiposAlimentacao={setTiposAlimentacao}
                    setParametrizacao={setParametrizacao}
                    setCarregarTabelas={setCarregarTabelas}
                    form={form}
                    uuidParametrizacao={
                      uuidParametrizacao || uuidNovaParametrizacao
                    }
                    ehCadastro
                  />

                  {tabelasCarregadas &&
                    Object.entries(TABELAS_POR_GRUPO).map(
                      ([key, componente]) =>
                        grupo.includes(key) && (
                          <React.Fragment key={key}>
                            {componente}
                          </React.Fragment>
                        ),
                    )}

                  {tabelasCarregadas && (
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
                  )}

                  <div className="d-flex justify-content-end gap-3 mt-5">
                    <Botao
                      dataTestId="botao-cancelar"
                      texto="Cancelar"
                      onClick={() => setShowModalCancelar(true)}
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
              );
            }}
          />
        </div>
      </div>

      <ModalCancelar
        showModal={showModalCancelar}
        setShowModal={setShowModalCancelar}
        uuidParametrizacao={uuidParametrizacao}
        onCancelar={onCancelar}
      />
    </>
  );
};
