import "@testing-library/jest-dom";
import React from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { reducer as formReducer } from "redux-form";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import {
    FiltroEnum,
    TIPO_SOLICITACAO,
} from "src/constants/shared";

const mockGetCodaePedidosDeKitLanche = jest.fn();
const mockGetLotesSimples = jest.fn();
const mockGetDiretoriaregionalSimplissima = jest.fn();
const mockUsuarioEhCODAEGestaoAlimentacao = jest.fn();
const mockCardPendenteAcao = jest.fn();
const mockFiltraPrioritarios = jest.fn();
const mockFiltraNoLimite = jest.fn();
const mockFiltraRegular = jest.fn();
const mockOrdenarPedidosDataMaisRecente = jest.fn();

jest.mock("src/services/kitLanche", () => ({
    getCodaePedidosDeKitLanche: (...args) =>
        mockGetCodaePedidosDeKitLanche(...args),
}));

jest.mock("src/services/lote.service", () => ({
    getLotesSimples: (...args) => mockGetLotesSimples(...args),
}));

jest.mock("src/services/diretoriaRegional.service", () => ({
    getDiretoriaregionalSimplissima: (...args) =>
        mockGetDiretoriaregionalSimplissima(...args),
}));

jest.mock("src/helpers/utilities", () => {
    const actualUtilities = jest.requireActual("src/helpers/utilities");

    return {
        ...actualUtilities,
        dataAtualDDMMYYYY: jest.fn(() => "09/06/2026"),
        safeConcatOn: jest.fn((field, ...responses) =>
            responses.flatMap((response) => response[field] || []),
        ),
        formatarOpcoesLote: jest.fn((lotes) =>
            lotes.map((lote) => ({
                value: lote.uuid,
                label: lote.nome,
            })),
        ),
        formatarOpcoesDRE: jest.fn((dres) =>
            dres.map((dre) => ({
                value: dre.uuid,
                label: dre.nome,
            })),
        ),
        usuarioEhCODAEGestaoAlimentacao: () =>
            mockUsuarioEhCODAEGestaoAlimentacao(),
    };
});

jest.mock("src/helpers/painelPedidos", () => ({
    filtraPrioritarios: (...args) => mockFiltraPrioritarios(...args),
    filtraNoLimite: (...args) => mockFiltraNoLimite(...args),
    filtraRegular: (...args) => mockFiltraRegular(...args),
    ordenarPedidosDataMaisRecente: (...args) =>
        mockOrdenarPedidosDataMaisRecente(...args),
}));

jest.mock("src/components/Shareable/MakeField", () => {
    const React = require("react");

    return {
        ASelect: ({ input, filterOption }) => {
            if (filterOption) {
                filterOption(input.value || "", {
                    props: {
                        children: "Diretoria Regional",
                    },
                });
            }

            return React.createElement("input", {
                "data-testid": `select-${input.name}`,
                value: input.value || "",
                onChange: (event) => {
                    input.onChange(event.target.value);
                },
                onBlur: (event) => {
                    input.onBlur(event);
                },
            });
        },
    };
});

jest.mock("src/components/Shareable/Select", () => {
    const React = require("react");

    return function Select({ input, options = [] }) {
        return React.createElement(
            "select",
            {
                "data-testid": "select-visao-por",
                value: input.value || "",
                onChange: (event) => {
                    input.onChange(event);
                },
            },
            [
                React.createElement(
                    "option",
                    {
                        key: "empty",
                        value: "",
                    },
                    "Filtro por",
                ),
                ...options.map((option) =>
                    React.createElement(
                        "option",
                        {
                            key: option.value,
                            value: option.value,
                        },
                        option.label,
                    ),
                ),
            ],
        );
    };
});

jest.mock("antd", () => {
    const React = require("react");

    const Select = ({ children }) => React.createElement("select", {}, children);

    Select.Option = ({ children, value }) =>
        React.createElement(
            "option",
            {
                value,
            },
            children,
        );

    return {
        Select,
    };
});

