/// <reference types="node" />
import { EventEmitter } from 'events';
declare const animeListRouter: import("express-serve-static-core").Router;
declare class AnimelistEmitterClass extends EventEmitter {
    on(event: 'updateNumbers', listener: (userId: string, err: Error | null) => void): this;
    emitUpdateNumbers(userId: string, err: Error | null): void;
}
export declare const AnimelistEmitter: AnimelistEmitterClass;
export default animeListRouter;
