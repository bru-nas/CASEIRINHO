/* ============================================================
   CASEIRINHO TEMPEROS & SABORES — Dados compartilhados
   Cardápio, preços, ficha técnica (insumos) e cadeias de produção.
   Editar aqui reflete automaticamente no index e no admin.
   ============================================================ */

const PIX_KEY = "62982694287";
const MOEDOR_COST = 7; // custo fixo do moedor (R$), somado ao custo quando o cliente escolhe "com moedor"
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 15;
const CARD_MACHINE_FEE_PCT = 0.03; // taxa da maquininha (cartão na entrega) — editável aqui

/* ---------- CARDÁPIO ---------- */
const MENU = {
  dia_a_dia: {
    label: "Linha Dia a Dia",
    desc: "Temperos artesanais para o dia a dia",
    sizeLabel: "Gramatura",
    sizes: [
      { key: "300", label: "300g", price: 16 },
      { key: "500", label: "500g", price: 25 },
      { key: "1000", label: "1kg", price: 40 },
    ],
    products: [
      { key: "tradicional", label: "Tradicional", desc: "alho, sal, cebola, pimenta de cheiro" },
      { key: "tradicional_picante", label: "Tradicional Picante", desc: "alho, sal, cebola, pimenta de cheiro, pimenta malagueta" },
      { key: "cheiro_verde", label: "Cheiro Verde", desc: "alho, sal, cebola, pimenta de cheiro, cheiro verde" },
      { key: "cheiro_verde_picante", label: "Cheiro Verde Picante", desc: "alho, sal, cebola, pimenta de cheiro, cheiro verde, pimenta malagueta" },
      { key: "toque_caipira", label: "Toque Caipira", desc: "alho, cebola, sal, mix de pimentas aromáticas, açafrão puro" },
      { key: "toque_caseiro", label: "Toque Caseiro", desc: "alho, sal, cebola, pimenta de cheiro, cheiro verde, páprica picante, toque caseiro (fumaça)" },
      { key: "toque_baiano", label: "Toque Baiano", desc: "alho, sal, cebola, mix de pimentas, cominho, pimenta do reino, salsa, toque de dendê" },
    ],
  },
  pure: {
    label: "Linha Pure",
    desc: "Alho triturado com azeite",
    sizeLabel: "Gramatura",
    sizes: [
      { key: "300", label: "300g", price: 25 },
      { key: "500", label: "500g", price: 35 },
    ],
    products: [
      { key: "pure", label: "Pure", desc: "alho triturado com azeite" },
    ],
  },
  saladete: {
    label: "Linha Saladete",
    desc: "Sal saborizado com limão desidratado e ervas para salada",
    sizeLabel: "Opção",
    sizes: [
      { key: "com_moedor", label: "Com refil + moedor 250g", price: 25 },
      { key: "sem_refil", label: "Somente refil 250g", price: 15 },
    ],
    products: [
      { key: "saladete", label: "Saladete", desc: "sal saborizado com limão desidratado e ervas para salada" },
    ],
  },
  churrasco: {
    label: "Linha de Churrasco",
    desc: "Sal grosso saborizado, 250g",
    sizeLabel: "Opção",
    sizes: [
      { key: "refil", label: "Somente refil", price: 15 },
      { key: "embalagem", label: "Com embalagem", price: 25 },
    ],
    products: [
      { key: "bbq_churras", label: "BBQ Churras", desc: "sal grosso saborizado com limão, 250g" },
      { key: "bbq_chamas", label: "BBQ em Chamas", desc: "sal grosso apimentado, 250g" },
      { key: "bbq_ponto", label: "BBQ ao Ponto", desc: "sal grosso saborizado com alho e cebola, 250g" },
      { key: "bbq_grelhado", label: "BBQ Grelhado", desc: "sal grosso saborizado com ervas, 250g" },
    ],
  },
};

/* Plataformas de venda por fora do app */
const PLATFORMS = ["Por fora (sem plataforma)", "iFood", "Shopee", "99Food", "TikTok Shop", "Mercado Livre"];

/* ---------- FICHA TÉCNICA (insumo em gramas/unidades por pote vendido) ----------
   editável: cada valor pode ser sobrescrito no admin (localStorage) sem tocar aqui. */
