"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[var(--btn-radius,min(var(--radius-md),10px))] border border-transparent bg-clip-padding text-[length:var(--btn-text,0.9rem)] tracking-[var(--btn-tracking,-0.025em)]  font-[var(--btn-font-weight,500)] whitespace-nowrap transition-all duration-[var(--btn-duration,200ms)] ease-[var(--btn-ease,ease-out)] outline-none select-none hover:scale-[var(--btn-hover-scale,1.02)] hover:ring-[length:var(--btn-ring-thickness,1px)] hover:ring-[color:var(--btn-ring-hover-color,hsl(var(--foreground)/0.2))] active:not-aria-[haspopup]:scale-[var(--btn-active-scale,0.96)] active:not-aria-[haspopup]:translate-y-[length:var(--btn-active-y,1px)] outline-offset-[length:var(--btn-focus-offset,2px)] focus-visible:outline-[length:var(--btn-focus-width,2px)] focus-visible:outline-[color:var(--btn-focus-color,hsl(var(--ring)/0.5))] disabled:pointer-events-none disabled:opacity-[var(--btn-disabled-opacity,0.5)] aria-invalid:border-[color:var(--btn-invalid-border,hsl(var(--destructive)))] aria-invalid:outline aria-invalid:outline-[length:var(--btn-invalid-outline-width,2px)] aria-invalid:outline-[color:var(--btn-invalid-outline-color,hsl(var(--destructive)/0.2))] dark:aria-invalid:border-[color:var(--btn-invalid-border-dark,hsl(var(--destructive)/0.5))] dark:aria-invalid:outline-[color:var(--btn-invalid-outline-color-dark,hsl(var(--destructive)/0.4))] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[length:var(--btn-icon-size,1rem)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--btn-bg,hsl(var(--primary)))] text-[var(--btn-fg,hsl(var(--primary-foreground)))] hover:bg-[var(--btn-bg-hover,hsl(var(--primary)/0.9))]",
        outline:
          "border-[var(--btn-outline-border,hsl(var(--border)))] bg-[var(--btn-outline-bg,hsl(var(--background)))] hover:bg-[var(--btn-outline-bg-hover,hsl(var(--muted)))] hover:text-[var(--btn-outline-fg-hover,hsl(var(--foreground)))] aria-expanded:bg-[var(--btn-outline-bg-expanded,hsl(var(--muted)))] aria-expanded:text-[var(--btn-outline-fg-expanded,hsl(var(--foreground)))] dark:border-[var(--btn-outline-border-dark,hsl(var(--input)))] dark:bg-[var(--btn-outline-bg-dark,hsl(var(--input)/0.3))] dark:hover:bg-[var(--btn-outline-bg-hover-dark,hsl(var(--input)/0.5))]",
        secondary:
          "bg-[var(--btn-secondary-bg,hsl(var(--secondary)))] text-[var(--btn-secondary-fg,hsl(var(--secondary-foreground)))] hover:bg-[var(--btn-secondary-bg-hover,hsl(var(--secondary)/0.8))] aria-expanded:bg-[var(--btn-secondary-bg-expanded,hsl(var(--secondary)))] aria-expanded:text-[var(--btn-secondary-fg-expanded,hsl(var(--secondary-foreground)))]",
        ghost:
          "hover:bg-[var(--btn-ghost-bg-hover,hsl(var(--muted)))] hover:text-[var(--btn-ghost-fg-hover,hsl(var(--foreground)))] aria-expanded:bg-[var(--btn-ghost-bg-expanded,hsl(var(--muted)))] aria-expanded:text-[var(--btn-ghost-fg-expanded,hsl(var(--foreground)))] dark:hover:bg-[var(--btn-ghost-bg-hover-dark,hsl(var(--muted)/0.5))]",
        destructive:
          "bg-[var(--btn-destructive-bg,hsl(var(--destructive)/0.1))] text-[var(--btn-destructive-fg,hsl(var(--destructive)))] border-transparent hover:bg-[var(--btn-destructive-bg-hover,hsl(var(--destructive)/0.2))] hover:ring-[var(--btn-destructive-ring-hover,hsl(var(--destructive)/0.3))] focus-visible:border-[var(--btn-destructive-focus-border,hsl(var(--destructive)/0.4))] focus-visible:ring-[var(--btn-destructive-focus-ring,hsl(var(--destructive)/0.2))] dark:bg-[var(--btn-destructive-bg-dark,hsl(var(--destructive)/0.2))] dark:hover:bg-[var(--btn-destructive-bg-hover-dark,hsl(var(--destructive)/0.3))] dark:focus-visible:ring-[var(--btn-destructive-focus-ring-dark,hsl(var(--destructive)/0.4))]",
        link: "text-[var(--btn-link-fg,hsl(var(--primary)))] underline-offset-[length:var(--btn-link-underline-offset,4px)] hover:underline",
      },
      size: {
        default:
          "h-[length:var(--btn-h,2.5rem)] gap-[length:var(--btn-gap,0.5rem)] px-[length:var(--btn-px,1rem)] has-data-[icon=inline-end]:pr-[length:var(--btn-icon-pr,0.75rem)] has-data-[icon=inline-start]:pl-[length:var(--btn-icon-pl,0.75rem)]",
        xs: "h-[length:var(--btn-h-xs,1.75rem)] gap-[length:var(--btn-gap-xs,0.25rem)] rounded-[var(--btn-radius-xs,min(var(--radius-md),10px))] px-[length:var(--btn-px-xs,0.625rem)] text-[length:var(--btn-text-xs,0.75rem)] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-[length:var(--btn-icon-pr-xs,0.5rem)] has-data-[icon=inline-start]:pl-[length:var(--btn-icon-pl-xs,0.5rem)] [&_svg:not([class*='size-'])]:size-[length:var(--btn-icon-size-xs,0.75rem)]",
        sm: "h-[length:var(--btn-h-sm,2rem)] gap-[length:var(--btn-gap-sm,0.375rem)] rounded-[var(--btn-radius-sm,min(var(--radius-md),12px))] px-[length:var(--btn-px-sm,0.75rem)] text-[length:var(--btn-text-sm,0.75rem)] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-[length:var(--btn-icon-pr-sm,0.5rem)] has-data-[icon=inline-start]:pl-[length:var(--btn-icon-pl-sm,0.5rem)] [&_svg:not([class*='size-'])]:size-[length:var(--btn-icon-size-sm,0.875rem)]",
        lg: "h-[length:var(--btn-h-lg,2.75rem)] gap-[length:var(--btn-gap-lg,0.5rem)] px-[length:var(--btn-px-lg,1.5rem)] has-data-[icon=inline-end]:pr-[length:var(--btn-icon-pr-lg,1rem)] has-data-[icon=inline-start]:pl-[length:var(--btn-icon-pl-lg,1rem)] text-[length:var(--btn-text-lg,0.95rem)]",
        icon: "size-[length:var(--btn-size-icon,2.5rem)]",
        "icon-xs":
          "size-[length:var(--btn-size-icon-xs,1.75rem)] rounded-[var(--btn-radius-icon-xs,min(var(--radius-md),10px))] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-[length:var(--btn-icon-size-icon-xs,0.75rem)]",
        "icon-sm":
          "size-[length:var(--btn-size-icon-sm,2rem)] rounded-[var(--btn-radius-icon-sm,min(var(--radius-md),12px))] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-[length:var(--btn-size-icon-lg,2.75rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
