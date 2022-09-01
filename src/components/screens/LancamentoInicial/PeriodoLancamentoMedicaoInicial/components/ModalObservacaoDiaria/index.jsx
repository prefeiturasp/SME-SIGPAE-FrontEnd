import React, { useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Modal } from "react-bootstrap";
import { Field } from "react-final-form";
import { Spin } from "antd";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "components/Shareable/Botao/constants";
import InputText from "components/Shareable/Input/InputText";
import { TextAreaWYSIWYG } from "components/Shareable/TextArea/TextAreaWYSIWYG";
import "./styles.scss";
import { format, getYear } from "date-fns";
import { peloMenosUmCaractere } from "helpers/fieldValidators";
import { OnChange } from "react-final-form-listeners";
import { deleteObservacaoValoresPeriodosLancamentos } from "services/medicaoInicial/periodoLancamentoMedicao.service";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";

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
  onSubmit
}) => {
  const [desabilitarBotaoSalvar, setDesabilitarBotaoSalvar] = useState(true);
  const [showBotaoExcluir, setShowBotaoExcluir] = useState(true);

  const formatarDataLancamento = () => {
    const mes = format(mesAnoConsiderado, "MM");
    const ano = getYear(mesAnoConsiderado);
    return `${dia}/${mes}/${ano}`;
  };

  const onClickExcluir = async () => {
    const valorAtual = valoresPeriodosLancamentos
      .filter(valor => valor.nome_campo === rowName)
      .filter(valor => String(valor.dia) === String(dia))
      .filter(
        valor => String(valor.categoria_medicao) === String(categoria)
      )[0];
    const uuidValor = valorAtual.uuid;
    const response = await deleteObservacaoValoresPeriodosLancamentos(
      uuidValor
    );
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
      valoresPeriodosLancamentos.splice(
        valoresPeriodosLancamentos.findIndex(valor => valor.uuid === uuidValor),
        1
      );
      toastSuccess("Observação excluída com sucesso");
    } else {
      toastError("Ocorreu um erro ao deletar a observação!");
    }
    closeModal();
  };

  const onClickVoltar = () => {
    if (
      !valoresPeriodosLancamentos
        .filter(valor => valor.nome_campo === rowName)
        .filter(valor => String(valor.dia) === String(dia))
        .filter(
          valor => String(valor.categoria_medicao) === String(categoria)
        )[0]
    ) {
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
    } else {
      form.change(
        `${rowName}__dia_${dia}__categoria_${categoria}`,
        valoresPeriodosLancamentos
          .filter(valor => valor.nome_campo === rowName)
          .filter(valor => String(valor.dia) === String(dia))
          .filter(
            valor => String(valor.categoria_medicao) === String(categoria)
          )[0].valor
      );
    }
    setDesabilitarBotaoSalvar(true);
    setShowBotaoExcluir(true);
    closeModal();
  };

  const onClickSalvar = async () => {
    await onSubmit();
    valoresPeriodosLancamentos
      .filter(valor => valor.nome_campo === rowName)
      .filter(valor => String(valor.dia) === String(dia))
      .filter(
        valor => String(valor.categoria_medicao) === String(categoria)
      )[0] && setShowBotaoExcluir(true);
    closeModal();
  };

  const onHideModal = () => {
    const validation = peloMenosUmCaractere(
      values[`${rowName}__dia_${dia}__categoria_${categoria}`]
    );
    validation &&
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
    if (
      !valoresPeriodosLancamentos
        .filter(valor => valor.nome_campo === rowName)
        .filter(valor => String(valor.dia) === String(dia))
        .filter(
          valor => String(valor.categoria_medicao) === String(categoria)
        )[0]
    ) {
      form.change(`${rowName}__dia_${dia}__categoria_${categoria}`, "");
    } else {
      form.change(
        `${rowName}__dia_${dia}__categoria_${categoria}`,
        valoresPeriodosLancamentos
          .filter(valor => valor.nome_campo === rowName)
          .filter(valor => String(valor.dia) === String(dia))
          .filter(
            valor => String(valor.categoria_medicao) === String(categoria)
          )[0].valor
      );
    }
    setDesabilitarBotaoSalvar(true);
    setShowBotaoExcluir(true);
    closeModal();
  };

  const onChangeTextAreaField = value => {
    const valorFiltered = valoresPeriodosLancamentos
      .filter(valor => valor.nome_campo === rowName)
      .filter(valor => String(valor.dia) === String(dia))
      .filter(
        valor => String(valor.categoria_medicao) === String(categoria)
      )[0];
    if (value) {
      setDesabilitarBotaoSalvar(
        (!["<p></p>\n", null, ""].includes(
          values[`${rowName}__dia_${dia}__categoria_${categoria}`]
        ) ||
          !!peloMenosUmCaractere(
            values[`${rowName}__dia_${dia}__categoria_${categoria}`]
          )) &&
          (valorFiltered && valorFiltered.valor === value)
      );

      setShowBotaoExcluir(
        valoresPeriodosLancamentos
          .filter(valor => valor.nome_campo === rowName)
          .filter(valor => String(valor.dia) === String(dia))
          .filter(
            valor => String(valor.categoria_medicao) === String(categoria)
          ).length > 0
      );
    }
  };

  return (
    <Modal dialogClassName="modal-50w" show={showModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Observação Diária</Modal.Title>
      </Modal.Header>
      <Spin tip="Carregando..." spinning={false}>
        <Modal.Body>
          <div className="col-4 mt-0">
            <label className="font-weight-bold">Data do Lançamento</label>
            <Field
              className="data_lancamento_modal"
              component={InputText}
              name="data_lancamento"
              disabled
              placeholder={formatarDataLancamento()}
            />
          </div>
          <div className="col-12 mt-3">
            <label className="font-weight-bold">Observação</label>
            <Field
              component={TextAreaWYSIWYG}
              name={`${rowName}__dia_${dia}__categoria_${categoria}`}
              ehModal={true}
            />
            <OnChange name={`${rowName}__dia_${dia}__categoria_${categoria}`}>
              {value => onChangeTextAreaField(value)}
            </OnChange>
          </div>
        </Modal.Body>
        <Modal.Footer className="botoes-modal-footer">
          {!["<p></p>\n", null, ""].includes(
            values[`${rowName}__dia_${dia}__categoria_${categoria}`]
          ) &&
          valoresPeriodosLancamentos.length > 0 &&
          showBotaoExcluir ? (
            <Botao
              className="ml-3 float-left"
              texto="Excluir"
              type={BUTTON_TYPE.BUTTON}
              icon={BUTTON_ICON.TRASH}
              onClick={() => onClickExcluir()}
              style={BUTTON_STYLE.RED_OUTLINE}
            />
          ) : (
            <div />
          )}
          <div className="botoes-right">
            <Botao
              className="ml-3"
              texto="Voltar"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => onClickVoltar()}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
            <Botao
              className="ml-3 mr-3"
              texto="Salvar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              disabled={desabilitarBotaoSalvar}
              onClick={() => onClickSalvar()}
            />
          </div>
        </Modal.Footer>
      </Spin>
    </Modal>
  );
};
