import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Select } from "src/components/Shareable/Select";
import { formataMesNome } from "src/helpers/utilities";
import { Field, Form } from "react-final-form";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_NOVA_OCORRENCIA,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.scss";
export const ListaOcorrencias = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const onSubmit = () => {};
  return _jsx("div", {
    className: "card lista-ocorrencias mt-3",
    children: _jsx("div", {
      className: "card-body",
      children: _jsx(Form, {
        onSubmit: onSubmit,
        children: ({ handleSubmit }) =>
          _jsx("form", {
            onSubmit: handleSubmit,
            children: _jsxs("div", {
              className: "row",
              children: [
                _jsx("div", {
                  className: "col-3",
                  children: _jsx(Field, {
                    component: Select,
                    name: "mes_ano",
                    label:
                      "Per\u00EDodo de Lan\u00E7amento da Medi\u00E7\u00E3o",
                    options: [
                      {
                        nome: `${formataMesNome(
                          searchParams.get("mes")
                        )} / ${searchParams.get("ano")}`,
                        uuid: "",
                      },
                    ],
                    disabled: true,
                  }),
                }),
                _jsx("div", {
                  className: "col-9 mt-auto text-end",
                  children: _jsx(Botao, {
                    texto: "Registrar Nova Ocorr\u00EAncia",
                    type: BUTTON_TYPE.BUTTON,
                    style: BUTTON_STYLE.GREEN_OUTLINE,
                    onClick: () =>
                      navigate(
                        `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${REGISTRAR_NOVA_OCORRENCIA}`,
                        {
                          state: {
                            editalUuid: searchParams.get("editalUuid"),
                            solicitacaoMedicaoInicialUuid: searchParams.get(
                              "solicitacaoMedicaoInicialUuid"
                            ),
                          },
                        }
                      ),
                  }),
                }),
              ],
            }),
          }),
      }),
    }),
  });
};