const RECIPE_DEFAULT = {
  // Linha Dia a Dia — insumos-base compartilhados entre os produtos com Alho/Sal/Cebola/Pimenta de Cheiro
  dia_a_dia_base: {
    alho:            { "300": 0.075, "500": 0.16, "1000": 0.32 },
    sal:             { "300": 0.15,  "500": 0.25, "1000": 0.50 },
    cebola:          { "300": 0,     "500": 0.02, "1000": 0.04 },
    pimenta_cheiro:  { "300": 0.01,  "500": 0.03, "1000": 0.06 },
  },
  // adicional só nos produtos "cheiro verde"
  cheiro_verde_extra: {
    cheiro_verde_folha: { "300": 0.125, "500": 0.21, "1000": 0.42 },
  },
  // transformações (adicionados sobre a base ao "evoluir" o produto)
  transform: {
    pimenta_malagueta:   { "300": 0.02, "500": 0.06, "1000": 0.12 }, // tradicional -> tradicional picante / cheiro verde -> cheiro verde picante
    acafrao:             { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque caipira
    mix_pimentas_aromat: { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque caipira
    fumaca_po:           { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque caseiro
    cominho:             { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque baiano
    pimenta_do_reino:    { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque baiano
    salsa:                { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque baiano
    azeite_dende:         { "300": 0.05, "500": 0.05, "1000": 0.10 }, // toque baiano
  },
  // Pure — só alho
  pure: {
    alho: { "300": 250, "500": 450 },
  },
  // Saladete — por unidade (mesma receita com ou sem moedor)
  saladete: {
    sal:                { com_moedor: 250, sem_refil: 250 },
    tempero_vinagrete:  { com_moedor: 50, sem_refil: 50 },
    lemon_pepper:       { com_moedor: 50, sem_refil: 50 },
    limao_unid:         { com_moedor: 3, sem_refil: 3 },
    salsa_desidratada:  { com_moedor: 50, sem_refil: 50 },
    coentro_desidratado:{ com_moedor: 50, sem_refil: 50 },
  },
  // Churrasco — por unidade de 250g (ambas opções refil/embalagem usam a mesma receita)
  churrasco: {
    bbq_churras:  { sal_grosso: 300, limao_unid: 2, lemon_pepper: 50 },
    bbq_chamas:   { sal_grosso: 300, pimenta_calabresa: 50, paprica_picante: 50 },
    bbq_ponto:    { sal_grosso: 300, alho_desidratado: 50, cebola_desidratada: 50 },
    bbq_grelhado: { sal_grosso: 300, ervas_finas: 50, chimichurri: 50 },
  },
  // Custo dos potes/embalagens — em branco (varia por lote de compra), editável no admin
  embalagens: {
    pote_300: null,
    pote_500: null,
    pote_1000: null,
    moedor: MOEDOR_COST,
  },
};

/* Nomes amigáveis dos insumos, pra exibir na lista de compras */
const INSUMO_LABELS = {
  alho: "Alho",
  sal: "Sal",
  cebola: "Cebola",
  pimenta_cheiro: "Pimenta de Cheiro",
  cheiro_verde_folha: "Cheiro Verde (folha)",
  pimenta_malagueta: "Pimenta Malagueta",
  acafrao: "Açafrão",
  mix_pimentas_aromat: "Mix de Pimentas Aromáticas",
  fumaca_po: "Fumaça em Pó",
  cominho: "Cominho",
  pimenta_do_reino: "Pimenta do Reino",
  salsa: "Salsa",
  azeite_dende: "Azeite de Dendê",
  tempero_vinagrete: "Tempero Vinagrete",
  lemon_pepper: "Lemon Pepper",
  limao_unid: "Limão (unidades)",
  salsa_desidratada: "Salsa Desidratada",
  coentro_desidratado: "Coentro Desidratado",
  sal_grosso: "Sal Grosso",
  pimenta_calabresa: "Pimenta Calabresa",
  paprica_picante: "Páprica Picante",
  alho_desidratado: "Alho Desidratado",
  cebola_desidratada: "Cebola Desidratada",
  ervas_finas: "Ervas Finas",
  chimichurri: "Chimichurri",
};

/* ---------- CADEIAS DE PRODUÇÃO ----------
   Usadas na aba Produção do admin para sugerir a ordem de preparo,
   já que um produto "evolui" no outro adicionando ingredientes. */
const PRODUCTION_CHAINS = [
  {
    base: "tradicional",
    steps: [
      { from: "tradicional", to: "tradicional_picante", add: ["Pimenta Malagueta"] },
      { from: "tradicional_picante", to: "toque_baiano", add: ["Cominho", "Pimenta do Reino", "Salsa", "Azeite de Dendê"] },
      { from: "tradicional", to: "toque_caipira", add: ["Açafrão", "Mix de Pimentas Aromáticas"] },
    ],
  },
  {
    base: "cheiro_verde",
    steps: [
      { from: "cheiro_verde", to: "cheiro_verde_picante", add: ["Pimenta Malagueta"] },
      { from: "cheiro_verde_picante", to: "toque_caseiro", add: ["Fumaça em Pó"] },
    ],
  },
];
const WILDCARD_PRODUCT = "pure"; // pode ser combinado em qualquer lote com espaço sobrando

/* Capacidade de produção por lote */
const BATCH_CAPACITY = { "300": 3, "500": 2, "1000": 1 };

/* ---------- Helpers ---------- */
function getRecipe() {
  try {
    const saved = localStorage.getItem("caseirinho_recipe");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return JSON.parse(JSON.stringify(RECIPE_DEFAULT));
}
function saveRecipe(recipe) {
  localStorage.setItem("caseirinho_recipe", JSON.stringify(recipe));
}
function findProduct(prodKey) {
  for (const lineKey in MENU) {
    const line = MENU[lineKey];
    const p = line.products.find((p) => p.key === prodKey);
    if (p) return { line: lineKey, ...p };
  }
  return null;
}
function findSize(lineKey, sizeKey) {
  return MENU[lineKey].sizes.find((s) => s.key === sizeKey);
}
