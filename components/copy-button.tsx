"use client"

import { useState } from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { InputGroupButton } from "@/components/ui/input-group"

interface CopyButtonProps {
  value: string
  className?: string
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <InputGroupButton
      type="button"
      variant="ghost"
      size="icon-xs"
      className={className}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy"}
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} />
    </InputGroupButton>
  )
}
