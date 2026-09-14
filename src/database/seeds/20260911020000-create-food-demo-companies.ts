import { QueryInterface } from "sequelize";

type Demo = {
  name: string;
  subdomain: string;
  primary: string;
  secondary: string;
  background: string;
  imageId?: string;
  categories: Record<string, string[]>;
};

const demos: Demo[] = [
  {
    name: "Hamburgueria Demo",
    subdomain: "demo-hamburgueria",
    primary: "#B91C1C",
    secondary: "#F59E0B",
    background: "cart",
    imageId: "photo-1568901346375-23c9450c58cd",
    categories: {
      "Hambúrgueres": ["Smash Clássico", "X-Bacon Artesanal", "Duplo Cheddar", "Burger Crispy"],
      "Combos": ["Combo Smash", "Combo X-Salada", "Combo Duplo", "Combo Família"],
      "Porções": ["Batata Frita", "Batata Cheddar e Bacon", "Onion Rings", "Nuggets"],
      "Bebidas": ["Refrigerante Lata", "Refrigerante 2L", "Suco Natural", "Água Mineral"],
    },
  },
  {
    name: "Pizzaria Demo",
    subdomain: "demo-pizzaria",
    primary: "#15803D",
    secondary: "#FACC15",
    background: "nature",
    imageId: "photo-1579751626657-72bc17010498",
    categories: {
      "Pizzas Salgadas": ["Calabresa", "Mussarela", "Frango com Catupiry", "Portuguesa"],
      "Pizzas Especiais": ["Cinco Queijos", "Carne Seca com Catupiry", "Pepperoni Especial", "Moda da Casa"],
      "Pizzas Doces": ["Chocolate", "Banana com Canela", "Romeu e Julieta", "M&M's"],
      "Bebidas": ["Refrigerante 2L", "Refrigerante Lata", "Suco de Uva", "Água Mineral"],
    },
  },
  {
    name: "Lanchonete Demo",
    subdomain: "demo-lanchonete",
    primary: "#E11D48",
    secondary: "#FBBF24",
    background: "cart",
    imageId: "photo-1550547660-d9450f859349",
    categories: {
      "Combos": ["Combo X-Burger", "Combo X-Salada", "Combo Frango Crocante", "Combo Vegetariano"],
      "Hamburgueres": ["X-Bacon Artesanal", "X-Tudo Especial", "Smash Cheddar", "Burger Duplo"],
      "Porcoes": ["Batata Frita", "Batata com Cheddar e Bacon", "Onion Rings", "Nuggets de Frango"],
      "Lanches": ["Misto Quente", "Cachorro-Quente Completo", "Beirute de Frango", "Tosta Especial"],
    },
  },
  {
    name: "Sorveteria Demo",
    subdomain: "demo-sorveteria",
    primary: "#7C3AED",
    secondary: "#F9A8D4",
    background: "nature",
    categories: {
      "Sorvetes": ["Sorvete de Chocolate", "Sorvete de Morango", "Sorvete de Baunilha", "Sorvete de Pistache"],
      "Acai": ["Acai 300ml", "Acai 500ml", "Acai com Frutas", "Barca de Acai"],
      "Milk-shakes": ["Milk-shake de Ovomaltine", "Milk-shake de Morango", "Milk-shake de Nutella", "Milk-shake de Cookies"],
      "Pecas e sobremesas": ["Pudim de Leite", "Brownie com Sorvete", "Banana Split", "Sundae Especial"],
    },
  },
  {
    name: "Bebidas Demo",
    subdomain: "demo-bebidas",
    primary: "#0F766E",
    secondary: "#22D3EE",
    background: "cart",
    categories: {
      "Refrigerantes": ["Cola 2L", "Guarana 2L", "Cola Lata", "Guarana Lata"],
      "Cervejas": ["Pilsen Lata", "Pilsen Long Neck", "IPA Lata", "Chopp Lata"],
      "Destilados": ["Gin London Dry", "Vodka Premium", "Whisky 8 Anos", "Cachaca Artesanal"],
      "Aguas e sucos": ["Agua Mineral 500ml", "Agua com Gas", "Suco de Uva Integral", "Agua de Coco"],
    },
  },
];

