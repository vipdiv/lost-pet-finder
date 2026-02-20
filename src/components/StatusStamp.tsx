const stampClasses: Record<string, string> = {
  MISSING: "stamp-missing",
  REGULAR: "stamp-regular",
  UNKNOWN: "stamp-sighting",
  REUNITED: "stamp-reunited",
  SIGHTING: "stamp-sighting",
};

const stampLabels: Record<string, string> = {
  MISSING: "Missing",
  REGULAR: "Regular",
  UNKNOWN: "New Sighting",
  REUNITED: "Reunited",
  SIGHTING: "New Sighting",
};

export function StatusStamp({ status }: { status: string }) {
  return (
    <span className={stampClasses[status] || "stamp-sighting"}>
      {stampLabels[status] || status}
    </span>
  );
}
