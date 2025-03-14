import { fileURLToPath } from 'node:url';
import path from 'path';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _Reflect = {};

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var hasRequired_Reflect;

function require_Reflect () {
	if (hasRequired_Reflect) return _Reflect;
	hasRequired_Reflect = 1;
	var Reflect;
	(function (Reflect) {
	    // Metadata Proposal
	    // https://rbuckton.github.io/reflect-metadata/
	    (function (factory) {
	        var root = typeof globalThis === "object" ? globalThis :
	            typeof commonjsGlobal === "object" ? commonjsGlobal :
	                typeof self === "object" ? self :
	                    typeof this === "object" ? this :
	                        sloppyModeThis();
	        var exporter = makeExporter(Reflect);
	        if (typeof root.Reflect !== "undefined") {
	            exporter = makeExporter(root.Reflect, exporter);
	        }
	        factory(exporter, root);
	        if (typeof root.Reflect === "undefined") {
	            root.Reflect = Reflect;
	        }
	        function makeExporter(target, previous) {
	            return function (key, value) {
	                Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
	                if (previous)
	                    previous(key, value);
	            };
	        }
	        function functionThis() {
	            try {
	                return Function("return this;")();
	            }
	            catch (_) { }
	        }
	        function indirectEvalThis() {
	            try {
	                return (void 0, eval)("(function() { return this; })()");
	            }
	            catch (_) { }
	        }
	        function sloppyModeThis() {
	            return functionThis() || indirectEvalThis();
	        }
	    })(function (exporter, root) {
	        var hasOwn = Object.prototype.hasOwnProperty;
	        // feature test for Symbol support
	        var supportsSymbol = typeof Symbol === "function";
	        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
	        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
	        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
	        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
	        var downLevel = !supportsCreate && !supportsProto;
	        var HashMap = {
	            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
	            create: supportsCreate
	                ? function () { return MakeDictionary(Object.create(null)); }
	                : supportsProto
	                    ? function () { return MakeDictionary({ __proto__: null }); }
	                    : function () { return MakeDictionary({}); },
	            has: downLevel
	                ? function (map, key) { return hasOwn.call(map, key); }
	                : function (map, key) { return key in map; },
	            get: downLevel
	                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
	                : function (map, key) { return map[key]; },
	        };
	        // Load global or shim versions of Map, Set, and WeakMap
	        var functionPrototype = Object.getPrototypeOf(Function);
	        var _Map = typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
	        var _Set = typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
	        var _WeakMap = typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
	        var registrySymbol = supportsSymbol ? Symbol.for("@reflect-metadata:registry") : undefined;
	        var metadataRegistry = GetOrCreateMetadataRegistry();
	        var metadataProvider = CreateMetadataProvider(metadataRegistry);
	        /**
	         * Applies a set of decorators to a property of a target object.
	         * @param decorators An array of decorators.
	         * @param target The target object.
	         * @param propertyKey (Optional) The property key to decorate.
	         * @param attributes (Optional) The property descriptor for the target key.
	         * @remarks Decorators are applied in reverse order.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Example = Reflect.decorate(decoratorsArray, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Object.defineProperty(Example, "staticMethod",
	         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
	         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
	         *
	         *     // method (on prototype)
	         *     Object.defineProperty(Example.prototype, "method",
	         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
	         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
	         *
	         */
	        function decorate(decorators, target, propertyKey, attributes) {
	            if (!IsUndefined(propertyKey)) {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
	                    throw new TypeError();
	                if (IsNull(attributes))
	                    attributes = undefined;
	                propertyKey = ToPropertyKey(propertyKey);
	                return DecorateProperty(decorators, target, propertyKey, attributes);
	            }
	            else {
	                if (!IsArray(decorators))
	                    throw new TypeError();
	                if (!IsConstructor(target))
	                    throw new TypeError();
	                return DecorateConstructor(decorators, target);
	            }
	        }
	        exporter("decorate", decorate);
	        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
	        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
	        /**
	         * A default metadata decorator factory that can be used on a class, class member, or parameter.
	         * @param metadataKey The key for the metadata entry.
	         * @param metadataValue The value for the metadata entry.
	         * @returns A decorator function.
	         * @remarks
	         * If `metadataKey` is already defined for the target and target key, the
	         * metadataValue for that key will be overwritten.
	         * @example
	         *
	         *     // constructor
	         *     @Reflect.metadata(key, value)
	         *     class Example {
	         *     }
	         *
	         *     // property (on constructor, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticProperty;
	         *     }
	         *
	         *     // property (on prototype, TypeScript only)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         property;
	         *     }
	         *
	         *     // method (on constructor)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         static staticMethod() { }
	         *     }
	         *
	         *     // method (on prototype)
	         *     class Example {
	         *         @Reflect.metadata(key, value)
	         *         method() { }
	         *     }
	         *
	         */
	        function metadata(metadataKey, metadataValue) {
	            function decorator(target, propertyKey) {
	                if (!IsObject(target))
	                    throw new TypeError();
	                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
	                    throw new TypeError();
	                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	            }
	            return decorator;
	        }
	        exporter("metadata", metadata);
	        /**
	         * Define a unique metadata entry on the target.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param metadataValue A value that contains attached metadata.
	         * @param target The target object on which to define metadata.
	         * @param propertyKey (Optional) The property key for the target.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     Reflect.defineMetadata("custom:annotation", options, Example);
	         *
	         *     // property (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
	         *
	         *     // decorator factory as metadata-producing annotation.
	         *     function MyAnnotation(options): Decorator {
	         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
	         *     }
	         *
	         */
	        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
	        }
	        exporter("defineMetadata", defineMetadata);
	        /**
	         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasMetadata", hasMetadata);
	        /**
	         * Gets a value indicating whether the target object has the provided metadata key defined.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function hasOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("hasOwnMetadata", hasOwnMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getMetadata", getMetadata);
	        /**
	         * Gets the metadata value for the provided metadata key on the target object.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function getOwnMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("getOwnMetadata", getOwnMetadata);
	        /**
	         * Gets the metadata keys defined on the target object or its prototype chain.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryMetadataKeys(target, propertyKey);
	        }
	        exporter("getMetadataKeys", getMetadataKeys);
	        /**
	         * Gets the unique metadata keys defined on the target object.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns An array of unique metadata keys.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.getOwnMetadataKeys(Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
	         *
	         */
	        function getOwnMetadataKeys(target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            return OrdinaryOwnMetadataKeys(target, propertyKey);
	        }
	        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
	        /**
	         * Deletes the metadata entry from the target object with the provided key.
	         * @param metadataKey A key used to store and retrieve metadata.
	         * @param target The target object on which the metadata is defined.
	         * @param propertyKey (Optional) The property key for the target.
	         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
	         * @example
	         *
	         *     class Example {
	         *         // property declarations are not part of ES6, though they are valid in TypeScript:
	         *         // static staticProperty;
	         *         // property;
	         *
	         *         constructor(p) { }
	         *         static staticMethod(p) { }
	         *         method(p) { }
	         *     }
	         *
	         *     // constructor
	         *     result = Reflect.deleteMetadata("custom:annotation", Example);
	         *
	         *     // property (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
	         *
	         *     // property (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
	         *
	         *     // method (on constructor)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
	         *
	         *     // method (on prototype)
	         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
	         *
	         */
	        function deleteMetadata(metadataKey, target, propertyKey) {
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            if (!IsObject(target))
	                throw new TypeError();
	            if (!IsUndefined(propertyKey))
	                propertyKey = ToPropertyKey(propertyKey);
	            var provider = GetMetadataProvider(target, propertyKey, /*Create*/ false);
	            if (IsUndefined(provider))
	                return false;
	            return provider.OrdinaryDeleteMetadata(metadataKey, target, propertyKey);
	        }
	        exporter("deleteMetadata", deleteMetadata);
	        function DecorateConstructor(decorators, target) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsConstructor(decorated))
	                        throw new TypeError();
	                    target = decorated;
	                }
	            }
	            return target;
	        }
	        function DecorateProperty(decorators, target, propertyKey, descriptor) {
	            for (var i = decorators.length - 1; i >= 0; --i) {
	                var decorator = decorators[i];
	                var decorated = decorator(target, propertyKey, descriptor);
	                if (!IsUndefined(decorated) && !IsNull(decorated)) {
	                    if (!IsObject(decorated))
	                        throw new TypeError();
	                    descriptor = decorated;
	                }
	            }
	            return descriptor;
	        }
	        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
	        function OrdinaryHasMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return true;
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryHasMetadata(MetadataKey, parent, P);
	            return false;
	        }
	        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	            var provider = GetMetadataProvider(O, P, /*Create*/ false);
	            if (IsUndefined(provider))
	                return false;
	            return ToBoolean(provider.OrdinaryHasOwnMetadata(MetadataKey, O, P));
	        }
	        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
	        function OrdinaryGetMetadata(MetadataKey, O, P) {
	            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
	            if (hasOwn)
	                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (!IsNull(parent))
	                return OrdinaryGetMetadata(MetadataKey, parent, P);
	            return undefined;
	        }
	        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	            var provider = GetMetadataProvider(O, P, /*Create*/ false);
	            if (IsUndefined(provider))
	                return;
	            return provider.OrdinaryGetOwnMetadata(MetadataKey, O, P);
	        }
	        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	            var provider = GetMetadataProvider(O, P, /*Create*/ true);
	            provider.OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P);
	        }
	        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
	        function OrdinaryMetadataKeys(O, P) {
	            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
	            var parent = OrdinaryGetPrototypeOf(O);
	            if (parent === null)
	                return ownKeys;
	            var parentKeys = OrdinaryMetadataKeys(parent, P);
	            if (parentKeys.length <= 0)
	                return ownKeys;
	            if (ownKeys.length <= 0)
	                return parentKeys;
	            var set = new _Set();
	            var keys = [];
	            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
	                var key = ownKeys_1[_i];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
	                var key = parentKeys_1[_a];
	                var hasKey = set.has(key);
	                if (!hasKey) {
	                    set.add(key);
	                    keys.push(key);
	                }
	            }
	            return keys;
	        }
	        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	        function OrdinaryOwnMetadataKeys(O, P) {
	            var provider = GetMetadataProvider(O, P, /*create*/ false);
	            if (!provider) {
	                return [];
	            }
	            return provider.OrdinaryOwnMetadataKeys(O, P);
	        }
	        // 6 ECMAScript Data Types and Values
	        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
	        function Type(x) {
	            if (x === null)
	                return 1 /* Null */;
	            switch (typeof x) {
	                case "undefined": return 0 /* Undefined */;
	                case "boolean": return 2 /* Boolean */;
	                case "string": return 3 /* String */;
	                case "symbol": return 4 /* Symbol */;
	                case "number": return 5 /* Number */;
	                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
	                default: return 6 /* Object */;
	            }
	        }
	        // 6.1.1 The Undefined Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
	        function IsUndefined(x) {
	            return x === undefined;
	        }
	        // 6.1.2 The Null Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
	        function IsNull(x) {
	            return x === null;
	        }
	        // 6.1.5 The Symbol Type
	        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
	        function IsSymbol(x) {
	            return typeof x === "symbol";
	        }
	        // 6.1.7 The Object Type
	        // https://tc39.github.io/ecma262/#sec-object-type
	        function IsObject(x) {
	            return typeof x === "object" ? x !== null : typeof x === "function";
	        }
	        // 7.1 Type Conversion
	        // https://tc39.github.io/ecma262/#sec-type-conversion
	        // 7.1.1 ToPrimitive(input [, PreferredType])
	        // https://tc39.github.io/ecma262/#sec-toprimitive
	        function ToPrimitive(input, PreferredType) {
	            switch (Type(input)) {
	                case 0 /* Undefined */: return input;
	                case 1 /* Null */: return input;
	                case 2 /* Boolean */: return input;
	                case 3 /* String */: return input;
	                case 4 /* Symbol */: return input;
	                case 5 /* Number */: return input;
	            }
	            var hint = "string" ;
	            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
	            if (exoticToPrim !== undefined) {
	                var result = exoticToPrim.call(input, hint);
	                if (IsObject(result))
	                    throw new TypeError();
	                return result;
	            }
	            return OrdinaryToPrimitive(input);
	        }
	        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
	        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
	        function OrdinaryToPrimitive(O, hint) {
	            var valueOf, result, toString_2; {
	                var toString_1 = O.toString;
	                if (IsCallable(toString_1)) {
	                    var result = toString_1.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	                var valueOf = O.valueOf;
	                if (IsCallable(valueOf)) {
	                    var result = valueOf.call(O);
	                    if (!IsObject(result))
	                        return result;
	                }
	            }
	            throw new TypeError();
	        }
	        // 7.1.2 ToBoolean(argument)
	        // https://tc39.github.io/ecma262/2016/#sec-toboolean
	        function ToBoolean(argument) {
	            return !!argument;
	        }
	        // 7.1.12 ToString(argument)
	        // https://tc39.github.io/ecma262/#sec-tostring
	        function ToString(argument) {
	            return "" + argument;
	        }
	        // 7.1.14 ToPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-topropertykey
	        function ToPropertyKey(argument) {
	            var key = ToPrimitive(argument);
	            if (IsSymbol(key))
	                return key;
	            return ToString(key);
	        }
	        // 7.2 Testing and Comparison Operations
	        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
	        // 7.2.2 IsArray(argument)
	        // https://tc39.github.io/ecma262/#sec-isarray
	        function IsArray(argument) {
	            return Array.isArray
	                ? Array.isArray(argument)
	                : argument instanceof Object
	                    ? argument instanceof Array
	                    : Object.prototype.toString.call(argument) === "[object Array]";
	        }
	        // 7.2.3 IsCallable(argument)
	        // https://tc39.github.io/ecma262/#sec-iscallable
	        function IsCallable(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.4 IsConstructor(argument)
	        // https://tc39.github.io/ecma262/#sec-isconstructor
	        function IsConstructor(argument) {
	            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
	            return typeof argument === "function";
	        }
	        // 7.2.7 IsPropertyKey(argument)
	        // https://tc39.github.io/ecma262/#sec-ispropertykey
	        function IsPropertyKey(argument) {
	            switch (Type(argument)) {
	                case 3 /* String */: return true;
	                case 4 /* Symbol */: return true;
	                default: return false;
	            }
	        }
	        function SameValueZero(x, y) {
	            return x === y || x !== x && y !== y;
	        }
	        // 7.3 Operations on Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-objects
	        // 7.3.9 GetMethod(V, P)
	        // https://tc39.github.io/ecma262/#sec-getmethod
	        function GetMethod(V, P) {
	            var func = V[P];
	            if (func === undefined || func === null)
	                return undefined;
	            if (!IsCallable(func))
	                throw new TypeError();
	            return func;
	        }
	        // 7.4 Operations on Iterator Objects
	        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
	        function GetIterator(obj) {
	            var method = GetMethod(obj, iteratorSymbol);
	            if (!IsCallable(method))
	                throw new TypeError(); // from Call
	            var iterator = method.call(obj);
	            if (!IsObject(iterator))
	                throw new TypeError();
	            return iterator;
	        }
	        // 7.4.4 IteratorValue(iterResult)
	        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
	        function IteratorValue(iterResult) {
	            return iterResult.value;
	        }
	        // 7.4.5 IteratorStep(iterator)
	        // https://tc39.github.io/ecma262/#sec-iteratorstep
	        function IteratorStep(iterator) {
	            var result = iterator.next();
	            return result.done ? false : result;
	        }
	        // 7.4.6 IteratorClose(iterator, completion)
	        // https://tc39.github.io/ecma262/#sec-iteratorclose
	        function IteratorClose(iterator) {
	            var f = iterator["return"];
	            if (f)
	                f.call(iterator);
	        }
	        // 9.1 Ordinary Object Internal Methods and Internal Slots
	        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
	        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
	        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
	        function OrdinaryGetPrototypeOf(O) {
	            var proto = Object.getPrototypeOf(O);
	            if (typeof O !== "function" || O === functionPrototype)
	                return proto;
	            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
	            // Try to determine the superclass constructor. Compatible implementations
	            // must either set __proto__ on a subclass constructor to the superclass constructor,
	            // or ensure each class has a valid `constructor` property on its prototype that
	            // points back to the constructor.
	            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
	            // This is the case when in ES6 or when using __proto__ in a compatible browser.
	            if (proto !== functionPrototype)
	                return proto;
	            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
	            var prototype = O.prototype;
	            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
	            if (prototypeProto == null || prototypeProto === Object.prototype)
	                return proto;
	            // If the constructor was not a function, then we cannot determine the heritage.
	            var constructor = prototypeProto.constructor;
	            if (typeof constructor !== "function")
	                return proto;
	            // If we have some kind of self-reference, then we cannot determine the heritage.
	            if (constructor === O)
	                return proto;
	            // we have a pretty good guess at the heritage.
	            return constructor;
	        }
	        // Global metadata registry
	        // - Allows `import "reflect-metadata"` and `import "reflect-metadata/no-conflict"` to interoperate.
	        // - Uses isolated metadata if `Reflect` is frozen before the registry can be installed.
	        /**
	         * Creates a registry used to allow multiple `reflect-metadata` providers.
	         */
	        function CreateMetadataRegistry() {
	            var fallback;
	            if (!IsUndefined(registrySymbol) &&
	                typeof root.Reflect !== "undefined" &&
	                !(registrySymbol in root.Reflect) &&
	                typeof root.Reflect.defineMetadata === "function") {
	                // interoperate with older version of `reflect-metadata` that did not support a registry.
	                fallback = CreateFallbackProvider(root.Reflect);
	            }
	            var first;
	            var second;
	            var rest;
	            var targetProviderMap = new _WeakMap();
	            var registry = {
	                registerProvider: registerProvider,
	                getProvider: getProvider,
	                setProvider: setProvider,
	            };
	            return registry;
	            function registerProvider(provider) {
	                if (!Object.isExtensible(registry)) {
	                    throw new Error("Cannot add provider to a frozen registry.");
	                }
	                switch (true) {
	                    case fallback === provider: break;
	                    case IsUndefined(first):
	                        first = provider;
	                        break;
	                    case first === provider: break;
	                    case IsUndefined(second):
	                        second = provider;
	                        break;
	                    case second === provider: break;
	                    default:
	                        if (rest === undefined)
	                            rest = new _Set();
	                        rest.add(provider);
	                        break;
	                }
	            }
	            function getProviderNoCache(O, P) {
	                if (!IsUndefined(first)) {
	                    if (first.isProviderFor(O, P))
	                        return first;
	                    if (!IsUndefined(second)) {
	                        if (second.isProviderFor(O, P))
	                            return first;
	                        if (!IsUndefined(rest)) {
	                            var iterator = GetIterator(rest);
	                            while (true) {
	                                var next = IteratorStep(iterator);
	                                if (!next) {
	                                    return undefined;
	                                }
	                                var provider = IteratorValue(next);
	                                if (provider.isProviderFor(O, P)) {
	                                    IteratorClose(iterator);
	                                    return provider;
	                                }
	                            }
	                        }
	                    }
	                }
	                if (!IsUndefined(fallback) && fallback.isProviderFor(O, P)) {
	                    return fallback;
	                }
	                return undefined;
	            }
	            function getProvider(O, P) {
	                var providerMap = targetProviderMap.get(O);
	                var provider;
	                if (!IsUndefined(providerMap)) {
	                    provider = providerMap.get(P);
	                }
	                if (!IsUndefined(provider)) {
	                    return provider;
	                }
	                provider = getProviderNoCache(O, P);
	                if (!IsUndefined(provider)) {
	                    if (IsUndefined(providerMap)) {
	                        providerMap = new _Map();
	                        targetProviderMap.set(O, providerMap);
	                    }
	                    providerMap.set(P, provider);
	                }
	                return provider;
	            }
	            function hasProvider(provider) {
	                if (IsUndefined(provider))
	                    throw new TypeError();
	                return first === provider || second === provider || !IsUndefined(rest) && rest.has(provider);
	            }
	            function setProvider(O, P, provider) {
	                if (!hasProvider(provider)) {
	                    throw new Error("Metadata provider not registered.");
	                }
	                var existingProvider = getProvider(O, P);
	                if (existingProvider !== provider) {
	                    if (!IsUndefined(existingProvider)) {
	                        return false;
	                    }
	                    var providerMap = targetProviderMap.get(O);
	                    if (IsUndefined(providerMap)) {
	                        providerMap = new _Map();
	                        targetProviderMap.set(O, providerMap);
	                    }
	                    providerMap.set(P, provider);
	                }
	                return true;
	            }
	        }
	        /**
	         * Gets or creates the shared registry of metadata providers.
	         */
	        function GetOrCreateMetadataRegistry() {
	            var metadataRegistry;
	            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
	                metadataRegistry = root.Reflect[registrySymbol];
	            }
	            if (IsUndefined(metadataRegistry)) {
	                metadataRegistry = CreateMetadataRegistry();
	            }
	            if (!IsUndefined(registrySymbol) && IsObject(root.Reflect) && Object.isExtensible(root.Reflect)) {
	                Object.defineProperty(root.Reflect, registrySymbol, {
	                    enumerable: false,
	                    configurable: false,
	                    writable: false,
	                    value: metadataRegistry
	                });
	            }
	            return metadataRegistry;
	        }
	        function CreateMetadataProvider(registry) {
	            // [[Metadata]] internal slot
	            // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
	            var metadata = new _WeakMap();
	            var provider = {
	                isProviderFor: function (O, P) {
	                    var targetMetadata = metadata.get(O);
	                    if (IsUndefined(targetMetadata))
	                        return false;
	                    return targetMetadata.has(P);
	                },
	                OrdinaryDefineOwnMetadata: OrdinaryDefineOwnMetadata,
	                OrdinaryHasOwnMetadata: OrdinaryHasOwnMetadata,
	                OrdinaryGetOwnMetadata: OrdinaryGetOwnMetadata,
	                OrdinaryOwnMetadataKeys: OrdinaryOwnMetadataKeys,
	                OrdinaryDeleteMetadata: OrdinaryDeleteMetadata,
	            };
	            metadataRegistry.registerProvider(provider);
	            return provider;
	            function GetOrCreateMetadataMap(O, P, Create) {
	                var targetMetadata = metadata.get(O);
	                var createdTargetMetadata = false;
	                if (IsUndefined(targetMetadata)) {
	                    if (!Create)
	                        return undefined;
	                    targetMetadata = new _Map();
	                    metadata.set(O, targetMetadata);
	                    createdTargetMetadata = true;
	                }
	                var metadataMap = targetMetadata.get(P);
	                if (IsUndefined(metadataMap)) {
	                    if (!Create)
	                        return undefined;
	                    metadataMap = new _Map();
	                    targetMetadata.set(P, metadataMap);
	                    if (!registry.setProvider(O, P, provider)) {
	                        targetMetadata.delete(P);
	                        if (createdTargetMetadata) {
	                            metadata.delete(O);
	                        }
	                        throw new Error("Wrong provider for target.");
	                    }
	                }
	                return metadataMap;
	            }
	            // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
	            function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return false;
	                return ToBoolean(metadataMap.has(MetadataKey));
	            }
	            // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
	            function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return undefined;
	                return metadataMap.get(MetadataKey);
	            }
	            // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
	            function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
	                metadataMap.set(MetadataKey, MetadataValue);
	            }
	            // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
	            // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
	            function OrdinaryOwnMetadataKeys(O, P) {
	                var keys = [];
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return keys;
	                var keysObj = metadataMap.keys();
	                var iterator = GetIterator(keysObj);
	                var k = 0;
	                while (true) {
	                    var next = IteratorStep(iterator);
	                    if (!next) {
	                        keys.length = k;
	                        return keys;
	                    }
	                    var nextValue = IteratorValue(next);
	                    try {
	                        keys[k] = nextValue;
	                    }
	                    catch (e) {
	                        try {
	                            IteratorClose(iterator);
	                        }
	                        finally {
	                            throw e;
	                        }
	                    }
	                    k++;
	                }
	            }
	            function OrdinaryDeleteMetadata(MetadataKey, O, P) {
	                var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
	                if (IsUndefined(metadataMap))
	                    return false;
	                if (!metadataMap.delete(MetadataKey))
	                    return false;
	                if (metadataMap.size === 0) {
	                    var targetMetadata = metadata.get(O);
	                    if (!IsUndefined(targetMetadata)) {
	                        targetMetadata.delete(P);
	                        if (targetMetadata.size === 0) {
	                            metadata.delete(targetMetadata);
	                        }
	                    }
	                }
	                return true;
	            }
	        }
	        function CreateFallbackProvider(reflect) {
	            var defineMetadata = reflect.defineMetadata, hasOwnMetadata = reflect.hasOwnMetadata, getOwnMetadata = reflect.getOwnMetadata, getOwnMetadataKeys = reflect.getOwnMetadataKeys, deleteMetadata = reflect.deleteMetadata;
	            var metadataOwner = new _WeakMap();
	            var provider = {
	                isProviderFor: function (O, P) {
	                    var metadataPropertySet = metadataOwner.get(O);
	                    if (!IsUndefined(metadataPropertySet) && metadataPropertySet.has(P)) {
	                        return true;
	                    }
	                    if (getOwnMetadataKeys(O, P).length) {
	                        if (IsUndefined(metadataPropertySet)) {
	                            metadataPropertySet = new _Set();
	                            metadataOwner.set(O, metadataPropertySet);
	                        }
	                        metadataPropertySet.add(P);
	                        return true;
	                    }
	                    return false;
	                },
	                OrdinaryDefineOwnMetadata: defineMetadata,
	                OrdinaryHasOwnMetadata: hasOwnMetadata,
	                OrdinaryGetOwnMetadata: getOwnMetadata,
	                OrdinaryOwnMetadataKeys: getOwnMetadataKeys,
	                OrdinaryDeleteMetadata: deleteMetadata,
	            };
	            return provider;
	        }
	        /**
	         * Gets the metadata provider for an object. If the object has no metadata provider and this is for a create operation,
	         * then this module's metadata provider is assigned to the object.
	         */
	        function GetMetadataProvider(O, P, Create) {
	            var registeredProvider = metadataRegistry.getProvider(O, P);
	            if (!IsUndefined(registeredProvider)) {
	                return registeredProvider;
	            }
	            if (Create) {
	                if (metadataRegistry.setProvider(O, P, metadataProvider)) {
	                    return metadataProvider;
	                }
	                throw new Error("Illegal state.");
	            }
	            return undefined;
	        }
	        // naive Map shim
	        function CreateMapPolyfill() {
	            var cacheSentinel = {};
	            var arraySentinel = [];
	            var MapIterator = /** @class */ (function () {
	                function MapIterator(keys, values, selector) {
	                    this._index = 0;
	                    this._keys = keys;
	                    this._values = values;
	                    this._selector = selector;
	                }
	                MapIterator.prototype["@@iterator"] = function () { return this; };
	                MapIterator.prototype[iteratorSymbol] = function () { return this; };
	                MapIterator.prototype.next = function () {
	                    var index = this._index;
	                    if (index >= 0 && index < this._keys.length) {
	                        var result = this._selector(this._keys[index], this._values[index]);
	                        if (index + 1 >= this._keys.length) {
	                            this._index = -1;
	                            this._keys = arraySentinel;
	                            this._values = arraySentinel;
	                        }
	                        else {
	                            this._index++;
	                        }
	                        return { value: result, done: false };
	                    }
	                    return { value: undefined, done: true };
	                };
	                MapIterator.prototype.throw = function (error) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    throw error;
	                };
	                MapIterator.prototype.return = function (value) {
	                    if (this._index >= 0) {
	                        this._index = -1;
	                        this._keys = arraySentinel;
	                        this._values = arraySentinel;
	                    }
	                    return { value: value, done: true };
	                };
	                return MapIterator;
	            }());
	            var Map = /** @class */ (function () {
	                function Map() {
	                    this._keys = [];
	                    this._values = [];
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                }
	                Object.defineProperty(Map.prototype, "size", {
	                    get: function () { return this._keys.length; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
	                Map.prototype.get = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    return index >= 0 ? this._values[index] : undefined;
	                };
	                Map.prototype.set = function (key, value) {
	                    var index = this._find(key, /*insert*/ true);
	                    this._values[index] = value;
	                    return this;
	                };
	                Map.prototype.delete = function (key) {
	                    var index = this._find(key, /*insert*/ false);
	                    if (index >= 0) {
	                        var size = this._keys.length;
	                        for (var i = index + 1; i < size; i++) {
	                            this._keys[i - 1] = this._keys[i];
	                            this._values[i - 1] = this._values[i];
	                        }
	                        this._keys.length--;
	                        this._values.length--;
	                        if (SameValueZero(key, this._cacheKey)) {
	                            this._cacheKey = cacheSentinel;
	                            this._cacheIndex = -2;
	                        }
	                        return true;
	                    }
	                    return false;
	                };
	                Map.prototype.clear = function () {
	                    this._keys.length = 0;
	                    this._values.length = 0;
	                    this._cacheKey = cacheSentinel;
	                    this._cacheIndex = -2;
	                };
	                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
	                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
	                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
	                Map.prototype["@@iterator"] = function () { return this.entries(); };
	                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
	                Map.prototype._find = function (key, insert) {
	                    if (!SameValueZero(this._cacheKey, key)) {
	                        this._cacheIndex = -1;
	                        for (var i = 0; i < this._keys.length; i++) {
	                            if (SameValueZero(this._keys[i], key)) {
	                                this._cacheIndex = i;
	                                break;
	                            }
	                        }
	                    }
	                    if (this._cacheIndex < 0 && insert) {
	                        this._cacheIndex = this._keys.length;
	                        this._keys.push(key);
	                        this._values.push(undefined);
	                    }
	                    return this._cacheIndex;
	                };
	                return Map;
	            }());
	            return Map;
	            function getKey(key, _) {
	                return key;
	            }
	            function getValue(_, value) {
	                return value;
	            }
	            function getEntry(key, value) {
	                return [key, value];
	            }
	        }
	        // naive Set shim
	        function CreateSetPolyfill() {
	            var Set = /** @class */ (function () {
	                function Set() {
	                    this._map = new _Map();
	                }
	                Object.defineProperty(Set.prototype, "size", {
	                    get: function () { return this._map.size; },
	                    enumerable: true,
	                    configurable: true
	                });
	                Set.prototype.has = function (value) { return this._map.has(value); };
	                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
	                Set.prototype.delete = function (value) { return this._map.delete(value); };
	                Set.prototype.clear = function () { this._map.clear(); };
	                Set.prototype.keys = function () { return this._map.keys(); };
	                Set.prototype.values = function () { return this._map.keys(); };
	                Set.prototype.entries = function () { return this._map.entries(); };
	                Set.prototype["@@iterator"] = function () { return this.keys(); };
	                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
	                return Set;
	            }());
	            return Set;
	        }
	        // naive WeakMap shim
	        function CreateWeakMapPolyfill() {
	            var UUID_SIZE = 16;
	            var keys = HashMap.create();
	            var rootKey = CreateUniqueKey();
	            return /** @class */ (function () {
	                function WeakMap() {
	                    this._key = CreateUniqueKey();
	                }
	                WeakMap.prototype.has = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.has(table, this._key) : false;
	                };
	                WeakMap.prototype.get = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
	                };
	                WeakMap.prototype.set = function (target, value) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
	                    table[this._key] = value;
	                    return this;
	                };
	                WeakMap.prototype.delete = function (target) {
	                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
	                    return table !== undefined ? delete table[this._key] : false;
	                };
	                WeakMap.prototype.clear = function () {
	                    // NOTE: not a real clear, just makes the previous data unreachable
	                    this._key = CreateUniqueKey();
	                };
	                return WeakMap;
	            }());
	            function CreateUniqueKey() {
	                var key;
	                do
	                    key = "@@WeakMap@@" + CreateUUID();
	                while (HashMap.has(keys, key));
	                keys[key] = true;
	                return key;
	            }
	            function GetOrCreateWeakMapTable(target, create) {
	                if (!hasOwn.call(target, rootKey)) {
	                    if (!create)
	                        return undefined;
	                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
	                }
	                return target[rootKey];
	            }
	            function FillRandomBytes(buffer, size) {
	                for (var i = 0; i < size; ++i)
	                    buffer[i] = Math.random() * 0xff | 0;
	                return buffer;
	            }
	            function GenRandomBytes(size) {
	                if (typeof Uint8Array === "function") {
	                    var array = new Uint8Array(size);
	                    if (typeof crypto !== "undefined") {
	                        crypto.getRandomValues(array);
	                    }
	                    else if (typeof msCrypto !== "undefined") {
	                        msCrypto.getRandomValues(array);
	                    }
	                    else {
	                        FillRandomBytes(array, size);
	                    }
	                    return array;
	                }
	                return FillRandomBytes(new Array(size), size);
	            }
	            function CreateUUID() {
	                var data = GenRandomBytes(UUID_SIZE);
	                // mark as random - RFC 4122 § 4.4
	                data[6] = data[6] & 0x4f | 0x40;
	                data[8] = data[8] & 0xbf | 0x80;
	                var result = "";
	                for (var offset = 0; offset < UUID_SIZE; ++offset) {
	                    var byte = data[offset];
	                    if (offset === 4 || offset === 6 || offset === 8)
	                        result += "-";
	                    if (byte < 16)
	                        result += "0";
	                    result += byte.toString(16).toLowerCase();
	                }
	                return result;
	            }
	        }
	        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
	        function MakeDictionary(obj) {
	            obj.__ = undefined;
	            delete obj.__;
	            return obj;
	        }
	    });
	})(Reflect || (Reflect = {}));
	return _Reflect;
}

