-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costcenters" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedBudget" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "responsible" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "costcenters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "um" TEXT NOT NULL DEFAULT 'UN',
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost" (
    "id" SERIAL NOT NULL,
    "equipment_id" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "quantity" DECIMAL(65,30) NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "aquisition_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "costcenter_id" INTEGER NOT NULL,

    CONSTRAINT "cost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_description_key" ON "groups"("description");

-- CreateIndex
CREATE UNIQUE INDEX "costcenters_description_key" ON "costcenters"("description");

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost" ADD CONSTRAINT "cost_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost" ADD CONSTRAINT "cost_costcenter_id_fkey" FOREIGN KEY ("costcenter_id") REFERENCES "costcenters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
