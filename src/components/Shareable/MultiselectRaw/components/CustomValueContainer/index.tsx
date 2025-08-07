import { components, ValueContainerProps } from "react-select";

export const CustomValueContainer = (
  props: ValueContainerProps<any, boolean>
) => {
  const { getValue, hasValue } = props;
  const selectedCount = getValue().length;

  if (hasValue && selectedCount > 2) {
    return (
      <components.ValueContainer {...props}>
        <div style={{ paddingLeft: "8px" }}>
          {selectedCount} opções selecionadas
        </div>
      </components.ValueContainer>
    );
  } else {
    return (
      <components.ValueContainer {...props}>
        {props.children}
      </components.ValueContainer>
    );
  }
};