require_Reflect();

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Lifecycle;
(function (Lifecycle) {
    Lifecycle[Lifecycle["Transient"] = 0] = "Transient";
    Lifecycle[Lifecycle["Singleton"] = 1] = "Singleton";
    Lifecycle[Lifecycle["ResolutionScoped"] = 2] = "ResolutionScoped";
    Lifecycle[Lifecycle["ContainerScoped"] = 3] = "ContainerScoped";
})(Lifecycle || (Lifecycle = {}));
var Lifecycle$1 = Lifecycle;

var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
function getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}
function defineInjectionTokenMetadata(data, transform) {
    return function (target, _propertyKey, parameterIndex) {
        var descriptors = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        descriptors[parameterIndex] = data;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, descriptors, target);
    };
}

function isClassProvider(provider) {
    return !!provider.useClass;
}

function isFactoryProvider(provider) {
    return !!provider.useFactory;
}

var DelayedConstructor = (function () {
    function DelayedConstructor(wrap) {
        this.wrap = wrap;
        this.reflectMethods = [
            "get",
            "getPrototypeOf",
            "setPrototypeOf",
            "getOwnPropertyDescriptor",
            "defineProperty",
            "has",
            "set",
            "deleteProperty",
            "apply",
            "construct",
            "ownKeys"
        ];
    }
    DelayedConstructor.prototype.createProxy = function (createObject) {
        var _this = this;
        var target = {};
        var init = false;
        var value;
        var delayedObject = function () {
            if (!init) {
                value = createObject(_this.wrap());
                init = true;
            }
            return value;
        };
        return new Proxy(target, this.createHandler(delayedObject));
    };
    DelayedConstructor.prototype.createHandler = function (delayedObject) {
        var handler = {};
        var install = function (name) {
            handler[name] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                args[0] = delayedObject();
                var method = Reflect[name];
                return method.apply(void 0, __spread(args));
            };
        };
        this.reflectMethods.forEach(install);
        return handler;
    };
    return DelayedConstructor;
}());

