import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#003354",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 80, fontWeight: 300, color: "white", letterSpacing: -2 }}>
            TOUCHDOWN
          </span>
          <svg width="70" height="50" viewBox="0 0 70 50" fill="none">
            <path
              d="M5 15c4-4 9-4 13 0s9 4 13 0 9-4 13 0 9 4 13 0"
              stroke="#65CEE6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M5 27c4-4 9-4 13 0s9 4 13 0 9-4 13 0 9 4 13 0"
              stroke="#65CEE6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M5 39c4-4 9-4 13 0s9 4 13 0 9-4 13 0 9 4 13 0"
              stroke="#00BFFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: 32, fontWeight: 300, color: "#8AACAF", marginTop: 24 }}>
          Freediving school founded by Gus Kreivenas · Dahab, Egypt
        </div>
      </div>
    ),
    { ...size }
  );
}
