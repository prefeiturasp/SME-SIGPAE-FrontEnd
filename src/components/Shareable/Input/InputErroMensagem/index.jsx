import "./style.scss";

export const InputErroMensagem = (props) => {
  const { meta, visitedError, dirtyValidation } = props;

  return (
    <div className="error-or-warning-message">
      {meta &&
        (visitedError
          ? meta.visited
          : dirtyValidation
            ? meta.dirty || meta.touched
            : meta.touched) &&
        ((meta.error && <div className="error-message">{meta.error}</div>) ||
          (meta.warning && (
            <div className="warning-message">{meta.warning}</div>
          )))}
    </div>
  );
};

export default InputErroMensagem;
