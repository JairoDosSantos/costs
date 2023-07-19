import { Router } from "express";
import CostController from "../controllers/CostsController";

const multer = require('multer')

class CostRoutes {

    private router: Router;

    private costController: CostController

    constructor() {
        this.router = Router();
        this.costController = new CostController()
    }

    getRoutes(): Router {

        const upload = multer()

        this.router.get("/", this.costController.index.bind(this.costController))
        this.router.get("/dash", this.costController.getAddresWithTotalAmount.bind(this.costController))
        this.router.get("/:id/:monthNumber?/:year?", this.costController.getCostByGroup.bind(this.costController))
        this.router.get("/cc/:centerCostId/date/:dateToSearch?/",
            this.costController.getCostByMonthOfOneAddress.bind(this.costController))
        this.router.post("/", upload.single("excel-custo"), this.costController.store.bind(this.costController))

        this.router.post("/home/cardresumem", this.costController.cardIndexResumem.bind(this.costController))
        this.router.get("/listequipament/costcenterid/:costcenter_id/group/:group_id/:month",
            this.costController.getEquipamentByGroupAndMonth.bind(this.costController))

        return this.router;
    }
}


export { CostRoutes };

