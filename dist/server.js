"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_cors = __toESM(require("cors"));
var import_express6 = __toESM(require("express"));

// src/routes/address.routes.ts
var import_express = require("express");

// src/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/repositories/CostCenterRepository.ts
var CostCenterRepository = class {
  async create({ description, estimatedBudget, responsible }) {
    try {
      const costCenter = await prisma.costcenter.upsert({
        where: {
          description
        },
        update: {
          description,
          responsible,
          estimatedBudget
        },
        create: {
          description,
          responsible,
          estimatedBudget
        }
      });
      if (costCenter) {
        return costCenter;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOneCenter({ description }) {
    try {
      const result = await prisma.costcenter.findFirst({ where: { description } });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAll() {
    try {
      const costObject = {
        description: "",
        estimatedBudget: 0,
        id: 0,
        responsible: "",
        total_amount: 0
      };
      const arrayCostObject = [];
      const result = await prisma.costcenter.findMany({
        select: {
          _count: {
            select: {
              cost: true
            }
          },
          description: true,
          estimatedBudget: true,
          id: true,
          responsible: true,
          cost: true
        },
        orderBy: {
          id: "asc"
        }
      }).then((res) => res.map((firstObject) => {
        costObject.description = firstObject.description;
        costObject.estimatedBudget = Number(firstObject.estimatedBudget);
        costObject.id = firstObject.id;
        costObject.responsible = firstObject.responsible;
        firstObject.cost.map((cost2) => costObject.total_amount += Number(cost2.total_amount));
        arrayCostObject.push({ ...costObject });
        Object.assign(costObject, {
          description: "",
          estimatedBudget: 0,
          id: 0,
          responsible: "",
          total_amount: 0
        });
        return arrayCostObject;
      }));
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOne(id) {
    try {
      const result = await prisma.costcenter.findFirst({
        select: {
          description: true,
          estimatedBudget: true,
          id: true,
          responsible: true,
          cost: true
        },
        where: {
          id
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// src/services/costCenterService.ts
var CostCenterService = class extends CostCenterRepository {
  costCenter;
  constructor() {
    super();
    this.costCenter = new CostCenterRepository();
  }
  getCostCenterRepository() {
    return this.costCenter;
  }
  async create({ description, estimatedBudget, responsible }) {
    try {
      const centerAlreadyExists = await this.getCostCenterRepository().findOneCenter({ description });
      if (centerAlreadyExists) {
        throw new Error("Cost center already exists");
      }
      const createdCenter = await this.getCostCenterRepository().create({ description, estimatedBudget, responsible });
      return createdCenter;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// src/controllers/CostCenterController.ts
var CostCenterController = class {
  costCenterService;
  constructor() {
    this.costCenterService = new CostCenterService();
  }
  async index(request, response, next) {
    try {
      const fetch = await this.costCenterService.findAll();
      response.status(200).json(fetch[0]);
    } catch (error) {
      next(error.message);
    }
  }
  async store(request, response, next) {
    try {
      const { description, estimatedBudget, responsible } = request.body;
      const result = await this.costCenterService.create({ description, estimatedBudget, responsible });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async show(request, response, next) {
    const { id } = request.params;
    const idAddress = Number(id);
    try {
      const address = {
        id: 0,
        description: "",
        estimatedBudget: 0,
        responsible: "",
        total_amount: 0
      };
      const fetch = await this.costCenterService.findOne(idAddress);
      fetch?.cost.map((cost2) => address.total_amount += Number(cost2.total_amount));
      if (fetch) {
        address.description = fetch?.description;
        address.estimatedBudget = Number(fetch?.estimatedBudget);
        address.responsible = fetch?.responsible;
        address.id = fetch?.id;
      }
      response.status(200).json(address);
    } catch (error) {
      next(error.message);
    }
  }
};
var CostCenterController_default = CostCenterController;

// src/routes/address.routes.ts
var CostCenterRoutes = class {
  router;
  addressController;
  constructor() {
    this.router = (0, import_express.Router)();
    this.addressController = new CostCenterController_default();
  }
  getRoutes() {
    this.router.get("/", this.addressController.index.bind(this.addressController));
    this.router.get("/:id", this.addressController.show.bind(this.addressController));
    this.router.post("/", this.addressController.store.bind(this.addressController));
    return this.router;
  }
};

// src/routes/cost.routes.ts
var import_express2 = require("express");

// src/helpers/index.ts
function groupBy(list) {
  const usersByColor = list.reduce((acc, value) => {
    if (!acc[value.equipament.group.description]) {
      if (acc[value.equipament?.group_id]) {
        acc[value.equipament?.group_id].push(value);
      }
      acc[value.equipament.group.description] = [];
    }
    acc[value.equipament.group.description].push(value);
    return acc;
  }, {});
  return usersByColor;
}
var accentsTidy = function(s) {
  var r = s.toLowerCase();
  r = r.replace(new RegExp(/[àáâãäå]/g), "a");
  r = r.replace(new RegExp(/æ/g), "ae");
  r = r.replace(new RegExp(/ç/g), "c");
  r = r.replace(new RegExp(/[èéêë]/g), "e");
  r = r.replace(new RegExp(/[ìíîï]/g), "i");
  r = r.replace(new RegExp(/ñ/g), "n");
  r = r.replace(new RegExp(/[òóôõö]/g), "o");
  r = r.replace(new RegExp(/œ/g), "oe");
  r = r.replace(new RegExp(/[ùúûü]/g), "u");
  r = r.replace(new RegExp(/[ýÿ]/g), "y");
  return r;
};

// src/services/costService.ts
var import_core_js = require("core-js");

// src/repositories/CostRepository.ts
var CostRepository = class {
  async create({ equipament: equipament2, quantity, price, total_amount, costcenter, aquisition_date, month }) {
    try {
      const createNewCost = await prisma.cost.create({
        data: {
          equipament: {
            connect: {
              id: equipament2
            }
          },
          quantity,
          price,
          total_amount,
          costcenter: {
            connect: {
              id: costcenter.id
            }
          },
          aquisition_date,
          month
        }
      });
      if (createNewCost)
        return createNewCost;
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOneCostByEquipament(equipament2) {
    try {
      const result = await prisma.cost.findFirst({ where: { equipament: equipament2 } });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAll() {
    try {
      const result = await prisma.cost.findMany({
        include: {
          costcenter: true,
          equipament: {
            include: {
              group: true
            }
          }
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findCostByAddressAndGroup(group_id, costcenter_id, month) {
    try {
      const result = await prisma.cost.findMany({
        include: {
          costcenter: true,
          equipament: {
            include: {
              group: true
            }
          }
        },
        where: {
          equipament: {
            group_id
          },
          costcenter_id,
          month
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async totalAmountByAddresInOneMonth(initialDate, finalDate) {
    try {
      const result = await prisma.cost.groupBy({
        by: ["costcenter_id"],
        where: {
          aquisition_date: {
            lte: finalDate,
            gte: initialDate
          }
        },
        _sum: {
          total_amount: true
        },
        orderBy: {
          costcenter_id: "asc"
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async totalAmountInPerMonthByCostCenter(centroId, firstDayOfYear, lastDayOfYear, searchMonth = "0") {
    try {
      if (firstDayOfYear && lastDayOfYear && searchMonth != "0") {
        const result = await prisma.cost.groupBy({
          by: ["month"],
          where: {
            aquisition_date: {
              lte: lastDayOfYear,
              gte: firstDayOfYear
            },
            costcenter: {
              id: {
                equals: centroId
              }
            },
            month: searchMonth
          },
          _sum: {
            total_amount: true
          },
          orderBy: {
            month: "asc"
          }
        });
        return result;
      } else {
        const result = await prisma.cost.groupBy({
          by: ["month"],
          where: {
            aquisition_date: {
              lte: lastDayOfYear,
              gte: firstDayOfYear
            },
            costcenter: {
              id: {
                equals: centroId
              }
            }
          },
          _sum: {
            total_amount: true
          },
          orderBy: {
            month: "asc"
          }
        });
        return result;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async totalAmountFromCostCenterByGroup(idCostCenter, month = "0") {
    try {
      const result = await prisma.cost.findMany({
        include: {
          equipament: {
            include: {
              group: true
            }
          },
          costcenter: true
        },
        where: {
          costcenter: {
            id: idCostCenter
          },
          month
        },
        orderBy: {
          id: "asc"
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// src/repositories/EquipamentRepository.ts
var EquipamentRepository = class {
  async createEquipament({ description, group, um }) {
    console.log(group);
    try {
      const createNewEquipament = await prisma.equipment.create({
        data: {
          description,
          group: {
            connect: {
              id: group?.id
            }
          },
          um
        }
      });
      if (createNewEquipament) {
        return createNewEquipament;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOneEquipament(equipament2) {
    try {
      const result = await prisma.equipment.findFirst({ where: { description: equipament2 }, include: { group: true } });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAllEquipament() {
    try {
      const result = await prisma.equipment.findMany({ include: { group: true, cost: true } });
      return result;
    } catch (error) {
    }
  }
};

// src/repositories/GroupsRepository.ts
var GroupRepository = class {
  async create({ description }) {
    try {
      const createdGroup = await prisma.group.upsert({
        where: {
          description
        },
        update: {
          description
        },
        create: {
          description
        }
      });
      if (createdGroup) {
        return createdGroup;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOneGroup({ description }) {
    try {
      const result = await prisma.group.findFirst({ where: { description } });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAll() {
    try {
      const result = await prisma.group.findMany();
      return result;
    } catch (error) {
    }
  }
};

// src/services/costService.ts
var CostService = class extends CostRepository {
  cost;
  equipament;
  costCenter;
  group;
  constructor() {
    super();
    this.cost = new CostRepository();
    this.equipament = new EquipamentRepository();
    this.costCenter = new CostCenterRepository();
    this.group = new GroupRepository();
  }
  getCostRepository() {
    return this.cost;
  }
  getEquipamentRepo() {
    return this.equipament;
  }
  getCostCenterRepo() {
    return this.costCenter;
  }
  createService(data) {
    let error = 0;
    try {
      data.map(async (dataObject, index) => {
        let findOrCreate;
        let costCenterr = accentsTidy(dataObject.Centro);
        let month = dataObject.Mes + "/" + new Date(dataObject.DataDoc).getFullYear();
        if (!dataObject.Centro || !dataObject.Descricao || !dataObject.Grupo || !dataObject.Mes) {
          error++;
        } else {
          const equipamentAlreadyExists = await this.getEquipamentRepo().findOneEquipament(dataObject.Descricao);
          if (equipamentAlreadyExists) {
            const costCenterAlreadyExists = await this.getCostCenterRepo().findOneCenter({ description: costCenterr });
            if (costCenterAlreadyExists) {
              await this.getCostRepository().create(
                {
                  aquisition_date: dataObject.DataDoc,
                  costcenter: costCenterAlreadyExists,
                  equipament: equipamentAlreadyExists.id,
                  price: dataObject.PrecUnit,
                  quantity: dataObject.Quantidade,
                  total_amount: dataObject.PrecoLiquido,
                  month
                }
              );
            } else {
              const newCostCenter = await this.getCostCenterRepo().create({ description: costCenterr, responsible: "" });
              if (newCostCenter)
                await this.getCostRepository().create(
                  {
                    aquisition_date: dataObject.DataDoc,
                    costcenter: newCostCenter,
                    equipament: equipamentAlreadyExists.id,
                    price: dataObject.PrecUnit,
                    quantity: dataObject.Quantidade,
                    total_amount: dataObject.PrecoLiquido,
                    month
                  }
                );
            }
          } else {
            findOrCreate = await this.group.findOneGroup({ description: dataObject.Grupo }) ?? {};
            if (!findOrCreate.description)
              findOrCreate = await this.group.create({ description: dataObject.Grupo }) ?? {};
            const newEquipament = await this.getEquipamentRepo().createEquipament({ description: dataObject.Descricao, group: findOrCreate, um: dataObject.Unidade });
            if (newEquipament) {
              const newCostCenterAlreadyExists = await this.getCostCenterRepo().findOneCenter({ description: costCenterr });
              if (newCostCenterAlreadyExists) {
                await this.getCostRepository().create(
                  {
                    aquisition_date: dataObject.DataDoc,
                    costcenter: newCostCenterAlreadyExists,
                    equipament: newEquipament.id,
                    price: dataObject.PrecUnit,
                    quantity: dataObject.Quantidade,
                    total_amount: dataObject.PrecoLiquido,
                    month
                  }
                );
              }
            }
          }
        }
      });
      return error;
    } catch (error2) {
      throw new Error(error2.message);
    }
  }
  async totalAmountOfOneAddressByGroup(idCostCenter, monthNumber = "0") {
    const arrayMonths = ["Janeiro", "Fevereiro", "Mar\xE7o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const results = await this.cost.totalAmountFromCostCenterByGroup(idCostCenter, monthNumber);
    const newDateAquisition = results.length ? results[0]?.aquisition_date : "";
    const newDate = new Date(newDateAquisition);
    const getYearForThisDate = newDate.getFullYear();
    const grouped = groupBy(results);
    const getObjectKeys = Object.keys(grouped);
    const monthDes = Number(monthNumber.slice(0, 1).replace("/", ""));
    const yearDes = monthNumber.slice(1, monthNumber.length).replace("/", "");
    const monthMounted = arrayMonths[monthDes - 1] + "/" + yearDes;
    let result = { group_id: 0, group: "", total_amount: 0, month: monthMounted };
    let totalAmountByGroup = [{ total_amount: 0, group: "", month: monthMounted }];
    getObjectKeys.map((key) => {
      grouped[key].map((group) => {
        result.total_amount += Number(group.total_amount);
        result.group = key;
        result.group_id = group?.equipament.group_id;
      });
      if (result) {
        totalAmountByGroup.push({ ...result });
      }
      result.total_amount = 0;
    });
    const finalResult = totalAmountByGroup.filter((response) => response.group != "");
    return finalResult;
  }
  async allCustsGroupedByGroup() {
    const results = await this.cost.findAll();
    const custsAgrouped = groupBy(results);
    return custsAgrouped;
  }
};

// src/controllers/CostsController.ts
var excelToJson = require("convert-excel-to-json");
var CostController = class {
  costService;
  constructor() {
    this.costService = new CostService();
  }
  async index(request, response, next) {
    try {
      const fetch = await this.costService.findAll();
      response.status(200).json(fetch);
    } catch (error) {
      next(error.message);
    }
  }
  //Criar um service para fazer essa gestão
  async store(request, response, next) {
    try {
      const file = request.file?.buffer;
      const fileConvertedToJSON = excelToJson({
        source: file,
        header: {
          rows: 1
        },
        sheets: ["dados"],
        columnToKey: {
          "*": "{{columnHeader}}"
        }
      });
      const { dados } = fileConvertedToJSON;
      const result = this.costService.createService(dados);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getEquipamentByGroupAndMonth(request, response, next) {
    const { costcenter_id, group_id, month } = request.params;
    const groupId = Number(group_id);
    const monthEdited = month.replace("-", "/");
    const costCenterId = Number(costcenter_id);
    try {
      const result = await this.costService.getCostRepository().findCostByAddressAndGroup(groupId, costCenterId, monthEdited);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getAddresWithTotalAmount(request, response, next) {
    const dateToSearch = new Date(2023, 5, 0, 0, 0, 0, 0);
    const initialDate = new Date(dateToSearch.getFullYear(), dateToSearch.getMonth(), 1);
    const finalDate = new Date(dateToSearch.getFullYear(), dateToSearch.getMonth() + 1, 0);
    try {
      const result = await this.costService.getCostRepository().totalAmountByAddresInOneMonth(initialDate, finalDate);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getCostByGroup(request, response, next) {
    const { id, monthNumber, year } = request.params;
    const idCostCenter = Number(id);
    const monthToSearch = monthNumber + "/" + year;
    try {
      const result = await this.costService.totalAmountOfOneAddressByGroup(idCostCenter, monthToSearch);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async getCostByMonthOfOneAddress(request, response, next) {
    const { centerCostId, dateToSearch } = request.params;
    try {
      const costCenterId = Number(centerCostId);
      let firstDayOfYear = new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 1);
      let lastDayOfYear = new Date((/* @__PURE__ */ new Date()).getFullYear(), 11, 31);
      let monthToSearch = "0";
      if (dateToSearch != void 0) {
        const dateToSearchNew = new Date(dateToSearch);
        firstDayOfYear = new Date(dateToSearchNew.getFullYear() - 1, 12, 1);
        lastDayOfYear = new Date(dateToSearchNew.getFullYear(), 12, 1);
        monthToSearch = String(dateToSearchNew.getMonth() + 1);
      }
      const result = await this.costService.getCostRepository().totalAmountInPerMonthByCostCenter(costCenterId, firstDayOfYear, lastDayOfYear, monthToSearch);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async cardIndexResumem(request, response, next) {
    const Cardresume = await this.costService.findAll();
    const results = groupBy(Cardresume);
    const keys = Object.keys(results);
    const fetchArray = keys.map((key) => results[key].reduce((acc, object) => acc + Number(object.total_amount), 0));
    let arrayFinal = [];
    const finalArray = fetchArray.map((total_amount, index) => {
      const indice = keys[index];
      return { total_amount, indice };
    });
    response.status(200).json(finalArray);
  }
};
var CostsController_default = CostController;

// src/routes/cost.routes.ts
var multer = require("multer");
var CostRoutes = class {
  router;
  costController;
  constructor() {
    this.router = (0, import_express2.Router)();
    this.costController = new CostsController_default();
  }
  getRoutes() {
    const upload = multer();
    this.router.get("/", this.costController.index.bind(this.costController));
    this.router.get("/dash", this.costController.getAddresWithTotalAmount.bind(this.costController));
    this.router.get("/:id/:monthNumber?/:year?", this.costController.getCostByGroup.bind(this.costController));
    this.router.post(
      "/cc/:centerCostId/date/:dateToSearch?/",
      this.costController.getCostByMonthOfOneAddress.bind(this.costController)
    );
    this.router.post("/", upload.single("excel-custo"), this.costController.store.bind(this.costController));
    this.router.post("/home/cardresumem", this.costController.cardIndexResumem.bind(this.costController));
    this.router.get(
      "/listequipament/costcenterid/:costcenter_id/group/:group_id/:month",
      this.costController.getEquipamentByGroupAndMonth.bind(this.costController)
    );
    return this.router;
  }
};

// src/routes/equipament.routes.ts
var import_express3 = require("express");

// src/services/equipamentService.ts
var EquipamentService = class extends EquipamentRepository {
  equipament;
  group;
  constructor() {
    super();
    this.equipament = new EquipamentRepository();
    this.group = new GroupRepository();
  }
  getEquipamentRepository() {
    return this.equipament;
  }
  getGroupRepository() {
    return this.group;
  }
  async create({ description, group, um }) {
    try {
      const equpamentAlreadyExists = await this.getEquipamentRepository().findOneEquipament(description);
      if (equpamentAlreadyExists) {
        throw new Error("Equipament already exists");
      }
      const groupAlreadyExists = await this.getGroupRepository().findOneGroup({ description: group.description });
      if (groupAlreadyExists) {
        const createNewEquipament = await this.getEquipamentRepository().createEquipament({ description, um, group });
        return createNewEquipament;
      }
      const createNewGroup = await this.getGroupRepository().create({ description: group.description });
      if (createNewGroup) {
        const createNewEquipamentWithNewGroup = await this.getEquipamentRepository().createEquipament({ description, um, group: createNewGroup });
        return createNewEquipamentWithNewGroup;
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// src/controllers/EquipamentController.ts
var EquipamentController = class {
  equipamentService;
  constructor() {
    this.equipamentService = new EquipamentService();
  }
  async index(request, response, next) {
    try {
      const fetch = await this.equipamentService.findAllEquipament();
      response.status(200).json(fetch);
    } catch (error) {
      next(error.message);
    }
  }
  async store(request, response, next) {
    try {
      const { description, group, um } = request.body;
      const result = await this.equipamentService.create({ description, group, um });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  show() {
    console.log("show");
  }
};
var EquipamentController_default = EquipamentController;

// src/routes/equipament.routes.ts
var EquipamentRoutes = class {
  router;
  equipamentController;
  constructor() {
    this.router = (0, import_express3.Router)();
    this.equipamentController = new EquipamentController_default();
  }
  getRoutes() {
    this.router.get("/", this.equipamentController.index.bind(this.equipamentController));
    this.router.post("/", this.equipamentController.store.bind(this.equipamentController));
    return this.router;
  }
};

// src/routes/expectedCosts.routes.ts
var import_express4 = require("express");

// src/repositories/ExpectedCosts.ts
var ExpectedCostRepository = class {
  async create({ expected_cost, costcenter, month }) {
    try {
      const createNewExpectedCost = await prisma.expectedCost.create({
        data: {
          expected_cost,
          costcenter: {
            connect: {
              id: costcenter.id
            }
          },
          month
        }
      });
      if (createNewExpectedCost)
        return createNewExpectedCost;
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOneExpectedCostByMonth(costCenter, month) {
    try {
      const result = await prisma.expectedCost.findFirst({
        where: {
          costcenter_id: {
            equals: costCenter
          },
          month
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findAll() {
    try {
      const result = await prisma.expectedCost.findMany({
        include: {
          costcenter: true
        }
      });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// src/controllers/ExpectedCostController.ts
var ExpectedCostController = class {
  expectedCosts;
  constructor() {
    this.expectedCosts = new ExpectedCostRepository();
  }
  //Criar um service para fazer essa gestão
  async store(request, response, next) {
    try {
      const { month, costcenter, expected_cost } = request.body;
      const result = this.expectedCosts.create({ costcenter, expected_cost, month });
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
  async fetchOne(request, response, next) {
    try {
      const { month, costcenter } = request.params;
      const newMonth = month.replace("-", "/");
      const centroDeCusto = Number(costcenter);
      const result = await this.expectedCosts.findOneExpectedCostByMonth(centroDeCusto, newMonth);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
var ExpectedCostController_default = ExpectedCostController;

// src/routes/expectedCosts.routes.ts
var ExpectedCostRoutes = class {
  router;
  expectedCostController;
  constructor() {
    this.router = (0, import_express4.Router)();
    this.expectedCostController = new ExpectedCostController_default();
  }
  getRoutes() {
    this.router.get("/:month/:costcenter/", this.expectedCostController.fetchOne.bind(this.expectedCostController));
    this.router.post("/", this.expectedCostController.store.bind(this.expectedCostController));
    return this.router;
  }
};

// src/routes/groups.routes.ts
var import_express5 = require("express");

// src/services/groupServices.ts
var GroupsService = class extends GroupRepository {
  groupRepository;
  constructor() {
    super();
    this.groupRepository = new GroupRepository();
  }
  getGroupRepository() {
    return this.groupRepository;
  }
  async create({ description }) {
    try {
      const groupsAlreadyExists = await this.getGroupRepository().findOneGroup({ description });
      if (groupsAlreadyExists) {
        throw new Error("Group already exists");
      }
      const createdGroup = await this.getGroupRepository().create({ description });
      return createdGroup;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

// src/controllers/GroupsControllers.ts
var GroupsController = class {
  groupService;
  constructor() {
    this.groupService = new GroupsService();
  }
  async index(request, response, next) {
    try {
      const createGroup = await this.groupService.findAll();
      response.status(200).json(createGroup);
    } catch (error) {
      next(error.message);
    }
  }
  async store(request, response, next) {
    try {
      const { description } = request.body;
      const createGroup = await this.groupService.create({ description });
      response.status(200).json({ message: "Group was created with successfull! " });
    } catch (error) {
      next(error);
    }
  }
  show() {
    console.log("show");
  }
};
var GroupsControllers_default = GroupsController;

// src/routes/groups.routes.ts
var GroupsRoutes = class {
  router;
  groupsController;
  constructor() {
    this.router = (0, import_express5.Router)();
    this.groupsController = new GroupsControllers_default();
  }
  getRoutes() {
    this.router.get("/", this.groupsController.index.bind(this.groupsController));
    this.router.post("/", this.groupsController.store.bind(this.groupsController));
    return this.router;
  }
};

// src/server.ts
var app = (0, import_express6.default)();
app.use((0, import_cors.default)());
var groupsRoutes = new GroupsRoutes().getRoutes();
var addressRoutes = new CostCenterRoutes().getRoutes();
var equipament = new EquipamentRoutes().getRoutes();
var cost = new CostRoutes().getRoutes();
var Expectedcost = new ExpectedCostRoutes().getRoutes();
app.use(import_express6.default.json());
app.use(import_express6.default.urlencoded({ extended: true }));
app.use("/group", groupsRoutes);
app.use("/address", addressRoutes);
app.use("/equipament", equipament);
app.use("/cost", cost);
app.use("/expectedcost", Expectedcost);
app.use((err, request, response, next) => {
  if (err instanceof Error)
    return response.status(400).json({ message: err.message });
  return response.status(500).json({ meaasge: "Internal server error" });
});
app.listen(process.env.PORT ? Number(process.env.PORT) : 3e3, () => console.log("server is running...\u{1F431}\u200D\u{1F3CD}"));
