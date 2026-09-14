import { QueryInterface } from "sequelize";

type Demo = { name: string; subdomain: string; primary: string; secondary: string; action: "checkout" | "interest"; categories: Record<string, string[]> };

const demos: Demo[] = [
  {
    name: "Açaí Demo", subdomain: "demo-acai", primary: "#7C3AED", secondary: "#F472B6", action: "checkout",
    categories: {
      "Açaí": ["Açaí 300ml", "Açaí 500ml", "Açaí 700ml", "Barca de Açaí"],
      "Adicionais": ["Banana", "Morango", "Leite em pó", "Granola"],
      "Cremes": ["Creme de Cupuaçu", "Creme de Ninho", "Creme de Morango", "Creme de Ovomaltine"],
    },
  },
  {
    name: "Garagem de Carros Demo", subdomain: "demo-garagem", primary: "#0F172A", secondary: "#F59E0B", action: "interest",
    categories: {
      "Carros seminovos": ["Hatch Compacto 2023", "Sedan Automático 2022", "SUV Flex 2024", "Picape Turbo 2023"],
      "Carros novos": ["Hatch Urbano 0km", "SUV Premium 0km", "Sedan Executivo 0km", "Picape 4x4 0km"],
      "Motos": ["Moto Urbana 160cc", "Moto Trail 300cc", "Scooter 125cc", "Moto Esportiva 600cc"],
    },
  },
  {
    name: "Imobiliária Demo", subdomain: "demo-imobiliaria", primary: "#0F766E", secondary: "#14B8A6", action: "interest",
    categories: {
      "Apartamentos": ["Apartamento 2 quartos", "Apartamento com varanda", "Cobertura duplex", "Apartamento mobiliado"],
      "Casas": ["Casa em condomínio", "Casa térrea com piscina", "Sobrado moderno", "Casa compacta"],
      "Comercial": ["Sala comercial central", "Loja térrea", "Galpão logístico", "Escritório mobiliado"],
    },
  },
];

const stamp = () => ({ createdAt: new Date(), updatedAt: new Date() });
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const findId = async (queryInterface: QueryInterface, table: string, where: Record<string, unknown>, transaction: any) => Number(await queryInterface.rawSelect(table, { where, transaction }, ["id"]));

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async transaction => {
    const configuredEmail = process.env.DEMO_USER_EMAIL;
    const userId = configuredEmail
      ? await findId(queryInterface, "User", { email: configuredEmail.toLowerCase() }, transaction)
      : Number(await queryInterface.rawSelect("User", { where: { owner: true, active: true }, transaction }, ["id"]));
    if (!userId) throw new Error("Defina DEMO_USER_EMAIL ou crie um usuário proprietário antes das demos.");

    for (const demo of demos) {
      let companyId = await findId(queryInterface, "Company", { subdomain: demo.subdomain }, transaction);
      if (!companyId) {
        await queryInterface.bulkInsert("Company", [{
          name: demo.name, planId: 1, isMaster: false, email: `${demo.subdomain}@demo.iloja.me`, subdomain: demo.subdomain,
          productActionMode: demo.action, logotipo: `https://placehold.co/400x400/${demo.primary.slice(1)}/ffffff?text=${encodeURIComponent(demo.name)}`,
          siteTitle: demo.name, siteSubTitle: demo.action === "interest" ? "Encontre seu próximo imóvel ou veículo" : "Monte seu açaí do seu jeito",
          colorPrimary: demo.primary, colorSecondary: demo.secondary, backgroundIconPattern: demo.action === "interest" ? "automotivo" : "none",
          backgroundBannerStyle: "cart", headerBackgroundColor: demo.primary, active: true, isOrder: demo.action === "checkout", isFrete: demo.action === "checkout", ...stamp(),
        }], { transaction });
        companyId = await findId(queryInterface, "Company", { subdomain: demo.subdomain }, transaction);
      } else {
        await queryInterface.bulkUpdate("Company", { productActionMode: demo.action, isOrder: demo.action === "checkout", isFrete: demo.action === "checkout", updatedAt: new Date() }, { id: companyId }, { transaction });
      }

      let roleId = await findId(queryInterface, "Role", { companyId, name: "Administrador" }, transaction);
      if (!roleId) {
        await queryInterface.bulkInsert("Role", [{ companyId, name: "Administrador", permissions: null, ...stamp() }], { transaction });
        roleId = await findId(queryInterface, "Role", { companyId, name: "Administrador" }, transaction);
      }
      const membership = await queryInterface.rawSelect("UserCompany", { where: { userId, companyId }, transaction }, ["id"]);
      if (!membership) await queryInterface.bulkInsert("UserCompany", [{ userId, companyId, roleId, owner: true, active: true, ...stamp() }], { transaction });

      if (await findId(queryInterface, "Product", { companyId, ref: `DEMO-${demo.subdomain}-01` }, transaction)) continue;

      await queryInterface.bulkInsert("Brand", [{ companyId, name: demo.name.replace(" Demo", ""), active: true, ...stamp() }], { transaction });
      const brandId = await findId(queryInterface, "Brand", { companyId, name: demo.name.replace(" Demo", "") }, transaction);
      let index = 0;
      for (const [categoryName, products] of Object.entries(demo.categories)) {
        await queryInterface.bulkInsert("Category", [{ companyId, name: categoryName, active: true, ...stamp() }], { transaction });
        const categoryId = await findId(queryInterface, "Category", { companyId, name: categoryName }, transaction);
        await queryInterface.bulkInsert("Product", products.map(name => {
          index += 1;
          const price = demo.action === "interest" ? 0 : Number((12 + (index % 6) * 4.5).toFixed(2));
          return { companyId, categoryId, brandId, conditionId: 1, name, title: `${name} | ${demo.name}`, sku: `SKU-${demo.subdomain}-${index}`, ref: `DEMO-${demo.subdomain}-${String(index).padStart(2, "0")}`, slug: `${slugify(name)}-${demo.subdomain}`, description: demo.action === "interest" ? "Consulte condições, disponibilidade e detalhes." : `${name} preparado com ingredientes selecionados.`, text: `Produto demonstrativo da ${demo.name}.`, image: image(demo.action === "interest" ? "photo-1560250097-0b93528c311a" : "photo-1511690743698-d9d85f2fbf38"), price, availability: true, active: true, inventoryControl: demo.action === "checkout", stockCurrent: demo.action === "checkout" ? 30 : null, isPromotional: false, isNew: index > 8, isPopular: index <= 2, ...stamp() };
        }), { transaction });
      }
    }
  }),
  down: async () => null,
};
