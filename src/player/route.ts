class Route {
    private routes: string[] = [];

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

export let route = new Route();

