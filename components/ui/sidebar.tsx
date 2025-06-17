"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelRightClose } from "lucide-react"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMobile: boolean
  isIcon: boolean
}>({
  isOpen: false,
  setIsOpen: () => {},
  isMobile: false,
  isIcon: false,
})

export const useSidebar = () => React.useContext(SidebarContext)

export const SidebarProvider = ({
  children,
  defaultOpen = true,
  ...props
}: {
  children: React.ReactNode
  defaultOpen?: boolean
} & React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider
      value={{
        isOpen: isMobile ? isOpen : isOpen,
        setIsOpen,
        isMobile,
        isIcon: !isOpen && !isMobile,
      }}
    >
      <div
        data-collapsible={!isOpen && !isMobile ? "icon" : "collapsible"}
        className={cn(
          "group/sidebar-wrapper grid",
          !isMobile &&
            `grid-cols-[var(--sidebar-width)] data-[collapsible=icon]:grid-cols-[var(--sidebar-icon-width)]`
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "bg-background text-foreground group-data-[collapsible=icon]/sidebar-wrapper:w-[var(--sidebar-icon-width)] group-data-[collapsible=icon]/sidebar-wrapper:transition-[width] group-data-[collapsible=icon]/sidebar-wrapper:duration-300",
  {
    variants: {
      variant: {
        default: "w-[var(--sidebar-width)]",
        inset:
          "w-[calc(var(--sidebar-width)-var(--spacing-md))] data-[collapsible=icon]:m-2.5 data-[collapsible=icon]:w-[var(--sidebar-icon-width)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sidebarVariants>
>(({ className, variant, ...props }, ref) => {
  const { isOpen, setIsOpen, isMobile } = useSidebar()
  
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="bg-background text-foreground flex w-[var(--sidebar-width)] flex-col p-0"
        >
          <div
            ref={ref}
            className={cn(sidebarVariants({ variant, className }))}
            {...props}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      ref={ref}
      className={cn(
        "relative hidden flex-col transition-[width] duration-300 sm:flex",
        sidebarVariants({ variant, className })
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen, isMobile, isIcon } = useSidebar()
  
  if (isMobile) {
      return (
         <SheetTrigger asChild>
            <Button
                ref={ref}
                variant="ghost"
                size="icon"
                className={cn("size-8", className)}
                {...props}
            />
         </SheetTrigger>
      )
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={() => setIsOpen(!isOpen)}
      className={cn("size-8", className)}
      {...props}
    >
      {isIcon ? <PanelRightClose /> : <PanelLeftClose />}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-full flex-1 flex-col overflow-y-auto", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} role="list" className="flex flex-col gap-2" {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} role="listitem" {...props} />)
SidebarMenuItem.displayName = "SidebarMenuItem"

// FIX: Menambahkan komponen yang hilang
export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div ref={ref} role="group" className="flex flex-col gap-4" {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "px-4 pb-1 pt-4 text-xs font-medium uppercase text-muted-foreground",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <div ref={ref} {...props} />);
SidebarGroupContent.displayName = "SidebarGroupContent";


export const SidebarMenuButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Button>
  >(({ className, ...props }, ref) => {
    const { isIcon } = useSidebar()
    return (
      <Button
        ref={ref}
        variant="secondary"
        size={isIcon ? "icon" : "default"}
        className={cn(
          "w-full justify-start data-[slot=sidebar-menu-button]:w-full",
          className
        )}
        {...props}
      />
    )
  })
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { isMobile } = useSidebar()
  if (isMobile) return <div ref={ref} {...props} />
  return (
    <div
      ref={ref}
      className="grid min-h-screen grid-rows-[var(--header-height)_1fr]"
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
