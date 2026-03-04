import brandmark from "@healthcare/web/assets/img/cayetano-heredia-brandmark.png"

// Component
type BrandmarkProps = Omit<React.ComponentProps<"img">, "src" | "alt">

export function Brandmark({ style, ...props }: BrandmarkProps) {
  return (
    <img
      {...brandmark}
      alt="Cayetano Heredia Isotipo"
      style={{ viewTransitionName: "cayetano-heredia-brandmark", ...style }}
      {...props}
    />
  )
}
