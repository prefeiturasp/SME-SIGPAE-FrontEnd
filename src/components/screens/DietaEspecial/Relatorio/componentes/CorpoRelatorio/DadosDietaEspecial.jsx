import React from "react";
import { Field } from "react-final-form";
import { InputText } from "components/Shareable/Input/InputText";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON
} from "components/Shareable/Botao/constants";

const DadosDietaEspecial = ({ values, dietaEspecial, card }) => {
  const downloadAnexo = url => {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const observacoes = (
    <div
      className="observacoes"
      dangerouslySetInnerHTML={{
        __html: values.observacoes
      }}
    />
  );

  const checaTipoSolicitacao = () => {
    if (card && ["autorizadas", "autorizadas-temp"].includes(card)) {
      return true;
    } else if (
      card &&
      ["inativas", "inativas-temp"].includes(card) &&
      dietaEspecial.ativo === false
    ) {
      return true;
    } else if (dietaEspecial.tipo_solicitacao === "ALTERACAO_UE") {
      return dietaEspecial.status_solicitacao === "CODAE_NEGOU_PEDIDO";
    }
    return (
      dietaEspecial.tipo_solicitacao !== "ALTERACAO_UE" &&
      ![
        "TERMINADA_AUTOMATICAMENTE_SISTEMA",
        "CANCELADO_ALUNO_MUDOU_ESCOLA",
        "CANCELADO_ALUNO_NAO_PERTENCE_REDE"
      ].includes(dietaEspecial.status_solicitacao)
    );
  };

  const anexos = values.anexos.map((anexo, key) => {
    return (
      <div className="col-2 mb-3" key={key}>
        <p>
          <b>Anexo {key + 1}</b>
        </p>
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.ATTACH}
          className="w-100"
          onClick={() => downloadAnexo(anexo.arquivo_url)}
        />
      </div>
    );
  });

  return (
    <div className="row mb-3">
      {dietaEspecial &&
        (dietaEspecial.eh_importado === false ||
          (dietaEspecial.eh_importado === true &&
            dietaEspecial.protocolo_padrao)) && (
          <>
            <div className="col-12 mb-3">
              <label className="sectionName">
                Detalhamento da Dieta Especial
              </label>
            </div>
            <div className="col-4">
              <Field
                component={InputText}
                name="registro_funcional_pescritor"
                label="Registro Funcional (CRM/CRN/CRFa/RMS)"
                disabled={true}
              />
            </div>
            <div className="col-8" />
            <div className="col-8">
              <Field
                component={InputText}
                name="nome_completo_pescritor"
                label="Nome do Prescritor do laudo (médico, nutricionista, fonoaudiólogo)"
                disabled={true}
              />
            </div>
            <div className="col-4" />
            {checaTipoSolicitacao() && (
              <div className="col-12">
                <Field
                  component={InputText}
                  name="laudo"
                  defaultValue="O laudo fornecido pelo profissional. Sem ele, a solicitação de Dieta Especial será negada."
                  label="Laudo"
                  disabled={true}
                />
              </div>
            )}
            <div className="col-12">
              <p className="mt-1">Anexos</p>
              <div className="row">{anexos}</div>
            </div>
          </>
        )}
      <div className="col-12">
        <p className="mt-1">Observações</p>
        {observacoes}
      </div>
    </div>
  );
};

export default DadosDietaEspecial;
