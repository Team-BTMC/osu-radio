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

export function availableResource(resource: string, fallback: string): Promise<string> {
  const img = document.createElement("img");

  const p = new Promise<string>(resolve => {
    img.addEventListener("load", () => resolve(resource));
    img.addEventListener("error", () => {
      console.log("Failed to load: " + resource);
      resolve(fallback);
    });
  });

  img.src = resource;

  return p;
}