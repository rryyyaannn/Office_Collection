import { Film, Image as ImageIcon } from "lucide-react";
import EditorialImage from "./EditorialImage";
import { SHOW_MEDIA_HINTS } from "../media";

/**
 * Moldura de mídia: renderiza VÍDEO ou IMAGEM real quando `media.src` existe;
 * caso contrário, mostra o placeholder editorial. Quando SHOW_MEDIA_HINTS está
 * ativo, sobrepõe uma etiqueta indicando exatamente qual arquivo entra ali.
 *
 * @param {object}  media  entrada do manifesto (src/media.js): {type,src,poster,path,note}
 * @param {boolean} [fill] preenche o container pai (hero full-bleed)
 * @param {boolean} [zoom] zoom no hover do grupo pai
 * @param {boolean} [motion] Ken Burns no placeholder
 * @param {boolean} [hint=true] permite a etiqueta de slot neste frame
 */
export default function MediaFrame({
  media = {},
  tone = "sand",
  ratio = "aspect-[3/4]",
  label,
  icon,
  alt = "",
  zoom = false,
  motion = false,
  fill = false,
  hint = true,
  className = "",
  children,
}) {
  const { type = "image", src = null, poster = null, path, note } = media;
  const shape = fill ? "absolute inset-0" : `relative ${ratio}`;
  const mediaCls = `h-full w-full object-cover transition-transform duration-image ${
    zoom ? "group-hover:scale-105" : ""
  }`;
  const showHint = SHOW_MEDIA_HINTS && hint;

  return (
    <div className={`overflow-hidden ${shape} ${className}`}>
      {src ? (
        type === "video" ? (
          <video
            className={mediaCls}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster || undefined}
            aria-label={alt}
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <img className={mediaCls} src={src} alt={alt} loading="lazy" />
        )
      ) : (
        <EditorialImage
          fill
          tone={tone}
          label={label}
          icon={icon}
          alt={alt}
          zoom={zoom}
          motion={motion}
        />
      )}

      {children}

      {showHint && (
        <div className="pointer-events-none absolute inset-0 z-20 border border-dashed border-white/35">
          <span className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 bg-graphite/75 px-2 py-1 font-body text-[9.5px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
            {type === "video" ? <Film size={11} /> : <ImageIcon size={11} />}
            <span className="truncate">
              {type === "video" ? "Vídeo" : "Imagem"} · {path}
            </span>
          </span>
          {note && (
            <span className="absolute bottom-2 left-2 right-2 truncate bg-graphite/60 px-2 py-1 font-body text-[9px] text-white/85 backdrop-blur-sm">
              {note}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
