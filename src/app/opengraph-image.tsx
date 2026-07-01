import { ImageResponse } from "next/og";
import { QUESTIONS } from "@/data/questions";

export const alt =
  "California DMV Practice Test — free Class C knowledge test prep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded Open Graph / Twitter card generated at build time (no asset needed).
export default function Image() {
  const count = QUESTIONS.length.toLocaleString("en-US");
  const subtitle = `${count}+ free Class C knowledge-test questions with explanations, diagrams & audio`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #046b99 0%, #034c6e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#fdb81e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#034c6e",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            CA
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>
            DMV Practice
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          California DMV Practice Test
        </div>
        <div style={{ marginTop: 24, fontSize: 34, color: "#d7ecf5", maxWidth: 980 }}>
          {subtitle}
        </div>
      </div>
    ),
    { ...size },
  );
}
