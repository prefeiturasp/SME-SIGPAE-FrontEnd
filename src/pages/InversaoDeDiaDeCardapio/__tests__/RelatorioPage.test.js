import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import HTTP_STATUS from "http-status-codes";
import {
  RelatorioBase,
  RelatorioEscola,
  RelatorioDRE,
  RelatorioCODAE,
  RelatorioTerceirizada,
} from "../RelatorioPage";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import { getMotivosDREnaoValida } from "src/services/relatorios";

jest.mock("src/services/relatorios", () => ({
  getMotivosDREnaoValida: jest.fn(),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div>Breadcrumb Mock</div>
));
jest.mock(
  "src/components/Shareable/Page/Page",
  () =>
    ({ children, ...props }) =>
      <div {...props}>{children}</div>
);
jest.mock("src/components/InversaoDeDiaDeCardapio/Container", () => () => (
  <div>Container Mock</div>
));
jest.mock(
  "src/components/InversaoDeDiaDeCardapio/Relatorio",
  () =>
    ({ motivosDREnaoValida, ...props }) =>
      (
        <div
          data-testid="relatorio-mock"
          motivosDREnaoValida={JSON.stringify(motivosDREnaoValida)}
          {...props}
        >
          Relatorio Mock
        </div>
      )
);

jest.mock("src/components/Shareable/ModalCancelarSolicitacao_", () => () => (
  <div>ModalCancelarSolicitacao Mock</div>
));
jest.mock(
  "src/components/Shareable/ModalNaoValidarSolicitacaoReduxForm",
  () => () => <div>ModalNaoValidarSolicitacao Mock</div>
);
jest.mock("src/components/Shareable/ModalNegarSolicitacao", () => () => (
  <div>ModalNegarSolicitacao Mock</div>
));
jest.mock("src/components/Shareable/ModalCODAEQuestiona", () => () => (
  <div>ModalCODAEQuestiona Mock</div>
));
jest.mock(
  "src/components/Shareable/ModalTerceirizadaRespondeQuestionamento",
  () => () => <div>ModalTerceirizadaRespondeQuestionamento Mock</div>
);
jest.mock(
  "src/components/Shareable/ModalAprovarGenericoSimOpcional",
  () => () => <div>ModalAprovarGenericoSimOpcional Mock</div>
);

describe("RelatorioPage", () => {
  const mockMotivos = [
    { uuid: "1", nome: "Motivo 1" },
    { uuid: "2", nome: "Motivo 2" },
  ];

  beforeEach(() => {
    getMotivosDREnaoValida.mockResolvedValue({
      status: HTTP_STATUS.OK,
      data: { results: mockMotivos },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("RelatorioBase", () => {
    it("deve renderizar corretamente e buscar motivos DRE não valida", async () => {
      render(<RelatorioBase />);

      expect(getMotivosDREnaoValida).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        const relatorio = screen.getByTestId("relatorio-mock");
        expect(relatorio).toBeInTheDocument();
        expect(relatorio.getAttribute("motivosDREnaoValida")).toEqual(
          JSON.stringify(mockMotivos)
        );
      });
    });

    it("deve lidar com erro na busca de motivos DRE não valida", async () => {
      getMotivosDREnaoValida.mockResolvedValue({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      });

      render(<RelatorioBase />);

      await waitFor(() => {
        const relatorio = screen.getByTestId("relatorio-mock");
        expect(relatorio).toBeInTheDocument();
        expect(relatorio.getAttribute("motivosDREnaoValida")).toBeNull();
      });
    });
  });

  describe("RelatorioEscola", () => {
    it("deve renderizar corretamente com props da escola", async () => {
      render(<RelatorioEscola />);

      await waitFor(() => {
        const relatorio = screen.getByTestId("relatorio-mock");
        expect(relatorio).toBeInTheDocument();
        expect(relatorio.getAttribute("visao")).toBe(ESCOLA);
        expect(relatorio.getAttribute("textoBotaoNaoAprova")).toBe("Cancelar");
      });
    });
  });

  describe("RelatorioDRE", () => {
    it("deve renderizar corretamente com props da DRE", async () => {
      render(<RelatorioDRE />);

      await waitFor(() => {
        const relatorio = screen.getByTestId("relatorio-mock");
        expect(relatorio).toBeInTheDocument();
        expect(relatorio.getAttribute("visao")).toBe(DRE);
        expect(relatorio.getAttribute("textoBotaoNaoAprova")).toBe(
          "Não Validar"
        );
        expect(relatorio.getAttribute("textoBotaoAprova")).toBe("Validar");
      });
    });
  });

  describe("RelatorioCODAE", () => {
    it("deve renderizar corretamente com props da CODAE", async () => {
      render(<RelatorioCODAE />);

      await waitFor(() => {
        const relatorio = screen.getByTestId("relatorio-mock");
        expect(relatorio).toBeInTheDocument();
        expect(relatorio.getAttribute("visao")).toBe(CODAE);
        expect(relatorio.getAttribute("textoBotaoNaoAprova")).toBe("Negar");
        expect(relatorio.getAttribute("textoBotaoAprova")).toBe("Autorizar");
      });
    });
  });

  describe("RelatorioTerceirizada", () => {
    it("deve renderizar corretamente com props da Terceirizada", async () => {
      render(<RelatorioTerceirizada />);

      await waitFor(() => {
        const relatorio = screen.getByTestId("relatorio-mock");
        expect(relatorio).toBeInTheDocument();
        expect(relatorio.getAttribute("visao")).toBe(TERCEIRIZADA);
        expect(relatorio.getAttribute("textoBotaoNaoAprova")).toBe("Não");
        expect(relatorio.getAttribute("textoBotaoAprova")).toBe("Ciente");
      });
    });
  });
});
