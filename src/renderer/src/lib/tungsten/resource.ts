import { ResourceID, ResourceTables } from '../../../../@types';



export function getResourcePath(id: ResourceID | undefined, table: ResourceTables): Promise<string> {
  return new Promise<string>(resolve => {
    window.api.request("resourceGet", id, table)
      .then(result => {
        if (result.isError) {
          return;
        }

        resolve(new URL(result.value).href);
      });
  });
}



//todo load on startup and save on shutdown
const seen = new Map<string, boolean>();

export function availableResource(resource: string, fallback: string): Promise<string> {
  const entry = seen.get(resource);

  if (entry !== undefined) {
    return Promise.resolve(
      entry
        ? resource
        : fallback
    );
  }

  const img = document.createElement("img");

  const p = new Promise<string>(resolve => {
    img.addEventListener("load", () => {
      seen.set(resource, true);
      resolve(resource);
    });
    img.addEventListener("error", () => {
      seen.set(resource, false);
      resolve(fallback);
    });
  });

  img.src = resource;

  return p;
}