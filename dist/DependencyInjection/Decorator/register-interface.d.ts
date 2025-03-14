import 'reflect-metadata';
import { Lifecycle } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types/index.js';
export declare function registerInterface<T>(interfaceName: string, lifecycle?: Lifecycle.ContainerScoped | Lifecycle.ResolutionScoped): (target: constructor<T>) => void;
