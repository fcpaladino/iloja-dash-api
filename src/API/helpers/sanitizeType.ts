export function sanitizeType<T extends Record<string, any>>(
  data: unknown[],
  model: T
): T[] {
  const allowedKeys = Object.keys(model) as (keyof T)[];

  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    if (!item || typeof item !== 'object') return { ...model } as T;

    const src = item as Record<string, unknown>;
    const picked: Record<string, any> = {};

    for (const key of allowedKeys) {
      const value = (src as any)[key];

      if (Array.isArray(model[key])) {
        if (Array.isArray(value) && value.length > 0) {
          const subModel = (model[key] as any[])[0];
          const sanitized = sanitizeType(value, subModel);

          (picked as any)[key] = sanitized.filter((sub) => {
            const idVal = sub.id;
            const validId =
              idVal !== null &&
              idVal !== undefined &&
              idVal !== 0 &&
              !Number.isNaN(idVal);

            const hasValidField = Object.entries(sub).some(
              ([k, v]) =>
                k !== 'id' && v !== null && v !== undefined && v !== ''
            );

            return validId || hasValidField;
          });
        } else {
          (picked as any)[key] = [];
        }
      } else {
        let finalValue = key in src ? value : model[key];

        // força id válido no nível principal
        if (
          key === 'id' &&
          (finalValue === null ||
            finalValue === undefined ||
            Number.isNaN(finalValue))
        ) {
          finalValue = 0;
        }

        (picked as any)[key] = finalValue;
      }
    }

    return picked as T;
  });
}
