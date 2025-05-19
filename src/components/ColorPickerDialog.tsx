import { Github } from "@uiw/react-color";

export default function ColorPickerDialog({
  setColor,
  color,
}: {
  setColor: (text: string) => void;
  color: string;
}) {
  return (
    <Github
      style={{
        boxShadow: "rgb(0 0 0 / 0%) 0px 0px 0px 0px",
        width: "100%",
        margin: "0",
        display: "flex",
        gap: "0",
        padding: "0",
        backgroundColor: "var(--background)",
        border: "none",
        justifyContent: "center",
      }}
      color={color}
      colors={[
        "#f97316",
        "#f59e0b",
        "#eab308",
        "#84cc16",
        "#22c55e",
        "#10b981",
        "#14b8a6",
        "#06b6d4",
        "#0ea5e9",
        "#3b82f6",
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
        "#f43f5e",
        "#ef4444",
      ]}
      onChange={(color) => {
        setColor(color.hex);
      }}
      showTriangle={false}
    />
  );
}
