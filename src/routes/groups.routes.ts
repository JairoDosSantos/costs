import { Router } from "express";
import GroupsController from "../controllers/GroupsControllers";


class GroupsRoutes {

    private router: Router;

    private groupsController: GroupsController

    constructor() {
        this.router = Router();
        this.groupsController = new GroupsController()
    }

    getRoutes(): Router {

        this.router.get("/", this.groupsController.index.bind(this.groupsController))
        this.router.post("/", this.groupsController.store.bind(this.groupsController))

        return this.router;
    }
}


export { GroupsRoutes };

