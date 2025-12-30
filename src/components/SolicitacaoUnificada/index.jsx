import StatefulMultiSelect from "@khanacademy/react-multi-select";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CardMatriculados from "src/components/Shareable/CardMatriculados";
import CKEditorField from "src/components/Shareable/CKEditorField";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import ModalDataPrioritaria from "src/components/Shareable/ModalDataPrioritaria";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { maxValue, required } from "src/helpers/fieldValidators";
import {
  checaSeDataEstaEntre2e5DiasUteis,
  composeValidators,
  fimDoCalendario,
  getError,
} from "src/helpers/utilities";
import {
  atualizarSolicitacaoUnificada,
  criarSolicitacaoUnificada,
  inicioPedido,
  removerSolicitacaoUnificada,
  solicitacoesUnificadasSalvas,
} from "src/services/solicitacaoUnificada.service";
import { formatarSubmissao } from "./helper";
import { Rascunhos } from "./Rascunhos";
import "./style.scss";

const SolicitacaoUnificada = ({
  dadosUsuario,
  proximosCincoDiasUteis,
  proximosDoisDiasUteis,
  escolas,
  kits,
}) => {
  const [rascunhosSalvos, setRascunhosSalvos] = useState([]);
  const [unidadesEscolaresSelecionadas, setUnidadesEscolaresSelecionadas] =
    useState([]);
  const [totalKits, setTotalKits] = useState(0);
  const [opcoes, setOpcoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submeteu, setSubmeteu] = useState(false);

  async function fetchData() {
    await solicitacoesUnificadasSalvas().then(
      (res) => {
        setRascunhosSalvos(res.results);
      },
      function (error) {
        toastError(
          `Erro ao carregar as inclusões salvas: ${getError(error.data)}`,
        );
      },
    );
  }

  useEffect(() => {
    fetchData();
    if (escolas) {
      const opcoesEscolas = escolas.map((escola) => {
        let label = `${escola.codigo_eol} - ${
          escola.nome.length > 28 ? escola.nome.slice(0, 28) : escola.nome
        }`;
        let dado = escola;
        dado["quantidade_kits"] = "";
        dado["kits_selecionados"] = [];
        return { label: label, uuid: escola.uuid, value: dado };
      });
      setOpcoes(opcoesEscolas);
    }
  }, [escolas]);

  const carregarRascunho = (solicitacaoUnificada, form) => {
    form.change("data", solicitacaoUnificada.data);
    form.change("local", solicitacaoUnificada.local);
    form.change("evento", solicitacaoUnificada.evento);
    form.change("uuid", solicitacaoUnificada.uuid);
    form.change(
      "descricao",
      solicitacaoUnificada.solicitacao_kit_lanche.descricao,
    );
    let escolas_quantidades = opcoes
      .filter((opcao) =>
        solicitacaoUnificada.escolas_quantidades.find(
          (eq) => eq.escola.uuid === opcao.uuid,
        ),
      )
      .map((opcao) => opcao.value);
    setUnidadesEscolaresSelecionadas(escolas_quantidades);
    escolas_quantidades.forEach((eq) => {
      const eq_back = solicitacaoUnificada.escolas_quantidades.find(
        (equ) => equ.escola.uuid === eq.uuid,
      );
      eq.nmr_alunos = eq_back.quantidade_alunos;
      eq.quantidade_kits = (eq_back.tempo_passeio + 1).toString();
      eq.kits_selecionados = eq_back.kits.map((kit) => kit.uuid);
    });
    form.change("unidades_escolares", escolas_quantidades);
  };

  const filterOptions = (options, filter) => {
    if (!filter) {
      return options;
    }
    const re = new RegExp(filter, "i");
    return options.filter(({ label }) => label && label.match(re));
  };

  const resetStates = () => {
    setUnidadesEscolaresSelecionadas([]);
    setTotalKits(0);
    setSubmeteu(false);
  };

  const onSubmit = async (formValues, form) => {
    if (unidadesEscolaresSelecionadas.length === 0) {
      toastError("Selecione ao menos uma unidade escolar");
    } else {
      setSubmeteu(true);
      if (!formValues.uuid) {
        await criarSolicitacaoUnificada(
          JSON.stringify(formatarSubmissao(formValues, dadosUsuario)),
        ).then(
          (res) => {
            if (res.status === HTTP_STATUS.CREATED) {
              if (formValues.status === "DRE_A_VALIDAR") {
                iniciarPedido(res.data.uuid);
                setTimeout(() => {
                  form.restart();
                  resetStates();
                });
              } else {
                toastSuccess("Solicitação Unificada salva com sucesso!");
                setTimeout(() => {
                  form.restart();
                  resetStates();
                });
                fetchData();
              }
            } else {
              toastError(
                `Houve um erro ao salvar a solicitação unificada: ${getError(
                  res.data,
                )}`,
              );
              setSubmeteu(false);
            }
          },
          function () {
            toastError("Houve um erro ao salvar a solicitação unificada");
          },
        );
      } else {
        atualizarSolicitacaoUnificada(
          formValues.uuid,
          JSON.stringify(formatarSubmissao(formValues, dadosUsuario)),
        ).then(
          (res) => {
            if (res.status === HTTP_STATUS.OK) {
              if (formValues.status === "DRE_A_VALIDAR") {
                iniciarPedido(res.data.uuid);
                setTimeout(() => {
                  form.restart();
                  resetStates();
                });
                fetchData();
              } else {
                toastSuccess("Solicitação Unificada atualizada com sucesso!");
                setTimeout(() => {
                  form.restart();
                  resetStates();
                });
                fetchData();
              }
            } else {
              toastError(
                `Houve um erro ao salvar a solicitação unificada: ${getError(
                  res.data,
                )}`,
              );
              setSubmeteu(false);
            }
          },
          function () {
            toastError("Houve um erro ao atualizar a solicitação unificada");
          },
        );
      }
    }
  };

  const removerRascunho = (id_externo, uuid) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      removerSolicitacaoUnificada(uuid).then(
        (res) => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
            fetchData();
          } else {
            toastError(
              `Houve um erro ao excluir o rascunho: ${getError(res.data)}`,
            );
          }
        },
        function (error) {
          toastError(
            `Houve um erro ao excluir o rascunho: ${getError(error.data)}`,
          );
        },
      );
    }
  };

  const iniciarPedido = (uuid) => {
    inicioPedido(uuid).then(
      (res) => {
        if (res.status === HTTP_STATUS.OK) {
          toastSuccess("Solicitação Unificada enviada com sucesso!");
          fetchData();
        } else if (res.status === HTTP_STATUS.BAD_REQUEST) {
          toastError(
            `Houve um erro ao salvar a solicitação unificada: ${getError(
              res.data,
            )}`,
          );
        }
      },
      function () {
        toastError("Houve um erro ao enviar a solicitação unificada");
      },
    );
  };

  const removerEscola = (ue, form, values) => {
    let resultado = values.unidades_escolares.filter((v) => v.uuid !== ue.uuid);
    let resultadoLabels = unidadesEscolaresSelecionadas.filter(
      (v) => v.uuid !== ue.uuid,
    );
    let total = 0;
    let listaQuantidadeKits = resultado.filter(
      (v) =>
        !["", undefined].includes(v.quantidade_kits) &&
        !["", undefined].includes(v.nmr_alunos),
    );
    if (listaQuantidadeKits.length !== 0) {
      listaQuantidadeKits = listaQuantidadeKits.map(
        (v) => parseInt(v.quantidade_kits) * parseInt(v.nmr_alunos),
      );
      for (let index = 0; index < listaQuantidadeKits.length; index++) {
        total = total + listaQuantidadeKits[index];
      }
    }
    setTotalKits(total);
    setUnidadesEscolaresSelecionadas(resultadoLabels);
    form.change("unidades_escolares", resultado);
  };

  const renderizarLabelUnidadesEscolares = (selected, options) => {
    if (selected.length === 0) {
      return "Selecione";
    }
    if (selected.length === options.length) {
      return "Todos as unidades escolares selecionados";
    }
    if (selected.length === 1) {
      return `${selected[0].nome}`;
    }
    if (selected.length > 1) {
      return `${selected[0].nome}; +${selected.length - 1}`;
    }
  };

  const validaDiasUteis = (value) => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis,
      )
    ) {
      setShowModal(true);
    }
  };

  const validaNdeAlunos = (ue) => {
    if (ue.nome.includes("CEU GESTAO")) {
      return required;
    } else {
      return composeValidators(required, maxValue(ue.quantidade_alunos));
    }
  };

  return (
    <>
      <CardMatriculados
        meusDados={dadosUsuario}
        numeroAlunos={
          dadosUsuario
            ? dadosUsuario.vinculo_atual.instituicao.quantidade_alunos
            : 0
        }
      />
      <div className="mt-3">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, values, form }) => (
            <form onSubmit={handleSubmit}>
              {rascunhosSalvos && rascunhosSalvos.length > 0 && (
                <div className="mt-3">
                  <span className="page-title">Rascunhos</span>
                  <Rascunhos
                    schoolsLoaded={escolas.length > 0}
                    unifiedSolicitationList={rascunhosSalvos}
                    OnDeleteButtonClicked={removerRascunho}
                    form={form}
                    OnEditButtonClicked={carregarRascunho}
                  />
                </div>
              )}
              <div className="mt-3">
                <span className="page-title">Nova Solicitação</span>
              </div>
              <div className="card mt-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-2 pb-3">
                      <Field
                        component={InputComData}
                        name="data"
                        minDate={proximosDoisDiasUteis}
                        maxDate={fimDoCalendario()}
                        label="Dia"
                        className="form-control"
                        validate={required}
                        inputOnChange={(value) => validaDiasUteis(value)}
                        required
                      />
                    </div>
                    <div className="col-5 pb-3">
                      <Field
                        component={InputText}
                        label="Local do passeio"
                        placeholder="Insira o local do passeio"
                        name="local"
                        className="form-control"
                        required
                        validate={required}
                      />
                    </div>
                    <div className="col-5 pb-3 input undefined">
                      <span className="required-asterisk">*</span>
                      <label
                        htmlFor="unidades_escolares"
                        className="col-form-label"
                      >
                        Unidades Escolares
                      </label>
                      <Field
                        component={StatefulMultiSelect}
                        name="unidades_escolares"
                        filterOptions={filterOptions}
                        options={opcoes}
                        className="form-control"
                        valueRenderer={renderizarLabelUnidadesEscolares}
                        selected={unidadesEscolaresSelecionadas}
                        onSelectedChanged={(value) => {
                          let resultado = value.map((v) => {
                            if (values.unidades_escolares) {
                              let elementFromForm =
                                values.unidades_escolares.find(
                                  (e) => e.uuid === v.uuid,
                                );
                              if (elementFromForm) {
                                return elementFromForm;
                              }
                            }
                            return v;
                          });
                          let total = 0;
                          let listaQuantidadeKits = resultado.filter(
                            (v) =>
                              !["", undefined].includes(v.quantidade_kits) &&
                              !["", undefined].includes(v.nmr_alunos),
                          );
                          if (listaQuantidadeKits.length !== 0) {
                            listaQuantidadeKits = listaQuantidadeKits.map(
                              (v) =>
                                parseInt(v.quantidade_kits) *
                                parseInt(v.nmr_alunos),
                            );
                            for (
                              let index = 0;
                              index < listaQuantidadeKits.length;
                              index++
                            ) {
                              total = total + listaQuantidadeKits[index];
                            }
                          }
                          setTotalKits(total);
                          form.change("unidades_escolares", resultado);
                          setUnidadesEscolaresSelecionadas(value);
                        }}
                        overrideStrings={{
                          search: "Busca",
                          selectSomeItems: "Selecione",
                          allItemsAreSelected:
                            "Todas as escolas estão selecionadas",
                          selectAll: "Todas",
                        }}
                      />
                    </div>
                    <div className="col-12">
                      <Field
                        component={InputText}
                        label="Evento/Atividade"
                        name="evento"
                        required
                        validate={required}
                      />
                    </div>
                  </div>

                  <hr />

                  {values.unidades_escolares &&
                    values.unidades_escolares.length > 0 && (
                      <div className="row mt-3">
                        {values.unidades_escolares.map((ue, idx) => {
                          return (
                            <div
                              className="col-12 lista-escolas"
                              key={ue.codigo_eol}
                            >
                              <div className="card pb-0">
                                <div className="card-body">
                                  <div className="row">
                                    <div className="col-6">
                                      <p className="escola">
                                        {ue.codigo_eol} - {ue.nome}
                                      </p>
                                      <p className="local">{values.local}</p>
                                    </div>
                                    <div className="col-4">
                                      <p className="float-end mt-3">
                                        {values.data}
                                      </p>
                                    </div>
                                    <div className="col-1">
                                      <Botao
                                        type={BUTTON_TYPE.BUTTON}
                                        onClick={() =>
                                          removerEscola(ue, form, values)
                                        }
                                        style={BUTTON_STYLE.RED_OUTLINE}
                                        icon={BUTTON_ICON.TRASH}
                                        className="botao-remover-escola mt-1"
                                      />
                                    </div>
                                    <div className="col-1">
                                      <Botao
                                        type={BUTTON_TYPE.BUTTON}
                                        onClick={() => {
                                          let e = document.getElementById(
                                            ue.uuid,
                                          );
                                          let i = document.getElementById(
                                            `${ue.uuid}-angle`,
                                          );
                                          if (e.classList.contains("d-none")) {
                                            e.classList.remove("d-none");
                                          } else {
                                            e.classList.add("d-none");
                                          }

                                          if (
                                            i.classList.contains(
                                              "fa-angle-down",
                                            )
                                          ) {
                                            i.classList.remove("fa-angle-down");
                                            i.classList.add("fa-angle-up");
                                          } else {
                                            i.classList.remove("fa-angle-up");
                                            i.classList.add("fa-angle-down");
                                          }
                                        }}
                                        iconId={`${ue.uuid}-angle`}
                                        style={BUTTON_STYLE.GRAY_OUTLINE}
                                        icon={BUTTON_ICON.ANGLE_DOWN}
                                        className="botao-remover-escola mt-1"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className="row mt-3 wrapper-solicitacao d-none p-3"
                                    id={ue.uuid}
                                  >
                                    <div className="col-5">
                                      <label
                                        htmlFor={`unidades_escolares[${idx}].nmr_alunos`}
                                        className="col-form-label"
                                      >
                                        <span className="required-asterisk">
                                          *
                                        </span>
                                        Nº de alunos por Unidade Educacional
                                      </label>
                                      <Field
                                        component={InputText}
                                        type="number"
                                        min={0}
                                        max={
                                          ue.nome.includes("CEU GESTAO")
                                            ? 32767
                                            : ue.quantidade_alunos
                                        }
                                        step="1"
                                        placeholder="Quantidade de alunos"
                                        name={`unidades_escolares[${idx}].nmr_alunos`}
                                        className="form-control"
                                        onChange={(event) => {
                                          form.change(
                                            `unidades_escolares[${idx}].nmr_alunos`,
                                            event.target.value,
                                          );
                                          let total = 0;
                                          let listaQuantidadeKits =
                                            values.unidades_escolares.filter(
                                              (e) =>
                                                e.uuid !== ue.uuid &&
                                                !["", undefined].includes(
                                                  e.quantidade_kits,
                                                ) &&
                                                !["", undefined].includes(
                                                  e.nmr_alunos,
                                                ),
                                            );
                                          if (
                                            listaQuantidadeKits.length !== 0
                                          ) {
                                            listaQuantidadeKits =
                                              listaQuantidadeKits.map(
                                                (e) =>
                                                  parseInt(e.quantidade_kits) *
                                                  parseInt(e.nmr_alunos),
                                              );
                                            for (
                                              let i = 0;
                                              i < listaQuantidadeKits.length;
                                              i++
                                            ) {
                                              total =
                                                total + listaQuantidadeKits[i];
                                            }
                                          }
                                          if (
                                            !["", undefined].includes(
                                              event.target.value,
                                            ) &&
                                            !["", undefined].includes(
                                              ue.quantidade_kits,
                                            )
                                          ) {
                                            total =
                                              total +
                                              parseInt(event.target.value) *
                                                parseInt(ue.quantidade_kits);
                                          }
                                          setTotalKits(total);
                                        }}
                                        required
                                        validate={validaNdeAlunos(ue)}
                                      />
                                    </div>
                                    <div className="col-8" />
                                    <div className="col-12 mt-3">
                                      <div className="label">
                                        <span className="required-asterisk">
                                          *{" "}
                                        </span>
                                        Tempo previsto do passeio
                                      </div>
                                      <div className="row mt-3">
                                        <div className="col-4">
                                          <label className="container-radio">
                                            até 4 horas (1 Kit)
                                            <Field
                                              component={"input"}
                                              type="radio"
                                              required
                                              validate={required}
                                              value="1"
                                              name={`unidades_escolares[${idx}].quantidade_kits`}
                                              onChange={() => {
                                                let total = 0;
                                                let listaQuantidadeKits =
                                                  values.unidades_escolares.filter(
                                                    (e) =>
                                                      e.uuid !== ue.uuid &&
                                                      !["", undefined].includes(
                                                        e.quantidade_kits,
                                                      ) &&
                                                      !["", undefined].includes(
                                                        e.nmr_alunos,
                                                      ),
                                                  );
                                                if (
                                                  listaQuantidadeKits.length !==
                                                  0
                                                ) {
                                                  listaQuantidadeKits =
                                                    listaQuantidadeKits.map(
                                                      (e) =>
                                                        parseInt(
                                                          e.quantidade_kits,
                                                        ) *
                                                        parseInt(e.nmr_alunos),
                                                    );
                                                  for (
                                                    let i = 0;
                                                    i <
                                                    listaQuantidadeKits.length;
                                                    i++
                                                  ) {
                                                    total =
                                                      total +
                                                      listaQuantidadeKits[i];
                                                  }
                                                }
                                                form.change(
                                                  `unidades_escolares[${idx}].kits_selecionados`,
                                                  [],
                                                );
                                                form.change(
                                                  `unidades_escolares[${idx}].quantidade_kits`,
                                                  "1",
                                                );
                                                if (
                                                  !["", undefined].includes(
                                                    ue.nmr_alunos,
                                                  )
                                                ) {
                                                  total =
                                                    total +
                                                    parseInt(ue.nmr_alunos);
                                                }
                                                setTotalKits(total);
                                              }}
                                            />
                                            <span className="checkmark" />
                                          </label>
                                        </div>
                                        <div className="col-4">
                                          <label className="container-radio">
                                            de 5 á 7 horas (2 Kits)
                                            <Field
                                              component={"input"}
                                              type="radio"
                                              value="2"
                                              required
                                              validate={required}
                                              name={`unidades_escolares[${idx}].quantidade_kits`}
                                              onChange={() => {
                                                let total = 0;
                                                let listaQuantidadeKits =
                                                  values.unidades_escolares.filter(
                                                    (e) =>
                                                      e.uuid !== ue.uuid &&
                                                      !["", undefined].includes(
                                                        e.quantidade_kits,
                                                      ) &&
                                                      !["", undefined].includes(
                                                        e.nmr_alunos,
                                                      ),
                                                  );
                                                if (
                                                  listaQuantidadeKits.length !==
                                                  0
                                                ) {
                                                  listaQuantidadeKits =
                                                    listaQuantidadeKits.map(
                                                      (e) =>
                                                        parseInt(
                                                          e.quantidade_kits,
                                                        ) *
                                                        parseInt(e.nmr_alunos),
                                                    );
                                                  for (
                                                    let i = 0;
                                                    i <
                                                    listaQuantidadeKits.length;
                                                    i++
                                                  ) {
                                                    total =
                                                      total +
                                                      listaQuantidadeKits[i];
                                                  }
                                                }
                                                form.change(
                                                  `unidades_escolares[${idx}].kits_selecionados`,
                                                  [],
                                                );
                                                form.change(
                                                  `unidades_escolares[${idx}].quantidade_kits`,
                                                  "2",
                                                );
                                                if (
                                                  !["", undefined].includes(
                                                    ue.nmr_alunos,
                                                  )
                                                ) {
                                                  total =
                                                    total +
                                                    parseInt(ue.nmr_alunos) * 2;
                                                }
                                                setTotalKits(total);
                                              }}
                                            />
                                            <span className="checkmark" />
                                          </label>
                                        </div>
                                        <div className="col-4">
                                          <label className="container-radio">
                                            8 horas ou mais (3 Kits)
                                            <Field
                                              component={"input"}
                                              type="radio"
                                              value="3"
                                              required
                                              validate={required}
                                              name={`unidades_escolares[${idx}].quantidade_kits`}
                                              onChange={() => {
                                                let total = 0;
                                                let listaQuantidadeKits =
                                                  values.unidades_escolares.filter(
                                                    (e) =>
                                                      e.uuid !== ue.uuid &&
                                                      !["", undefined].includes(
                                                        e.quantidade_kits,
                                                      ) &&
                                                      !["", undefined].includes(
                                                        e.nmr_alunos,
                                                      ),
                                                  );
                                                if (
                                                  listaQuantidadeKits.length !==
                                                  0
                                                ) {
                                                  listaQuantidadeKits =
                                                    listaQuantidadeKits.map(
                                                      (e) =>
                                                        parseInt(
                                                          e.quantidade_kits,
                                                        ) *
                                                        parseInt(e.nmr_alunos),
                                                    );
                                                  for (
                                                    let i = 0;
                                                    i <
                                                    listaQuantidadeKits.length;
                                                    i++
                                                  ) {
                                                    total =
                                                      total +
                                                      listaQuantidadeKits[i];
                                                  }
                                                }
                                                form.change(
                                                  `unidades_escolares[${idx}].kits_selecionados`,
                                                  [],
                                                );
                                                form.change(
                                                  `unidades_escolares[${idx}].quantidade_kits`,
                                                  "3",
                                                );
                                                if (
                                                  !["", undefined].includes(
                                                    ue.nmr_alunos,
                                                  )
                                                ) {
                                                  total =
                                                    total +
                                                    parseInt(ue.nmr_alunos) * 3;
                                                }
                                                setTotalKits(total);
                                              }}
                                            />
                                            <span className="checkmark" />
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                      <div className="label">
                                        <span className="required-asterisk">
                                          *{" "}
                                        </span>
                                        Selecione a opção desejada
                                      </div>
                                      <div className="row mt-3">
                                        {kits.map((kit, indice) => {
                                          return (
                                            <div
                                              className="col-4 d-flex"
                                              key={indice}
                                            >
                                              <div className="card card-kits w-100">
                                                <div className="card-body p-2">
                                                  <div className="row">
                                                    <div className="col-6">
                                                      <span className="nome-kit">
                                                        {kit.nome}
                                                      </span>
                                                    </div>
                                                    <div className="col-6 form-check">
                                                      <Field
                                                        component={"input"}
                                                        type="checkbox"
                                                        required
                                                        validate={required}
                                                        value={kit.uuid}
                                                        id={`${ue.codigo_eol}-${kit.uuid}`}
                                                        className="float-end"
                                                        name={`unidades_escolares[${idx}].kits_selecionados`}
                                                        disabled={
                                                          [
                                                            undefined,
                                                            "",
                                                          ].includes(
                                                            ue.quantidade_kits,
                                                          ) ||
                                                          (ue.quantidade_kits ===
                                                            `${ue.kits_selecionados.length}` &&
                                                            !ue.kits_selecionados.includes(
                                                              kit.uuid,
                                                            ))
                                                        }
                                                      />
                                                      <span className="checkmark" />
                                                    </div>
                                                    <div className="col-12 kit-itens mt-3">
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html: kit.descricao,
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                      <p>
                                        Número de kits dessa escola:{" "}
                                        {!["", undefined].includes(
                                          ue.nmr_alunos,
                                        ) &&
                                        !["", undefined].includes(
                                          ue.quantidade_kits,
                                        )
                                          ? parseInt(ue.nmr_alunos) *
                                            parseInt(ue.quantidade_kits)
                                          : 0}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  <div className="row">
                    <div className="col-6">
                      <p>
                        Total de Unidades Escolares:{" "}
                        {unidadesEscolaresSelecionadas.length}
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="float-end">
                        Total de Kits Lanche: {totalKits}
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div className="row">
                    <div className="col-12">
                      <Field
                        component={CKEditorField}
                        label="Observações"
                        name="descricao"
                      />
                    </div>
                    <div className="offset-5 col-2 mt-3">
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        onClick={() => {
                          form.restart();
                          setUnidadesEscolaresSelecionadas([]);
                          setTotalKits(0);
                        }}
                        texto={"Cancelar"}
                        className="w-100"
                      />
                    </div>
                    <div className="col-3 mt-3">
                      <Botao
                        type={BUTTON_TYPE.SUBMIT}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        texto={"Salvar Rascunho"}
                        className="w-100"
                      />
                    </div>
                    <div className="col-2 mt-3">
                      <Botao
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN}
                        texto="Enviar"
                        onClick={() => {
                          values["status"] = "DRE_A_VALIDAR";
                          !submeteu &&
                            handleSubmit((values) => onSubmit(values, form));
                        }}
                        className="w-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        />
      </div>
      <ModalDataPrioritaria
        showModal={showModal}
        closeModal={() => setShowModal(false)}
      />
    </>
  );
};

export default SolicitacaoUnificada;
