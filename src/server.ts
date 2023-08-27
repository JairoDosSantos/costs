import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { CostCenterRoutes } from "./routes/address.routes";
import { CostRoutes } from "./routes/cost.routes";
import { EquipamentRoutes } from "./routes/equipament.routes";
import { ExpectedCostRoutes } from "./routes/expectedCosts.routes";
import { GroupsRoutes } from "./routes/groups.routes";

const app: Application = express();

app.use(cors())
const groupsRoutes = new GroupsRoutes().getRoutes();
const addressRoutes = new CostCenterRoutes().getRoutes();
const equipament = new EquipamentRoutes().getRoutes();
const cost = new CostRoutes().getRoutes();
const Expectedcost = new ExpectedCostRoutes().getRoutes();
app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use("/group", groupsRoutes)
app.use("/address", addressRoutes)
app.use("/equipament", equipament)
app.use("/cost", cost)
app.use("/expectedcost", Expectedcost)

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error)
        return response.status(400).json({ message: err.message })
    return response.status(500).json({ meaasge: "Internal server error" })
})



app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, () => console.log("server is running...🐱‍🏍"))