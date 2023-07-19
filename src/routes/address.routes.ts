import { Router } from "express";
import CostCenterController from "../controllers/CostCenterController";


class CostCenterRoutes {

    private router: Router;

    private addressController: CostCenterController

    constructor() {
        this.router = Router();
        this.addressController = new CostCenterController()
    }

    getRoutes(): Router {

        this.router.get("/", this.addressController.index.bind(this.addressController))
        this.router.get("/:id", this.addressController.show.bind(this.addressController))
        this.router.post("/", this.addressController.store.bind(this.addressController))

        return this.router;
    }
}


export { CostCenterRoutes };

