import { QueryInterface } from "sequelize";

type DemoCatalog = {
  name: string;
  subdomain: string;
  primary: string;
  secondary: string;
  logoColor: string;
  logoText: string;
  image: string;
  brands: string[];
  categories: { name: string; products: string[] }[];
};

const stamp = () => ({ createdAt: new Date(), updatedAt: new Date() });
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const demos: DemoCatalog[] = [
  {
    name: "Mercado Demo", subdomain: "demo-mercado", primary: "#15803D", secondary: "#FACC15", logoColor: "15803D", logoText: "Mercado Demo",
    image: image("photo-1542838132-92c53300491e"), brands: ["Da Hora", "Sabor da Casa", "Selecao Demo"],
    categories: [
      { name: "Mercearia", products: ["Arroz Agulhinha 5kg", "Feijao Carioca 1kg", "Macarrao Espaguete 500g", "Cafe Torrado 500g", "Acucar Cristal 1kg", "Farinha de Trigo 1kg"] },
      { name: "Bebidas", products: ["Suco de Uva Integral", "Refrigerante Cola 2L", "Agua Mineral 1,5L", "Cafe Gelado", "Cha de Pessego", "Agua de Coco 1L"] },
      { name: "Frios e Laticinios", products: ["Queijo Mussarela Fatiado", "Presunto Cozido 200g", "Iogurte Natural", "Leite Integral 1L", "Manteiga com Sal", "Requeijao Cremoso"] },
      { name: "Limpeza", products: ["Detergente Neutro", "Sabao em Po 1kg", "Amaciante Concentrado", "Desinfetante Floral", "Esponja Multiuso", "Papel Toalha"] },
      { name: "Higiene", products: ["Shampoo Hidratacao", "Sabonete em Barra", "Creme Dental", "Papel Higienico 12un", "Desodorante Aerosol", "Fraldas Tamanho M"] },
    ],
  },
  {
    name: "Sacolao Demo", subdomain: "demo-sacolao", primary: "#65A30D", secondary: "#F97316", logoColor: "65A30D", logoText: "Sacolao Demo",
    image: image("photo-1610832958506-aa56368176cf"), brands: ["Colheita Feliz", "Sitio Demo", "Natural da Terra"],
    categories: [
      { name: "Frutas", products: ["Banana Prata", "Maca Gala", "Manga Palmer", "Uva sem Semente", "Laranja Pera", "Abacaxi Pérola"] },
      { name: "Verduras", products: ["Alface Crespa", "Rucula Hidroponica", "Couve Manteiga", "Espinafre Fresco", "Cheiro Verde", "Repolho Verde"] },
      { name: "Legumes", products: ["Tomate Italiano", "Cenoura Lavada", "Batata Inglesa", "Abobrinha Italiana", "Berinjela", "Pimentao Colorido"] },
      { name: "Organicos", products: ["Cesta Organica Pequena", "Ovos Caipiras", "Mel Organico", "Banana Organica", "Tomate Organico", "Folhas Organicas"] },
      { name: "Cestas", products: ["Cesta Salada", "Cesta Cafe da Manha", "Cesta Frutas da Semana", "Cesta Sopa", "Cesta Churrasco", "Cesta Fit"] },
    ],
  },
  {
    name: "Petshop Demo", subdomain: "demo-petshop", primary: "#7C3AED", secondary: "#F59E0B", logoColor: "7C3AED", logoText: "Petshop Demo",
    image: image("photo-1583337130417-3346a1be7dee"), brands: ["Pet Demo", "Amigo Fiel", "Mundo Animal"],
    categories: [
      { name: "Cachorros", products: ["Racao Premium Adulto", "Petisco Dental", "Coleira Confort", "Brinquedo Mordedor", "Shampoo para Caes", "Tapete Higienico"] },
      { name: "Gatos", products: ["Racao Premium Gatos", "Areia Biodegradavel", "Fonte de Agua", "Arranhador Compacto", "Brinquedo Varinha", "Sachê Carne"] },
      { name: "Acessorios", products: ["Cama Nuvem", "Comedouro Inox", "Bebedouro Portatil", "Guia Retratil", "Bolsa de Transporte", "Manta Pet"] },
      { name: "Higiene", products: ["Shampoo Neutro", "Lenço Umedecido", "Escova Desemboladora", "Cortador de Unhas", "Perfume Pet", "Removedor de Pelos"] },
      { name: "Veterinaria", products: ["Suplemento Vitaminico", "Antipulgas Mensal", "Probiótico Pet", "Spray Cicatrizante", "Colageno para Articulacoes", "Higiene Auricular"] },
    ],
  },
  {
    name: "Moda Demo", subdomain: "demo-moda", primary: "#BE185D", secondary: "#F9A8D4", logoColor: "BE185D", logoText: "Moda Demo",
    image: image("photo-1441986300917-64674bd600d8"), brands: ["Essenza", "Urbana Demo", "Atelier 10"],
    categories: [
      { name: "Feminino", products: ["Blusa Canelada", "Vestido Midi Floral", "Calca Wide Leg", "Saia Plissada", "Cropped Linho", "Camisa Oversized"] },
      { name: "Masculino", products: ["Camiseta Essential", "Polo Piquet", "Calca Sarja", "Bermuda Casual", "Camisa Linho", "Jaqueta Bomber"] },
      { name: "Calcados", products: ["Tenis Casual Branco", "Sandalia Tiras", "Bota Chelsea", "Mocassim Couro", "Tenis Esportivo", "Rasteira Comfort"] },
      { name: "Acessorios", products: ["Bolsa Transversal", "Cinto Couro", "Oculos Solar", "Carteira Slim", "Chapeu Fedora", "Relogio Minimal"] },
      { name: "Infantil", products: ["Conjunto Infantil", "Vestido Infantil", "Camiseta Kids", "Moletom Kids", "Tenis Infantil", "Pijama Infantil"] },
    ],
  },
  {
    name: "Eletronicos Demo", subdomain: "demo-eletronicos", primary: "#1D4ED8", secondary: "#06B6D4", logoColor: "1D4ED8", logoText: "Eletronicos Demo",
    image: image("photo-1468495244123-6c6c332eeece"), brands: ["Iloja Tech", "Nexus", "Connect Pro"],
    categories: [
      { name: "Smartphones", products: ["Smartphone Pro 256GB", "Smartphone Lite 128GB", "Smartphone Max 512GB", "Celular 5G Plus", "Smartphone Camera", "Celular Compact"] },
      { name: "Computadores", products: ["Notebook Ultra i5", "Notebook Pro i7", "Desktop Home Office", "Mini PC 16GB", "Monitor 27 Polegadas", "Tablet 10 Polegadas"] },
      { name: "Acessorios", products: ["Mouse Sem Fio", "Teclado Mecanico", "Hub USB-C", "Webcam Full HD", "Suporte para Notebook", "Mousepad Extended"] },
      { name: "Audio", products: ["Fone Bluetooth ANC", "Caixa de Som Portatil", "Headset Gamer", "Microfone USB", "Soundbar Compacta", "Fone Esportivo"] },
      { name: "Casa Inteligente", products: ["Lampada Wi-Fi RGB", "Camera de Seguranca", "Tomada Inteligente", "Fechadura Digital", "Sensor de Presenca", "Roteador Mesh"] },
    ],
  },
  {
    name: "Farmacia Demo", subdomain: "demo-farmacia", primary: "#0F766E", secondary: "#5EEAD4", logoColor: "0F766E", logoText: "Farmacia Demo",
    image: image("photo-1584308666744-24d5c474f2ae"), brands: ["Bem Estar", "Vida Mais", "Cuidado Demo"],
    categories: [
      { name: "Medicamentos", products: ["Analgesico 20 Comprimidos", "Antialergico 10 Comprimidos", "Vitamina C 1g", "Soro Fisiologico", "Antiacido Mastigavel", "Termometro Digital"] },
      { name: "Higiene", products: ["Sabonete Liquido", "Protetor Solar FPS 50", "Enxaguante Bucal", "Fio Dental", "Absorvente Noturno", "Alcool em Gel"] },
      { name: "Beleza", products: ["Hidratante Facial", "Agua Micelar", "Protetor Labial", "Mascara Capilar", "Creme para Maos", "Body Splash"] },
      { name: "Bebes", products: ["Fralda Descartavel", "Lenço para Bebê", "Pomada Preventiva", "Shampoo Infantil", "Mamadeira Anticolica", "Chupeta Ortodontica"] },
      { name: "Suplementos", products: ["Whey Protein", "Creatina Monohidratada", "Multivitaminico", "Colageno Hidrolisado", "Omega 3", "Barra de Proteina"] },
    ],
  },
];

