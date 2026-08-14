"use client"

import { useState } from "react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { InputGroupButton } from "@/components/ui/input-group"

interface CopyButtonProps {
  value: string
  className?: string
}

function copyTextFallback(text: string) {
  const area = document.createElement("textarea")
  area.value = text
  area.setAttribute("readonly", "")
  area.style.position = "fixed"
  area.style.left = "-9999px"
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand("copy")
  document.body.removeChild(area)
  if (!ok) throw new Error("copy failed")
}

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      copyTextFallback(text)
      return
    }
  }
  copyTextFallback(text)
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await copyText(value)
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
