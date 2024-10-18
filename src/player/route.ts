class Route {

    static instance: Route;
    private routes: string[] = [];

    constructor() {
        if (Route.instance) {
            throw new Error("Error: Instantiation failed: Use Route.getInstance() instead of new.");
        }
        Route.instance = this;  
    }

    static getInstance(): Route {
        if (!Route.instance) {
            Route.instance = new Route();
        }
        return Route.instance;
    }

    push(route: string) {
        this.routes.push(route);
    }

    pop() {
        return this.routes.pop();
    }

    intern() {
        return this.routes;
    }

    set(routes: string[]) {
        this.routes = routes;
    }
}

export let route = Route.getInstance();

