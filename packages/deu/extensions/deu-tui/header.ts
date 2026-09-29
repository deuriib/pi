import type {
  ExtensionAPI,
  ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import type { Component, TUI } from "@earendil-works/pi-tui";
import { getPackageMeta } from "../../lib/pkg-meta.ts";
import {
  center,
  collectPiCommandNames,
  headerColumnWidths,
  padRight,
  pickSlashCommandTips,
  truncateToWidth,
  visibleWidth,
} from "./utils.ts";

// Versión local del paquete — fuente única: package.json (no la versión del runtime base).
const DEU_VERSION = getPackageMeta(import.meta.url).version;

const SLOGAN = "Haces las cosas como para Dios";

// Logo DEU pixelado estilo VASQUEZ (7 filas x 26 cols, █ = ancho 1).
const DEU_LOGO: readonly string[] = [
  "██████   ███████   ██   ██",
  "██  ██   ██        ██   ██",
  "██  ██   ██        ██   ██",
  "██  ██   ██████    ██   ██",
  "██  ██   ██        ██   ██",
  "██  ██   ██        ██   ██",
  "██████   ███████   ███████",
];

const LOGO_ROWS = DEU_LOGO.length;
const LOGO_COLS = [...DEU_LOGO[0]!].length;

// Maquinaria de frames porteada de deu-tui (timing idéntico, geometría DEU).
const LOGO_CELL = "███";

type LogoColor =
  "panel" | "cyan" | "red" | "green" | "orange" | "white" | "flash" | "brand";
type LogoFrame = {
  phase: number;
  active: "left" | "top" | "right" | "none";
  flash: boolean;
  white: boolean;
};

const LOGO_FRAMES: LogoFrame[] = [
  ...Array.from({ length: 4 }, () => ({
    phase: 0,
    active: "left" as const,
    flash: false,
    white: false,
  })),
  ...Array.from({ length: 3 }, () => ({
    phase: 1,
    active: "top" as const,
    flash: false,
    white: false,
  })),
  ...Array.from({ length: 5 }, () => ({
    phase: 2,
    active: "right" as const,
    flash: false,
    white: false,
  })),
  { phase: 3, active: "none", flash: false, white: false },
  { phase: 3, active: "none", flash: true, white: false },
  { phase: 3, active: "none", flash: false, white: false },
  { phase: 3, active: "none", flash: true, white: false },
  { phase: 4, active: "none", flash: false, white: false },
  { phase: 5, active: "none", flash: false, white: false },
  { phase: 5, active: "none", flash: false, white: true },
  { phase: 5, active: "none", flash: false, white: false },
  { phase: 5, active: "none", flash: false, white: true },
  { phase: 6, active: "none", flash: false, white: false },
];

const INTRO_FRAME_MS = 110;

function isLogoCell(y: number, x: number): boolean {
  if (y < 0 || y >= LOGO_ROWS) return false;
  const row = DEU_LOGO[y]!;
  if (x < 0 || x >= LOGO_COLS) return false;
  return [...row][x] === "█";
}

function logoCellColor(frame: LogoFrame, y: number, x: number): LogoColor {
  if (!isLogoCell(y, x)) return "panel";
  if (frame.white) return "white";
  if (frame.flash && y === LOGO_ROWS - 1) return "flash";

  const third = Math.floor((x / LOGO_COLS) * 3);
  switch (frame.active) {
    case "left":
      return third === 0 ? "red" : "panel";
    case "top":
      if (third === 1) return "cyan";
      return third === 0 ? "red" : "panel";
    case "right":
      if (third === 2) return "green";
      return third <= 1 ? "red" : "panel";
  }

  if (frame.phase === 6) return "brand";
  if (frame.phase >= 3) return "red";
  return "panel";
}

function colorCell(
  color: LogoColor,
  paintBrand: (text: string) => string,
): string {
  switch (color) {
    case "cyan":
      return `\x1b[36m${LOGO_CELL}\x1b[39m`;
    case "red":
      return `\x1b[31m${LOGO_CELL}\x1b[39m`;
    case "green":
      return `\x1b[32m${LOGO_CELL}\x1b[39m`;
    case "orange":
    case "flash":
      return `\x1b[33m${LOGO_CELL}\x1b[39m`;
    case "white":
      return `\x1b[39m${LOGO_CELL}`;
    case "brand":
      return paintBrand(LOGO_CELL);
    default:
      return " ".repeat(LOGO_CELL.length);
  }
}

function renderLogo(
  frameIndex: number,
  paintBrand: (text: string) => string,
): string[] {
  const frame = LOGO_FRAMES[frameIndex % LOGO_FRAMES.length]!;
  const lines: string[] = [];
  for (let y = 0; y < LOGO_ROWS; y++) {
    let line = "";
    for (let x = 0; x < LOGO_COLS; x++)
      line += colorCell(logoCellColor(frame, y, x), paintBrand);
    lines.push(line);
  }
  return lines;
}

function borderLine(
  left: string,
  label: string,
  right: string,
  width: number,
  paint: (text: string) => string,
): string {
  if (width <= 1) return "";
  if (width < 8 || label.length === 0) {
    return paint(
      truncateToWidth(
        left + "─".repeat(Math.max(0, width - 2)) + right,
        width,
        "",
      ),
    );
  }
  const before = "─── ";
  const after = " ─────";
  const fixedWidth =
    visibleWidth(before) + visibleWidth(label) + visibleWidth(after);
  const fill = Math.max(0, width - 2 - fixedWidth);
  return `${paint(left)}${paint(before)}${label}${paint(after)}${paint("─".repeat(fill))}${paint(right)}`;
}

function boxedLine(
  content: string,
  width: number,
  paint: (text: string) => string,
): string {
  if (width <= 2) return truncateToWidth(content, width, "");
  return `${paint("│")}${padRight(content, width - 2)}${paint("│")}`;
}

function twoColumn(
  left: string,
  right: string,
  leftWidth: number,
  rightWidth: number,
  paint: (text: string) => string,
): string {
  return `${padRight(left, leftWidth)} ${paint("│")} ${padRight(right, rightWidth, "…")}`;
}

export class DeuHeader implements Component {
  private readonly pi: ExtensionAPI;
  private readonly ctx: ExtensionContext;
  private frame = LOGO_FRAMES.length - 1;
  private readonly tipCommands: string[];

  constructor(pi: ExtensionAPI, ctx: ExtensionContext, _tui: TUI) {
    this.pi = pi;
    this.ctx = ctx;
    const pool = collectPiCommandNames(pi.getCommands());
    this.tipCommands = pickSlashCommandTips(pool, {
      fixed: ["deu"],
      count: 3,
    });
  }

  setFrame(index: number): void {
    this.frame = Math.max(0, Math.min(LOGO_FRAMES.length - 1, index));
  }

  render(width: number): string[] {
    const theme = this.ctx.ui.theme;
    const paint = (s: string): string => theme.fg("accent", s);
    const muted = (s: string): string => theme.fg("muted", s);
    const bold = (s: string): string => theme.bold(s);

    if (width < 24) return [paint(`Deu v${DEU_VERSION}`)];

    const innerWidth = width - 2;
    const { leftWidth, rightWidth, useTips } = headerColumnWidths(innerWidth);

    const leftLines = [
      ...renderLogo(this.frame, paint).map((line) => center(line, leftWidth)),
      center(bold(SLOGAN), leftWidth),
    ];

    const tipDivider = paint("─".repeat(Math.max(8, Math.min(rightWidth, 22))));
    const [cmd0 = "", cmd1 = "", cmd2 = "", cmd3 = ""] = this.tipCommands;
    const tipLines = [
      "",
      paint(bold("Welcome")),
      muted("Ask Deu anything"),
      tipDivider,
      paint(bold("Commands")),
      muted(cmd0),
      muted(cmd1),
      muted(cmd2),
      muted(cmd3),
      "",
    ];

    const lines = [
      borderLine("╭", `${paint("deu")} v${DEU_VERSION}`, "╮", width, paint),
    ];
    for (let i = 0; i < leftLines.length; i++) {
      const content = useTips
        ? twoColumn(
            leftLines[i] ?? "",
            tipLines[i] ?? "",
            leftWidth,
            rightWidth,
            paint,
          )
        : padRight(leftLines[i] ?? "", leftWidth);
      lines.push(boxedLine(content, width, paint));
    }
    lines.push(borderLine("╰", "", "╯", width, paint));
    return lines.map((line) => truncateToWidth(line, width, ""));
  }

  invalidate(): void {}

  dispose(): void {}
}

/**
 * Instala el header DEU con intro animada de una pasada por los frames
 * y lo deja fijo en el frame final. Limpieza idempotente.
 */
export function installHeader(
  pi: ExtensionAPI,
  ctx: ExtensionContext,
  opts?: { animate?: boolean },
): () => void {
  let header: DeuHeader | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let settled = false;

  const render = (tui: TUI): DeuHeader => {
    header?.dispose();
    header = new DeuHeader(pi, ctx, tui);
    return header;
  };

  ctx.ui.setHeader((tui) => render(tui));

  if (opts?.animate !== false) {
    let frame = 0;
    header?.setFrame(0);
    timer = setInterval(() => {
      frame++;
      if (frame >= LOGO_FRAMES.length - 1 || settled) {
        if (timer) {
          clearInterval(timer);
          timer = undefined;
        }
        try {
          ctx.ui.setHeader((tui) => {
            const h = render(tui);
            h.setFrame(LOGO_FRAMES.length - 1);
            return h;
          });
        } catch {
          // best-effort: la sesión puede estar cerrándose
        }
        return;
      }
      const current = frame;
      try {
        ctx.ui.setHeader((tui) => {
          const h = render(tui);
          h.setFrame(current);
          return h;
        });
      } catch {
        if (timer) {
          clearInterval(timer);
          timer = undefined;
        }
      }
    }, INTRO_FRAME_MS);
    timer.unref?.();
  }

  return () => {
    settled = true;
    if (timer) {
      clearInterval(timer);
      timer = undefined;
    }
    header?.dispose();
    header = undefined;
    try {
      ctx.ui.setHeader(undefined);
    } catch {
      // best-effort: el runtime restaura su header nativo al cerrar sesión.
    }
  };
}
