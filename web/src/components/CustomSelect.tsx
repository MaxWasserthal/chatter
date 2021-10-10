import React from "react";

import { useField } from "formik";
import Select from "react-select";
import { FormControl, FormLabel } from "@chakra-ui/form-control";

function CustomSelect({ label, ...props }:any) {
  const [field, , { setValue }] = useField(props);
  const options = props.children.map((option:any) => ({
    value: option.props.value,
    label: option.props.children,
  }));

  const onChange = (value:any) => {
    setValue(value);
  };

  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Select
        defaultValue={options.find((option:any) => option.value === field.value)}
        options={options}
        onChange={onChange}
        isMulti={true}
      />
    </FormControl>
  );
}
export default CustomSelect;