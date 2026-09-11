"use strict";
class Router {
    routes;
    app;
    constructor(routes, app) {
        this.routes = routes;
        this.app = app;
    }
    // Navigate
    navigate(path, params = {}) {
        const route = this.routes.find(route => route.path === path);
        if (!route) {
            this.renderNotFound();
            return;
        }
        const element = route.component(params);
        this.app.replaceChildren(element);
    }
    // 404
    renderNotFound() {
        const element = document.createElement("div");
        element.textContent =
            "404 - Page Not Found";
        this.app.replaceChildren(element);
    }
}
// Routes
const routes = [
    {
        path: "/",
        component: () => {
            const div = document.createElement("div");
            div.textContent =
                "Home Page";
            return div;
        }
    },
    {
        path: "/about",
        component: () => {
            const div = document.createElement("div");
            div.textContent =
                "About Page";
            return div;
        }
    },
    {
        path: "/user",
        component: (params) => {
            const div = document.createElement("div");
            div.textContent =
                `User ID: ${params.id ?? "Unknown"}`;
            return div;
        }
    }
];
// App Element
const app = document.getElementById("app");
if (!app) {
    throw new Error("App element not found");
}
// Router Instance
const router = new Router(routes, app);
// Navigation
router.navigate("/");
router.navigate("/about");
router.navigate("/user", {
    id: "101"
});
router.navigate("/unknown");
