export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
] as const;

export const languageCodes = SUPPORTED_LANGUAGES.map((lang) => lang.code);
