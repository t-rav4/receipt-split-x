export function convertToPascalCase(text: string) {
  const normalizedText = text.replace(/\s+/g, " ");

  const words = normalizedText.split(" ");

  const formatted = words.map((word) => {
    if (word.split("").length === 1) {
      return word.toLowerCase();
    }

    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  return formatted.join(" ").trim();
}
