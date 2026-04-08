import { useState } from "react"
import { Playground } from "@/components/playground"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus } from "lucide-react"
import buttonRawCode from "@/components/ui/button?raw"

const VARIANTS = [
  { value: "default", label: "Default" },
  { value: "destructive", label: "Destructive" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "link", label: "Link" },
] as const

const SIZES = [
  { value: "default", label: "Default", isIcon: false },
  { value: "xs", label: "Extra Small", isIcon: false },
  { value: "sm", label: "Small", isIcon: false },
  { value: "lg", label: "Large", isIcon: false },
  { value: "icon", label: "Icon", isIcon: true },
  { value: "icon-xs", label: "Icon XS", isIcon: true },
  { value: "icon-sm", label: "Icon SM", isIcon: true },
  { value: "icon-lg", label: "Icon LG", isIcon: true },
] as const

type Variant = (typeof VARIANTS)[number]["value"]
type Size = (typeof SIZES)[number]["value"]

type UnitVal = { v: number; u: "px" | "rem" }

const stringifyUnit = (val: UnitVal) => `${val.v}${val.u}`

function UnitInput({ label, value, onChange, min = 0, step = 0.125 }: { label: string, value: UnitVal, onChange: (v: UnitVal) => void, min?: number, step?: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-xs truncate">{label}</Label>
      <div className="flex items-center gap-1 w-[120px] shrink-0">
        <Input 
          type="number" 
          value={value.v} 
          min={min} 
          step={value.u === 'px' ? 1 : step}
          onChange={(e) => onChange({ ...value, v: Number(e.target.value) })}
          className="h-7 text-xs px-2 rounded-md focus-visible:ring-1" 
        />
        <Select value={value.u} onValueChange={(u: "px" | "rem") => onChange({ ...value, u })}>
          <SelectTrigger className="h-7 w-14 px-2 text-xs rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rem">rem</SelectItem>
            <SelectItem value="px">px</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function ButtonDemo() {
  const [variant, setVariant] = useState<Variant>("default")
  const [size, setSize] = useState<Size>("default")
  const [disabled, setDisabled] = useState(false)

  // Typography
  const [textSize, setTextSize] = useState<UnitVal>({ v: 0.9, u: "rem" })
  const [tracking, setTracking] = useState("-0.025em")
  const [weight, setWeight] = useState("500")

  // Animation & Interaction
  const [duration, setDuration] = useState("200ms")
  const [ease, setEase] = useState("ease-out")
  const [hoverScale, setHoverScale] = useState(1.02)
  const [activeScale, setActiveScale] = useState(0.96)
  const [activeY, setActiveY] = useState<UnitVal>({ v: 1, u: "px" })

  // Focus & Accessibility
  const [focusOffset, setFocusOffset] = useState<UnitVal>({ v: 2, u: "px" })
  const [focusWidth, setFocusWidth] = useState<UnitVal>({ v: 2, u: "px" })
  const [disabledOpacity, setDisabledOpacity] = useState(0.5)

  // Base sizing state structure matching the Tailwind utility mappings
  const [sizeOverrides, setSizeOverrides] = useState<Record<string, Record<string, UnitVal>>>({
    default: { h: { v: 2.5, u: "rem" }, px: { v: 1, u: "rem" }, gap: { v: 0.5, u: "rem" } },
    xs: { h: { v: 1.75, u: "rem" }, px: { v: 0.625, u: "rem" }, gap: { v: 0.25, u: "rem" }, text: { v: 0.75, u: "rem" }, icon: { v: 0.75, u: "rem" } },
    sm: { h: { v: 2, u: "rem" }, px: { v: 0.75, u: "rem" }, gap: { v: 0.375, u: "rem" }, text: { v: 0.75, u: "rem" }, icon: { v: 0.875, u: "rem" } },
    lg: { h: { v: 2.75, u: "rem" }, px: { v: 1.5, u: "rem" }, gap: { v: 0.5, u: "rem" }, text: { v: 0.95, u: "rem" } },
    icon: { size: { v: 2.5, u: "rem" } },
    "icon-xs": { size: { v: 1.75, u: "rem" }, icon: { v: 0.75, u: "rem" } },
    "icon-sm": { size: { v: 2, u: "rem" } },
    "icon-lg": { size: { v: 2.75, u: "rem" } },
  })

  // Which size variant we are currently editing in the accordion
  const [editingSize, setEditingSize] = useState<Size>("default")

  const handleSizeOverride = (prop: string, val: UnitVal) => {
    setSizeOverrides(prev => ({
      ...prev,
      [editingSize]: {
        ...prev[editingSize],
        [prop]: val
      }
    }))
  }

  const isIconSize = size.startsWith("icon")
  
  const propsArr: string[] = []
  if (variant !== "default") propsArr.push(`variant="${variant}"`)
  if (size !== "default") propsArr.push(`size="${size}"`)
  if (disabled) propsArr.push("disabled")
  const propsStr = propsArr.length > 0 ? " " + propsArr.join(" ") : ""

  const buttonContent = isIconSize ? "<Plus className=\"size-4\" />" : "Click Me"
  const importLine = isIconSize
    ? `import { Button } from "@/components/ui/button"\nimport { Plus } from "lucide-react"`
    : `import { Button } from "@/components/ui/button"`

  const codeString = `${importLine}\n\nexport function ButtonDemo() {\n  return (\n    <Button${propsStr}>\n      ${buttonContent}\n    </Button>\n  )\n}`

  // Build the massive code replacements object mapping directly to the 44 CSS CSS variables in Button
  const codeReplacements: Record<string, string> = {
    "--btn-text": stringifyUnit(textSize),
    "--btn-tracking": tracking,
    "--btn-font-weight": weight,
    "--btn-duration": duration,
    "--btn-ease": ease,
    "--btn-hover-scale": hoverScale.toString(),
    "--btn-active-scale": activeScale.toString(),
    "--btn-active-y": stringifyUnit(activeY),
    "--btn-focus-offset": stringifyUnit(focusOffset),
    "--btn-focus-width": stringifyUnit(focusWidth),
    "--btn-disabled-opacity": disabledOpacity.toString(),
  }

  // Inject current size overrides
  Object.keys(sizeOverrides).forEach(sz => {
    const props = sizeOverrides[sz]
    const ext = sz === "default" ? "" : `-${sz}`
    if (props.h) codeReplacements[`--btn-h${ext}`] = stringifyUnit(props.h)
    if (props.size) codeReplacements[`--btn-size-icon${ext.replace('-icon','')}`] = stringifyUnit(props.size)
    if (props.px) codeReplacements[`--btn-px${ext}`] = stringifyUnit(props.px)
    if (props.gap) codeReplacements[`--btn-gap${ext}`] = stringifyUnit(props.gap)
    if (props.text) codeReplacements[`--btn-text${ext}`] = stringifyUnit(props.text)
    if (props.icon) codeReplacements[`--btn-icon-size${ext}`] = stringifyUnit(props.icon)
  })

  const Controls = (
    <>
      {/* Component States (Direct Props) */}
      <div className="space-y-4 mb-6">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">Properties</h4>
        <div className="space-y-2">
          <Label className="text-xs">Variant</Label>
          <Select value={variant} onValueChange={(v: string | null) => setVariant((v || "default") as Variant)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {VARIANTS.map((v) => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Size</Label>
          <Select value={size} onValueChange={(v: string | null) => setSize((v || "default") as Size)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}{s.isIcon && <span className="ml-1 text-muted-foreground">⬦</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between pt-1">
          <Label className="text-xs">Disabled State</Label>
          <Switch checked={disabled} onCheckedChange={(val: boolean) => setDisabled(val)} />
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {/* SIZE OVERRIDES PANEL */}
        <AccordionItem value="sizes" className="border-border/40">
          <AccordionTrigger className="text-xs hover:no-underline font-semibold py-3 px-1 hover:bg-muted/30 rounded-md transition-colors data-[state=open]:bg-muted/50">
            Size-Specific Overrides
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1">
            <div className="space-y-4">
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-2 block tracking-wider">Target Variant</Label>
                <Select value={editingSize} onValueChange={(v: any) => setEditingSize(v)}>
                  <SelectTrigger className="h-7 text-xs bg-background border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3 pl-2 border-l-2 border-border/40 ml-1">
                {sizeOverrides[editingSize]?.h && <UnitInput label="Height" value={sizeOverrides[editingSize].h} onChange={v => handleSizeOverride("h", v)} />}
                {sizeOverrides[editingSize]?.size && <UnitInput label="Square Size" value={sizeOverrides[editingSize].size} onChange={v => handleSizeOverride("size", v)} />}
                {sizeOverrides[editingSize]?.px && <UnitInput label="Padding X" value={sizeOverrides[editingSize].px} onChange={v => handleSizeOverride("px", v)} />}
                {sizeOverrides[editingSize]?.gap && <UnitInput label="Gap" value={sizeOverrides[editingSize].gap} onChange={v => handleSizeOverride("gap", v)} />}
                {sizeOverrides[editingSize]?.text && <UnitInput label="Text Size" value={sizeOverrides[editingSize].text} onChange={v => handleSizeOverride("text", v)} />}
                {sizeOverrides[editingSize]?.icon && <UnitInput label="Icon Size" value={sizeOverrides[editingSize].icon} onChange={v => handleSizeOverride("icon", v)} />}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography" className="border-border/40">
          <AccordionTrigger className="text-xs hover:no-underline font-semibold py-3 px-1 hover:bg-muted/30 rounded-md transition-colors data-[state=open]:bg-muted/50">
            Typography Config
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1 space-y-3">
            <UnitInput label="Base Text Size" value={textSize} onChange={setTextSize} />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center"><Label className="text-xs">Letter Spacing (Tracking)</Label><span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{tracking}</span></div>
              <Input value={tracking} onChange={(e) => setTracking(e.target.value)} className="h-7 text-xs px-2 focus-visible:ring-1" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center"><Label className="text-xs">Font Weight</Label><span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{weight}</span></div>
              <Input value={weight} onChange={(e) => setWeight(e.target.value)} className="h-7 text-xs px-2 focus-visible:ring-1" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="animation" className="border-border/40">
          <AccordionTrigger className="text-xs hover:no-underline font-semibold py-3 px-1 hover:bg-muted/30 rounded-md transition-colors data-[state=open]:bg-muted/50">
            Animation & Scales
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label className="text-xs">Duration</Label><span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{duration}</span></div>
              <Input value={duration} onChange={(e) => setDuration(e.target.value)} className="h-7 text-xs focus-visible:ring-1" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label className="text-xs">Hover Scale Lift</Label><span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{hoverScale}x</span></div>
              <Slider value={[hoverScale]} max={1.1} min={1.0} step={0.01} onValueChange={(v) => setHoverScale(v[0])} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label className="text-xs">Active Press Scale</Label><span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{activeScale}x</span></div>
              <Slider value={[activeScale]} max={1.0} min={0.9} step={0.01} onValueChange={(v) => setActiveScale(v[0])} />
            </div>
            <UnitInput label="Active Press Drop (Y)" value={activeY} onChange={setActiveY} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="access" className="border-border/40 border-b-0">
          <AccordionTrigger className="text-xs hover:no-underline font-semibold py-3 px-1 hover:bg-muted/30 rounded-md transition-colors data-[state=open]:bg-muted/50">
            Focus & Access
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-2 px-1 space-y-4">
            <UnitInput label="Focus Ring Offset" value={focusOffset} onChange={setFocusOffset} />
            <UnitInput label="Focus Ring Thickness" value={focusWidth} onChange={setFocusWidth} />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center"><Label className="text-xs">Disabled Opacity</Label><span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{disabledOpacity * 100}%</span></div>
              <Slider value={[disabledOpacity]} max={1.0} min={0} step={0.1} onValueChange={(v) => setDisabledOpacity(v[0])} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )

  return (
    <Playground
      title="Button"
      description="Interactive component showroom with full control over 44 design properties, generating perfect tailwind classes automatically."
      code={codeString}
      customCode={buttonRawCode}
      controls={Controls}
      codeReplacements={codeReplacements}
    >
      <Button variant={variant} size={size} disabled={disabled}>
        {isIconSize ? <Plus className="size-4" /> : "Click Me"}
      </Button>
    </Playground>
  )
}
