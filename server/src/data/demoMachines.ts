type MachineStatus = "Active" | "Under maintenance" | "Out of service";

type DemoMaintenance = {
  date: string;
  company: string;
  description: string;
};

type DemoMachine = {
  machineCode: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  location: string;
  status: MachineStatus;
  description: string;
  imageUrl: string;
  maintenanceHistory: DemoMaintenance[];
};

const demoMachines: DemoMachine[] = [
  {
    machineCode: "kitchen-001",
    name: "Industrial Oven",
    brand: "Rational",
    model: "iCombi Pro",
    serialNumber: "OVN-2020-001",
    purchaseDate: "2020-08-11",
    location: "Main Kitchen",
    status: "Active",
    description:
      "Commercial oven used for daily baking, roasting, and high-volume food production.",
    imageUrl: "maquina1.webp",
    maintenanceHistory: [
      {
        date: "2023-08-30",
        company: "MaqFood Systems",
        description: "Deep cleaning of internal components.",
      },
      {
        date: "2022-11-23",
        company: "Industrial Kitchens Inc.",
        description: "Hydraulic system check and greasing.",
      },
    ],
  },
  {
    machineCode: "kitchen-002",
    name: "Planetary Mixer 20L",
    brand: "Hobart",
    model: "HL200",
    serialNumber: "MIX-2020-002",
    purchaseDate: "2020-08-12",
    location: "Bakery Section",
    status: "Active",
    description:
      "20L planetary mixer used for dough, batters, creams, and general bakery preparation.",
    imageUrl: "maquina2.jpg",
    maintenanceHistory: [
      {
        date: "2023-10-15",
        company: "ProKitchen Services",
        description: "Heating element inspection and repair.",
      },
    ],
  },
  {
    machineCode: "kitchen-003",
    name: "Double Group Espresso Machine",
    brand: "La Marzocco",
    model: "Linea Classic",
    serialNumber: "ESP-2023-003",
    purchaseDate: "2023-01-16",
    location: "Coffee Station",
    status: "Under maintenance",
    description:
      "Double group espresso machine used for coffee service during peak hours.",
    imageUrl: "maquina3.jpg",
    maintenanceHistory: [
      {
        date: "2022-07-11",
        company: "GastroTech Ltd.",
        description: "Worn part replacement and functional testing.",
      },
    ],
  },
];

export = demoMachines;
