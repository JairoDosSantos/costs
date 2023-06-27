import { Router } from "express";
import EquipamentController from "../controllers/EquipamentController";


class EquipamentRoutes {

    private router: Router;

    private equipamentController: EquipamentController

    constructor() {
        this.router = Router();
        this.equipamentController = new EquipamentController()
    }

    getRoutes(): Router {

        this.router.get("/", this.equipamentController.index.bind(this.equipamentController))
        this.router.post("/", this.equipamentController.store.bind(this.equipamentController))

        return this.router;
    }
}


export { EquipamentRoutes };

