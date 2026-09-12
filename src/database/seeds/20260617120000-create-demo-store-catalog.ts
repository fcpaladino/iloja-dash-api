import { Op, QueryInterface } from "sequelize";

const PLACEHOLDER_COMPANY_ID = 9001;
const TARGET_COMPANY_ID = 1;
const ID_OFFSET = 1000000;
const remapId = (id: number) => id + ID_OFFSET;

const now = () => new Date();

const timestamps = () => ({
  createdAt: now(),
  updatedAt: now()
});

const brands = [
  { id: 9001, name: "Iloja Tech", slug: "iloja-tech" },
  { id: 9002, name: "Samsung", slug: "samsung" },
  { id: 9003, name: "Apple", slug: "apple" },
  { id: 9004, name: "Lenovo", slug: "lenovo" },
  { id: 9005, name: "Logitech", slug: "logitech" }
].map(brand => ({
  ...brand,
  companyId: PLACEHOLDER_COMPANY_ID,
  active: true,
  ...timestamps()
}));

const categories = [
  { id: 9001, name: "Smartphones", slug: "smartphones" },
  { id: 9002, name: "Notebooks", slug: "notebooks" },
  { id: 9003, name: "Acessorios", slug: "acessorios" },
  { id: 9004, name: "Casa Inteligente", slug: "casa-inteligente" }
].map(category => ({
  ...category,
  companyId: PLACEHOLDER_COMPANY_ID,
  active: true,
  ...timestamps()
}));

const groups = [
  {
    id: 9001,
    name: "Mais vendidos",
    slug: "mais-vendidos",
    description: "Produtos com maior procura na loja",
    color: "#0F766E",
    icon: "trending-up"
  },
  {
    id: 9002,
    name: "Promocoes da semana",
    slug: "promocoes-da-semana",
    description: "Ofertas com preco especial por tempo limitado",
    color: "#F97316",
    icon: "badge-percent"
  },
  {
    id: 9003,
    name: "Lancamentos",
    slug: "lancamentos",
    description: "Novidades para renovar o setup",
    color: "#2563EB",
    icon: "sparkles"
  }
].map(group => ({
  ...group,
  companyId: PLACEHOLDER_COMPANY_ID,
  active: true,
  ...timestamps()
}));

const subGroups = [
  {
    id: 9001,
    groupId: 9001,
    name: "Top celulares",
    slug: "top-celulares",
    description: "Celulares preferidos pelos clientes",
    color: "#0F766E",
    icon: "smartphone"
  },
  {
    id: 9002,
    groupId: 9001,
    name: "Setup home office",
    slug: "setup-home-office",
    description: "Itens para produtividade e conforto",
    color: "#0F766E",
    icon: "monitor"
  },
  {
    id: 9003,
    groupId: 9002,
    name: "Descontos relampago",
    slug: "descontos-relampago",
    description: "Produtos com desconto agressivo",
    color: "#F97316",
    icon: "zap"
  },
  {
    id: 9004,
    groupId: 9003,
    name: "Novidades premium",
    slug: "novidades-premium",
    description: "Produtos recentes com acabamento superior",
    color: "#2563EB",
    icon: "gem"
  }
].map(subGroup => ({
  ...subGroup,
  companyId: PLACEHOLDER_COMPANY_ID,
  active: true,
  ...timestamps()
}));