function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
function isTokenDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "multiple" in descriptor);
}
function isTransformDescriptor(descriptor) {
    return (typeof descriptor === "object" &&
        "token" in descriptor &&
        "transform" in descriptor);
}
function isConstructorToken(token) {
    return typeof token === "function" || token instanceof DelayedConstructor;
}

function isTokenProvider(provider) {
    return !!provider.useToken;
}

function isValueProvider(provider) {
    return provider.useValue != undefined;
}

function isProvider(provider) {
    return (isClassProvider(provider) ||
        isValueProvider(provider) ||
        isTokenProvider(provider) ||
        isFactoryProvider(provider));
}

var RegistryBase = (function () {
    function RegistryBase() {
        this._registryMap = new Map();
    }
    RegistryBase.prototype.entries = function () {
        return this._registryMap.entries();
    };
    RegistryBase.prototype.getAll = function (key) {
        this.ensure(key);
        return this._registryMap.get(key);
    };
    RegistryBase.prototype.get = function (key) {
        this.ensure(key);
        var value = this._registryMap.get(key);
        return value[value.length - 1] || null;
    };
    RegistryBase.prototype.set = function (key, value) {
        this.ensure(key);
        this._registryMap.get(key).push(value);
    };
    RegistryBase.prototype.setAll = function (key, value) {
        this._registryMap.set(key, value);
    };
    RegistryBase.prototype.has = function (key) {
        this.ensure(key);
        return this._registryMap.get(key).length > 0;
    };
    RegistryBase.prototype.clear = function () {
        this._registryMap.clear();
    };
    RegistryBase.prototype.ensure = function (key) {
        if (!this._registryMap.has(key)) {
            this._registryMap.set(key, []);
        }
    };
    return RegistryBase;
}());

