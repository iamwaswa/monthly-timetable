import type { ChangeEventHandler, ReactNode } from "react";
import { useId } from "react";

interface ISelectProps<
  Value extends number | string,
  ChangeHandler extends ChangeEventHandler<HTMLSelectElement>
> {
  children: Array<ReactNode>;
  className: string;
  label: ReactNode;
  value: Value;
  onChange: ChangeHandler;
}

export function Select<
  Value extends number | string,
  ChangeHandler extends ChangeEventHandler<HTMLSelectElement>
>({
  children,
  className,
  label,
  value,
  onChange,
}: ISelectProps<Value, ChangeHandler>) {
  const id = useId();

  return (
    <section className={className}>
      <label htmlFor={id}>{label}</label>
      <select
        className="py-2.5 shadow-md"
        id={id}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </section>
  );
}
