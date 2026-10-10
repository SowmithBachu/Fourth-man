/** A CSS 3D cricket ball: a shaded disc with a seam that genuinely rotates in 3D around it. */
export default function Ball3D({ className = "" }: { className?: string }) {
  return (
    <div className={`ball3d ${className}`} aria-hidden>
      <div className="ball3d-face" />
      <div className="ball3d-seam">
        <div className="ball3d-ring" />
        <div className="ball3d-ring stitch" />
        <div className="ball3d-ring second" />
      </div>
      <div className="ball3d-shine" />
    </div>
  );
}
