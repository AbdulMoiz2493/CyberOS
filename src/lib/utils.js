import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatTime(date, use24Hour = false, showSeconds = true) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    ...(showSeconds && { second: "2-digit" }),
    hour12: !use24Hour,
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export function getFileType(filename) {
  const ext = getFileExtension(filename);
  const types = {
    txt: "text",
    md: "text",
    js: "code",
    jsx: "code",
    ts: "code",
    tsx: "code",
    css: "code",
    html: "code",
    json: "code",
    py: "code",
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    svg: "image",
    webp: "image",
    mp3: "audio",
    wav: "audio",
    ogg: "audio",
    mp4: "video",
    webm: "video",
    mov: "video",
    pdf: "document",
    doc: "document",
    docx: "document",
  };
  return types[ext] || "unknown";
}
