import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import { Field } from "react-final-form";
import { Spin } from "antd";
import { format, getYear } from "date-fns";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  maxLengthSemTags,
  peloMenosUmCaractere,
} from "src/helpers/fieldValidators";
import { deleteObservacaoValoresPeriodosLancamentos } from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import "./styles.scss";
import strip_tags from "locutus/php/strings/strip_tags";

export default ({
  closeModal,
  showModal,
  form,
  dia,
  categoria,
  mesAnoConsiderado,
  values,
  rowName,
  valoresPeriodosLancamentos,
  onSubmit,
  dadosIniciais,
  setExibirTooltip,
  errors,
  valoresObservacoes,
  location,
  setFormValuesAtualizados,
  setValoresObservacoes,
}) => {
  const [desabilitarBotaoSalvar, setDesabilitarBotaoSalvar] = useState(true);
  const [showBotaoExcluir, setShowBotaoExcluir] = useState(false);

  const formatarDataLancamento = () => {
    const mes = format(mesAnoConsiderado, "MM");
    const ano = getYear(mesAnoConsiderado);
    return `${dia}/${mes}/${ano}`;
  };

  const onClickExcluir = async () => {
    const msgError = "Ocorreu um erro ao deletar a observação!";
    try {
      const valorAtual = valoresPeriodosLancamentos
        .filter((valor) => valor.nome_campo === rowName)
        .filter((valor) => String(valor.dia) === String(dia))
        .filter(
          (valor) => String(valor.categoria_medicao) === String(categoria),
        )[0];
      const uuidValor =
        (valorAtual && valorAtual.uuid) ||
        (valoresObservacoes &&
          valoresObservacoes.find(
            (valor) =>
              String(valor.dia) === String(dia) &&
              String(valor.categoria_medicao) === String(categoria),
          ).uuid);
      const response =
        await deleteObservacaoValoresPeriodosLancamentos(uuidValor);
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
        setValoresObservacoes(
          valoresObservacoes.filter((v) => v.uuid !== uuidValor),
        );
        valoresPeriodosLancamentos.splice(
          valoresPeriodosLancamentos.findIndex(
            (valor) => valor.uuid === uuidValor,
          ),
          1,
        );
        if (Object.keys(errors).length > 0) {
          setExibirTooltip(true);
        } else {
          setExibirTooltip(false);
        }
        toastSuccess("Observação excluída com sucesso");
      } else {
        toastError(msgError);
      }
    } catch {
      toastError(msgError);
    }
    closeModal();
  };

  const onClickVoltar = () => {
    if (
      !valoresObservacoes
        .filter((valor) => valor.nome_campo === rowName)
        .filter((valor) => String(valor.dia) === String(dia))
        .filter(
          (valor) => String(valor.categoria_medicao) === String(categoria),
        )
    ) {
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
    } else {
      let valueObs = valoresObservacoes.filter(
        (valor) =>
          valor.nome_campo === rowName &&
          String(valor.dia) === String(dia) &&
          String(valor.categoria_medicao) === String(categoria),
      );
      let valoresLancamentos = valoresPeriodosLancamentos.filter(
        (valor) =>
          valor.nome_campo === rowName &&
          String(valor.dia) === String(dia) &&
          String(valor.categoria_medicao) === String(categoria),
      );

      form.change(
        `${rowName}__dia_${dia}__categoria_${categoria}`,
        valueObs[0]?.valor || valoresLancamentos[0]?.valor,
      );
    }
    setDesabilitarBotaoSalvar(true);
    closeModal();
  };

  const onClickSalvar = async () => {
    setDesabilitarBotaoSalvar(true);
    await onSubmit();

    valoresPeriodosLancamentos
      .filter((valor) => valor.nome_campo === rowName)
      .filter((valor) => String(valor.dia) === String(dia))
      .filter(
        (valor) => String(valor.categoria_medicao) === String(categoria),
      )[0] && setShowBotaoExcluir(true);

    setDesabilitarBotaoSalvar(false);
    closeModal();
  };

  const onHideModal = () => {
    const validation = peloMenosUmCaractere(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`],
    );
    validation &&
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
    if (
      !valoresPeriodosLancamentos
        .filter((valor) => valor.nome_campo === rowName)
        .filter((valor) => String(valor.dia) === String(dia))
        .filter(
          (valor) => String(valor.categoria_medicao) === String(categoria),
        )[0]
    ) {
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
    } else {
      form.change(
        `${rowName}__dia_${dia}__categoria_${categoria}`,
        valoresPeriodosLancamentos
          .filter((valor) => valor.nome_campo === rowName)
          .filter((valor) => String(valor.dia) === String(dia))
          .filter(
            (valor) => String(valor.categoria_medicao) === String(categoria),
          )[0].valor,
      );
    }
    const updateObs = {};
    if (
      valoresObservacoes.find(
        (valor) =>
          String(valor.dia) === String(dia) &&
          String(valor.categoria_medicao) === String(categoria),
      )
    ) {
      updateObs[`${rowName}__dia_${dia}__categoria_${categoria}`] =
        valoresObservacoes.find(
          (valor) =>
            String(valor.dia) === String(dia) &&
            String(valor.categoria_medicao) === String(categoria),
        ).valor;
      setFormValuesAtualizados({ ...values, ...updateObs });
      form.change(
        `${rowName}__dia_${dia}__categoria_${categoria}`,
        valoresObservacoes.find(
          (valor) =>
            String(valor.dia) === String(dia) &&
            String(valor.categoria_medicao) === String(categoria),
        ).valor,
      );
    }
    setDesabilitarBotaoSalvar(true);
    closeModal();
  };

  const setUpModal = () => {
    if (dia && categoria) {
      if (
        !values[`${rowName}__dia_${dia}__categoria_${categoria}`] &&
        valoresObservacoes &&
        valoresObservacoes.find(
          (valor) =>
            String(valor.dia) === String(dia) &&
            String(valor.categoria_medicao) === String(categoria),
        )
      ) {
        const updateObs = {};
        updateObs[`${rowName}__dia_${dia}__categoria_${categoria}`] =
          valoresObservacoes.find(
            (valor) =>
              String(valor.dia) === String(dia) &&
              String(valor.categoria_medicao) === String(categoria),
          ).valor;
        setFormValuesAtualizados({ ...values, ...updateObs });
        form.change(
          `${rowName}__dia_${dia}__categoria_${categoria}`,
          valoresObservacoes.find(
            (valor) =>
              String(valor.dia) === String(dia) &&
              String(valor.categoria_medicao) === String(categoria),
          ).valor,
        );
      }
    }
  };

  const onChangeTextAreaField = (value) => {
    const valorFiltered = valoresPeriodosLancamentos
      .filter((valor) => valor.nome_campo === rowName)
      .filter((valor) => String(valor.dia) === String(dia))
      .filter(
        (valor) => String(valor.categoria_medicao) === String(categoria),
      )[0];
    if (value) {
      setDesabilitarBotaoSalvar(
        ((!["<p></p>\n", null, ""].includes(
          values[`${rowName}__dia_${dia}__categoria_${categoria}`],
        ) ||
          !!peloMenosUmCaractere(
            values[`${rowName}__dia_${dia}__categoria_${categoria}`],
          )) &&
          valorFiltered &&
          valorFiltered.valor === value) ||
          strip_tags(value).length > 250,
      );

      setShowBotaoExcluir(
        valoresPeriodosLancamentos
          .filter((valor) => valor.nome_campo === rowName)
          .filter((valor) => String(valor.dia) === String(dia))
          .filter(
            (valor) => String(valor.categoria_medicao) === String(categoria),
          ).length > 0,
      );

      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, value);
    } else {
      setDesabilitarBotaoSalvar(true);
    }
  };

  return (
    <Modal
      onEntered={() => setUpModal()}
      dialogClassName="modal-50w"
      show={showModal}
      onHide={onHideModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Observação Diária</Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={false}>
        <Modal.Body>
          <div className="col-4 mt-0">
            <label className="fw-bold">Data do Lançamento</label>
            <Field
              className="data_lancamento_modal"
              component={InputText}
              name="data_lancamento"
              disabled
              placeholder={formatarDataLancamento()}
            />
          </div>
          <div className="col-12 mt-3">
            <label className="fw-bold">Observação</label>
            <Field
              component={CKEditorField}
              name={`${rowName}__dia_${dia}__categoria_${categoria}`}
              ehModal={true}
              disabled={
                location.state &&
                [
                  "MEDICAO_APROVADA_PELA_DRE",
                  "MEDICAO_APROVADA_PELA_CODAE",
                ].includes(location.state.status_periodo)
              }
              validate={maxLengthSemTags(250)}
              onChange={(_, editor) => {
                const value_ = editor.getData();
                onChangeTextAreaField(value_);
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="botoes-modal-footer">
          {values &&
          !["<p></p>\n", null, ""].includes(
            values[`${rowName}__dia_${dia}__categoria_${categoria}`],
          ) &&
          valoresPeriodosLancamentos.length > 0 &&
          (showBotaoExcluir ||
            valoresObservacoes.find(
              (valor) =>
                String(valor.dia) === String(dia) &&
                String(valor.categoria_medicao) === String(categoria),
            ) ||
            (!!dadosIniciais[
              `observacoes__dia_${dia}__categoria_${categoria}`
            ] &&
              !!values[`observacoes__dia_${dia}__categoria_${categoria}`])) ? (
            <Botao
              className="ms-3 float-start"
              texto="Excluir"
              disabled={
                location.state &&
                [
                  "MEDICAO_APROVADA_PELA_DRE",
                  "MEDICAO_APROVADA_PELA_CODAE",
                ].includes(location.state.status_periodo)
              }
              type={BUTTON_TYPE.BUTTON}
              icon={BUTTON_ICON.TRASH}
              onClick={() => onClickExcluir()}
              style={BUTTON_STYLE.RED_OUTLINE}
              dataTestId="botao-excluir"
            />
          ) : (
            <div />
          )}
          <div className="botoes-right">
            <Botao
              className="ms-3"
              texto="Voltar"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => onClickVoltar()}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              dataTestId="botao-voltar"
            />
            <Botao
              className="ms-3 me-3"
              texto="Salvar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              disabled={desabilitarBotaoSalvar}
              onClick={() => onClickSalvar()}
              dataTestId="botao-salvar"
            />
          </div>
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};