var Registry = (function (_super) {
    __extends(Registry, _super);
    function Registry() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Registry;
}(RegistryBase));

var ResolutionContext = (function () {
    function ResolutionContext() {
        this.scopedResolutions = new Map();
    }
    return ResolutionContext;
}());

function formatDependency(params, idx) {
    if (params === null) {
        return "at position #" + idx;
    }
    var argName = params.split(",")[idx].trim();
    return "\"" + argName + "\" at position #" + idx;
}
function composeErrorMessage(msg, e, indent) {
    if (indent === void 0) { indent = "    "; }
    return __spread([msg], e.message.split("\n").map(function (l) { return indent + l; })).join("\n");
}
function formatErrorCtor(ctor, paramIdx, error) {
    var _a = __read(ctor.toString().match(/constructor\(([\w, ]+)\)/) || [], 2), _b = _a[1], params = _b === void 0 ? null : _b;
    var dep = formatDependency(params, paramIdx);
    return composeErrorMessage("Cannot inject the dependency " + dep + " of \"" + ctor.name + "\" constructor. Reason:", error);
}

function isDisposable(value) {
    if (typeof value.dispose !== "function")
        return false;
    var disposeFun = value.dispose;
    if (disposeFun.length > 0) {
        return false;
    }
    return true;
}

