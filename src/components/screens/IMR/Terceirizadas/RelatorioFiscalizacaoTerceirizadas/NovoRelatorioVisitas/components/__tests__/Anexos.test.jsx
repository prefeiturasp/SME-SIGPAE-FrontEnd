import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Anexos } from "../Anexos";

jest.mock("src/components/Shareable/InputFileField", () =>
  jest.fn(({ removeFile }) => (
    <div data-testid="campo-anexos">
      <button type="button" onClick={() => removeFile(1)}>
        Remover segundo anexo
      </button>
    </div>
  )),
);

jest.mock("src/components/Shareable/Input/InputFile/helper", () => ({
  downloadAndConvertToBase64: jest
    .fn()
    .mockResolvedValue("data:application/pdf;base64,YW5leG8taW5pY2lhbA=="),
}));

jest.mock("src/components/PreRecebimento/BotaoAnexo", () =>
  jest.fn(({ urlAnexo }) => <a href={urlAnexo}>Visualizar anexo</a>),
);

const anexos = [
  {
    nome: "primeiro.pdf",
    arquivo: "data:application/pdf;base64,cHJpbWVpcm8=",
  },
  {
    nome: "segundo.png",
    arquivo: "data:image/png;base64,c2VndW5kbw==",
  },
];

const anexosIniciais = [
  {
    nome: "anexo-inicial.pdf",
    anexo_url: "https://arquivos.sme.prefeitura.sp.gov.br/anexo-inicial.pdf",
  },
];

const renderizarComponente = (props = {}) => {
  const setAnexos = jest.fn();

  render(
    <Anexos
      anexos={anexos}
      anexosIniciais={[]}
      setAnexos={setAnexos}
      {...props}
    />,
  );

  return { setAnexos };
};

describe("Anexos", () => {
  it("remove o arquivo correspondente ao índice informado", () => {
    const { setAnexos } = renderizarComponente();

    fireEvent.click(
      screen.getByRole("button", { name: "Remover segundo anexo" }),
    );

    expect(setAnexos).toHaveBeenCalledWith([anexos[0]]);
  });

  it("exibe somente os anexos existentes no modo de leitura", async () => {
    await act(async () => {
      renderizarComponente({ anexosIniciais, somenteLeitura: true });
    });

    expect(screen.queryByTestId("campo-anexos")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Visualizar anexo" }),
    ).toHaveAttribute("href", anexosIniciais[0].anexo_url);
  });
});
