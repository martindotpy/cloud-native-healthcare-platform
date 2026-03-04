import banner from "@healthcare/web/assets/img/cayetano-heredia-banner.png"

// Component
type BannerProps = Omit<React.ComponentProps<"img">, "src" | "alt">

export function Banner({ style, ...props }: BannerProps) {
  return (
    <img
      {...banner}
      alt="Cayetano Heredia Banner"
      style={{ viewTransitionName: "cayetano-heredia-banner", ...style }}
      {...props}
    />
  )
}
