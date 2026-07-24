"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between py-4 text-sm font-medium text-left",
        className
      )}
      {...props}>
      {children}
      {/* Bespoke toggle: a drawn plus that resolves to a minus. The vertical
          bar rotates onto the horizontal one rather than scaling to zero, so
          the rounded caps keep their shape through the whole transition. */}
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="shrink-0 text-ink-soft transition-colors duration-300 group-hover:text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round">
        <path d="M1.5 8h13" />
        <path
          d="M8 1.5v13"
          className="origin-center transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]:rotate-90" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}>
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
