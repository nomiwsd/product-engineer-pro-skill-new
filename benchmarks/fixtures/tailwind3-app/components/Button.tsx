import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground",
  danger: "bg-danger text-primary-foreground"
};

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`rounded-md px-4 py-2 focus-visible:ring-2 ${styles[variant]} ${className}`} {...props} />;
}
