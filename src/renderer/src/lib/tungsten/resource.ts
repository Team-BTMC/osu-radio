import { ResourceID, ResourceTables } from '../../../../@types';
import { createSignal } from 'solid-js';



export function getResourcePath(id: ResourceID | undefined, table: ResourceTables) {
  //todo set default and not ""
  const [path, setPath] = createSignal("");

  window.api.request("resourceGet", id, table)
    .then(result => {
      if (result.isError) {
        return;
      }

      setPath(new URL(result.value).href);
    });

  return path;
}