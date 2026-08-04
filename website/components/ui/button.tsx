import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base: tactile feel — defined hover AND active states
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "cursor-pointer select-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    // Active tactile press
    "active:scale-[0.97] active:brightness-90",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover hover:shadow-glow",
          "border border-primary/0 hover:border-primary/40",
        ].join(" "),
        accent: [
          "bg-accent text-accent-foreground font-semibold",
          "hover:bg-accent-hover",
          "shadow-sm hover:shadow-[0_0_20px_-4px_var(--accent)]",
        ].join(" "),
        outline: [
          "border border-border bg-background/50",
          "text-foreground",
          "hover:bg-background-subtle hover:border-border-strong hover:text-foreground",
        ].join(" "),
        ghost: [
          "text-muted-foreground",
          "hover:bg-muted hover:text-foreground",
        ].join(" "),
        muted: [
          "bg-muted text-muted-foreground border border-border",
          "hover:bg-muted/80 hover:border-border-strong hover:text-foreground",
        ].join(" "),
      },
      size: {
        sm:      "h-8 px-3 text-xs rounded-md gap-1.5 [&_svg]:size-3.5",
        default: "h-10 px-4 text-sm rounded-lg gap-2 [&_svg]:size-4",
        lg:      "h-12 px-6 text-[0.9375rem] rounded-xl gap-2.5 [&_svg]:size-4",
        xl:      "h-14 px-8 text-base rounded-xl gap-3 [&_svg]:size-5",
        icon:    "h-9 w-9 rounded-lg [&_svg]:size-4",
        "icon-sm": "h-7 w-7 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
