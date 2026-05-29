import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          background: "#5D8C39",
        }}
      >
        <div style={{ width: 32, height: 16, background: "#5D8C39" }} />
        <div style={{ width: 32, height: 16, background: "#866526", marginTop: -16 }} />
      </div>
    ),
    { ...size }
  );
}
