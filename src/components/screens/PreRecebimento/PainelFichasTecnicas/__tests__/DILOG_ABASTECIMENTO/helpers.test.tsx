import "@testing-library/jest-dom";
import { gerarLinkItemFichaTecnica } from "src/components/screens/PreRecebimento/PainelFichasTecnicas/helpers";
import {
  usuarioEhDilogAbastecimento,
  usuarioEhCronograma,
} from "src/helpers/utilities";

jest.mock("src/helpers/utilities", () => ({
  usuarioEhDilogAbastecimento: jest.fn(),
  usuarioEhCronograma: jest.fn(),
}));

const mockItem = (status: string) => ({
  uuid: "d2b75164-7ec1-45be-a7ce-1bf99261d5f4",
  numero_ficha: "FT071",
  nome_produto: "BANANA NANICA",
  nome_empresa: "JP Alimentos",
  status,
  log_mais_recente: "10/04/2025 14:41",
});

describe("gerarLinkItemFichaTecnica", () => {
  const urlDetalhar = "/pre-recebimento/detalhar-ficha-tecnica";
  const urlAnalisar = "/pre-recebimento/analisar-ficha-tecnica";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar urlDetalhar se o usuário for do Dilog Abastecimento", () => {
    (usuarioEhDilogAbastecimento as jest.Mock).mockReturnValue(true);
    (usuarioEhCronograma as jest.Mock).mockReturnValue(false);

    const result = gerarLinkItemFichaTecnica(mockItem("Enviada para Análise"));
    expect(result).toBe(urlDetalhar);
  });

  it("deve retornar urlDetalhar se o usuário for do Cronograma", () => {
    (usuarioEhDilogAbastecimento as jest.Mock).mockReturnValue(false);
    (usuarioEhCronograma as jest.Mock).mockReturnValue(true);

    const result = gerarLinkItemFichaTecnica(mockItem("Enviada para Análise"));
    expect(result).toBe(urlDetalhar);
  });

  it('deve retornar urlDetalhar se o status for "Aprovada"', () => {
    (usuarioEhDilogAbastecimento as jest.Mock).mockReturnValue(false);
    (usuarioEhCronograma as jest.Mock).mockReturnValue(false);

    const result = gerarLinkItemFichaTecnica(mockItem("Aprovada"));
    expect(result).toBe(urlDetalhar);
  });

  it('deve retornar urlDetalhar se o status for "Enviada para Correção"', () => {
    (usuarioEhDilogAbastecimento as jest.Mock).mockReturnValue(false);
    (usuarioEhCronograma as jest.Mock).mockReturnValue(false);

    const result = gerarLinkItemFichaTecnica(mockItem("Enviada para Correção"));
    expect(result).toBe(urlDetalhar);
  });

  it('deve retornar urlAnalisar se o status for "Enviada para Análise"', () => {
    (usuarioEhDilogAbastecimento as jest.Mock).mockReturnValue(false);
    (usuarioEhCronograma as jest.Mock).mockReturnValue(false);

    const result = gerarLinkItemFichaTecnica(mockItem("Enviada para Análise"));
    expect(result).toBe(urlAnalisar);
  });

  it("deve retornar urlAnalisar para status não especificado", () => {
    (usuarioEhDilogAbastecimento as jest.Mock).mockReturnValue(false);
    (usuarioEhCronograma as jest.Mock).mockReturnValue(false);

    const result = gerarLinkItemFichaTecnica(mockItem("Desconhecido"));
    expect(result).toBe(urlAnalisar);
  });
});
