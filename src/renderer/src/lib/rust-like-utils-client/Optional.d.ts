import { Optional } from '../../../../@types';
export declare function none(): Optional<any>;
export declare function some<V>(value: V): Optional<V>;
export declare function orDefault<V>(opt: Optional<V>, def: V): V;
