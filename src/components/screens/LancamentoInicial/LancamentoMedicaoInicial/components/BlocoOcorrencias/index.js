import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
export const BlocoOcorrencias = ({ ...props }) => {
  const {
    comOcorrencias,
    setComOcorrencias,
    errosAoSalvar,
    setErrosAoSalvar,
    ano,
    mes,
    escolaSimples,
    solicitacaoMedicaoInicialUuid,
  } = props;
  const navigate = useNavigate();
  return _jsxs("div", {
    className: "bloco-ocorrencias mb-3",
    children: [
      _jsx("div", {
        className: "pb-3",
        children: _jsx("b", {
          className: "section-title",
          children: "Ocorr\u00EAncias",
        }),
      }),
      _jsxs("div", {
        className: `box row ${
          errosAoSalvar &&
          errosAoSalvar.find((erro) => erro.periodo_escolar === "OCORRENCIAS")
            ? "border-danger"
            : ""
        }`,
        children: [
          _jsxs("div", {
            className: "col-8 my-auto",
            children: [
              _jsx("span", {
                className: "me-3",
                children: "Avalia\u00E7\u00E3o do Servi\u00E7o: ",
              }),
              _jsx("input", {
                name: "com_ocorrencias",
                onClick: () => {
                  setComOcorrencias("false");
                  setErrosAoSalvar(
                    errosAoSalvar.filter(
                      (obj) => obj.periodo_escolar !== "OCORRENCIAS"
                    )
                  );
                },
                type: "radio",
                value: "false",
                id: "false",
                required: true,
              }),
              _jsx("label", {
                className: "ms-1",
                htmlFor: "false",
                children: "Servi\u00E7o prestado sem ocorr\u00EAncias",
              }),
              _jsx("input", {
                name: "com_ocorrencias",
                className: "ms-3",
                onClick: () => {
                  setComOcorrencias("true");
                  setErrosAoSalvar(
                    errosAoSalvar.filter(
                      (obj) => obj.periodo_escolar !== "OCORRENCIAS"
                    )
                  );
                },
                type: "radio",
                value: "true",
                id: "true",
                required: true,
              }),
              _jsx("label", {
                className: "ms-1",
                htmlFor: "true",
                children: "Com ocorr\u00EAncias",
              }),
            ],
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsxs("div", {
              className: "row",
              children: [
                _jsx("div", {
                  className: "col-4",
                  children:
                    errosAoSalvar &&
                    errosAoSalvar
                      .filter((obj) => obj.periodo_escolar === "OCORRENCIAS")
                      .map((obj, idxErros) => {
                        return _jsx(
                          "span",
                          {
                            className: "mt-auto mensagem-erro",
                            children: obj.erro,
                          },
                          idxErros
                        );
                      }),
                }),
                _jsx("div", {
                  className: "col-8 text-end",
                  children: _jsx(Botao, {
                    texto: "Registrar Ocorr\u00EAncias",
                    onClick: () =>
                      navigate({
                        pathname: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}`,
                        search: createSearchParams({
                          ano,
                          mes,
                          editalUuid: escolaSimples.lote.contratos_do_lote.find(
                            (contrato) => !contrato.encerrado
                          ).edital,
                          solicitacaoMedicaoInicialUuid,
                        }).toString(),
                      }),
                    disabled: comOcorrencias !== "true",
                    type: BUTTON_TYPE.BUTTON,
                    style: BUTTON_STYLE.RED_OUTLINE,
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};
