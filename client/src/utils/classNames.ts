export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter((className): className is string => Boolean(className)).join(" ");
}
