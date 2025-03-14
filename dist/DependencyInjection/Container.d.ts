import { InjectionToken } from 'tsyringe';
export declare class Container {
    registerValue(key: string, value: unknown): void;
    resolve<T>(token: InjectionToken<T>): T;
    registerInterfaces(): Promise<void>;
}
