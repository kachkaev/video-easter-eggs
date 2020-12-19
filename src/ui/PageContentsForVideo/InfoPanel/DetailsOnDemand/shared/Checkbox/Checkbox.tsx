import * as React from "react";
import styled from "styled-components";

import { CheckedIcon } from "./CheckIcon";

interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  children: React.ReactNode;
}

const CheckboxWrapper = styled.span<{ isChecked: boolean }>`
  white-space: nowrap;
  position: relative;
  display: block;
  background: no-repeat 0px 2px;
  background-size: 1em;
`;

const Input = styled.input`
  position: absolute;
  left: -10000px;
`;

const StyledCheckIcon = styled(CheckedIcon)`
  position: absolute;
  pointer-events: none;
  width: 12px;
  top: 2px;
  left: 0;
`;

const Label = styled.label`
  padding-left: 1.5em;
  .no-touchscreen &:hover {
    color: #000;
  }
`;

export const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  children,
  ref,
  as,
  ...rest
}) => {
  return (
    <CheckboxWrapper isChecked={Boolean(rest.checked)}>
      <Input type="checkbox" {...rest} />
      <Label htmlFor={rest.id}>
        <StyledCheckIcon checked={Boolean(rest.checked)} />
        {children}
      </Label>
    </CheckboxWrapper>
  );
};