const stamp = () => ({ createdAt: new Date(), updatedAt: new Date() });
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const findId = async (queryInterface: QueryInterface, table: string, where: Record<string, unknown>, transaction: any) =>
  Number(await queryInterface.rawSelect(table, { where, transaction }, ["id"]));

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
          name: demo.name,
          planId: 1,
          isMaster: false,
          email: `${demo.subdomain}@demo.iloja.me`,
          subdomain: demo.subdomain,
          logotipo: `https://placehold.co/400x400/${demo.primary.slice(1)}/ffffff?text=${encodeURIComponent(demo.name)}`,
          siteTitle: demo.name,
          siteSubTitle: "Uma loja demo pronta para apresentar o iLoja",
          colorPrimary: demo.primary,
          colorSecondary: demo.secondary,
          themeMode: "light",
          backgroundBannerStyle: demo.background,
          headerBackgroundColor: demo.primary,
          backgroundIconPattern: "none",
          backgroundIconColor: demo.primary,
          backgroundIconOpacity: 0.12,
          active: true,
          isBtnWhatsapp: true,
          isOrder: true,
          isFrete: true,
          ...stamp(),
        }], { transaction });
        companyId = await findId(queryInterface, "Company", { subdomain: demo.subdomain }, transaction);
      }

      const roleId = await findId(queryInterface, "Role", { companyId, name: "Administrador" }, transaction);
      if (!roleId) {
        await queryInterface.bulkInsert("Role", [{ companyId, name: "Administrador", permissions: null, ...stamp() }], { transaction });
      }
      const resolvedRoleId = roleId || await findId(queryInterface, "Role", { companyId, name: "Administrador" }, transaction);

      const membership = await queryInterface.rawSelect("UserCompany", { where: { userId, companyId }, transaction }, ["id"]);
      if (!membership) {
        await queryInterface.bulkInsert("UserCompany", [{ userId, companyId, roleId: resolvedRoleId, owner: true, active: true, ...stamp() }], { transaction });
      }

      const sentinel = await findId(queryInterface, "Product", { companyId, ref: `DEMO-${demo.subdomain}-01` }, transaction);
      if (sentinel) continue;

      const brandId = await (async () => {
        await queryInterface.bulkInsert("Brand", [{ companyId, name: demo.name.replace(" Demo", ""), active: true, ...stamp() }], { transaction });
        return findId(queryInterface, "Brand", { companyId, name: demo.name.replace(" Demo", "") }, transaction);
      })();

      let productIndex = 0;
      for (const [categoryName, products] of Object.entries(demo.categories)) {
        await queryInterface.bulkInsert("Category", [{ companyId, name: categoryName, active: true, ...stamp() }], { transaction });
        const categoryId = await findId(queryInterface, "Category", { companyId, name: categoryName }, transaction);

        await queryInterface.bulkInsert("Product", products.map(name => {
          productIndex += 1;
          const price = Number((9.9 + (productIndex % 8) * 4.5).toFixed(2));
          return {
            companyId, categoryId, brandId, conditionId: 1,
            name, title: `${name} | ${demo.name}`, sku: `SKU-${demo.subdomain}-${productIndex}`,
            ref: `DEMO-${demo.subdomain}-${String(productIndex).padStart(2, "0")}`,
            slug: `${slugify(name)}-${demo.subdomain}`,
            description: `${name} preparado especialmente para o catalogo demonstrativo.`,
            text: `Produto demonstrativo da ${demo.name}.`,
            image: image(demo.imageId || "photo-1513104890138-7c749659a591"), price,
            pricePromotional: productIndex % 3 === 0 ? Number((price * 0.9).toFixed(2)) : null,
            availability: true, active: true, inventoryControl: true,
            stockCurrent: 20, stockMin: 2, stockMax: 100,
            isPromotional: productIndex % 3 === 0, isNew: productIndex > 10, isPopular: productIndex <= 2,
            ...stamp(),
          };
        }), { transaction });
      }
    }
  }),
  down: async () => null,
};
