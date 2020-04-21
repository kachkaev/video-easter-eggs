import React from "react";
import styled from "styled-components";

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
}

const CheckboxWrapper = styled.span`
  white-space: nowrap;
`;

const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  label,
  ...rest
}) => {
  return (
    <CheckboxWrapper>
      <input type="checkbox" {...rest} />{" "}
      <label htmlFor={rest.id}>{label}</label>
    </CheckboxWrapper>
  );
};

export default Checkbox;
