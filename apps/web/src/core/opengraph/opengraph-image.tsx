import type { RenderFunctionInput } from "astro-opengraph-images"
import { twj } from "tw-to-css"
import { appShortName } from "../constant/seo-constant"
import { removeAppNameFromTitle } from "../kit/title-kit"

// Constants — colors derived / tuned from light mode (:root in styles.css)
const fontFamily = "Geist"

const COLORS = {
  background: "#faf7f5", // very light bluish background (light mode)
  foreground: "#1a1a1a", // deep slate for primary text
  muted: "#57534e", // muted / secondary text
  primary: "#9b2c2c", // brand blue
  primarySoft: "rgba(155,44,44,0.12)",
  secondary: "#b45309",
}

// Component
type OpenGraphImageProps = Pick<RenderFunctionInput, "title" | "description">

export function OpenGraphImage({
  title,
  description,
}: OpenGraphImageProps): Promise<React.ReactElement> {
  // eslint-disable-next-line react-compiler/react-compiler
  "use no memo"

  const finalTitle = removeAppNameFromTitle(title)

  return Promise.resolve(
    <div
      style={{
        ...twj`relative flex h-full w-full flex-col overflow-hidden`,
        fontFamily,
        // layered background: soft base + radial accent and subtle texture
        background: `radial-gradient(circle at 85% 15%, ${COLORS.primarySoft}, transparent 18%), linear-gradient(180deg, ${COLORS.background} 0%, #f3f9ff 100%)`,
      }}
    >
      {/* Top-left brand + clinic badge */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 52,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: COLORS.primary,
              boxShadow: `0 6px 18px ${COLORS.primarySoft}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            +
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            {appShortName}
          </span>
        </div>
      </div>

      {/* Decorative left hatch: diagonal rhythm suggesting clinical grids */}
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 140,
          bottom: 80,
          width: 140,
          borderRadius: 12,
          transform: "skewX(-12deg)",
          opacity: 0.85,
          background: `repeating-linear-gradient(135deg, ${COLORS.primarySoft} 0px, ${COLORS.primarySoft} 1px, transparent 1px, transparent 18px)`,
        }}
      />

      {/* Subtle dot field as texture — non-intrusive, ties to healthcare grid */}
      <div
        style={{
          position: "absolute",
          right: 220,
          top: 120,
          width: 1400,
          height: 720,
          opacity: 0.3,
          background: `radial-gradient(circle at 10% 10%, ${COLORS.primary} 0.6px, transparent 0.8px), radial-gradient(circle at 30% 30%, ${COLORS.secondary} 0.5px, transparent 0.8px)`,
          backgroundSize: "14px 14px, 18px 18px",
          pointerEvents: "none",
        }}
      />

      {/* Medical icon (heartbeat+cross) placed near the heading */}
      <img
        src={
          "data:image/svg+xml;utf8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width="100%" height="100%" viewBox="0 0 13397 5000">
              <defs>
                <linearGradient id='g' x1='0' x2='1'>
                  <stop offset='0' stop-color='${COLORS.primary}'/>
                  <stop offset='1' stop-color='${COLORS.secondary}'/>
                </linearGradient>
              </defs>
              <g><path fill='url(#g)' d="M12385.76,2662.956l-336.584,-892.653c-19,-50.427 -69.579,-81.803 -123.113,-76.608c-53.687,5.247 -97.135,45.791 -106.049,98.969l-341.678,2038.101l-695.378,-3733.404c-10.646,-57.303 -61.123,-98.459 -119.547,-97.339c-58.27,1.12 -107.22,44.264 -115.624,101.923l-374.634,2561.01l-492.959,0l-279.486,-673.679c-18.489,-44.569 -61.989,-73.552 -110.123,-73.552l-1.681,0c-48.797,0.662 -92.244,31.02 -109.716,76.608l-256.819,670.623l-848.033,0c-51.853,0 -97.797,33.516 -113.587,82.873l-386.4,1208.354l-626.36,-1986.86c-15.688,-49.714 -61.734,-83.382 -113.689,-83.382l-1.63,0c-52.668,0.713 -98.612,35.859 -113.078,86.438l-197.836,692.577l-974.303,0l-308.418,-595.391c-20.527,-39.577 -61.378,-64.383 -105.896,-64.383l-1.12,0c-44.976,0.408 -85.878,26.079 -105.794,66.42l-293.085,593.353l-696.957,0c-54.247,0 -101.668,36.572 -115.37,89.087l-415.637,1590.323l-790.73,-4094.743c-10.798,-55.826 -59.493,-96.269 -116.389,-96.626l-0.713,0c-56.539,0 -105.387,39.781 -116.796,95.301l-673.985,3285.677l-550.822,-1646.149c-16.299,-48.797 -62.346,-81.549 -113.638,-81.396c-51.445,0.255 -96.982,33.516 -112.874,82.465l-251.471,776.061l-812.582,0c9.168,38.253 14.007,78.187 14.007,119.241c0,41.003 -4.839,80.937 -14.007,119.19l899.275,0c51.7,0 97.491,-33.261 113.434,-82.465l166.612,-514.097l576.697,1723.47c17.115,51.14 66.421,84.401 120.26,81.192c53.839,-3.26 98.765,-42.226 109.614,-95.098l642.761,-3133.53l776.774,4022.516c10.544,54.654 57.558,94.741 113.231,96.575c1.273,0 2.598,0.051 3.871,0.051c54.043,0 101.566,-36.47 115.319,-89.087l525.201,-2009.526l679.027,0c45.333,0 86.795,-25.723 106.864,-66.421l221.572,-448.491l233.389,450.529c20.527,39.577 61.326,64.383 105.895,64.383l1136.738,0c53.228,0 99.987,-35.248 114.657,-86.438l113.536,-397.403l619.891,1966.485c15.638,49.51 61.53,83.229 113.486,83.382l0.254,0c51.853,0 97.797,-33.516 113.587,-82.924l474.265,-1483.103l842.991,0c49.408,0 93.671,-30.46 111.345,-76.557l179.243,-468.051l195.442,471.107c18.489,44.518 61.938,73.5 110.174,73.5l675.667,0c59.187,0 109.41,-43.397 117.967,-101.974l285.7,-1953.038l687.381,3690.566c10.544,56.488 59.85,97.39 117.204,97.39l1.069,0c57.864,-0.509 106.966,-42.481 116.542,-99.529l379.982,-2266.498l209.602,555.915c17.522,46.454 61.938,77.168 111.6,77.168l1058.246,0c-9.169,-38.253 -14.007,-78.187 -14.007,-119.19c0,-41.054 4.839,-80.988 14.007,-119.241l-975.781,0Z" style="fill-rule:nonzero;"/></g>
            </svg>`
          )
        }
        width={1200}
        height={300}
        style={{
          position: "absolute",
          bottom: -65,
          left: 0,
          opacity: 0.4,
          filter: "drop-shadow(0 8px 20px rgba(15,23,36,0.06))",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 62,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          padding: "72px 32px 72px 62px",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 6,
              height: "90%",
              background: `linear-gradient(${COLORS.primary}, ${COLORS.secondary})`,
              borderRadius: 4,
              opacity: 0.95,
              transform: "translateY(4px)",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                fontSize: finalTitle.length > 20 ? 72 : 88,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
                color: COLORS.foreground,
                margin: 0,
                maxWidth: "85%",
                textShadow: `0 6px 24px rgba(15,23,36,0.06)`,
              }}
            >
              {finalTitle}
            </h1>

            {description && (
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  lineHeight: 1.45,
                  color: COLORS.muted,
                  margin: "24px 0 0 0",
                  maxWidth: "85%",
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
