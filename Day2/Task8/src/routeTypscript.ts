// ==========================================
// Route Type
// ==========================================

type Route = {
    path: string;

    component: (
        params: Record<string, string>
    ) => HTMLElement;
};


// ==========================================
// Router
// ==========================================

class Router {

    private routes: Route[];

    private app: HTMLElement;


    constructor(
        routes: Route[],
        app: HTMLElement
    ) {
        this.routes = routes;
        this.app = app;
    }


    // ======================================
    // Navigate
    // ======================================

    navigate(
        path: string,
        params: Record<string, string> = {}
    ): void {

        const route = this.routes.find(
            route => route.path === path
        );


        if (!route) {
            this.renderNotFound();
            return;
        }


        const element =
            route.component(params);


        this.app.replaceChildren(element);
    }


    // ======================================
    // 404
    // ======================================

    private renderNotFound(): void {

        const element =
            document.createElement("div");

        element.textContent =
            "404 - Page Not Found";

        this.app.replaceChildren(element);
    }
}


// ==========================================
// Routes
// ==========================================

const routes: Route[] = [

    {
        path: "/",

        component: () => {

            const div =
                document.createElement("div");

            div.textContent =
                "Home Page";

            return div;
        }
    },


    {
        path: "/about",

        component: () => {

            const div =
                document.createElement("div");

            div.textContent =
                "About Page";

            return div;
        }
    },


    {
        path: "/user",

        component: (params) => {

            const div =
                document.createElement("div");

            div.textContent =
                `User ID: ${params.id ?? "Unknown"}`;

            return div;
        }
    }
];


// ==========================================
// App Element
// ==========================================

const app =
    document.getElementById("app");

if (!app) {
    throw new Error(
        "App element not found"
    );
}


// ==========================================
// Router Instance
// ==========================================

const router =
    new Router(routes, app);


// ==========================================
// Navigation
// ==========================================

router.navigate("/");

router.navigate("/about");

router.navigate("/user", {
    id: "101"
});

router.navigate("/unknown");