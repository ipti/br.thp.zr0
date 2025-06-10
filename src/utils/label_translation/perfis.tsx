export const PerfisLabelTranslation = {
    "SELLER": "Vendedor",
    "SELLER_MANAGER": "Gestão",
    "CUSTOMER": "Cliente",
    "ADMIN": "Administrador"
  }

  type PerfisKeys = keyof typeof PerfisLabelTranslation;

// Now, strongly type the 'e' parameter
// Assuming 'e' is intended to be one of the keys of PerfisLabelTranslation
// For example, in a function:
export function getTranslatedLabelPerfis(e: PerfisKeys): string {
  return PerfisLabelTranslation[e];
}
