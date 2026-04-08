"use client"

import { useState } from "react"
import { Playground } from "@/components/playground"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import cardRawCode from "@/components/ui/card?raw"

export function CardDemo() {
  const [size, setSize] = useState<"default" | "sm">("default")
  const [showHeader, setShowHeader] = useState(true)
  const [showTitle, setShowTitle] = useState(true)
  const [showDescription, setShowDescription] = useState(true)
  const [showAction, setShowAction] = useState(false)
  const [showContent, setShowContent] = useState(true)
  const [showFooter, setShowFooter] = useState(true)

  // Build dynamic import list — only import what's used
  const usedImports = ["Card"]
  if (showHeader) usedImports.push("CardHeader")
  if (showHeader && showTitle) usedImports.push("CardTitle")
  if (showHeader && showDescription) usedImports.push("CardDescription")
  if (showHeader && showAction) usedImports.push("CardAction")
  if (showContent) usedImports.push("CardContent")
  if (showFooter) usedImports.push("CardFooter")

  const sizeAttr = size !== "default" ? ` size="${size}"` : ""

  // Build card body code
  let cardBody = ""

  if (showHeader) {
    let headerInner = ""
    if (showTitle) headerInner += `\n        <CardTitle>Create project</CardTitle>`
    if (showDescription)
      headerInner += `\n        <CardDescription>Deploy your new project in one-click.</CardDescription>`
    if (showAction)
      headerInner += `\n        <CardAction>\n          <Button variant="ghost" size="icon-sm">⋮</Button>\n        </CardAction>`
    cardBody += `\n      <CardHeader>${headerInner}\n      </CardHeader>`
  }

  if (showContent) {
    cardBody += `\n      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </CardContent>`
  }

  if (showFooter) {
    cardBody += `\n      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>`
  }

  const codeString = `import {\n  ${usedImports.join(",\n  ")},\n} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CardDemo() {
  return (
    <Card${sizeAttr} className="w-[350px]">${cardBody}
    </Card>
  )
}`

  let dynamicRawCode = cardRawCode

  if (!showHeader) {
    dynamicRawCode = dynamicRawCode.replace(/^function CardHeader[\s\S]*?^}/gm, "")
    dynamicRawCode = dynamicRawCode.replace(/\s*CardHeader,/g, "")
  }
  if (!showHeader || !showTitle) {
    dynamicRawCode = dynamicRawCode.replace(/^function CardTitle[\s\S]*?^}/gm, "")
    dynamicRawCode = dynamicRawCode.replace(/\s*CardTitle,/g, "")
  }
  if (!showHeader || !showDescription) {
    dynamicRawCode = dynamicRawCode.replace(/^function CardDescription[\s\S]*?^}/gm, "")
    dynamicRawCode = dynamicRawCode.replace(/\s*CardDescription,/g, "")
  }
  if (!showHeader || !showAction) {
    dynamicRawCode = dynamicRawCode.replace(/^function CardAction[\s\S]*?^}/gm, "")
    dynamicRawCode = dynamicRawCode.replace(/\s*CardAction,/g, "")
  }
  if (!showContent) {
    dynamicRawCode = dynamicRawCode.replace(/^function CardContent[\s\S]*?^}/gm, "")
    dynamicRawCode = dynamicRawCode.replace(/\s*CardContent,/g, "")
  }
  if (!showFooter) {
    dynamicRawCode = dynamicRawCode.replace(/^function CardFooter[\s\S]*?^}/gm, "")
    dynamicRawCode = dynamicRawCode.replace(/\s*CardFooter,/g, "")
  }

  // Cleanup triple newlines
  dynamicRawCode = dynamicRawCode.replace(/\n\s*\n\s*\n/g, "\n\n").trim()

  const Controls = (
    <>
      {/* Size */}
      <div className="space-y-2">
        <Label className="text-xs">Size</Label>
        <Select
          value={size}
          onValueChange={(v: string | null) => setSize((v || "default") as "default" | "sm")}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Toggleable sections */}
      <div className="space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Sections
        </Label>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">Header</Label>
        <Switch
          checked={showHeader}
          onCheckedChange={(val: boolean) => setShowHeader(val)}
        />
      </div>

      {/* Title — greyed out if Header is off */}
      <div
        className={`flex items-center justify-between pl-4 border-l border-border/30 transition-opacity ${
          !showHeader ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        <Label className="text-xs">Title</Label>
        <Switch
          checked={showTitle}
          onCheckedChange={(val: boolean) => setShowTitle(val)}
          disabled={!showHeader}
        />
      </div>

      {/* Description — greyed out if Header is off */}
      <div
        className={`flex items-center justify-between pl-4 border-l border-border/30 transition-opacity ${
          !showHeader ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        <Label className="text-xs">Description</Label>
        <Switch
          checked={showDescription}
          onCheckedChange={(val: boolean) => setShowDescription(val)}
          disabled={!showHeader}
        />
      </div>

      {/* Action — greyed out if Header is off */}
      <div
        className={`flex items-center justify-between pl-4 border-l border-border/30 transition-opacity ${
          !showHeader ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        <Label className="text-xs">Action</Label>
        <Switch
          checked={showAction}
          onCheckedChange={(val: boolean) => setShowAction(val)}
          disabled={!showHeader}
        />
      </div>

      {/* Content */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">Content</Label>
        <Switch
          checked={showContent}
          onCheckedChange={(val: boolean) => setShowContent(val)}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Label className="text-xs">Footer</Label>
        <Switch
          checked={showFooter}
          onCheckedChange={(val: boolean) => setShowFooter(val)}
        />
      </div>
    </>
  )

  return (
    <Playground
      title="Card"
      description="Container with header, content, and footer sections. Toggle each section on/off to compose your layout."
      code={codeString}
      customCode={dynamicRawCode}
      controls={Controls}
    >
      <Card size={size} className="w-[350px]">
        {showHeader && (
          <CardHeader>
            {showTitle && <CardTitle>Create project</CardTitle>}
            {showDescription && (
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            )}
            {showAction && (
              <CardAction>
                <Button variant="ghost" size="icon-sm">⋮</Button>
              </CardAction>
            )}
          </CardHeader>
        )}
        {showContent && (
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
            </div>
          </CardContent>
        )}
        {showFooter && (
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        )}
      </Card>
    </Playground>
  )
}
