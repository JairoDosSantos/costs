import { Router } from "express";
import ExpectedCosts from "../controllers/expectedCostController";


class ExpectedCostRoutes {

    private router: Router;

    private expectedCostController: ExpectedCosts

    constructor() {
        this.router = Router();
        this.expectedCostController = new ExpectedCosts()
    }

    getRoutes(): Router {
        this.router.get("/:month/:costcenter/", this.expectedCostController.fetchOne.bind(this.expectedCostController))
        this.router.post("/", this.expectedCostController.store.bind(this.expectedCostController))
        return this.router;
    }
}


export { ExpectedCostRoutes };

