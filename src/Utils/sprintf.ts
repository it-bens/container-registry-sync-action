export function sprintf(template: string, ...args: string[]): string {
  return template.replace(/%s/g, () => args.shift() || '')
}
