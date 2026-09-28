import React, { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";
import { debounce } from "lodash";
import { Field, Form } from "react-final-form";
import CardCronograma from "src/components/Shareable/CardCronograma/CardCronograma";
import InputText from "src/components/Shareable/Input/InputText";
import { gerarParametrosConsulta, truncarString } from "src/helpers/utilities";
import {
  POS_RECEBIMENTO,
  DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";
import {
  getTermosPendentesAssinatura,
  getTermosAssinados,
} from "src/services/posRecebimento.service";
import { CARD_PENDENTES_ASSINATURA, CARD_ASSINADOS } from "./constants";
import {
  FiltrosPainelAssinaturaTermos,
  TermoRecebimentoAssinaturaDashboard,
} from "./interfaces";
import "./styles.scss";

export default () => {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [filtrado, setFiltrado] = useState<boolean>(false);
  const [pendentes, setPendentes] = useState<
    TermoRecebimentoAssinaturaDashboard[]
  >([]);
  const [assinados, setAssinados] = useState<
    TermoRecebimentoAssinaturaDashboard[]
  >([]);

  const formatarItens = (itens: TermoRecebimentoAssinaturaDashboard[]) =>
    itens.map((item) => {
      const cronogramas = (item.numeros_cronogramas || []).join(" | ");
      const produtos = (item.nomes_produtos || []).join(" | ");
      const texto = `${item.empresa} - ${produtos} - ${cronogramas}`;

      return {
        text: truncarString(texto, 40),
        fullText: texto,
        date: item.criado_em,
        link: `/${POS_RECEBIMENTO}/${DETALHAR_TERMO_RECEBIMENTO_DEFINITIVO}?uuid=${item.uuid}`,
        status: "",
      };
    });

  const buscarTermos = useCallback(
    async (filtros: FiltrosPainelAssinaturaTermos = null) => {
      setCarregando(true);

      const params = gerarParametrosConsulta({ ...filtros });

      const [respostaPendentes, respostaAssinados] = await Promise.all([
        getTermosPendentesAssinatura(params),
        getTermosAssinados(params),
      ]);

      setPendentes(respostaPendentes?.data?.results || []);
      setAssinados(respostaAssinados?.data?.results || []);
      setCarregando(false);
    },
    [],
  );

  const filtrarTermos = debounce((values: FiltrosPainelAssinaturaTermos) => {
    const { numero_contrato, nome_produto, nome_empresa } = values;
    const podeFiltrar = [numero_contrato, nome_produto, nome_empresa].some(
      (value) => value && value.length > 2,
    );

    if (podeFiltrar) {
      buscarTermos(values);
      setFiltrado(true);
    } else if (filtrado) {
      setFiltrado(false);
      buscarTermos();
    }
  }, 500);

  useEffect(() => {
    buscarTermos();
  }, [buscarTermos]);

  const cards = [
    { config: CARD_PENDENTES_ASSINATURA, itens: pendentes },
    { config: CARD_ASSINADOS, itens: assinados },
  ];

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-painel-assinatura-termos">
        <div className="card-body painel-assinatura-termos">
          <Form
            initialValues={{
              numero_contrato: "",
              nome_produto: "",
              nome_empresa: "",
            }}
            onSubmit={() => {}}
          >
            {({ form }) => (
              <div className="row mt-2">
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="numero_contrato"
                    placeholder="Pesquisar por Nº do Contrato"
                    inputOnChange={() => filtrarTermos(form.getState().values)}
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="nome_produto"
                    placeholder="Pesquisar por Produto"
                    inputOnChange={() => filtrarTermos(form.getState().values)}
                  />
                </div>
                <div className="col-4">
                  <Field
                    component={InputText}
                    name="nome_empresa"
                    placeholder="Pesquisar por Empresa"
                    inputOnChange={() => filtrarTermos(form.getState().values)}
                  />
                </div>
              </div>
            )}
          </Form>

          <div className="row mt-4">
            {cards.map(({ config, itens }) => (
              <div className="col-6 mb-4" key={config.id}>
                <CardCronograma
                  cardTitle={config.titulo}
                  cardType={config.style}
                  solicitations={formatarItens(itens)}
                  icon={config.icon}
                  href={config.href}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Spin>
  );
};