jest.mock(
    "src/components/SolicitacaoDeKitLanche/components/CardPendenteAcao",
    () => {
        const React = require("react");

        return {
            CardPendenteAcao: (props) => {
                mockCardPendenteAcao(props);

                return React.createElement(
                    "section",
                    {
                        "data-testid": `card-${props.tipoDeCard}`,
                    },
                    React.createElement("h2", {}, props.titulo),
                    React.createElement(
                        "span",
                        {
                            "data-testid": `quantidade-${props.tipoDeCard}`,
                        },
                        props.pedidos.length,
                    ),
                );
            },
        };
    },
);

const PainelPedidos = require("../CODAE/PainelPedidos").default;

describe("PainelPedidos", () => {
    const dreUuid = "8f1da4a7-11b6-4a09-9eaa-6633d066f26b";
    const loteUuid = "f9cb1f30-7b86-4cc2-9f5f-d9e7d81c1234";

    const pedidoPrioritario = {
        id_externo: "ABC123",
        prioridade: "PRIORITARIO",
        data: "10/06/2026",
    };

    const pedidoNoLimite = {
        id_externo: "DEF456",
        prioridade: "LIMITE",
        data: "11/06/2026",
    };

    const pedidoRegular = {
        id_externo: "GHI789",
        prioridade: "REGULAR",
        data: "12/06/2026",
    };

    const createTestStore = (initialState = {}) =>
        createStore(
            combineReducers({
                form: formReducer,
            }),
            initialState,
        );

    const renderPainelPedidos = ({ props = {}, initialState = {} } = {}) => {
        const store = createTestStore(initialState);

        return render(
            <Provider store={store}>
                <PainelPedidos
                    visaoPorCombo={[
                        {
                            value: FiltroEnum.SEM_FILTRO,
                            label: "Sem filtro",
                        },
                        {
                            value: "outro_filtro",
                            label: "Outro filtro",
                        },
                    ]}
                    {...props}
                />
            </Provider>,
        );
    };

    const waitForPedidosLoad = async () => {
        await waitFor(() => {
            expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
        });
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUsuarioEhCODAEGestaoAlimentacao.mockReturnValue(true);

        mockGetLotesSimples.mockResolvedValue({
            status: 200,
            data: {
                results: [
                    {
                        uuid: loteUuid,
                        nome: "CS - 04",
                    },
                ],
            },
        });

        mockGetDiretoriaregionalSimplissima.mockResolvedValue({
            status: 200,
            data: {
                results: [
                    {
                        uuid: dreUuid,
                        nome: "DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO",
                    },
                ],
            },
        });

        mockGetCodaePedidosDeKitLanche.mockImplementation(
            async (filtro, tipoSolicitacao) => {
                if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_NORMAL) {
                    return {
                        results: [pedidoPrioritario],
                    };
                }

                if (tipoSolicitacao === TIPO_SOLICITACAO.SOLICITACAO_CEI) {
                    return {
                        results: [pedidoNoLimite],
                    };
                }

                return {
                    results: [pedidoRegular],
                };
            },
        );

        mockFiltraPrioritarios.mockImplementation((pedidos) =>
            pedidos.filter((pedido) => pedido.prioridade === "PRIORITARIO"),
        );

        mockFiltraNoLimite.mockImplementation((pedidos) =>
            pedidos.filter((pedido) => pedido.prioridade === "LIMITE"),
        );

        mockFiltraRegular.mockImplementation((pedidos) =>
            pedidos.filter((pedido) => pedido.prioridade === "REGULAR"),
        );

        mockOrdenarPedidosDataMaisRecente.mockImplementation((pedidos) => pedidos);
    });

    it("exibe carregando antes de finalizar a busca dos pedidos", async () => {
        renderPainelPedidos();

        expect(screen.getByText("Carregando...")).toBeInTheDocument();

        await waitForPedidosLoad();
    });

    it("busca pedidos normais, CEI e CEMEI com filtros padrão ao montar a tela", async () => {
        renderPainelPedidos();

        await waitFor(() => {
            expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
        });

        expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
            1,
            FiltroEnum.SEM_FILTRO,
            TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
            {
                lote: [],
                diretoria_regional: [],
            },
        );

        expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
            2,
            FiltroEnum.SEM_FILTRO,
            TIPO_SOLICITACAO.SOLICITACAO_CEI,
            {
                lote: [],
                diretoria_regional: [],
            },
        );

        expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
            3,
            FiltroEnum.SEM_FILTRO,
            TIPO_SOLICITACAO.SOLICITACAO_CEMEI,
            {
                lote: [],
                diretoria_regional: [],
            },
        );
    });

    it("busca lotes e diretorias regionais ao montar a tela", async () => {
        renderPainelPedidos();

        await waitFor(() => {
            expect(mockGetLotesSimples).toHaveBeenCalledTimes(1);
            expect(mockGetDiretoriaregionalSimplissima).toHaveBeenCalledTimes(1);
        });
    });

    it("preenche os campos do formulário quando recebe filtros por props", async () => {
        renderPainelPedidos({
            props: {
                filtros: {
                    diretoria_regional: dreUuid,
                    lote: loteUuid,
                },
            },
        });

        await waitForPedidosLoad();

        expect(screen.getByTestId("select-diretoria_regional")).toHaveValue(dreUuid);
        expect(screen.getByTestId("select-lote")).toHaveValue(loteUuid);
    });

    it("filtra pelo select comum quando o usuário não é CODAE Gestão Alimentação", async () => {
        mockUsuarioEhCODAEGestaoAlimentacao.mockReturnValue(false);

        renderPainelPedidos();

        await waitForPedidosLoad();

        mockGetCodaePedidosDeKitLanche.mockClear();

        fireEvent.change(screen.getByTestId("select-visao-por"), {
            target: {
                value: "outro_filtro",
            },
        });

        await waitFor(() => {
            expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
        });

        expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
            1,
            "outro_filtro",
            TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
            {
                lote: undefined,
                diretoria_regional: undefined,
            },
        );
    });

    it("filtra novamente ao selecionar DRE e lote", async () => {
        renderPainelPedidos();

        await waitForPedidosLoad();

        mockGetCodaePedidosDeKitLanche.mockClear();

        fireEvent.change(screen.getByTestId("select-diretoria_regional"), {
            target: {
                value: dreUuid,
            },
        });

        await waitFor(() => {
            expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
        });

        expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
            1,
            FiltroEnum.SEM_FILTRO,
            TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
            {
                diretoria_regional: dreUuid,
                lote: undefined,
            },
        );

        await waitForPedidosLoad();

        mockGetCodaePedidosDeKitLanche.mockClear();

        fireEvent.change(screen.getByTestId("select-lote"), {
            target: {
                value: loteUuid,
            },
        });

        await waitFor(() => {
            expect(mockGetCodaePedidosDeKitLanche).toHaveBeenCalledTimes(3);
        });

        expect(mockGetCodaePedidosDeKitLanche).toHaveBeenNthCalledWith(
            1,
            FiltroEnum.SEM_FILTRO,
            TIPO_SOLICITACAO.SOLICITACAO_NORMAL,
            {
                diretoria_regional: dreUuid,
                lote: loteUuid,
            },
        );

        await waitForPedidosLoad();

        fireEvent.blur(screen.getByTestId("select-diretoria_regional"));
        fireEvent.blur(screen.getByTestId("select-lote"));

        expect(screen.getByTestId("select-diretoria_regional")).toBeInTheDocument();
        expect(screen.getByTestId("select-lote")).toBeInTheDocument();
    });
});