const findId = async (queryInterface: QueryInterface, table: string, where: Record<string, unknown>, transaction: any) => Number(await queryInterface.rawSelect(table, { where, transaction }, ["id"]));

module.exports = {
  up: (queryInterface: QueryInterface) => queryInterface.sequelize.transaction(async transaction => {
    for (const demo of demos) {
      let companyId = await findId(queryInterface, "Company", { subdomain: demo.subdomain }, transaction);
      if (!companyId) {
        await queryInterface.bulkInsert("Company", [{
          name: demo.name, planId: 1, isMaster: false, email: `${demo.subdomain}@demo.iloja.me`, subdomain: demo.subdomain,
          logotipo: `https://placehold.co/400x400/${demo.logoColor}/ffffff?text=${encodeURIComponent(demo.logoText)}`,
          siteTitle: demo.name, siteSubTitle: `Uma loja demonstracao pronta para apresentar o iLoja`, colorPrimary: demo.primary, colorSecondary: demo.secondary,
          active: true, isBtnWhatsapp: true, isOrder: true, isFrete: true, ...stamp(),
        }], { transaction });
        companyId = await findId(queryInterface, "Company", { subdomain: demo.subdomain }, transaction);
      }

      const sentinel = await findId(queryInterface, "Product", { companyId, ref: `DEMO-${demo.subdomain}-01` }, transaction);
      if (sentinel) continue;

      const brands = demo.brands.map(name => ({ companyId, name, slug: slugify(name), active: true, ...stamp() }));
      await queryInterface.bulkInsert("Brand", brands, { transaction });
      const brandIds = await Promise.all(demo.brands.map(name => findId(queryInterface, "Brand", { companyId, name }, transaction)));

      const categories = demo.categories.map(category => ({ companyId, name: category.name, slug: slugify(category.name), active: true, ...stamp() }));
      await queryInterface.bulkInsert("Category", categories, { transaction });
      const categoryIds = await Promise.all(demo.categories.map(category => findId(queryInterface, "Category", { companyId, name: category.name }, transaction)));

      const groupNames = ["Mais vendidos", "Ofertas da semana", "Novidades"];
      await queryInterface.bulkInsert("Group", groupNames.map((name, index) => ({ companyId, name, slug: slugify(name), description: `Selecao especial da ${demo.name}`, color: [demo.primary, demo.secondary, "#334155"][index], icon: ["trending-up", "badge-percent", "sparkles"][index], active: true, ...stamp() })), { transaction });
      const groupIds = await Promise.all(groupNames.map(name => findId(queryInterface, "Group", { companyId, name }, transaction)));

      const subGroupNames = ["Destaques", "Promocoes", "Lancamentos", "Escolhas da loja", "Mais procurados", "Selecao premium"];
      await queryInterface.bulkInsert("SubGroup", subGroupNames.map((name, index) => ({ companyId, groupId: groupIds[index % groupIds.length], name, slug: slugify(name), description: `${name} da ${demo.name}`, color: demo.primary, icon: "sparkles", active: true, ...stamp() })), { transaction });
      const subGroupIds = await Promise.all(subGroupNames.map(name => findId(queryInterface, "SubGroup", { companyId, name }, transaction)));

      const productRows = demo.categories.flatMap((category, categoryIndex) => category.products.map((name, productIndex) => {
        const price = Number((19.9 + ((categoryIndex * 7 + productIndex * 11) % 80) * 3.25).toFixed(2));
        const promotional = productIndex % 3 === 0 ? Number((price * 0.9).toFixed(2)) : null;
        return {
          companyId, categoryId: categoryIds[categoryIndex], brandId: brandIds[productIndex % brandIds.length], groupId: groupIds[productIndex % groupIds.length], subGroupId: subGroupIds[(categoryIndex + productIndex) % subGroupIds.length],
          conditionId: 1, name, title: `${name} | ${demo.name}`, sku: `SKU-${demo.subdomain}-${categoryIndex + 1}${productIndex + 1}`, ref: `DEMO-${demo.subdomain}-${String(categoryIndex * 6 + productIndex + 1).padStart(2, "0")}`,
          slug: `${slugify(name)}-${demo.subdomain}`, description: `${name} com qualidade e excelente custo-beneficio.`, text: `Produto demonstrativo da ${demo.name}.`, image: demo.image,
          price, pricePromotional: promotional, availability: true, active: true, inventoryControl: true, stockCurrent: 10 + productIndex * 2, stockMin: 2, stockMax: 80, dimensionUnit: "cm", dimensionLenght: 20, dimensionWidth: 15, dimensionHeight: 8, dimensionWeightUnit: "kg", dimensionGrossWeight: 1, dimensionTareWeight: 0, dimensionNetWeight: 0.8, point: Math.round(price), isPromotional: Boolean(promotional), isNew: productIndex >= 4, isPopular: productIndex < 2, ...stamp(),
        };
      }));
      await queryInterface.bulkInsert("Product", productRows, { transaction });

      for (const product of productRows) {
        const productId = await findId(queryInterface, "Product", { companyId, ref: product.ref }, transaction);
        const variantNames = demo.subdomain === "demo-moda" ? ["Tamanho", "Cor"] : ["Modelo", "Embalagem"];
        for (let variantIndex = 0; variantIndex < variantNames.length; variantIndex += 1) {
          await queryInterface.bulkInsert("Variant", [{ companyId, registerModel: "Product", registerId: productId, name: variantNames[variantIndex], active: true, requered: true, min: 1, max: 1, order: variantIndex + 1, ...stamp() }], { transaction });
          const variantId = await findId(queryInterface, "Variant", { companyId, registerId: productId, name: variantNames[variantIndex] }, transaction);
          const values = variantIndex === 0 ? (demo.subdomain === "demo-moda" ? ["P", "M", "G"] : ["Original", "Premium", "Especial"]) : (demo.subdomain === "demo-moda" ? ["Preto", "Branco", "Azul"] : ["1 unidade", "Kit 2 unidades", "Kit 3 unidades"]);
          await queryInterface.bulkInsert("VariantItem", values.map((name, index) => ({ variantId, name, description: `${name} - opcao demonstrativa`, price: index === 0 ? null : Number((index * 5).toFixed(2)), order: index + 1, ...stamp() })), { transaction });
        }
      }
    }
  }),

  down: async () => null,
};
