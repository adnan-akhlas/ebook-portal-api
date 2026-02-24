import crypto from "crypto";

export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const randomSuffix = crypto.randomBytes(4).toString("hex");

  return `${baseSlug}-${randomSuffix}`;
}
