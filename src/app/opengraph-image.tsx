import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111 0%, #7c3aed 100%)",
        }}
      >
        Octavio Store • iPhone & Electronics
      </div>
    ),
    { ...size }
  );
}
