export function assetUrl(path: string) {
  if(import.meta.env.BASE_URL === '/') return path;

  return `${import.meta.env.BASE_URL}${path}`;
}