var PreResolutionInterceptors = (function (_super) {
    __extends(PreResolutionInterceptors, _super);
    function PreResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PreResolutionInterceptors;
}(RegistryBase));
var PostResolutionInterceptors = (function (_super) {
    __extends(PostResolutionInterceptors, _super);
    function PostResolutionInterceptors() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PostResolutionInterceptors;
}(RegistryBase));
var Interceptors = (function () {
    function Interceptors() {
        this.preResolution = new PreResolutionInterceptors();
        this.postResolution = new PostResolutionInterceptors();
    }
    return Interceptors;
}());

var typeInfo = new Map();
var InternalDependencyContainer = (function () {
    function InternalDependencyContainer(parent) {
        this.parent = parent;
        this._registry = new Registry();
        this.interceptors = new Interceptors();
        this.disposed = false;
        this.disposables = new Set();
    }
    InternalDependencyContainer.prototype.register = function (token, providerOrConstructor, options) {
        if (options === void 0) { options = { lifecycle: Lifecycle$1.Transient }; }
        this.ensureNotDisposed();
        var provider;
        if (!isProvider(providerOrConstructor)) {
            provider = { useClass: providerOrConstructor };
        }
        else {
            provider = providerOrConstructor;
        }
        if (isTokenProvider(provider)) {
            var path = [token];
            var tokenProvider = provider;
            while (tokenProvider != null) {
                var currentToken = tokenProvider.useToken;
                if (path.includes(currentToken)) {
                    throw new Error("Token registration cycle detected! " + __spread(path, [currentToken]).join(" -> "));
                }
                path.push(currentToken);
                var registration = this._registry.get(currentToken);
                if (registration && isTokenProvider(registration.provider)) {
                    tokenProvider = registration.provider;
                }
                else {
                    tokenProvider = null;
                }
            }
        }
        if (options.lifecycle === Lifecycle$1.Singleton ||
            options.lifecycle == Lifecycle$1.ContainerScoped ||
            options.lifecycle == Lifecycle$1.ResolutionScoped) {
            if (isValueProvider(provider) || isFactoryProvider(provider)) {
                throw new Error("Cannot use lifecycle \"" + Lifecycle$1[options.lifecycle] + "\" with ValueProviders or FactoryProviders");
            }
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    InternalDependencyContainer.prototype.registerType = function (from, to) {
        this.ensureNotDisposed();
        if (isNormalToken(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    InternalDependencyContainer.prototype.registerInstance = function (token, instance) {
        this.ensureNotDisposed();
        return this.register(token, {
            useValue: instance
        });
    };
    InternalDependencyContainer.prototype.registerSingleton = function (from, to) {
        this.ensureNotDisposed();
        if (isNormalToken(from)) {
            if (isNormalToken(to)) {
                return this.register(from, {
                    useToken: to
                }, { lifecycle: Lifecycle$1.Singleton });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { lifecycle: Lifecycle$1.Singleton });
            }
            throw new Error('Cannot register a type name as a singleton without a "to" token');
        }
        var useClass = from;
        if (to && !isNormalToken(to)) {
            useClass = to;
        }
        return this.register(from, {
            useClass: useClass
        }, { lifecycle: Lifecycle$1.Singleton });
    };
    InternalDependencyContainer.prototype.resolve = function (token, context) {
        if (context === void 0) { context = new ResolutionContext(); }
        this.ensureNotDisposed();
        var registration = this.getRegistration(token);
        if (!registration && isNormalToken(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "Single");
        if (registration) {
            var result = this.resolveRegistration(registration, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        if (isConstructorToken(token)) {
            var result = this.construct(token, context);
            this.executePostResolutionInterceptor(token, result, "Single");
            return result;
        }
        throw new Error("Attempted to construct an undefined constructor. Could mean a circular dependency problem. Try using `delay` function.");
    };
    InternalDependencyContainer.prototype.executePreResolutionInterceptor = function (token, resolutionType) {
        var e_1, _a;
        if (this.interceptors.preResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = __values(this.interceptors.preResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, resolutionType);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.interceptors.preResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.executePostResolutionInterceptor = function (token, result, resolutionType) {
        var e_2, _a;
        if (this.interceptors.postResolution.has(token)) {
            var remainingInterceptors = [];
            try {
                for (var _b = __values(this.interceptors.postResolution.getAll(token)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var interceptor = _c.value;
                    if (interceptor.options.frequency != "Once") {
                        remainingInterceptors.push(interceptor);
                    }
                    interceptor.callback(token, result, resolutionType);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.interceptors.postResolution.setAll(token, remainingInterceptors);
        }
    };
    InternalDependencyContainer.prototype.resolveRegistration = function (registration, context) {
        this.ensureNotDisposed();
        if (registration.options.lifecycle === Lifecycle$1.ResolutionScoped &&
            context.scopedResolutions.has(registration)) {
            return context.scopedResolutions.get(registration);
        }
        var isSingleton = registration.options.lifecycle === Lifecycle$1.Singleton;
        var isContainerScoped = registration.options.lifecycle === Lifecycle$1.ContainerScoped;
        var returnInstance = isSingleton || isContainerScoped;
        var resolved;
        if (isValueProvider(registration.provider)) {
            resolved = registration.provider.useValue;
        }
        else if (isTokenProvider(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.resolve(registration.provider.useToken, context))
                : this.resolve(registration.provider.useToken, context);
        }
        else if (isClassProvider(registration.provider)) {
            resolved = returnInstance
                ? registration.instance ||
                    (registration.instance = this.construct(registration.provider.useClass, context))
                : this.construct(registration.provider.useClass, context);
        }
        else if (isFactoryProvider(registration.provider)) {
            resolved = registration.provider.useFactory(this);
        }
        else {
            resolved = this.construct(registration.provider, context);
        }
        if (registration.options.lifecycle === Lifecycle$1.ResolutionScoped) {
            context.scopedResolutions.set(registration, resolved);
        }
        return resolved;
    };
    InternalDependencyContainer.prototype.resolveAll = function (token, context) {
        var _this = this;
        if (context === void 0) { context = new ResolutionContext(); }
        this.ensureNotDisposed();
        var registrations = this.getAllRegistrations(token);
        if (!registrations && isNormalToken(token)) {
            throw new Error("Attempted to resolve unregistered dependency token: \"" + token.toString() + "\"");
        }
        this.executePreResolutionInterceptor(token, "All");
        if (registrations) {
            var result_1 = registrations.map(function (item) {
                return _this.resolveRegistration(item, context);
            });
            this.executePostResolutionInterceptor(token, result_1, "All");
            return result_1;
        }
        var result = [this.construct(token, context)];
        this.executePostResolutionInterceptor(token, result, "All");
        return result;
    };
    InternalDependencyContainer.prototype.isRegistered = function (token, recursive) {
        if (recursive === void 0) { recursive = false; }
        this.ensureNotDisposed();
        return (this._registry.has(token) ||
            (recursive &&
                (this.parent || false) &&
                this.parent.isRegistered(token, true)));
    };
    InternalDependencyContainer.prototype.reset = function () {
        this.ensureNotDisposed();
        this._registry.clear();
        this.interceptors.preResolution.clear();
        this.interceptors.postResolution.clear();
    };
    InternalDependencyContainer.prototype.clearInstances = function () {
        var e_3, _a;
        this.ensureNotDisposed();
        try {
            for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
                this._registry.setAll(token, registrations
                    .filter(function (registration) { return !isValueProvider(registration.provider); })
                    .map(function (registration) {
                    registration.instance = undefined;
                    return registration;
                }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    InternalDependencyContainer.prototype.createChildContainer = function () {
        var e_4, _a;
        this.ensureNotDisposed();
        var childContainer = new InternalDependencyContainer(this);
        try {
            for (var _b = __values(this._registry.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], registrations = _d[1];
                if (registrations.some(function (_a) {
                    var options = _a.options;
                    return options.lifecycle === Lifecycle$1.ContainerScoped;
                })) {
                    childContainer._registry.setAll(token, registrations.map(function (registration) {
                        if (registration.options.lifecycle === Lifecycle$1.ContainerScoped) {
                            return {
                                provider: registration.provider,
                                options: registration.options
                            };
                        }
                        return registration;
                    }));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return childContainer;
    };
    InternalDependencyContainer.prototype.beforeResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.preResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.afterResolution = function (token, callback, options) {
        if (options === void 0) { options = { frequency: "Always" }; }
        this.interceptors.postResolution.set(token, {
            callback: callback,
            options: options
        });
    };
    InternalDependencyContainer.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.disposed = true;
                        promises = [];
                        this.disposables.forEach(function (disposable) {
                            var maybePromise = disposable.dispose();
                            if (maybePromise) {
                                promises.push(maybePromise);
                            }
                        });
                        return [4, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    InternalDependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.getAllRegistrations = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.getAll(token);
        }
        if (this.parent) {
            return this.parent.getAllRegistrations(token);
        }
        return null;
    };
    InternalDependencyContainer.prototype.construct = function (ctor, context) {
        var _this = this;
        if (ctor instanceof DelayedConstructor) {
            return ctor.createProxy(function (target) {
                return _this.resolve(target, context);
            });
        }
        var instance = (function () {
            var paramInfo = typeInfo.get(ctor);
            if (!paramInfo || paramInfo.length === 0) {
                if (ctor.length === 0) {
                    return new ctor();
                }
                else {
                    throw new Error("TypeInfo not known for \"" + ctor.name + "\"");
                }
            }
            var params = paramInfo.map(_this.resolveParams(context, ctor));
            return new (ctor.bind.apply(ctor, __spread([void 0], params)))();
        })();
        if (isDisposable(instance)) {
            this.disposables.add(instance);
        }
        return instance;
    };
    InternalDependencyContainer.prototype.resolveParams = function (context, ctor) {
        var _this = this;
        return function (param, idx) {
            var _a, _b, _c;
            try {
                if (isTokenDescriptor(param)) {
                    if (isTransformDescriptor(param)) {
                        return param.multiple
                            ? (_a = _this.resolve(param.transform)).transform.apply(_a, __spread([_this.resolveAll(param.token)], param.transformArgs)) : (_b = _this.resolve(param.transform)).transform.apply(_b, __spread([_this.resolve(param.token, context)], param.transformArgs));
                    }
                    else {
                        return param.multiple
                            ? _this.resolveAll(param.token)
                            : _this.resolve(param.token, context);
                    }
                }
                else if (isTransformDescriptor(param)) {
                    return (_c = _this.resolve(param.transform, context)).transform.apply(_c, __spread([_this.resolve(param.token, context)], param.transformArgs));
                }
                return _this.resolve(param, context);
            }
            catch (e) {
                throw new Error(formatErrorCtor(ctor, idx, e));
            }
        };
    };
    InternalDependencyContainer.prototype.ensureNotDisposed = function () {
        if (this.disposed) {
            throw new Error("This container has been disposed, you cannot interact with a disposed container");
        }
    };
    return InternalDependencyContainer;
}());
var instance = new InternalDependencyContainer();

function inject(token) {
    return defineInjectionTokenMetadata(token);
}

function injectable() {
    return function (target) {
        typeInfo.set(target, getParamInfo(target));
    };
}

function scoped(lifecycle, token) {
    return function (target) {
        injectable()(target);
        instance.register(target, target, {
            lifecycle: lifecycle
        });
    };
}

if (typeof Reflect === "undefined" || !Reflect.getMetadata) {
    throw new Error("tsyringe requires a reflect polyfill. Please add 'import \"reflect-metadata\"' to the top of your entry point.");
}

let Summary$1 = class Summary {
    installedRegCtlVersion = null;
    imageCopyResults = [];
    setInstalledRegCtlVersion(version) {
        this.installedRegCtlVersion = version;
    }
    addImageCopyResult(result) {
        this.imageCopyResults.push(result);
    }
    getInstalledRegCtlVersion() {
        if (this.installedRegCtlVersion === null) {
            throw new Error('installedRegCtlVersion has not been set');
        }
        return this.installedRegCtlVersion;
    }
    getImageCopyResults() {
        return this.imageCopyResults;
    }
};
Summary$1 = __decorate([
    scoped(Lifecycle$1.ContainerScoped)
], Summary$1);

let Action$3 = class Action {
    regCtlBinaryBuilder;
    io;
    downloader;
    exec;
    core;
    regCtlVersionBuilder;
    logger;
    summary;
    constructor(regCtlBinaryBuilder, io, downloader, exec, core, regCtlVersionBuilder, logger, summary) {
        this.regCtlBinaryBuilder = regCtlBinaryBuilder;
        this.io = io;
        this.downloader = downloader;
        this.exec = exec;
        this.core = core;
        this.regCtlVersionBuilder = regCtlVersionBuilder;
        this.logger = logger;
        this.summary = summary;
    }
    async run() {
        const regCtlBinary = this.regCtlBinaryBuilder.build('latest');
        await this.io.mkdirP(regCtlBinary.installationDirectory);
        try {
            await this.exec.exec('rm', [regCtlBinary.getInstallationPath()]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            this.logger.logRegCtlNotInstalledYet();
        }
        await this.downloader.downloadFile(regCtlBinary.buildDownloadUrl(), regCtlBinary.getInstallationPath());
        await this.exec.exec('chmod', ['+x', regCtlBinary.getInstallationPath()]);
        this.logger.logRegCtlInstalled(regCtlBinary.getInstallationPath(), regCtlBinary.version);
        this.core.addPath(regCtlBinary.installationDirectory);
        const regCtlVersion = await this.regCtlVersionBuilder.buildFromExecOutput();
        this.summary.setInstalledRegCtlVersion(regCtlVersion.vcsTag);
    }
    async post() {
        const regCtlBinary = this.regCtlBinaryBuilder.build('latest');
        try {
            await this.exec.exec('rm', [regCtlBinary.getInstallationPath()]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            this.logger.logRegCtlCouldNotBeDeleted(regCtlBinary.getInstallationPath());
        }
    }
};
Action$3 = __decorate([
    scoped(Lifecycle$1.ContainerScoped),
    __param(0, inject('RegCtlBinaryBuilderInterface')),
    __param(1, inject('IoInterface')),
    __param(2, inject('DownloaderInterface')),
    __param(3, inject('ExecInterface')),
    __param(4, inject('CoreInterface')),
    __param(5, inject('RegCtlVersionBuilderInterface')),
    __param(6, inject('LoggerInterface')),
    __param(7, inject(Summary$1)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Summary$1])
], Action$3);

let Action$2 = class Action {
    credentialsBuilder;
    regClient;
    logger;
    core;
    constructor(credentialsBuilder, regClient, logger, core) {
        this.credentialsBuilder = credentialsBuilder;
        this.regClient = regClient;
        this.logger = logger;
        this.core = core;
    }
    async run(inputs) {
        const regClientCredentials = this.credentialsBuilder.build(inputs);
        if (!inputs.loginToSourceRepository) {
            this.logger.logSkipLoginToRepository('source');
        }
        else if (regClientCredentials.source.username === '' ||
            regClientCredentials.source.password === '') {
            this.core.setFailed('Source repository credentials (username and/or password) are missing.');
        }
        else {
            await this.regClient.logIntoRegistry(regClientCredentials.source);
        }
        if (!inputs.loginToTargetRepository) {
            this.logger.logSkipLoginToRepository('target');
        }
        else if (regClientCredentials.target.username === '' ||
            regClientCredentials.target.password === '') {
            this.core.setFailed('Target repository credentials (username and/or password) are missing.');
        }
        else {
            await this.regClient.logIntoRegistry(regClientCredentials.target);
        }
    }
    async post(inputs) {
        if (inputs.loginToSourceRepository) {
            this.logger.logLoggingOutFromRepository('source');
            await this.regClient.logoutFromRegistry(this.credentialsBuilder.build(inputs).source);
        }
        if (inputs.loginToTargetRepository) {
            this.logger.logLoggingOutFromRepository('target');
            await this.regClient.logoutFromRegistry(this.credentialsBuilder.build(inputs).target);
        }
    }
};
Action$2 = __decorate([
    scoped(Lifecycle$1.ContainerScoped),
    __param(0, inject('RegClientCredentialsBuilderInterface')),
    __param(1, inject('RegClientInterface')),
    __param(2, inject('LoggerInterface')),
    __param(3, inject('CoreInterface')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], Action$2);

let Action$1 = class Action {
    installAction;
    loginAction;
    core;
    regClient;
    tagFilter;
    tagSorter;
    logger;
    summary;
    summaryPrinter;
    constructor(installAction, loginAction, core, regClient, tagFilter, tagSorter, logger, summary, summaryPrinter) {
        this.installAction = installAction;
        this.loginAction = loginAction;
        this.core = core;
        this.regClient = regClient;
        this.tagFilter = tagFilter;
        this.tagSorter = tagSorter;
        this.logger = logger;
        this.summary = summary;
        this.summaryPrinter = summaryPrinter;
    }
    async run(inputs) {
        await this.installAction.run();
        await this.loginAction.run(inputs);
        const sourceRepositoryTags = await this.regClient.listTagsInRepository(inputs.sourceRepository);
        this.logger.logTagsFound(sourceRepositoryTags.length, 'source');
        let filteredSourceRepositoryTags = this.tagFilter.filter(sourceRepositoryTags, inputs.tags);
        filteredSourceRepositoryTags = this.tagSorter.sortTags(filteredSourceRepositoryTags);
        this.logger.logTagsMatched(filteredSourceRepositoryTags.length, 'source');
        this.logger.logTagsToBeCopied(filteredSourceRepositoryTags, inputs.sourceRepository, inputs.targetRepository);
        for (const tag of filteredSourceRepositoryTags) {
            try {
                await this.regClient.copyImageFromSourceToTarget(inputs.sourceRepository, tag, inputs.targetRepository, tag);
            }
            catch (error) {
                if (error instanceof Error &&
                    error.message.startsWith('Failed to copy image')) {
                    this.core.setFailed(error.message);
                    this.summary.addImageCopyResult({
                        tag,
                        success: false
                    });
                    continue;
                }
            }
            this.summary.addImageCopyResult({
                tag,
                success: true
            });
        }
        await this.summaryPrinter.printSummary(this.summary);
    }
    async post(inputs) {
        await this.loginAction.post(inputs);
        await this.installAction.post();
    }
};
Action$1 = __decorate([
    scoped(Lifecycle$1.ContainerScoped),
    __param(0, inject(Action$3)),
    __param(1, inject(Action$2)),
    __param(2, inject('CoreInterface')),
    __param(3, inject('RegClientInterface')),
    __param(4, inject('TagFilterInterface')),
    __param(5, inject('TagSorterInterface')),
    __param(6, inject('LoggerInterface')),
    __param(7, inject(Summary$1)),
    __param(8, inject('PrinterInterface')),
    __metadata("design:paramtypes", [Action$3,
        Action$2, Object, Object, Object, Object, Object, Summary$1, Object])
], Action$1);

function registerInterface(interfaceName, lifecycle) {
    return function (target) {
        if (lifecycle) {
            instance.register(interfaceName, { useClass: target }, { lifecycle: lifecycle });
            return;
        }
        instance.register(interfaceName, { useClass: target });
    };
}

let Container$1 = class Container {
    registerValue(key, value) {
        instance.register(key, { useValue: value });
    }
    resolve(token) {
        return instance.resolve(token);
    }
    async registerInterfaces() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const srcDir = path.resolve(__dirname, '../../');
        const classMap = await Promise.resolve().then(function () { return classMap$1; });
        for (const [className, relativePath] of Object.entries(classMap.default)) {
            const filePath = path.join(srcDir, relativePath);
            const module = await import(filePath);
            const target = module[className];
            if (typeof target === 'function' && target.prototype) {
                const interfaceName = Reflect.getMetadata('design:interface', target);
                const lifecycle = Reflect.getMetadata('design:lifecycle', target);
                if (interfaceName) {
                    registerInterface(interfaceName, lifecycle)(target);
                }
            }
        }
    }
};

async function post() {
    const container = await buildContainer();
    const core = container.resolve('CoreInterface');
    const inputs = buildInputs(core);
    const action = container.resolve(Action$1);
    try {
        await action.post(inputs);
    }
    catch (error) {
        if (error instanceof Error) {
            const core = container.resolve('CoreInterface');
            core.setFailed(error.message);
        }
    }
}
async function buildContainer() {
    const container = new Container$1();
    await container.registerInterfaces();
    const core = container.resolve('CoreInterface');
    container.registerValue('RegClientConcurrency', parseRegClientConcurrency(core));
    container.registerValue('ENV_HOME', parseEnvHome(core));
    return container;
}
function buildInputs(core) {
    return {
        sourceRepository: core.getInput('sourceRepository', {
            required: true
        }),
        loginToSourceRepository: parseLoginToInput(core.getInput('loginToSourceRepository', { required: false })),
        sourceRepositoryUsername: core.getInput('sourceRepositoryUsername', {
            required: false
        }),
        sourceRepositoryPassword: core.getInput('sourceRepositoryPassword', {
            required: false
        }),
        targetRepository: core.getInput('targetRepository', {
            required: true
        }),
        loginToTargetRepository: parseLoginToInput(core.getInput('loginToTargetRepository', { required: false })),
        targetRepositoryUsername: core.getInput('targetRepositoryUsername', {
            required: false
        }),
        targetRepositoryPassword: core.getInput('targetRepositoryPassword', {
            required: false
        }),
        tags: core.getInput('tags', { required: false })
    };
}
function parseRegClientConcurrency(core) {
    const regClientConcurrencyInput = core.getInput('regClientConcurrency', {
        required: false
    });
    const regClientConcurrency = parseInt(regClientConcurrencyInput);
    if (isNaN(regClientConcurrency) || regClientConcurrency <= 0) {
        core.setFailed('regClientConcurrency must be a positive integer greater than 0');
    }
    return regClientConcurrency;
}
function parseEnvHome(core) {
    const envHome = process.env.HOME;
    if (!envHome) {
        core.setFailed('HOME environment variable is not set');
    }
    return envHome;
}
function parseLoginToInput(input) {
    return input === 'true' || input === '1';
}

/* istanbul ignore next */
post();

var Inputs = "./src/Inputs.ts";
var Action = "./src/Install/Action.ts";
var TagSorterInterface = "./src/Utils/TagSorterInterface.ts";
var TagSorter = "./src/Utils/TagSorter.ts";
var TagFilterInterface = "./src/Utils/TagFilterInterface.ts";
var TagFilter = "./src/Utils/TagFilter.ts";
var RegClientInterface = "./src/Utils/RegClientInterface.ts";
var RegClient = "./src/Utils/RegClient.ts";
var LoggerInterface = "./src/Utils/LoggerInterface.ts";
var Logger = "./src/Utils/Logger.ts";
var DownloaderInterface = "./src/Utils/DownloaderInterface.ts";
var Downloader = "./src/Utils/Downloader.ts";
var RegClientCredentials = "./src/Utils/RegClient/RegClientCredentials.ts";
var RegClientConcurrencyLimiterInterface = "./src/Utils/RegClient/RegClientConcurrencyLimiterInterface.ts";
var RegClientConcurrencyLimiter = "./src/Utils/RegClient/RegClientConcurrencyLimiter.ts";
var IoInterface = "./src/Utils/GitHubAction/IoInterface.ts";
var Io = "./src/Utils/GitHubAction/Io.ts";
var ExecInterface = "./src/Utils/GitHubAction/ExecInterface.ts";
var Exec = "./src/Utils/GitHubAction/Exec.ts";
var CoreInterface = "./src/Utils/GitHubAction/CoreInterface.ts";
var Core = "./src/Utils/GitHubAction/Core.ts";
var Summary = "./src/Summary/Summary.ts";
var ImageCopyResult = "./src/Summary/ImageCopyResult.ts";
var PrinterInterface = "./src/Summary/Service/PrinterInterface.ts";
var Printer = "./src/Summary/Service/Printer.ts";
var RegClientCredentialsBuilderInterface = "./src/Login/Service/RegClientCredentialsBuilderInterface.ts";
var RegClientCredentialsBuilder = "./src/Login/Service/RegClientCredentialsBuilder.ts";
var RegCtlVersion = "./src/Install/RegCtlVersion.ts";
var RegCtlBinary = "./src/Install/RegCtlBinary.ts";
var RegCtlVersionBuilderInterface = "./src/Install/Service/RegCtlVersionBuilderInterface.ts";
var RegCtlVersionBuilder = "./src/Install/Service/RegCtlVersionBuilder.ts";
var RegCtlBinaryBuilderInterface = "./src/Install/Service/RegCtlBinaryBuilderInterface.ts";
var RegCtlBinaryBuilder = "./src/Install/Service/RegCtlBinaryBuilder.ts";
var Container = "./src/DependencyInjection/Container.ts";
var classMap = {
	Inputs: Inputs,
	Action: Action,
	TagSorterInterface: TagSorterInterface,
	TagSorter: TagSorter,
	TagFilterInterface: TagFilterInterface,
	TagFilter: TagFilter,
	RegClientInterface: RegClientInterface,
	RegClient: RegClient,
	LoggerInterface: LoggerInterface,
	Logger: Logger,
	DownloaderInterface: DownloaderInterface,
	Downloader: Downloader,
	RegClientCredentials: RegClientCredentials,
	RegClientConcurrencyLimiterInterface: RegClientConcurrencyLimiterInterface,
	RegClientConcurrencyLimiter: RegClientConcurrencyLimiter,
	IoInterface: IoInterface,
	Io: Io,
	ExecInterface: ExecInterface,
	Exec: Exec,
	CoreInterface: CoreInterface,
	Core: Core,
	Summary: Summary,
	ImageCopyResult: ImageCopyResult,
	PrinterInterface: PrinterInterface,
	Printer: Printer,
	RegClientCredentialsBuilderInterface: RegClientCredentialsBuilderInterface,
	RegClientCredentialsBuilder: RegClientCredentialsBuilder,
	RegCtlVersion: RegCtlVersion,
	RegCtlBinary: RegCtlBinary,
	RegCtlVersionBuilderInterface: RegCtlVersionBuilderInterface,
	RegCtlVersionBuilder: RegCtlVersionBuilder,
	RegCtlBinaryBuilderInterface: RegCtlBinaryBuilderInterface,
	RegCtlBinaryBuilder: RegCtlBinaryBuilder,
	Container: Container
};

var classMap$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Action: Action,
	Container: Container,
	Core: Core,
	CoreInterface: CoreInterface,
	Downloader: Downloader,
	DownloaderInterface: DownloaderInterface,
	Exec: Exec,
	ExecInterface: ExecInterface,
	ImageCopyResult: ImageCopyResult,
	Inputs: Inputs,
	Io: Io,
	IoInterface: IoInterface,
	Logger: Logger,
	LoggerInterface: LoggerInterface,
	Printer: Printer,
	PrinterInterface: PrinterInterface,
	RegClient: RegClient,
	RegClientConcurrencyLimiter: RegClientConcurrencyLimiter,
	RegClientConcurrencyLimiterInterface: RegClientConcurrencyLimiterInterface,
	RegClientCredentials: RegClientCredentials,
	RegClientCredentialsBuilder: RegClientCredentialsBuilder,
	RegClientCredentialsBuilderInterface: RegClientCredentialsBuilderInterface,
	RegClientInterface: RegClientInterface,
	RegCtlBinary: RegCtlBinary,
	RegCtlBinaryBuilder: RegCtlBinaryBuilder,
	RegCtlBinaryBuilderInterface: RegCtlBinaryBuilderInterface,
	RegCtlVersion: RegCtlVersion,
	RegCtlVersionBuilder: RegCtlVersionBuilder,
	RegCtlVersionBuilderInterface: RegCtlVersionBuilderInterface,
	Summary: Summary,
	TagFilter: TagFilter,
	TagFilterInterface: TagFilterInterface,
	TagSorter: TagSorter,
	TagSorterInterface: TagSorterInterface,
	default: classMap
});
//# sourceMappingURL=post.js.map
