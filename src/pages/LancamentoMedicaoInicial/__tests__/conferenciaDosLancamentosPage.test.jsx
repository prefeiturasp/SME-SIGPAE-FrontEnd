import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ConferenciaDosLancamentosPage } from "src/pages/LancamentoMedicaoInicial/ConferenciaDosLancamentosPage";

const mockUseLocation = jest.fn();
const mockPageSpy = jest.fn(({ children }) => <div>{children}</div>);
const mockBreadcrumbSpy = jest.fn(() => <div>breadcrumb</div>);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => mockUseLocation(),
}));

jest.mock("src/components/Shareable/Page/Page", () => ({
  __esModule: true,
  default: (props) => mockPageSpy(props),
}));

jest.mock("src/components/Shareable/Breadcrumb", () => ({
  __esModule: true,
  default: (props) => mockBreadcrumbSpy(props),
}));

jest.mock(
  "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos",
  () => ({
    __esModule: true,
    ConferenciaDosLancamentos: () => <div>conferencia</div>,
  }),
);

describe("Conferência dos Lançamentos Page", () => {
  beforeEach(() => {
    mockPageSpy.mockClear();
    mockBreadcrumbSpy.mockClear();
  });

  it("usa a URL de retorno recebida no location.state no botão voltar e no breadcrumb", () => {
    const voltarPara =
      "/medicao-inicial/acompanhamento-de-lancamentos?diretoria_regional=108600&mes_ano=09_2023&recreio_nas_ferias=recreio-uuid&status=MEDICAO_APROVADA_PELA_DRE";

    mockUseLocation.mockReturnValue({
      state: { voltarPara },
    });

    render(<ConferenciaDosLancamentosPage />);

    expect(mockPageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        botaoVoltar: true,
        voltarPara,
        titulo: "Conferência dos Lançamentos",
      }),
    );

    expect(mockBreadcrumbSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        anteriores: [
          expect.objectContaining({ href: voltarPara }),
          expect.objectContaining({ href: voltarPara }),
        ],
      }),
    );
  });
});
