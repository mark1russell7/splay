export function createRegistry() {
    const viewers = new Map();
    return {
        register: (type, factory) => {
            viewers.set(type, factory);
        },
        get: (type) => viewers.get(type),
        has: (type) => viewers.has(type),
    };
}
//# sourceMappingURL=registry.js.map