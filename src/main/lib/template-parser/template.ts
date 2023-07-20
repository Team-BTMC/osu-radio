import { ConfigItem } from "./parser/TemplateParser";



export type IdentAccessor = (ident: string) => string;



export default function template(config: ConfigItem[], accessor: IdentAccessor): string {
    let buffer = "";

    for (let i = 0; i < config.length; i++) {
        if (config[i].type === "TEXT") {
            buffer += config[i].literal;
            continue;
        }

        if (config[i].type === "IDENT") {
            buffer += accessor(config[i].literal);
        }
    }

    return buffer;
}