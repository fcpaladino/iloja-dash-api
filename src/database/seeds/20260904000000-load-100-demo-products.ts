import { Op, QueryInterface } from "sequelize";

const PLACEHOLDER_COMPANY_ID = 9001;
const TARGET_COMPANY_ID = 1;
const ID_OFFSET = 1000000;
const stamp = () => ({ createdAt: new Date(), updatedAt: new Date() });
const slug = (v: string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const names = ["Galaxy A56", "Galaxy S25", "iPhone 16", "Moto Edge 50", "IdeaPad Slim", "ThinkBook 14", "Iloja Pro", "Tab S10", "iPad Air", "Monitor UltraView", "Monitor Gamer Pulse", "Teclado Mecar", "Mouse Master", "Webcam Vision", "Fone Tune", "Caixa SoundBox", "Lampada Smart", "Camera Guard", "Roteador Mesh", "Cadeira Gamer"];
const categoryIds = [9001, 9001, 9001, 9001, 9002, 9002, 9002, 9003, 9003, 9004, 9004, 9003, 9003, 9003, 9003, 9003, 9004, 9004, 9004, 9003];
const brandIds = [9002, 9002, 9003, 9001, 9004, 9004, 9001, 9002, 9003, 9001, 9001, 9001, 9005, 9001, 9005, 9005, 9001, 9001, 9001, 9001];
const prices = [1699.9, 5299.9, 6999.9, 2499.9, 3899.9, 5299.9, 7899.9, 3299.9, 5999.9, 1199.9, 1799.9, 349.9, 699.9, 299.9, 249.9, 499.9, 89.9, 249.9, 599.9, 1299.9];

const products = Array.from({ length: 100 }, (_, index) => {
  const familyIndex = index % names.length; const edition = Math.floor(index / names.length) + 1; const id = ID_OFFSET + 9001 + index;
  const name = `${names[familyIndex]}${edition === 1 ? "" : ` Edicao ${edition}`}`; const price = Number((prices[familyIndex] + edition * 37.5).toFixed(2));
  return { id, companyId: PLACEHOLDER_COMPANY_ID, categoryId: ID_OFFSET + categoryIds[familyIndex], brandId: ID_OFFSET + brandIds[familyIndex], groupId: ID_OFFSET + 9001 + index % 3, subGroupId: ID_OFFSET + 9001 + index % 4, conditionId: 1, name, title: `${name} - tecnologia para o seu dia a dia`, sku: `DEMO-${String(id).padStart(5, "0")}`, ref: `REF-${id}`, slug: `${slug(name)}-${id}`, description: `Produto ${name} com qualidade e excelente desempenho.`, text: "Produto de demonstracao para catalogo completo.", image: null, price, pricePromotional: index % 3 === 0 ? Number((price * 0.9).toFixed(2)) : null, availability: true, active: true, inventoryControl: true, stockCurrent: 8 + index % 60, stockMin: 2, stockMax: 100, dimensionUnit: "cm", dimensionLenght: 20 + index % 20, dimensionWidth: 10 + index % 15, dimensionHeight: 5 + index % 8, dimensionWeightUnit: "kg", dimensionGrossWeight: 0.5 + index % 10 / 10, dimensionTareWeight: 0, dimensionNetWeight: 0.4 + index % 8 / 10, point: Math.round(price / 10), isPromotional: index % 3 === 0, isNew: index >= 80, isPopular: index % 4 === 0, ...stamp() };
});

const variants = products.flatMap((product, index) => [{ id: ID_OFFSET + 19001 + index * 2, companyId: PLACEHOLDER_COMPANY_ID, registerModel: "Product", registerId: product.id, name: "Cor", active: true, requered: true, min: 1, max: 1, order: 1, ...stamp() }, ...(index % 2 === 0 ? [{ id: ID_OFFSET + 19002 + index * 2, companyId: PLACEHOLDER_COMPANY_ID, registerModel: "Product", registerId: product.id, name: "Capacidade", active: true, requered: true, min: 1, max: 1, order: 2, ...stamp() }] : [])]);
const variantItems = variants.flatMap((variant, index) => (variant.name === "Cor" ? ["Preto", "Branco", "Azul"].map((name, itemIndex) => ({ id: ID_OFFSET + 29001 + index * 3 + itemIndex, variantId: variant.id, name, description: `Acabamento ${name.toLowerCase()}`, price: null, order: itemIndex + 1, ...stamp() })) : ["128GB", "256GB", "512GB"].map((name, itemIndex) => ({ id: ID_OFFSET + 30001 + index * 3 + itemIndex, variantId: variant.id, name, description: `Armazenamento de ${name}`, price: itemIndex * 300, order: itemIndex + 1, ...stamp() }))));
const legacyProductIds = products.map(product => product.id - ID_OFFSET);
const legacyVariantIds = variants.map(variant => variant.id - ID_OFFSET);
const allSeedProductIds = [...products.map(product => product.id), ...legacyProductIds];
const allSeedVariantIds = [...variants.map(variant => variant.id), ...legacyVariantIds];

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async transaction => {
    const companyId = Number(await queryInterface.rawSelect("Company", { where: { id: TARGET_COMPANY_ID }, transaction }, ["id"]));
    if (!companyId) throw new Error("Nenhuma empresa ativa encontrada para receber os produtos demo.");
    await queryInterface.bulkDelete("VariantItem", { variantId: { [Op.in]: allSeedVariantIds } }, { transaction });
    await queryInterface.bulkDelete("Variant", { companyId, id: { [Op.in]: allSeedVariantIds } }, { transaction });
    await queryInterface.bulkDelete("Product", { companyId, id: { [Op.in]: allSeedProductIds } }, { transaction });
    await queryInterface.bulkInsert("Product", products.map(product => ({ ...product, companyId })), { transaction });
    await queryInterface.bulkInsert("Variant", variants.map(variant => ({ ...variant, companyId })), { transaction }); await queryInterface.bulkInsert("VariantItem", variantItems, { transaction });
  }),
  down: (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async transaction => {
    const companyId = Number(await queryInterface.rawSelect("Company", { where: { id: TARGET_COMPANY_ID }, transaction }, ["id"]));
    if (!companyId) return;
    await queryInterface.bulkDelete("VariantItem", { variantId: { [Op.in]: allSeedVariantIds } }, { transaction });
    await queryInterface.bulkDelete("Variant", { companyId, id: { [Op.in]: allSeedVariantIds } }, { transaction });
    await queryInterface.bulkDelete("Product", { companyId, id: { [Op.in]: allSeedProductIds } }, { transaction });
  })
};
