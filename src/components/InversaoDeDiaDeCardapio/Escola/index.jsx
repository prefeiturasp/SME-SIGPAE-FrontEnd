import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import CKEditorField from "src/components/Shareable/CKEditorField";
import ModalDataPrioritaria from "src/components/Shareable/ModalDataPrioritaria";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { STATUS_DRE_A_VALIDAR } from "src/configs/constants";
import {
  composeValidators,
  peloMenosUmCaractere,
  requiredMultiselect,
  textAreaRequired,
} from "src/helpers/fieldValidators";
import { formatarParaMultiselect, getError } from "src/helpers/utilities";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import {
  atualizarInversaoDeDiaDeCardapio,
  criarInversaoDeDiaDeCardapio,
  getInversoesDeDiaDeCardapio,
  inicioPedido,
  removerInversaoDeDiaDeCardapio,
} from "src/services/inversaoDeDiaDeCardapio.service";
import { DatasReferenciaAplicarEm } from "./components/DatasReferenciaAplicarEm";
import { Rascunhos } from "./components/Rascunhos";
import "./style.scss";

export const InversaoDeDiaDeCardapio = ({ ...props }) => {
  const { meusDados, proximosCincoDiasUteis, proximosDoisDiasUteis } = props;

  const [rascunhos, setRascunhos] = useState();
  const [erroAPI, setErroAPI] = useState("");
  const [showModalDataPrioritaria, setShowModalDataPrioritaria] =
    useState(false);
  const [adicionarOutroDia, setAdicionarOutroDia] = useState(false);
  const [tiposAlimentacao, setTiposAlimentacao] = useState();

  const removerRascunho = async (id_externo, uuid, form) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await removerInversaoDeDiaDeCardapio(uuid);
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
        refresh(form);
      } else {
        toastError(getError(response.data));
      }
    }
  };

  const refresh = (form) => {
    getRascunhosAsync();
    form.reset();
    setAdicionarOutroDia(false);
  };

  const getRascunhosAsync = async () => {
    const response = await getInversoesDeDiaDeCardapio();
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      setErroAPI("Erro ao carregar rascunhos. Tente novamente mais tarde.");
    }
  };

  const retornaTiposAlimentacaoSemRepeticao = (vinculos) => {
    let tiposAlimentacao = [];
    for (let periodo in vinculos) {
      let listaTiposAlimentacao = vinculos[periodo].tipos_alimentacao;
      for (let tipoAlimentacao of listaTiposAlimentacao) {
        if (
          tipoAlimentacao.nome !== "Lanche Emergencial" &&
          !tiposAlimentacao.some((t) => t.nome === tipoAlimentacao.nome)
        ) {
          tiposAlimentacao.push(tipoAlimentacao);
        }
      }
    }
    setTiposAlimentacao(formatarParaMultiselect(tiposAlimentacao));
  };

  const getTiposAlimentacaoAsync = async () => {
    const escola_uuid = meusDados.vinculo_atual.instituicao.uuid;
    const response = await getVinculosTipoAlimentacaoPorEscola(escola_uuid);
    if (response.status === HTTP_STATUS.OK) {
      retornaTiposAlimentacaoSemRepeticao(response.data.results);
    } else {
      setErroAPI("Erro ao carregar vínculos de tipo de alimentação.");
    }
  };

  const carregarRascunho = (solicitacao, form) => {
    form.change("uuid", solicitacao.uuid);
    form.change("id_externo", solicitacao.id_externo);
    form.change(
      "tipos_alimentacao",
      solicitacao.tipos_alimentacao.map((ta) => ta.uuid)
    );
    form.change("data_de", solicitacao.data_de);
    form.change("data_para", solicitacao.data_para);
    if (solicitacao.alunos_da_cemei === "Todos") {
      form.change("alunos_da_cemei", ["CEI", "EMEI"]);
    } else {
      form.change("alunos_da_cemei", [solicitacao.alunos_da_cemei]);
    }
    if (solicitacao.data_de_inversao_2) {
      setAdicionarOutroDia(true);
      form.change("data_de_2", solicitacao.data_de_inversao_2);
      form.change("data_para_2", solicitacao.data_para_inversao_2);
      if (solicitacao.alunos_da_cemei_2 === "Todos") {
        form.change("alunos_da_cemei_2", ["CEI", "EMEI"]);
      } else {
        form.change("alunos_da_cemei_2", [solicitacao.alunos_da_cemei_2]);
      }
    }
    form.change("motivo", solicitacao.motivo);
    form.change("observacao", solicitacao.observacao);
  };

  const iniciarPedido = async (uuid, form) => {
    const response = await inicioPedido(uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Inversão de dia de Cardápio enviada com sucesso!");
      refresh(form);
    } else {
      toastError(getError(response.data));
    }
  };

  const prepararAlunosCemei = (alunos_da_cemei) => {
    if (!alunos_da_cemei) return "";
    if (alunos_da_cemei.length === 2) {
      return "Todos";
    } else {
      return alunos_da_cemei[0];
    }
  };

  const onSubmit = async (values, form) => {
    values["alunos_da_cemei"] = prepararAlunosCemei(values["alunos_da_cemei"]);
    values["alunos_da_cemei_2"] = prepararAlunosCemei(
      values["alunos_da_cemei_2"]
    );
    values.escola = meusDados.vinculo_atual.instituicao.uuid;
    if (!values.uuid) {
      const response = await criarInversaoDeDiaDeCardapio(values);
      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess("Inversão de dia de Cardápio salvo com sucesso!");
          refresh(form);
        }
      } else {
        toastError(getError(response.data));
      }
    } else {
      const response = await atualizarInversaoDeDiaDeCardapio(
        values.uuid,
        values
      );
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, form);
        } else {
          toastSuccess("Inversão de dia de Cardápio atualizado com sucesso!");
          refresh(form);
        }
      } else {
        toastError(getError(response.data));
      }
    }
  };

  useEffect(() => {
    getRascunhosAsync();
    getTiposAlimentacaoAsync();
  }, []);

  return (
    <div className="formulario-inversao-dia-cardapio">
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && tiposAlimentacao && (
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, form, values }) => (
            <form onSubmit={handleSubmit}>
              <CardMatriculados
                numeroAlunos={
                  meusDados.vinculo_atual.instituicao.quantidade_alunos || 0
                }
                meusDados={meusDados}
              />
              {rascunhos?.length > 0 && (
                <div className="mt-3">
                  <span className="page-title">Rascunhos</span>
                  <Rascunhos
                    rascunhos={rascunhos}
                    removerRascunho={removerRascunho}
                    carregarRascunho={carregarRascunho}
                    form={form}
                  />
                </div>
              )}
              <div className="mt-2 page-title">
                {values.uuid
                  ? `Solicitação # ${values.id_externo}`
                  : "Nova Solicitação"}
              </div>
              <div className="card inversao-dia-cardapio border rounded mt-2">
                <div className="card-body">
                  <label className="card-title fw-bold">
                    Descrição da Inversão
                  </label>
                  <div className="row">
                    <div className="col-12">
                      <Field
                        label="Tipos de Alimentação"
                        component={MultiselectRaw}
                        dataTestId={`select-tipos-alimentacao`}
                        required
                        validate={requiredMultiselect}
                        name="tipos_alimentacao"
                        placeholder="Selecione os tipos de alimentação"
                        options={tiposAlimentacao}
                        selected={values.tipos_alimentacao || []}
                        onSelectedChanged={(values_) => {
                          form.change(
                            "tipos_alimentacao",
                            values_.map((value_) => value_.value)
                          );
                        }}
                      />
                    </div>
                  </div>
                  <DatasReferenciaAplicarEm
                    name_data_de="data_de"
                    name_data_para="data_para"
                    name_alunos="alunos_da_cemei"
                    proximosDoisDiasUteis={proximosDoisDiasUteis}
                    proximosCincoDiasUteis={proximosCincoDiasUteis}
                    setShowModalDataPrioritaria={setShowModalDataPrioritaria}
                    form={form}
                    setAdicionarOutroDia={setAdicionarOutroDia}
                  />
                  {adicionarOutroDia && (
                    <DatasReferenciaAplicarEm
                      name_data_de="data_de_2"
                      name_data_para="data_para_2"
                      name_alunos="alunos_da_cemei_2"
                      proximosDoisDiasUteis={proximosDoisDiasUteis}
                      proximosCincoDiasUteis={proximosCincoDiasUteis}
                      setShowModalDataPrioritaria={setShowModalDataPrioritaria}
                      form={form}
                      setAdicionarOutroDia={setAdicionarOutroDia}
                      pode_remover={true}
                    />
                  )}
                  {!adicionarOutroDia && (
                    <div className="row">
                      <div className="col-5">
                        <Botao
                          texto="Adicionar Dia"
                          titulo="adicionar_dia"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="mt-3 mb-3"
                          onClick={() => setAdicionarOutroDia(true)}
                        />
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-12">
                      <Field
                        component={CKEditorField}
                        label="Motivo"
                        name="motivo"
                        required
                        validate={composeValidators(
                          textAreaRequired,
                          peloMenosUmCaractere
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-12 mt-2 pb-5">
                      <Field
                        component={CKEditorField}
                        label="Observação"
                        name="observacao"
                      />
                    </div>
                  </div>
                  <div className="row text-end mt-4">
                    <div className="col-12 mt-2">
                      <Botao
                        texto="Cancelar"
                        onClick={() => form.reset()}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        type={BUTTON_TYPE.SUBMIT}
                      />
                      <Botao
                        texto={values.uuid ? "Atualizar" : "Salvar"}
                        className="ms-3"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        type={BUTTON_TYPE.SUBMIT}
                      />
                      <Botao
                        texto="Enviar"
                        onClick={() => {
                          values["status"] = STATUS_DRE_A_VALIDAR;
                          handleSubmit((values) => onSubmit(values, form));
                        }}
                        style={BUTTON_STYLE.GREEN}
                        type={BUTTON_TYPE.BUTTON}
                        className="ms-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <ModalDataPrioritaria
                showModal={showModalDataPrioritaria}
                closeModal={() => setShowModalDataPrioritaria(false)}
              />
            </form>
          )}
        </Form>
      )}
    </div>
  );
};
