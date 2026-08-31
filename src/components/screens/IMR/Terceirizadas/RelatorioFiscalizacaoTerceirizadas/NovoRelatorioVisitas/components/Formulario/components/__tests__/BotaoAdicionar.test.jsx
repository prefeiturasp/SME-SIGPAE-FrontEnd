import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { AdicionarResposta } from "../BotaoAdicionar";

jest.mock("src/components/Shareable/Botao", () =>
  jest.fn(({ className, onClick, texto, type }) => (
    <button className={className} onClick={onClick} type={type}>
      {texto}
    </button>
  )),
);

const UUID_OCORRENCIA = "9d197495-3e7d-414b-aab8-38b9b35e6d54";
const NOME_CAMPO = `grupos_${UUID_OCORRENCIA}`;

describe("AdicionarResposta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o botão com as configurações esperadas", () => {
    render(<AdicionarResposta nameFieldArray={NOME_CAMPO} push={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Adicionar +" })).toHaveClass(
      "col-3",
      "mb-3",
    );
    expect(Botao.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        style: BUTTON_STYLE.GREEN_OUTLINE,
        texto: "Adicionar +",
        type: BUTTON_TYPE.BUTTON,
      }),
    );
  });

  it("adiciona uma resposta ao grupo informado", () => {
    const push = jest.fn();
    render(<AdicionarResposta nameFieldArray={NOME_CAMPO} push={push} />);

    fireEvent.click(screen.getByRole("button", { name: "Adicionar +" }));

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(NOME_CAMPO);
  });
});
