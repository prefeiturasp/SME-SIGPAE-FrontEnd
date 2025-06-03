import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import RenderComponentByParametrizacao from "./RenderComponentByParametrizacao";
export const Ocorrencia = ({ ...props }) => {
  const {
    tipoOcorrencia,
    form,
    escolaSelecionada,
    name_grupos,
    indexFieldArray,
    respostasOcorrencias,
    somenteLeitura,
  } = props;
  const excluiGrupoDeResposta = () => {
    const grupos = [...form.getState().values[`grupos_${tipoOcorrencia.uuid}`]];
    grupos.splice(indexFieldArray, 1);
    form.change(`grupos_${tipoOcorrencia.uuid}`, grupos);
  };
  const getUUIDRespostaParametrizacao = (parametrizacao) => {
    let UUIDResposta = "";
    const _resposta = respostasOcorrencias.find(
      (_resposta) =>
        _resposta.parametrizacao.uuid === parametrizacao.uuid &&
        _resposta.grupo === indexFieldArray + 1
    );
    UUIDResposta = _resposta && _resposta.uuid ? _resposta.uuid : "";
    return UUIDResposta;
  };
  return tipoOcorrencia.parametrizacoes.length
    ? _jsx("tr", {
        className: "tipo-ocorrencia-parametrizacao",
        children: _jsxs("td", {
          colSpan: 2,
          className: "py-3",
          children: [
            indexFieldArray > 0 &&
              !somenteLeitura &&
              _jsx(Botao, {
                titulo: "Excluir",
                className: "no-border float-end",
                onClick: () => excluiGrupoDeResposta(),
                type: BUTTON_TYPE.BUTTON,
                style: BUTTON_STYLE.GREEN_OUTLINE,
                icon: BUTTON_ICON.TRASH,
              }),
            tipoOcorrencia.parametrizacoes.map((parametrizacao, index) => {
              let UUID = "";
              if (respostasOcorrencias.length > 0) {
                UUID = getUUIDRespostaParametrizacao(parametrizacao);
              }
              return _jsx(
                "div",
                {
                  className: "row d-flex align-items-center py-1 px-3",
                  children: _jsx(RenderComponentByParametrizacao, {
                    parametrizacao: parametrizacao,
                    tipoOcorrencia: tipoOcorrencia,
                    name_grupos: name_grupos,
                    form: form,
                    escolaSelecionada: escolaSelecionada,
                    UUIDResposta: UUID,
                    somenteLeitura: somenteLeitura,
                  }),
                },
                index
              );
            }),
          ],
        }),
      })
    : _jsx("tr", {
        className: "tipo-ocorrencia-nao-ha-parametrizacao",
        children: _jsx("td", {
          className: "p-3",
          colSpan: 3,
          children: _jsx("div", {
            className: "d-flex justify-content-center align-items-center",
            children: _jsx("p", {
              className: "m-0",
              children:
                "N\u00E3o h\u00E1 parametriza\u00E7\u00E3o para esse item.",
            }),
          }),
        }),
      });
};
