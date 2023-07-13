import { ResourceID } from '../../../../@types';



export function getResourcePath(id: ResourceID | undefined): Promise<string> {
  return new Promise<string>(resolve => {
    window.api.request("resourceGet", id)
      .then(result => {
        if (result.isError) {
          return;
        }

        resolve(new URL(result.value).href);
      });
  });
}



const seen = new Map<string, boolean>();

export function availableResource(resource: string, fallback: string): Promise<string> {
  const isAvailable = seen.get(resource);

  if (isAvailable !== undefined) {
    return Promise.resolve(isAvailable ? resource : fallback);
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