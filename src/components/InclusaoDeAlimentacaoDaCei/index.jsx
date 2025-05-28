import { Spin } from "antd";
import {
  AdicionarDia,
  DataInclusaoNormal,
  OutroMotivo,
} from "components/InclusaoDeAlimentacao/Escola/Formulario/componentes/InclusaoNormal";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import CardMatriculados from "components/Shareable/CardMatriculados";
import InputText from "components/Shareable/Input/InputText";
import ModalDataPrioritaria from "components/Shareable/ModalDataPrioritaria";
import { Select } from "components/Shareable/Select";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { STATUS_DRE_A_VALIDAR } from "configs/constants";
import arrayMutators from "final-form-arrays";
import { maxValue, naoPodeSerZero, required } from "helpers/fieldValidators";
import {
  agregarDefault,
  checaSeDataEstaEntre2e5DiasUteis,
  composeValidators,
  deepCopy,
  getError,
} from "helpers/utilities";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  atualizarInclusoesDaCEI,
  criarInclusoesDaCEI,
  excluirInclusoesDaCei,
  getQuantidadeAlunosFaixaEtaria,
  iniciarInclusoesDaCEI,
  meusRascunhosDeInclusaoDeAlimentacao,
} from "services/inclusaoDeAlimentacao/cei.legacy.service";
import { Rascunhos } from "./Rascunhos";
import { formataPayload, validarForm } from "./helper";
import "./style.scss";