const products = [
  {
    id: 9001,
    categoryId: 9001,
    brandId: 9002,
    groupId: 9001,
    subGroupId: 9001,
    name: "Samsung Galaxy S25 256GB",
    title: "Galaxy S25 com 256GB e camera tripla",
    sku: "SM-S25-256-PT",
    ref: "S25-256",
    slug: "samsung-galaxy-s25-256gb",
    description: "Smartphone com tela AMOLED de alta resolucao, camera tripla e bateria para o dia inteiro.",
    text: "Ideal para fotos, videos, produtividade e uso intenso com armazenamento generoso.",
    price: 5299.9,
    pricePromotional: 4899.9,
    stockCurrent: 18,
    stockMin: 3,
    stockMax: 40,
    dimensionLenght: 16,
    dimensionWidth: 8,
    dimensionHeight: 1,
    dimensionGrossWeight: 0.42,
    dimensionNetWeight: 0.19,
    point: 490,
    isPromotional: true,
    isNew: true,
    isPopular: true
  },
  {
    id: 9002,
    categoryId: 9001,
    brandId: 9003,
    groupId: 9003,
    subGroupId: 9004,
    name: "iPhone 16 128GB",
    title: "iPhone 16 com tela Super Retina",
    sku: "APL-IP16-128",
    ref: "IP16-128",
    slug: "iphone-16-128gb",
    description: "iPhone com desempenho fluido, camera avancada e integracao completa com o ecossistema Apple.",
    text: "Uma opcao premium para quem busca qualidade de imagem, seguranca e longevidade.",
    price: 6999.9,
    pricePromotional: 6699.9,
    stockCurrent: 12,
    stockMin: 2,
    stockMax: 30,
    dimensionLenght: 16,
    dimensionWidth: 8,
    dimensionHeight: 1,
    dimensionGrossWeight: 0.4,
    dimensionNetWeight: 0.18,
    point: 670,
    isPromotional: false,
    isNew: true,
    isPopular: true
  },
  {
    id: 9003,
    categoryId: 9002,
    brandId: 9004,
    groupId: 9001,
    subGroupId: 9002,
    name: "Notebook Lenovo IdeaPad Slim i5",
    title: "Notebook Lenovo i5 com SSD 512GB",
    sku: "LNV-IPS-I5-512",
    ref: "IDEAPAD-I5",
    slug: "notebook-lenovo-ideapad-slim-i5",
    description: "Notebook leve com processador Intel Core i5, 16GB de memoria e SSD de 512GB.",
    text: "Perfeito para escritorio, estudos, videoconferencias e tarefas de produtividade.",
    price: 3899.9,
    pricePromotional: 3499.9,
    stockCurrent: 9,
    stockMin: 2,
    stockMax: 25,
    dimensionLenght: 36,
    dimensionWidth: 25,
    dimensionHeight: 3,
    dimensionGrossWeight: 2.1,
    dimensionNetWeight: 1.6,
    point: 350,
    isPromotional: true,
    isNew: false,
    isPopular: true
  },
  {
    id: 9004,
    categoryId: 9002,
    brandId: 9001,
    groupId: 9003,
    subGroupId: 9004,
    name: "Notebook Iloja Pro 14",
    title: "Notebook Iloja Pro 14 com tela 2.5K",
    sku: "ILJ-PRO14-1TB",
    ref: "PRO14",
    slug: "notebook-iloja-pro-14",
    description: "Notebook premium com tela 2.5K, 32GB de memoria e SSD de 1TB.",
    text: "Desenvolvido para criadores, profissionais e usuarios que precisam de alta performance.",
    price: 7899.9,
    pricePromotional: null,
    stockCurrent: 5,
    stockMin: 1,
    stockMax: 15,
    dimensionLenght: 34,
    dimensionWidth: 24,
    dimensionHeight: 3,
    dimensionGrossWeight: 2.0,
    dimensionNetWeight: 1.35,
    point: 790,
    isPromotional: false,
    isNew: true,
    isPopular: false
  },
  {
    id: 9005,
    categoryId: 9003,
    brandId: 9005,
    groupId: 9001,
    subGroupId: 9002,
    name: "Mouse Logitech MX Master 3S",
    title: "Mouse sem fio ergonomico MX Master 3S",
    sku: "LOG-MX3S-GRF",
    ref: "MX3S",
    slug: "mouse-logitech-mx-master-3s",
    description: "Mouse sem fio ergonomico com sensor de alta precisao e rolagem magnetica.",
    text: "Excelente para edicao, produtividade e uso prolongado no escritorio.",
    price: 699.9,
    pricePromotional: 599.9,
    stockCurrent: 32,
    stockMin: 6,
    stockMax: 80,
    dimensionLenght: 13,
    dimensionWidth: 9,
    dimensionHeight: 6,
    dimensionGrossWeight: 0.32,
    dimensionNetWeight: 0.14,
    point: 60,
    isPromotional: true,
    isNew: false,
    isPopular: true
  },
  {
    id: 9006,
    categoryId: 9003,
    brandId: 9001,
    groupId: 9002,
    subGroupId: 9003,
    name: "Carregador Turbo USB-C 65W",
    title: "Carregador rapido USB-C com 65W",
    sku: "ILJ-CHG-65W",
    ref: "CHG65W",
    slug: "carregador-turbo-usb-c-65w",
    description: "Carregador compacto com Power Delivery para celulares, tablets e notebooks compativeis.",
    text: "Acompanha cabo USB-C reforcado de 1 metro.",
    price: 199.9,
    pricePromotional: 149.9,
    stockCurrent: 60,
    stockMin: 10,
    stockMax: 120,
    dimensionLenght: 10,
    dimensionWidth: 8,
    dimensionHeight: 4,
    dimensionGrossWeight: 0.22,
    dimensionNetWeight: 0.12,
    point: 15,
    isPromotional: true,
    isNew: false,
    isPopular: true
  },
  {
    id: 9007,
    categoryId: 9004,
    brandId: 9001,
    groupId: 9003,
    subGroupId: 9004,
    name: "Lampada Inteligente Wi-Fi RGB",
    title: "Lampada inteligente RGB com controle por aplicativo",
    sku: "ILJ-LMP-RGB",
    ref: "LAMP-RGB",
    slug: "lampada-inteligente-wi-fi-rgb",
    description: "Lampada Wi-Fi com ajuste de intensidade, temperatura de cor e cenas RGB.",
    text: "Funciona com rotinas, automacoes e assistentes de voz compativeis.",
    price: 89.9,
    pricePromotional: 69.9,
    stockCurrent: 85,
    stockMin: 15,
    stockMax: 160,
    dimensionLenght: 12,
    dimensionWidth: 7,
    dimensionHeight: 7,
    dimensionGrossWeight: 0.16,
    dimensionNetWeight: 0.08,
    point: 7,
    isPromotional: true,
    isNew: true,
    isPopular: false
  },
  {
    id: 9008,
    categoryId: 9004,
    brandId: 9001,
    groupId: 9002,
    subGroupId: 9003,
    name: "Camera de Seguranca Wi-Fi Full HD",
    title: "Camera Wi-Fi Full HD com visao noturna",
    sku: "ILJ-CAM-FHD",
    ref: "CAM-FHD",
    slug: "camera-de-seguranca-wi-fi-full-hd",
    description: "Camera inteligente com deteccao de movimento, audio bidirecional e visao noturna.",
    text: "Indicada para monitorar ambientes internos em tempo real pelo aplicativo.",
    price: 249.9,
    pricePromotional: 219.9,
    stockCurrent: 27,
    stockMin: 5,
    stockMax: 70,
    dimensionLenght: 14,
    dimensionWidth: 10,
    dimensionHeight: 10,
    dimensionGrossWeight: 0.38,
    dimensionNetWeight: 0.21,
    point: 22,
    isPromotional: true,
    isNew: false,
    isPopular: false
  }
].map(product => ({
  ...product,
  companyId: PLACEHOLDER_COMPANY_ID,
  conditionId: 1,
  image: null,
  availability: true,
  active: true,
  inventoryControl: true,
  stockMin: product.stockMin,
  stockMax: product.stockMax,
  dimensionUnit: "cm",
  dimensionWeightUnit: "kg",
  dimensionTareWeight: 0,
  ...timestamps()
}));

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async transaction => {
      const companyId = Number(await queryInterface.rawSelect(
        "Company",
        { where: { id: TARGET_COMPANY_ID }, transaction },
        ["id"]
      ));

      if (!companyId) throw new Error("Nenhuma empresa ativa encontrada para receber o catalogo demo.");

      const existingProduct = await queryInterface.rawSelect(
        "Product",
        {
          // Os IDs deste catálogo são reservados. A verificação por ID também
          // cobre uma execução interrompida antes do companyId/ref serem gravados.
          where: { id: remapId(products[0].id) },
          transaction
        },
        ["id"]
      );

      if (existingProduct) return null;

      await queryInterface.bulkInsert("Brand", brands.map(item => ({ ...item, id: remapId(item.id), companyId })), { transaction });
      await queryInterface.bulkInsert("Category", categories.map(item => ({ ...item, id: remapId(item.id), companyId })), { transaction });
      await queryInterface.bulkInsert("Group", groups.map(item => ({ ...item, id: remapId(item.id), companyId })), { transaction });
      await queryInterface.bulkInsert("SubGroup", subGroups.map(item => ({ ...item, id: remapId(item.id), groupId: remapId(item.groupId), companyId })), { transaction });
      await queryInterface.bulkInsert("Product", products.map(item => ({
        ...item,
        id: remapId(item.id),
        categoryId: remapId(item.categoryId),
        brandId: remapId(item.brandId),
        groupId: remapId(item.groupId),
        subGroupId: remapId(item.subGroupId),
        companyId,
      })), { transaction });

      return null;
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async transaction => {
      const companyId = Number(await queryInterface.rawSelect(
        "Company",
        { where: { id: TARGET_COMPANY_ID }, transaction },
        ["id"]
      ));

      if (!companyId) return null;

      await queryInterface.bulkDelete("Product", { companyId, id: { [Op.in]: products.map(item => remapId(item.id)) } }, { transaction });
      await queryInterface.bulkDelete("SubGroup", { companyId, id: { [Op.in]: subGroups.map(item => remapId(item.id)) } }, { transaction });
      await queryInterface.bulkDelete("Group", { companyId, id: { [Op.in]: groups.map(item => remapId(item.id)) } }, { transaction });
      await queryInterface.bulkDelete("Category", { companyId, id: { [Op.in]: categories.map(item => remapId(item.id)) } }, { transaction });
      await queryInterface.bulkDelete("Brand", { companyId, id: { [Op.in]: brands.map(item => remapId(item.id)) } }, { transaction });

      return null;
    });
  }
};
