import { headers } from "next/headers";

export function getViewerIdFromHeader(): string | null {
  const headersList = headers();
  return headersList.get("x-viewer-id");
}

export function getIpFromHeader(): string {
  const headersList = headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}