export const InclusaoDeAlimentacaoDaCei = ({ ...props }) => {
  const {
    meusDados,
    motivos,
    periodos,
    proximosDoisDiasUteis,
    proximosCincoDiasUteis,
    vinculosAlimentacao,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [valoresIniciais, setValoresIniciais] = useState(null);
  const [rascunhos, setRascunhos] = useState(null);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (values) => {
    const payload = formataPayload(values);
    const erro = validarForm(payload);
    if (erro) {
      toastError(erro);
      return;
    }
    setLoading(true);
    if (payload.uuid) {
      const response = await atualizarInclusoesDaCEI(payload, payload.uuid);
      if (response.status === HTTP_STATUS.OK) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, values);
        } else {
          toastSuccess("Rascunho atualizado com sucesso");
          refresh(values);
        }
      } else {
        toastError(getError(response.data));
      }
    } else {
      const response = await criarInclusoesDaCEI(payload);

      if (response.status === HTTP_STATUS.CREATED) {
        if (values.status === STATUS_DRE_A_VALIDAR) {
          iniciarPedido(response.data.uuid, values);
        } else {
          toastSuccess("Solicitação Rascunho criada com sucesso!");
          refresh(values);
        }
      } else {
        toastError(getError(response.data));
      }
    }
    setLoading(false);
  };

  const iniciarPedido = async (uuid, values) => {
    const response = await iniciarInclusoesDaCEI(uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Inclusão de Alimentação enviada com sucesso!");
      refresh(values);
    } else {
      toastError(getError(response.data));
    }
  };

  const resetForm = (values) => {
    values.uuid = undefined;
    values.escola = valoresIniciais.escola;
    values.dias_motivos_da_inclusao_cei =
      valoresIniciais.dias_motivos_da_inclusao_cei;
    values.periodos_e_faixas = valoresIniciais.periodos_e_faixas;
  };

  const outroMotivoSelecionado = (values, index) => {
    return (
      values.dias_motivos_da_inclusao_cei &&
      values.dias_motivos_da_inclusao_cei[index] &&
      values.dias_motivos_da_inclusao_cei[index].motivo &&
      motivos.find(
        (motivo) =>
          motivo.uuid === values.dias_motivos_da_inclusao_cei[index].motivo
      ) &&
      motivos
        .find(
          (motivo) =>
            motivo.uuid === values.dias_motivos_da_inclusao_cei[index].motivo
        )
        .nome.includes("Outro")
    );
  };

  const onDataChanged = (value) => {
    if (
      value &&
      checaSeDataEstaEntre2e5DiasUteis(
        value,
        proximosDoisDiasUteis,
        proximosCincoDiasUteis
      )
    ) {
      setShowModal(true);
    }
  };

  const motivoSelecionado = (values) => {
    return (
      values.dias_motivos_da_inclusao_cei &&
      values.dias_motivos_da_inclusao_cei[0].motivo &&
      motivos.find(
        (motivo) =>
          motivo.uuid === values.dias_motivos_da_inclusao_cei[0].motivo
      )
    );
  };

  const alimentacoesFormatadas = (periodo) => {
    const alimentosFormatados = vinculosAlimentacao
      .find((v) => v.periodo_escolar.uuid === periodo.uuid)
      .tipos_alimentacao.map((ta) => ta.nome)
      .join(", ");
    return alimentosFormatados;
  };

  const getRascunhos = async () => {
    const response = await meusRascunhosDeInclusaoDeAlimentacao();
    if (response.status === HTTP_STATUS.OK) {
      setRascunhos(response.data.results);
    } else {
      toastError(`Houve um erro ao carregar os rascunhos salvos`);
    }
  };

  const carregarRascunho = (form, inclusao, values) => {
    let _periodos_e_faixas = deepCopy(values.periodos_e_faixas);
    let periodos_externos_inclusao =
      inclusao.quantidade_alunos_por_faixas_etarias.map((periodo_faixa) => {
        return periodo_faixa.periodo_externo.nome;
      });
    periodos_externos_inclusao = [...new Set(periodos_externos_inclusao)];
    periodos_externos_inclusao.forEach((periodo_nome) => {
      _periodos_e_faixas = _periodos_e_faixas.map((periodo_faixa) => {
        if (periodo_faixa.nome === periodo_nome) {
          periodo_faixa.checked = true;
          if (periodo_faixa.nome !== "INTEGRAL") {
            periodo_faixa.faixas_etarias = periodo_faixa.faixas_etarias.map(
              (fx) => {
                const faixa_inclusao =
                  inclusao.quantidade_alunos_por_faixas_etarias.find(
                    (faixa_etaria) =>
                      faixa_etaria.periodo.uuid === periodo_faixa.uuid &&
                      faixa_etaria.periodo_externo.uuid ===
                        periodo_faixa.uuid &&
                      faixa_etaria.faixa_etaria.uuid === fx.faixa_etaria.uuid
                  );
                if (faixa_inclusao) {
                  fx["quantidade_alunos"] = faixa_inclusao.quantidade_alunos;
                }
                return fx;
              }
            );
          } else {
            let faixas_periodo_integral =
              inclusao.quantidade_alunos_por_faixas_etarias.filter(
                (faixa_etaria) =>
                  faixa_etaria.periodo_externo.nome === "INTEGRAL"
              );
            let periodos_internos_nomes = faixas_periodo_integral.map(
              (faixa_etaria) => faixa_etaria.periodo.nome
            );
            periodos_internos_nomes = [...new Set(periodos_internos_nomes)];
            periodo_faixa.periodos = periodo_faixa.periodos.map((periodo) => {
              if (periodos_internos_nomes.includes(periodo.nome)) {
                periodo.checked = true;
                periodo.faixas_etarias = periodo.faixas_etarias.map((fx) => {
                  const faixa_inclusao =
                    inclusao.quantidade_alunos_por_faixas_etarias.find(
                      (faixa_etaria) =>
                        faixa_etaria.periodo.uuid === periodo.uuid &&
                        faixa_etaria.periodo_externo.uuid ===
                          periodo_faixa.uuid &&
                        faixa_etaria.faixa_etaria.uuid === fx.faixa_etaria.uuid
                    );
                  if (faixa_inclusao) {
                    fx["quantidade_alunos"] = faixa_inclusao.quantidade_alunos;
                  }
                  return fx;
                });
              }
              return periodo;
            });
          }
        }
        return periodo_faixa;
      });
    });

    form.change("periodos_e_faixas", _periodos_e_faixas);
    form.change("uuid", inclusao.uuid);
    form.change("id_externo", inclusao.id_externo);
    form.change("escola", inclusao.escola.uuid);
    form.change(
      "dias_motivos_da_inclusao_cei",
      inclusao.dias_motivos_da_inclusao_cei.map((dia_motivo) => ({
        motivo: dia_motivo.motivo.uuid,
        outro_motivo: dia_motivo.outro_motivo,
        data: dia_motivo.data,
      }))
    );
  };

  const removerRascunho = async (id_externo, uuid, values) => {
    if (window.confirm("Deseja remover este rascunho?")) {
      const response = await excluirInclusoesDaCei(uuid);
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        toastSuccess(`Rascunho # ${id_externo} excluído com sucesso`);
        refresh(values);
      } else {
        toastError(
          `Houve um erro ao excluir o rascunho: ${getError(response.data)}`
        );
      }
    }
  };

  const refresh = (values) => {
    getRascunhos();
    resetForm(values);
  };

  useEffect(() => {
    async function fetch() {
      let periodos_e_faixas = [];
      const dataInclusao = new Date().toISOString().split("T")[0];
      for (let index = 0; index < periodos.length; index++) {
        const periodo = periodos[index];
        const response = await getQuantidadeAlunosFaixaEtaria(
          periodo.uuid,
          dataInclusao
        );
        if (response.status === HTTP_STATUS.OK && response.data.count > 0) {
          let _periodos_e_faixas = {
            nome: periodo.nome,
            uuid: periodo.uuid,
            checked: false,
          };
          const total_matriculados = response.data.results.reduce(
            (somatorio, faixa) => {
              return somatorio + faixa.count;
            },
            0
          );
          if (periodo.nome === "INTEGRAL") {
            _periodos_e_faixas["periodos"] = periodos.map((p) => {
              return {
                nome: p.nome,
                uuid: p.uuid,
                checked: false,
                faixas_etarias: response.data.results,
                total_matriculados: total_matriculados,
              };
            });
          } else {
            _periodos_e_faixas["faixas_etarias"] = response.data.results;
            _periodos_e_faixas["total_matriculados"] = total_matriculados;
          }
          periodos_e_faixas.push(_periodos_e_faixas);
        }
      }
      setValoresIniciais({
        escola: meusDados.vinculo_atual.instituicao.uuid,
        dias_motivos_da_inclusao_cei: [{ motivo: undefined }],
        periodos_e_faixas: periodos_e_faixas,
      });
      setLoading(false);
    }
    getRascunhos();
    fetch();
  }, [meusDados, periodos]);

  return valoresIniciais && valoresIniciais.periodos_e_faixas ? (
    <div>
      <Spin tip="Carregando..." spinning={loading}>
        <Form
          keepDirtyOnReinitialize
          mutators={{
            ...arrayMutators,
          }}
          initialValues={valoresIniciais}
          onSubmit={onSubmit}
        >
          {({
            handleSubmit,
            submitting,
            form,
            form: {
              mutators: { push },
            },
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              <Field component={"input"} type="hidden" name="uuid" />
              <CardMatriculados
                meusDados={meusDados}
                numeroAlunos={
                  meusDados.vinculo_atual.instituicao.quantidade_alunos || 0
                }
              />
              {rascunhos && rascunhos.length > 0 && (
                <div className="mt-3">
                  <span className="page-title">Rascunhos</span>
                  <Rascunhos
                    rascunhos={rascunhos}
                    removerRascunho={removerRascunho}
                    carregarRascunho={carregarRascunho}
                    form={form}
                    values={values}
                  />
                </div>
              )}
              <div className="mt-2 page-title">
                {values.uuid
                  ? `Solicitação # ${values.id_externo}`
                  : "Nova Solicitação"}
              </div>
              <div className="card solicitation mt-2">
                <div className="card-body">
                  <div className="card-title fw-bold">
                    Descrição da Inclusão de Alimentação
                  </div>
                  <FieldArray name="dias_motivos_da_inclusao_cei">
                    {({ fields }) =>
                      fields.map((name, index) => (
                        <div key={index}>
                          <div className="row">
                            <div className="col-6">
                              <Field
                                component={Select}
                                name={`${name}.motivo`}
                                dataTestId="div-select-motivo"
                                label="Motivo"
                                options={agregarDefault(motivos)}
                                required
                                validate={required}
                                naoDesabilitarPrimeiraOpcao
                              />
                            </div>
                            <DataInclusaoNormal
                              name={name}
                              nameFieldArray="dias_motivos_da_inclusao_cei"
                              onDataChanged={onDataChanged}
                              values={values}
                              index={index}
                              proximosDoisDiasUteis={proximosDoisDiasUteis}
                              form={form}
                            />
                          </div>
                          {outroMotivoSelecionado(values, index) && (
                            <div className="mt-3">
                              <OutroMotivo name={name} />
                            </div>
                          )}
                          <hr />
                        </div>
                      ))
                    }
                  </FieldArray>
                  {motivoSelecionado(values) && (
                    <div className="mt-3">
                      <AdicionarDia
                        push={push}
                        nameFieldArray="dias_motivos_da_inclusao_cei"
                      />
                    </div>
                  )}
                  <div className="row my-2">
                    <div className="col-12">
                      <p>Períodos</p>
                    </div>
                  </div>
                  {valoresIniciais.periodos_e_faixas.map(
                    (periodo_faixa, periodo_faixa_idx) => {
                      return (
                        <>
                          <div className="col-12 mt-2" key={periodo_faixa_idx}>
                            <label
                              style={{
                                background: "#D4FFE0",
                                border: `1px solid #DADADA`,
                                borderRadius: "5px",
                                marginBottom: "1%",
                                width: "100%",
                                padding: "8px 15px",
                                height: "40px",
                              }}
                            >
                              <span
                                data-testid={`span-${periodo_faixa.nome}`}
                                onClick={async (e) => {
                                  const value = e.target.checked;
                                  let _periodos_e_faixas = deepCopy(
                                    values.periodos_e_faixas
                                  );
                                  if (
                                    !value &&
                                    periodo_faixa.nome === "INTEGRAL"
                                  ) {
                                    _periodos_e_faixas = _periodos_e_faixas.map(
                                      (_periodo_faixa) => {
                                        if (
                                          _periodo_faixa.nome ===
                                          periodo_faixa.nome
                                        ) {
                                          _periodo_faixa.periodos =
                                            _periodo_faixa.periodos.map(
                                              (_periodo) => {
                                                _periodo.checked = false;
                                                _periodo.faixas_etarias =
                                                  _periodo.faixas_etarias.map(
                                                    (_fx) => {
                                                      if (
                                                        _fx["quantidade_alunos"]
                                                      ) {
                                                        delete _fx[
                                                          "quantidade_alunos"
                                                        ];
                                                      }
                                                      return _fx;
                                                    }
                                                  );
                                                return _periodo;
                                              }
                                            );
                                        }
                                        return _periodo_faixa;
                                      }
                                    );
                                  }
                                  if (
                                    !value &&
                                    periodo_faixa.nome !== "INTEGRAL"
                                  ) {
                                    _periodos_e_faixas = _periodos_e_faixas.map(
                                      (_periodo_faixa) => {
                                        if (
                                          _periodo_faixa.nome ===
                                          periodo_faixa.nome
                                        ) {
                                          _periodo_faixa.faixas_etarias =
                                            _periodo_faixa.faixas_etarias.map(
                                              (_fx) => {
                                                if (_fx["quantidade_alunos"]) {
                                                  delete _fx[
                                                    "quantidade_alunos"
                                                  ];
                                                }
                                                return _fx;
                                              }
                                            );
                                        }
                                        return _periodo_faixa;
                                      }
                                    );
                                  }
                                  form.change(
                                    "periodos_e_faixas",
                                    _periodos_e_faixas
                                  );
                                }}
                              >
                                <Field
                                  component={"input"}
                                  data-testid={`periodos_e_faixas[${periodo_faixa_idx}]`}
                                  type="checkbox"
                                  name={`periodos_e_faixas[${periodo_faixa_idx}].checked`}
                                />
                              </span>
                              <span
                                className="checkbox-custom"
                                data-cy={`checkbox-${periodo_faixa.nome}`}
                              />
                              {periodo_faixa.nome}
                            </label>
                          </div>
                          {values.periodos_e_faixas[periodo_faixa_idx]
                            .checked &&
                            periodo_faixa.nome !== "INTEGRAL" && (
                              <div className="col-12 mt-2">
                                <p>
                                  Tipos de Alimentação do período{" "}
                                  {periodo_faixa.nome.toLowerCase()}:{" "}
                                  <b className="alimentosStyle">
                                    {alimentacoesFormatadas(periodo_faixa)}
                                  </b>
                                </p>
                              </div>
                            )}
                          {values.periodos_e_faixas[periodo_faixa_idx]
                            .checked &&
                            (periodo_faixa.nome !== "INTEGRAL" ? (
                              <div className="col-12 mt-3">
                                <table className="table faixas-etarias-cei-alteracao">
                                  <thead>
                                    <tr>
                                      <th className="col-7">Faixa Etária</th>
                                      <th className="col-3 text-center">
                                        Alunos Matriculados
                                      </th>
                                      <th className="col-2 text-center">
                                        Quantidade
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {values.periodos_e_faixas[
                                      periodo_faixa_idx
                                    ].faixas_etarias.map((fa, k) => {
                                      return (
                                        <tr key={k}>
                                          <td>{fa.faixa_etaria.__str__}</td>
                                          <td className="text-center">
                                            {fa.count}
                                          </td>
                                          <td className="text-center">
                                            <Field
                                              component={InputText}
                                              dataTestId={`periodos_e_faixas[${periodo_faixa_idx}].faixas_etarias[${k}].quantidade_alunos`}
                                              type="number"
                                              step="1"
                                              min="0"
                                              max={parseInt(
                                                fa.count ? fa.count : 0
                                              )}
                                              name={`periodos_e_faixas[${periodo_faixa_idx}][faixas_etarias][${k}][quantidade_alunos]`}
                                              validate={composeValidators(
                                                naoPodeSerZero,
                                                maxValue(
                                                  parseInt(
                                                    fa.count ? fa.count : 0
                                                  )
                                                )
                                              )}
                                              className="input-quantidades"
                                            />
                                          </td>
                                        </tr>
                                      );
                                    })}
                                    <tr>
                                      <td>Total</td>
                                      <td className="text-center">
                                        {
                                          values.periodos_e_faixas[
                                            periodo_faixa_idx
                                          ].total_matriculados
                                        }
                                      </td>
                                      <td className="text-center">
                                        {values.periodos_e_faixas[
                                          periodo_faixa_idx
                                        ].faixas_etarias
                                          ? values.periodos_e_faixas[
                                              periodo_faixa_idx
                                            ].faixas_etarias.reduce(
                                              (somatorio, f) => {
                                                return (
                                                  somatorio +
                                                  parseInt(
                                                    f.quantidade_alunos
                                                      ? f.quantidade_alunos
                                                      : 0
                                                  )
                                                );
                                              },
                                              0
                                            )
                                          : 0}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              valoresIniciais.periodos_e_faixas[
                                periodo_faixa_idx
                              ].periodos.map((periodo, periodo_idx) => {
                                const background = periodos.find(
                                  (p) => p.uuid === periodo.uuid
                                ).background;
                                const borderColor = periodos.find(
                                  (p) => p.uuid === periodo.uuid
                                ).borderColor;
                                return (
                                  <div
                                    className="container-fluid"
                                    key={periodo_idx}
                                  >
                                    <div className="col-12 mt-2">
                                      <label
                                        style={{
                                          background: background,
                                          border: `1px solid ${borderColor}`,
                                          borderRadius: "5px",
                                          marginBottom: "1%",
                                          width: "100%",
                                          padding: "8px 15px",
                                          height: "40px",
                                        }}
                                      >
                                        <span
                                          data-testid={`span-dentro-${periodo.nome}`}
                                          onClick={async (e) => {
                                            const value = e.target.checked;
                                            let _periodos_e_faixas = deepCopy(
                                              values.periodos_e_faixas
                                            );
                                            if (!value) {
                                              _periodos_e_faixas =
                                                _periodos_e_faixas.map(
                                                  (_periodo_faixa) => {
                                                    if (
                                                      _periodo_faixa.nome ===
                                                      "INTEGRAL"
                                                    ) {
                                                      _periodo_faixa.periodos =
                                                        _periodo_faixa.periodos.map(
                                                          (_periodo) => {
                                                            if (
                                                              _periodo.nome ===
                                                              periodo.nome
                                                            ) {
                                                              _periodo.faixas_etarias =
                                                                _periodo.faixas_etarias.map(
                                                                  (_fx) => {
                                                                    if (
                                                                      _fx[
                                                                        "quantidade_alunos"
                                                                      ]
                                                                    ) {
                                                                      delete _fx[
                                                                        "quantidade_alunos"
                                                                      ];
                                                                    }
                                                                    return _fx;
                                                                  }
                                                                );
                                                            }
                                                            return _periodo;
                                                          }
                                                        );
                                                    }
                                                    return _periodo_faixa;
                                                  }
                                                );
                                            }
                                            form.change(
                                              "periodos_e_faixas",
                                              _periodos_e_faixas
                                            );
                                          }}
                                        >
                                          <Field
                                            component={"input"}
                                            type="checkbox"
                                            name={`periodos_e_faixas[${periodo_faixa_idx}].periodos[${periodo_idx}].checked`}
                                          />
                                        </span>
                                        <span
                                          className="checkbox-custom"
                                          data-cy={`checkbox-${valoresIniciais.periodos_e_faixas[periodo_faixa_idx].periodos[periodo_idx].nome}`}
                                        />
                                        {periodo.nome}
                                      </label>
                                    </div>
                                    {values.periodos_e_faixas[periodo_faixa_idx]
                                      .periodos[periodo_idx].checked && (
                                      <div className="col-12 mt-2">
                                        <p>
                                          Tipos de Alimentação do período{" "}
                                          {periodo.nome.toLowerCase()}:{" "}
                                          <b className="alimentosStyle">
                                            {alimentacoesFormatadas(periodo)}
                                          </b>
                                        </p>
                                      </div>
                                    )}
                                    {values.periodos_e_faixas[periodo_faixa_idx]
                                      .periodos[periodo_idx].checked && (
                                      <div className="col-12 mt-3">
                                        <table className="table faixas-etarias-cei-alteracao">
                                          <thead>
                                            <tr>
                                              <th className="col-7">
                                                Faixa Etária
                                              </th>
                                              <th className="col-3 text-center">
                                                Alunos Matriculados
                                              </th>
                                              <th className="col-2 text-center">
                                                Quantidade
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {values.periodos_e_faixas[
                                              periodo_faixa_idx
                                            ].periodos[
                                              periodo_idx
                                            ].faixas_etarias.map((fa, k) => {
                                              return (
                                                <tr key={k}>
                                                  <td>
                                                    {fa.faixa_etaria.__str__}
                                                  </td>
                                                  <td className="text-center">
                                                    {fa.count}
                                                  </td>
                                                  <td className="text-center">
                                                    <Field
                                                      component={InputText}
                                                      dataTestId={`periodos_e_faixas[${periodo_faixa_idx}].periodos[${periodo_idx}].faixas_etarias[${k}].quantidade_alunos`}
                                                      type="number"
                                                      step="1"
                                                      min="0"
                                                      max={parseInt(
                                                        fa.count ? fa.count : 0
                                                      )}
                                                      name={`periodos_e_faixas[${periodo_faixa_idx}].periodos[${periodo_idx}].faixas_etarias[${k}].quantidade_alunos`}
                                                      validate={composeValidators(
                                                        naoPodeSerZero,
                                                        maxValue(
                                                          parseInt(
                                                            fa.count
                                                              ? fa.count
                                                              : 0
                                                          )
                                                        )
                                                      )}
                                                      className="input-quantidades"
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                            <tr>
                                              <td>Total</td>
                                              <td className="text-center">
                                                {
                                                  values.periodos_e_faixas[
                                                    periodo_faixa_idx
                                                  ].periodos[periodo_idx]
                                                    .total_matriculados
                                                }
                                              </td>
                                              <td className="text-center">
                                                {values.periodos_e_faixas[
                                                  periodo_faixa_idx
                                                ].periodos[periodo_idx]
                                                  .faixas_etarias
                                                  ? values.periodos_e_faixas[
                                                      periodo_faixa_idx
                                                    ].periodos[
                                                      periodo_idx
                                                    ].faixas_etarias.reduce(
                                                      (somatorio, f) => {
                                                        return (
                                                          somatorio +
                                                          parseInt(
                                                            f.quantidade_alunos
                                                              ? f.quantidade_alunos
                                                              : 0
                                                          )
                                                        );
                                                      },
                                                      0
                                                    )
                                                  : 0}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ))}
                        </>
                      );
                    }
                  )}
                  <div className="row float-end mt-4">
                    <div className="col-12">
                      <Botao
                        texto="Cancelar"
                        onClick={() => {
                          form.change("uuid", undefined);
                          form.change("escola", valoresIniciais.escola);
                          form.change(
                            "dias_motivos_da_inclusao_cei",
                            valoresIniciais.dias_motivos_da_inclusao_cei
                          );
                          form.change(
                            "periodos_e_faixas",
                            valoresIniciais.periodos_e_faixas
                          );
                        }}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                      />
                      <Botao
                        texto={
                          values.uuid ? "Atualizar rascunho" : "Salvar rascunho"
                        }
                        className="ms-3"
                        disabled={submitting}
                        type={BUTTON_TYPE.SUBMIT}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        onClick={() => {
                          handleSubmit((values) => onSubmit(values));
                        }}
                      />
                      <Botao
                        texto="Enviar"
                        type={BUTTON_TYPE.BUTTON}
                        disabled={submitting}
                        onClick={() => {
                          values["status"] = STATUS_DRE_A_VALIDAR;
                          handleSubmit((values) => onSubmit(values));
                        }}
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Form>
        <ModalDataPrioritaria
          showModal={showModal}
          closeModal={() => setShowModal(false)}
        />
      </Spin>
    </div>
  ) : (
    <></>
  );
};

export default InclusaoDeAlimentacaoDaCei;
