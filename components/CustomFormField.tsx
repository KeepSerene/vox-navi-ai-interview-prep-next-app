import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

interface CustomFormFieldProps<T extends FieldValues> {
  inputType?: "text" | "email" | "password" | "file";
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
}

function CustomFormField<T extends FieldValues>({
  inputType = "text",
  name,
  control,
  label,
  placeholder,
}: CustomFormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>

          <FormControl>
            <Input
              type={inputType}
              placeholder={placeholder}
              className="input"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default CustomFormField;
