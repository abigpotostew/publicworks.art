const isDate = (date: any): date is Date => {
  return (
    typeof date?.getMonth === "function" &&
    typeof date?.toISOString === "function"
  );
};
/**
 * Recursively convert any Date fields to string ISO date format
 * @param object
 * @return the same object with all dates mutated to string ISO date format
 */
export const prismaNextAdaptor = <T = any>(object: T): T => {
  if (object === null || object === undefined) {
    return object;
  }
  if (isDate(object)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return object.toISOString();
  } else if (Array.isArray(object)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return object.map(prismaNextAdaptor);
  } else if (typeof object === "object") {
    const objectAny = object as any;
    Object.keys(objectAny).forEach((key) => {
      if (isDate(objectAny[key])) {
        objectAny[key] = objectAny[key].toISOString();
      } else if (typeof objectAny[key] === "object") {
        prismaNextAdaptor(objectAny[key]);
      }
    });
  }
  return object;
};
