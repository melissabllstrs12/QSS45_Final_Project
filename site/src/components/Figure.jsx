import './Figure.css'

export default function Figure({ src, alt, caption }) {
  return (
    <figure className="figure">
      <img className="figure__img" src={src} alt={alt} loading="lazy" />
      {caption && <figcaption className="figure__caption">{caption}</figcaption>}
    </figure>
  )
}
