// ─── Types ──────────────────────────────────────────────────────────────────

export interface PictionaryWord {
  es: string;
  zh: string;
  pinyin: string;
  category: string;
  tip?: string;
}

export interface TriviaQuestion {
  id: number;
  category: string;
  question: { es: string; zh: string };
  options: { es: string; zh: string }[];
  correctIndex: number;
  explanation: { es: string; zh: string };
  timerSeconds: number;
}

export interface MemoryPair {
  es: string;
  zh: string;
  pinyin: string;
  deck: string;
}

export interface MemoryCard {
  id: number;
  pairId: number;
  lang: 'es' | 'zh';
  text: string;
  pinyin: string;
  isMatched: boolean;
}

export interface TruthDareCard {
  id: number;
  type: 'truth' | 'dare';
  es: string;
  zh: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuickPhrase {
  emoji: string;
  es: string;
  zh: string;
  pinyin: string;
  category: string;
}

// ─── PICTIONARY DATA ────────────────────────────────────────────────────────

export const pictionaryWords: PictionaryWord[] = [
  // ── Animales (25) ──
  { es: 'Perro', zh: '狗', pinyin: 'gǒu', category: 'Animales' },
  { es: 'Gato', zh: '猫', pinyin: 'māo', category: 'Animales' },
  { es: 'Leon', zh: '狮子', pinyin: 'shīzi', category: 'Animales' },
  { es: 'Elefante', zh: '大象', pinyin: 'dàxiàng', category: 'Animales' },
  { es: 'Mariposa', zh: '蝴蝶', pinyin: 'húdié', category: 'Animales' },
  { es: 'Pinguino', zh: '企鹅', pinyin: "qǐ'é", category: 'Animales' },
  { es: 'Jirafa', zh: '长颈鹿', pinyin: 'chángjǐnglù', category: 'Animales' },
  { es: 'Cocodrilo', zh: '鳄鱼', pinyin: 'èyú', category: 'Animales' },
  { es: 'Panda', zh: '熊猫', pinyin: 'xióngmāo', category: 'Animales' },
  { es: 'Flamenco', zh: '火烈鸟', pinyin: 'huǒlièniǎo', category: 'Animales' },
  { es: 'Pulpo', zh: '章鱼', pinyin: 'zhāngyú', category: 'Animales' },
  { es: 'Canguro', zh: '袋鼠', pinyin: 'dàishǔ', category: 'Animales' },
  { es: 'Loro', zh: '鹦鹉', pinyin: 'yīngwǔ', category: 'Animales' },
  { es: 'Tortuga', zh: '乌龟', pinyin: 'wūguī', category: 'Animales' },
  { es: 'Caballo', zh: '马', pinyin: 'mǎ', category: 'Animales' },
  { es: 'Rana', zh: '青蛙', pinyin: 'qīngwā', category: 'Animales' },
  { es: 'Tiburon', zh: '鲨鱼', pinyin: 'shāyú', category: 'Animales' },
  { es: 'Buho', zh: '猫头鹰', pinyin: 'māotóuyīng', category: 'Animales' },
  { es: 'Zorro', zh: '狐狸', pinyin: 'húli', category: 'Animales' },
  { es: 'Camello', zh: '骆驼', pinyin: 'luòtuo', category: 'Animales' },
  { es: 'Delfin', zh: '海豚', pinyin: 'hǎitún', category: 'Animales' },
  { es: 'Oso polar', zh: '北极熊', pinyin: 'běijíxióng', category: 'Animales' },
  { es: 'Murcielago', zh: '蝙蝠', pinyin: 'biānfú', category: 'Animales' },
  { es: 'Pavo real', zh: '孔雀', pinyin: 'kǒngquè', category: 'Animales' },
  { es: 'Lobo', zh: '狼', pinyin: 'láng', category: 'Animales' },

  // ── Comida y Bebida (25) ──
  { es: 'Pizza', zh: '比萨', pinyin: 'bǐsà', category: 'Comida y Bebida' },
  { es: 'Sushi', zh: '寿司', pinyin: 'shòusī', category: 'Comida y Bebida' },
  { es: 'Helado', zh: '冰淇淋', pinyin: 'bīngqílín', category: 'Comida y Bebida' },
  { es: 'Tacos', zh: '玉米饼', pinyin: 'yùmǐbǐng', category: 'Comida y Bebida' },
  { es: 'Ramen', zh: '拉面', pinyin: 'lāmiàn', category: 'Comida y Bebida' },
  { es: 'Hamburguesa', zh: '汉堡', pinyin: 'hànbǎo', category: 'Comida y Bebida' },
  { es: 'Manzana', zh: '苹果', pinyin: 'píngguǒ', category: 'Comida y Bebida' },
  { es: 'Sandia', zh: '西瓜', pinyin: 'xīguā', category: 'Comida y Bebida' },
  { es: 'Arroz', zh: '米饭', pinyin: 'mǐfàn', category: 'Comida y Bebida' },
  { es: 'Te', zh: '茶', pinyin: 'chá', category: 'Comida y Bebida' },
  { es: 'Cafe', zh: '咖啡', pinyin: 'kāfēi', category: 'Comida y Bebida' },
  { es: 'Chocolate', zh: '巧克力', pinyin: 'qiǎokèlì', category: 'Comida y Bebida' },
  { es: 'Empanada', zh: '馅饼', pinyin: 'xiànbǐng', category: 'Comida y Bebida' },
  { es: 'Dim Sum', zh: '点心', pinyin: 'diǎnxīn', category: 'Comida y Bebida' },
  { es: 'Durian', zh: '榴莲', pinyin: 'liúlián', category: 'Comida y Bebida' },
  { es: 'Ceviche', zh: '柠檬腌鱼', pinyin: 'níngméng ānyú', category: 'Comida y Bebida' },
  { es: 'Wonton', zh: '馄饨', pinyin: 'húntun', category: 'Comida y Bebida' },
  { es: 'Churros', zh: '吉事果', pinyin: 'jíshìguǒ', category: 'Comida y Bebida' },
  { es: 'Mango', zh: '芒果', pinyin: 'mángguǒ', category: 'Comida y Bebida' },
  { es: 'Fresa', zh: '草莓', pinyin: 'cǎoméi', category: 'Comida y Bebida' },
  { es: 'Naranja', zh: '橙子', pinyin: 'chéngzi', category: 'Comida y Bebida' },
  { es: 'Pastel', zh: '蛋糕', pinyin: 'dàngāo', category: 'Comida y Bebida' },
  { es: 'Fideos', zh: '面条', pinyin: 'miàntiáo', category: 'Comida y Bebida' },
  { es: 'Tofu', zh: '豆腐', pinyin: 'dòufu', category: 'Comida y Bebida' },
  { es: 'Pollo', zh: '鸡肉', pinyin: 'jīròu', category: 'Comida y Bebida' },

  // ── Objetos Cotidianos (25) ──
  { es: 'Paraguas', zh: '雨伞', pinyin: 'yǔsǎn', category: 'Objetos Cotidianos' },
  { es: 'Tijeras', zh: '剪刀', pinyin: 'jiǎndāo', category: 'Objetos Cotidianos' },
  { es: 'Reloj', zh: '钟', pinyin: 'zhōng', category: 'Objetos Cotidianos' },
  { es: 'Bicicleta', zh: '自行车', pinyin: 'zìxíngchē', category: 'Objetos Cotidianos' },
  { es: 'Telefono', zh: '手机', pinyin: 'shǒujī', category: 'Objetos Cotidianos' },
  { es: 'Llave', zh: '钥匙', pinyin: 'yàoshi', category: 'Objetos Cotidianos' },
  { es: 'Mochila', zh: '背包', pinyin: 'bēibāo', category: 'Objetos Cotidianos' },
  { es: 'Espejo', zh: '镜子', pinyin: 'jìngzi', category: 'Objetos Cotidianos' },
  { es: 'Sombrero', zh: '帽子', pinyin: 'màozi', category: 'Objetos Cotidianos' },
  { es: 'Avion', zh: '飞机', pinyin: 'fēijī', category: 'Objetos Cotidianos' },
  { es: 'Barco', zh: '船', pinyin: 'chuán', category: 'Objetos Cotidianos' },
  { es: 'Tren', zh: '火车', pinyin: 'huǒchē', category: 'Objetos Cotidianos' },
  { es: 'Cama', zh: '床', pinyin: 'chuáng', category: 'Objetos Cotidianos' },
  { es: 'Silla', zh: '椅子', pinyin: 'yǐzi', category: 'Objetos Cotidianos' },
  { es: 'Lampara', zh: '灯', pinyin: 'dēng', category: 'Objetos Cotidianos' },
  { es: 'Pelota', zh: '球', pinyin: 'qiú', category: 'Objetos Cotidianos' },
  { es: 'Guitarra', zh: '吉他', pinyin: 'jítā', category: 'Objetos Cotidianos' },
  { es: 'Piano', zh: '钢琴', pinyin: 'gāngqín', category: 'Objetos Cotidianos' },
  { es: 'Libro', zh: '书', pinyin: 'shū', category: 'Objetos Cotidianos' },
  { es: 'Globo', zh: '气球', pinyin: 'qìqiú', category: 'Objetos Cotidianos' },
  { es: 'Cohete', zh: '火箭', pinyin: 'huǒjiàn', category: 'Objetos Cotidianos' },
  { es: 'Castillo', zh: '城堡', pinyin: 'chéngbǎo', category: 'Objetos Cotidianos' },
  { es: 'Arbol', zh: '树', pinyin: 'shù', category: 'Objetos Cotidianos' },
  { es: 'Montana', zh: '山', pinyin: 'shān', category: 'Objetos Cotidianos' },
  { es: 'Playa', zh: '海滩', pinyin: 'hǎitān', category: 'Objetos Cotidianos' },

  // ── Acciones y Verbos (20) ──
  { es: 'Bailar', zh: '跳舞', pinyin: 'tiàowǔ', category: 'Acciones y Verbos' },
  { es: 'Correr', zh: '跑步', pinyin: 'pǎobù', category: 'Acciones y Verbos' },
  { es: 'Dormir', zh: '睡觉', pinyin: 'shuìjiào', category: 'Acciones y Verbos' },
  { es: 'Cocinar', zh: '做饭', pinyin: 'zuòfàn', category: 'Acciones y Verbos' },
  { es: 'Nadar', zh: '游泳', pinyin: 'yóuyǒng', category: 'Acciones y Verbos' },
  { es: 'Saltar', zh: '跳', pinyin: 'tiào', category: 'Acciones y Verbos' },
  { es: 'Leer', zh: '读书', pinyin: 'dúshū', category: 'Acciones y Verbos' },
  { es: 'Cantar', zh: '唱歌', pinyin: 'chànggē', category: 'Acciones y Verbos' },
  { es: 'Volar', zh: '飞', pinyin: 'fēi', category: 'Acciones y Verbos' },
  { es: 'Llorar', zh: '哭', pinyin: 'kū', category: 'Acciones y Verbos' },
  { es: 'Reir', zh: '笑', pinyin: 'xiào', category: 'Acciones y Verbos' },
  { es: 'Abrazar', zh: '拥抱', pinyin: 'yōngbào', category: 'Acciones y Verbos' },
  { es: 'Fotografiar', zh: '拍照', pinyin: 'pāizhào', category: 'Acciones y Verbos' },
  { es: 'Escalar', zh: '爬山', pinyin: 'páshān', category: 'Acciones y Verbos' },
  { es: 'Pescar', zh: '钓鱼', pinyin: 'diàoyú', category: 'Acciones y Verbos' },
  { es: 'Pelear', zh: '打架', pinyin: 'dǎjià', category: 'Acciones y Verbos' },
  { es: 'Meditar', zh: '冥想', pinyin: 'míngxiǎng', category: 'Acciones y Verbos' },
  { es: 'Aplaudir', zh: '鼓掌', pinyin: 'gǔzhǎng', category: 'Acciones y Verbos' },
  { es: 'Senalar', zh: '指', pinyin: 'zhǐ', category: 'Acciones y Verbos' },
  { es: 'Escribir', zh: '写字', pinyin: 'xiězì', category: 'Acciones y Verbos' },

  // ── Lugares (20) ──
  { es: 'Hospital', zh: '医院', pinyin: 'yīyuàn', category: 'Lugares' },
  { es: 'Escuela', zh: '学校', pinyin: 'xuéxiào', category: 'Lugares' },
  { es: 'Supermercado', zh: '超市', pinyin: 'chāoshì', category: 'Lugares' },
  { es: 'Aeropuerto', zh: '机场', pinyin: 'jīchǎng', category: 'Lugares' },
  { es: 'Biblioteca', zh: '图书馆', pinyin: 'túshūguǎn', category: 'Lugares' },
  { es: 'Estadio', zh: '体育场', pinyin: 'tǐyùchǎng', category: 'Lugares' },
  { es: 'Templo', zh: '寺庙', pinyin: 'sìmiào', category: 'Lugares' },
  { es: 'Piramide', zh: '金字塔', pinyin: 'jīnzìtǎ', category: 'Lugares' },
  { es: 'Faro', zh: '灯塔', pinyin: 'dēngtǎ', category: 'Lugares' },
  { es: 'Volcan', zh: '火山', pinyin: 'huǒshān', category: 'Lugares' },
  { es: 'Cascada', zh: '瀑布', pinyin: 'pùbù', category: 'Lugares' },
  { es: 'Desierto', zh: '沙漠', pinyin: 'shāmò', category: 'Lugares' },
  { es: 'Iglesia', zh: '教堂', pinyin: 'jiàotáng', category: 'Lugares' },
  { es: 'Banco', zh: '银行', pinyin: 'yínháng', category: 'Lugares' },
  { es: 'Parque', zh: '公园', pinyin: 'gōngyuán', category: 'Lugares' },
  { es: 'Playa', zh: '海滩', pinyin: 'hǎitān', category: 'Lugares' },
  { es: 'Selva', zh: '丛林', pinyin: 'cónglín', category: 'Lugares' },
  { es: 'Cueva', zh: '洞穴', pinyin: 'dòngxué', category: 'Lugares' },
  { es: 'Fabrica', zh: '工厂', pinyin: 'gōngchǎng', category: 'Lugares' },
  { es: 'Farmacia', zh: '药店', pinyin: 'yàodiàn', category: 'Lugares' },

  // ── Emociones y Conceptos (15) ──
  { es: 'Amor', zh: '爱', pinyin: 'ài', category: 'Emociones y Conceptos' },
  { es: 'Miedo', zh: '恐惧', pinyin: 'kǒngjù', category: 'Emociones y Conceptos' },
  { es: 'Sorpresa', zh: '惊喜', pinyin: 'jīngxǐ', category: 'Emociones y Conceptos' },
  { es: 'Aburrimiento', zh: '无聊', pinyin: 'wúliáo', category: 'Emociones y Conceptos' },
  { es: 'Celos', zh: '嫉妒', pinyin: 'jídù', category: 'Emociones y Conceptos' },
  { es: 'Orgullo', zh: '骄傲', pinyin: "jiāo'ào", category: 'Emociones y Conceptos' },
  { es: 'Nostalgia', zh: '怀念', pinyin: 'huáiniàn', category: 'Emociones y Conceptos' },
  { es: 'Esperanza', zh: '希望', pinyin: 'xīwàng', category: 'Emociones y Conceptos' },
  { es: 'Soledad', zh: '孤独', pinyin: 'gūdú', category: 'Emociones y Conceptos' },
  { es: 'Libertad', zh: '自由', pinyin: 'zìyóu', category: 'Emociones y Conceptos' },
  { es: 'Paz', zh: '和平', pinyin: 'hépíng', category: 'Emociones y Conceptos' },
  { es: 'Sueno', zh: '梦', pinyin: 'mèng', category: 'Emociones y Conceptos' },
  { es: 'Magia', zh: '魔法', pinyin: 'mófǎ', category: 'Emociones y Conceptos' },
  { es: 'Aventura', zh: '冒险', pinyin: 'màoxiǎn', category: 'Emociones y Conceptos' },
  { es: 'Amistad', zh: '友谊', pinyin: 'yǒuyì', category: 'Emociones y Conceptos' },

  // ── Dificiles (12) ──
  { es: 'Procrastinar', zh: '拖延', pinyin: 'tuōyán', category: 'Dificiles' },
  { es: 'Democracia', zh: '民主', pinyin: 'mínzhǔ', category: 'Dificiles' },
  { es: 'Gravedad', zh: '重力', pinyin: 'zhònglì', category: 'Dificiles' },
  { es: 'Algoritmo', zh: '算法', pinyin: 'suànfǎ', category: 'Dificiles' },
  { es: 'Nostalgia', zh: '怀旧', pinyin: 'huáijiù', category: 'Dificiles' },
  { es: 'Caos', zh: '混乱', pinyin: 'hùnluàn', category: 'Dificiles' },
  { es: 'Destino', zh: '命运', pinyin: 'mìngyùn', category: 'Dificiles' },
  { es: 'Infinito', zh: '无限', pinyin: 'wúxiàn', category: 'Dificiles' },
  { es: 'Paradoja', zh: '悖论', pinyin: 'bèilùn', category: 'Dificiles' },
  { es: 'Transparencia', zh: '透明度', pinyin: 'tòumíngdù', category: 'Dificiles' },
  { es: 'Resonancia', zh: '共鸣', pinyin: 'gòngmíng', category: 'Dificiles' },
  { es: 'Eclipse', zh: '日食', pinyin: 'rìshí', category: 'Dificiles' },
];

// ─── TRIVIA DATA ────────────────────────────────────────────────────────────

export const triviaQuestions: TriviaQuestion[] = [
  // ── Cultura General (8) ──
  {
    id: 1,
    category: 'Cultura General',
    question: { es: '¿Cuantos colores tiene el arcoiris?', zh: '彩虹有几种颜色？' },
    options: [
      { es: '5', zh: '5' },
      { es: '6', zh: '6' },
      { es: '7', zh: '7' },
      { es: '8', zh: '8' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El arcoiris tiene 7 colores',
      zh: '彩虹有7种颜色：红、橙、黄、绿、蓝、靛、紫。',
    },
    timerSeconds: 15,
  },
  {
    id: 2,
    category: 'Cultura General',
    question: { es: '¿Cual es el animal mas rapido?', zh: '世界上跑得最快的动物是什么？' },
    options: [
      { es: 'Guepardo', zh: '猎豹' },
      { es: 'Leon', zh: '狮子' },
      { es: 'Aguila', zh: '鹰' },
      { es: 'Antilope', zh: '羚羊' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'El guepardo alcanza 110-120 km/h',
      zh: '猎豹的速度可达110-120公里/小时。',
    },
    timerSeconds: 15,
  },
  {
    id: 3,
    category: 'Cultura General',
    question: { es: '¿Que planeta es el mas grande?', zh: '太阳系中最大的行星是哪个？' },
    options: [
      { es: 'Saturno', zh: '土星' },
      { es: 'Jupiter', zh: '木星' },
      { es: 'Urano', zh: '天王星' },
      { es: 'Neptuno', zh: '海王星' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Jupiter es el planeta mas grande del sistema solar',
      zh: '木星是太阳系中最大的行星。',
    },
    timerSeconds: 15,
  },
  {
    id: 4,
    category: 'Cultura General',
    question: { es: '¿Cuantos continentes tiene la Tierra?', zh: '地球有几个大洲？' },
    options: [
      { es: '5', zh: '5' },
      { es: '6', zh: '6' },
      { es: '7', zh: '7' },
      { es: '8', zh: '8' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'La Tierra tiene 7 continentes',
      zh: '地球有7个大洲。',
    },
    timerSeconds: 15,
  },
  {
    id: 5,
    category: 'Cultura General',
    question: { es: '¿Que instrumento tiene 88 teclas?', zh: '哪种乐器有88个键？' },
    options: [
      { es: 'Organo', zh: '管风琴' },
      { es: 'Piano', zh: '钢琴' },
      { es: 'Acordeon', zh: '手风琴' },
      { es: 'Xilofono', zh: '木琴' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El piano tiene 88 teclas',
      zh: '钢琴有88个键。',
    },
    timerSeconds: 15,
  },
  {
    id: 6,
    category: 'Cultura General',
    question: { es: '¿Cuantos lados tiene un hexagono?', zh: '六边形有几条边？' },
    options: [
      { es: '4', zh: '4' },
      { es: '5', zh: '5' },
      { es: '6', zh: '6' },
      { es: '8', zh: '8' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Un hexagono tiene 6 lados',
      zh: '六边形有6条边。',
    },
    timerSeconds: 15,
  },
  {
    id: 7,
    category: 'Cultura General',
    question: { es: '¿Cual es el idioma mas hablado?', zh: '世界上使用人数最多的语言是什么？' },
    options: [
      { es: 'Ingles', zh: '英语' },
      { es: 'Espanol', zh: '西班牙语' },
      { es: 'Mandarin', zh: '普通话' },
      { es: 'Hindi', zh: '印地语' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El mandarin es el idioma mas hablado del mundo por numero de hablantes nativos',
      zh: '按母语使用人数计算，普通话是世界上使用人数最多的语言。',
    },
    timerSeconds: 15,
  },
  {
    id: 8,
    category: 'Cultura General',
    question: { es: '¿Que gas respiramos principalmente?', zh: '我们主要呼吸什么气体？' },
    options: [
      { es: 'Oxigeno', zh: '氧气' },
      { es: 'Nitrogeno', zh: '氮气' },
      { es: 'CO2', zh: '二氧化碳' },
      { es: 'Helio', zh: '氦气' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'La atmosfera es 78% nitrogeno',
      zh: '大气层中78%是氮气。',
    },
    timerSeconds: 15,
  },

  // ── Cultura China (8) ──
  {
    id: 9,
    category: 'Cultura China',
    question: { es: '¿Cuantos anos dura el zodiaco chino?', zh: '中国生肖一个轮回有几年？' },
    options: [
      { es: '10', zh: '10' },
      { es: '12', zh: '12' },
      { es: '14', zh: '14' },
      { es: '16', zh: '16' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El zodiaco chino tiene un ciclo de 12 anos',
      zh: '中国生肖有12年一个轮回。',
    },
    timerSeconds: 15,
  },
  {
    id: 10,
    category: 'Cultura China',
    question: { es: '¿Cual es la Gran Muralla China?', zh: '长城是什么？' },
    options: [
      { es: 'Un rio', zh: '一条河' },
      { es: 'Muralla defensiva', zh: '防御城墙' },
      { es: 'Palacio', zh: '一座宫殿' },
      { es: 'Montana', zh: '一座山' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'La Gran Muralla es una muralla defensiva historica',
      zh: '长城是一座历史性的防御城墙。',
    },
    timerSeconds: 15,
  },
  {
    id: 11,
    category: 'Cultura China',
    question: { es: '¿Que color simboliza buena suerte en China?', zh: '在中国什么颜色象征好运？' },
    options: [
      { es: 'Azul', zh: '蓝色' },
      { es: 'Blanco', zh: '白色' },
      { es: 'Rojo', zh: '红色' },
      { es: 'Negro', zh: '黑色' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El rojo simboliza buena suerte y prosperidad en China',
      zh: '红色在中国象征好运和繁荣。',
    },
    timerSeconds: 15,
  },
  {
    id: 12,
    category: 'Cultura China',
    question: { es: '¿Cuantas provincias tiene China?', zh: '中国有多少个省？' },
    options: [
      { es: '23', zh: '23' },
      { es: '28', zh: '28' },
      { es: '34', zh: '34' },
      { es: '40', zh: '40' },
    ],
    correctIndex: 0,
    explanation: {
      es: 'China tiene 23 provincias',
      zh: '中国有23个省。',
    },
    timerSeconds: 15,
  },
  {
    id: 13,
    category: 'Cultura China',
    question: { es: '¿Que animal es simbolo nacional de China?', zh: '什么动物是中国的国家象征？' },
    options: [
      { es: 'Tigre', zh: '老虎' },
      { es: 'Dragon', zh: '龙' },
      { es: 'Panda', zh: '熊猫' },
      { es: 'Grulla', zh: '仙鹤' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El dragon es el simbolo nacional de China',
      zh: '龙是中国的国家象征。',
    },
    timerSeconds: 15,
  },
  {
    id: 14,
    category: 'Cultura China',
    question: { es: '¿Como se llama la moneda de China?', zh: '中国的官方货币叫什么？' },
    options: [
      { es: 'Won', zh: '韩元' },
      { es: 'Yen', zh: '日元' },
      { es: 'Yuan', zh: '人民币元' },
      { es: 'Dong', zh: '越南盾' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'La moneda oficial de China es el yuan (renminbi)',
      zh: '中国的官方货币是人民币元。',
    },
    timerSeconds: 15,
  },
  {
    id: 15,
    category: 'Cultura China',
    question: { es: '¿En que ano fue fundada la RPC?', zh: '中华人民共和国成立于哪一年？' },
    options: [
      { es: '1945', zh: '1945' },
      { es: '1949', zh: '1949' },
      { es: '1952', zh: '1952' },
      { es: '1960', zh: '1960' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'La Republica Popular China fue fundada en 1949',
      zh: '中华人民共和国成立于1949年。',
    },
    timerSeconds: 15,
  },
  {
    id: 16,
    category: 'Cultura China',
    question: { es: '¿Que es el Feng Shui?', zh: '风水是什么？' },
    options: [
      { es: 'Comida', zh: '一种食物' },
      { es: 'Arte marcial', zh: '武术' },
      { es: 'Armonia espacial', zh: '空间和谐的实践' },
      { es: 'Deporte', zh: '传统运动' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El Feng Shui es la practica de armonia espacial',
      zh: '风水是一种空间和谐的实践。',
    },
    timerSeconds: 15,
  },

  // ── Cultura Latinoamericana (7) ──
  {
    id: 17,
    category: 'Cultura Latinoamericana',
    question: { es: '¿En que pais esta Machu Picchu?', zh: '马丘比丘在哪个国家？' },
    options: [
      { es: 'Colombia', zh: '哥伦比亚' },
      { es: 'Ecuador', zh: '厄瓜多尔' },
      { es: 'Peru', zh: '秘鲁' },
      { es: 'Bolivia', zh: '玻利维亚' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Machu Picchu esta en Peru',
      zh: '马丘比丘在秘鲁。',
    },
    timerSeconds: 15,
  },
  {
    id: 18,
    category: 'Cultura Latinoamericana',
    question: { es: '¿Cual es el rio mas largo de Sudamerica?', zh: '南美洲最长的河流是什么？' },
    options: [
      { es: 'Orinoco', zh: '奥里诺科河' },
      { es: 'Parana', zh: '巴拉那河' },
      { es: 'Amazonas', zh: '亚马逊河' },
      { es: 'Magdalena', zh: '马格达莱纳河' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El Amazonas es el rio mas largo de Sudamerica',
      zh: '亚马逊河是南美洲最长的河流。',
    },
    timerSeconds: 15,
  },
  {
    id: 19,
    category: 'Cultura Latinoamericana',
    question: { es: '¿Que baile es originario de Argentina?', zh: '探戈起源于哪个国家？' },
    options: [
      { es: 'Samba', zh: '桑巴' },
      { es: 'Tango', zh: '探戈' },
      { es: 'Salsa', zh: '萨尔萨' },
      { es: 'Cumbia', zh: '昆比亚' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El tango es originario de Argentina',
      zh: '探戈起源于阿根廷。',
    },
    timerSeconds: 15,
  },
  {
    id: 20,
    category: 'Cultura Latinoamericana',
    question: { es: '¿Capital de Peru?', zh: '秘鲁的首都是什么？' },
    options: [
      { es: 'Cusco', zh: '库斯科' },
      { es: 'Lima', zh: '利马' },
      { es: 'Arequipa', zh: '阿雷基帕' },
      { es: 'Trujillo', zh: '特鲁希略' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Lima es la capital de Peru',
      zh: '利马是秘鲁的首都。',
    },
    timerSeconds: 15,
  },
  {
    id: 21,
    category: 'Cultura Latinoamericana',
    question: { es: '¿Que civilizacion construyo Machu Picchu?', zh: '哪个文明建造了马丘比丘？' },
    options: [
      { es: 'Maya', zh: '玛雅' },
      { es: 'Azteca', zh: '阿兹特克' },
      { es: 'Inca', zh: '印加' },
      { es: 'Olmeca', zh: '奥尔梅克' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Los Incas construyeron Machu Picchu',
      zh: '印加文明建造了马丘比丘。',
    },
    timerSeconds: 15,
  },
  {
    id: 22,
    category: 'Cultura Latinoamericana',
    question: { es: '¿Comida mas famosa de Peru?', zh: '秘鲁最著名的食物叫什么？' },
    options: [
      { es: 'Tacos', zh: '玉米饼' },
      { es: 'Ceviche', zh: '柠檬腌鱼' },
      { es: 'Asado', zh: '烤肉' },
      { es: 'Feijoada', zh: '黑豆炖肉' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El ceviche es la comida mas famosa de Peru',
      zh: '柠檬腌鱼是秘鲁最著名的食物。',
    },
    timerSeconds: 15,
  },
  {
    id: 23,
    category: 'Cultura Latinoamericana',
    question: { es: '¿Que es la chicha morada?', zh: '紫玉米汁是什么？' },
    options: [
      { es: 'Baile', zh: '一种舞蹈' },
      { es: 'Bebida peruana', zh: '秘鲁玉米饮料' },
      { es: 'Sombrero', zh: '一种帽子' },
      { es: 'Deporte', zh: '一种运动' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'La chicha morada es una bebida peruana hecha de maiz morado',
      zh: '紫玉米汁是一种用紫玉米制成的秘鲁饮料。',
    },
    timerSeconds: 15,
  },

  // ── Ciencia y Naturaleza (6) ──
  {
    id: 24,
    category: 'Ciencia y Naturaleza',
    question: { es: '¿Cuantos huesos tiene el cuerpo humano adulto?', zh: '成人人体有多少块骨头？' },
    options: [
      { es: '186', zh: '186' },
      { es: '206', zh: '206' },
      { es: '226', zh: '226' },
      { es: '246', zh: '246' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El cuerpo humano adulto tiene 206 huesos',
      zh: '成人人体有206块骨头。',
    },
    timerSeconds: 15,
  },
  {
    id: 25,
    category: 'Ciencia y Naturaleza',
    question: { es: '¿Que planeta es el "planeta rojo"?', zh: '哪个星球被称为"红色星球"？' },
    options: [
      { es: 'Venus', zh: '金星' },
      { es: 'Marte', zh: '火星' },
      { es: 'Jupiter', zh: '木星' },
      { es: 'Saturno', zh: '土星' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Marte es conocido como el planeta rojo',
      zh: '火星被称为红色星球。',
    },
    timerSeconds: 15,
  },
  {
    id: 26,
    category: 'Ciencia y Naturaleza',
    question: { es: '¿Que organo produce insulina?', zh: '哪个器官产生胰岛素？' },
    options: [
      { es: 'Higado', zh: '肝脏' },
      { es: 'Rinon', zh: '肾脏' },
      { es: 'Pancreas', zh: '胰腺' },
      { es: 'Bazo', zh: '脾脏' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El pancreas produce insulina',
      zh: '胰腺产生胰岛素。',
    },
    timerSeconds: 15,
  },
  {
    id: 27,
    category: 'Ciencia y Naturaleza',
    question: { es: '¿A que velocidad viaja la luz?', zh: '光的传播速度是多少？' },
    options: [
      { es: '150,000 km/s', zh: '150,000公里/秒' },
      { es: '200,000 km/s', zh: '200,000公里/秒' },
      { es: '300,000 km/s', zh: '300,000公里/秒' },
      { es: '400,000 km/s', zh: '400,000公里/秒' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'La luz viaja a aproximadamente 300,000 km/s',
      zh: '光的传播速度约为300,000公里/秒。',
    },
    timerSeconds: 15,
  },
  {
    id: 28,
    category: 'Ciencia y Naturaleza',
    question: { es: '¿Cuantas capas tiene la Tierra?', zh: '地球有几层结构？' },
    options: [
      { es: '2', zh: '2' },
      { es: '3', zh: '3' },
      { es: '4', zh: '4' },
      { es: '5', zh: '5' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'La Tierra tiene 4 capas: corteza, manto, nucleo externo y nucleo interno',
      zh: '地球有4层结构：地壳、地幔、外核和内核。',
    },
    timerSeconds: 15,
  },
  {
    id: 29,
    category: 'Ciencia y Naturaleza',
    question: { es: '¿Que energia produce un panel solar?', zh: '太阳能板产生哪种能量？' },
    options: [
      { es: 'Nuclear', zh: '核能' },
      { es: 'Electrica', zh: '电能' },
      { es: 'Eolica', zh: '风能' },
      { es: 'Hidraulica', zh: '水力能' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Los paneles solares producen energia electrica',
      zh: '太阳能板产生电能。',
    },
    timerSeconds: 15,
  },

  // ── Entretenimiento (5) ──
  {
    id: 30,
    category: 'Entretenimiento',
    question: { es: '¿En que pais se origino K-Pop?', zh: 'K-Pop起源于哪个国家？' },
    options: [
      { es: 'Japon', zh: '日本' },
      { es: 'China', zh: '中国' },
      { es: 'Corea del Sur', zh: '韩国' },
      { es: 'Tailandia', zh: '泰国' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'El K-Pop se origino en Corea del Sur',
      zh: 'K-Pop起源于韩国。',
    },
    timerSeconds: 15,
  },
  {
    id: 31,
    category: 'Entretenimiento',
    question: { es: '¿Cuantas peliculas de Harry Potter?', zh: '哈利·波特系列有几部电影？' },
    options: [
      { es: '6', zh: '6' },
      { es: '7', zh: '7' },
      { es: '8', zh: '8' },
      { es: '9', zh: '9' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Hay 8 peliculas de Harry Potter',
      zh: '哈利·波特系列有8部电影。',
    },
    timerSeconds: 15,
  },
  {
    id: 32,
    category: 'Entretenimiento',
    question: { es: '¿Juego de mesa para conectar 4?', zh: '哪个棋盘游戏要连接4个同色棋子？' },
    options: [
      { es: 'Ajedrez', zh: '国际象棋' },
      { es: 'Conecta 4', zh: '四子棋' },
      { es: 'Damas', zh: '跳棋' },
      { es: 'Parchis', zh: '飞行棋' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'Conecta 4 es el juego donde debes conectar 4 fichas del mismo color',
      zh: '四子棋是需要连接4个同色棋子的游戏。',
    },
    timerSeconds: 15,
  },
  {
    id: 33,
    category: 'Entretenimiento',
    question: { es: '¿Cuantos jugadores en equipo futbol?', zh: '足球场上一队有几名球员？' },
    options: [
      { es: '9', zh: '9' },
      { es: '10', zh: '10' },
      { es: '11', zh: '11' },
      { es: '12', zh: '12' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Un equipo de futbol tiene 11 jugadores en el campo',
      zh: '足球场上一队有11名球员。',
    },
    timerSeconds: 15,
  },
  {
    id: 34,
    category: 'Entretenimiento',
    question: { es: '¿Que pais invento los Juegos Olimpicos?', zh: '现代奥运会起源于哪个国家？' },
    options: [
      { es: 'Italia', zh: '意大利' },
      { es: 'Francia', zh: '法国' },
      { es: 'Grecia', zh: '希腊' },
      { es: 'Gran Bretana', zh: '英国' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Los Juegos Olimpicos se originaron en Grecia',
      zh: '奥运会起源于希腊。',
    },
    timerSeconds: 15,
  },

  // ── Preguntas Relampago 5s (6) ──
  {
    id: 35,
    category: 'Preguntas Relampago',
    question: { es: '¿7x8?', zh: '7乘以8等于多少？' },
    options: [
      { es: '54', zh: '54' },
      { es: '56', zh: '56' },
      { es: '58', zh: '58' },
      { es: '60', zh: '60' },
    ],
    correctIndex: 1,
    explanation: {
      es: '7 x 8 = 56',
      zh: '7乘以8等于56。',
    },
    timerSeconds: 5,
  },
  {
    id: 36,
    category: 'Preguntas Relampago',
    question: { es: '¿Color del cielo de dia?', zh: '晴天的天空是什么颜色？' },
    options: [
      { es: 'Verde', zh: '绿色' },
      { es: 'Azul', zh: '蓝色' },
      { es: 'Gris', zh: '灰色' },
      { es: 'Amarillo', zh: '黄色' },
    ],
    correctIndex: 1,
    explanation: {
      es: 'El cielo es azul durante el dia',
      zh: '晴天的天空是蓝色的。',
    },
    timerSeconds: 5,
  },
  {
    id: 37,
    category: 'Preguntas Relampago',
    question: { es: '¿Patas de una arana?', zh: '蜘蛛有几条腿？' },
    options: [
      { es: '4', zh: '4' },
      { es: '6', zh: '6' },
      { es: '8', zh: '8' },
      { es: '10', zh: '10' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Las aranas tienen 8 patas',
      zh: '蜘蛛有8条腿。',
    },
    timerSeconds: 5,
  },
  {
    id: 38,
    category: 'Preguntas Relampago',
    question: { es: '¿Que viene despues del invierno?', zh: '冬天之后是什么季节？' },
    options: [
      { es: 'Verano', zh: '夏天' },
      { es: 'Otono', zh: '秋天' },
      { es: 'Primavera', zh: '春天' },
      { es: 'Otro invierno', zh: '又是冬天' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Despues del invierno viene la primavera',
      zh: '冬天之后是春天。',
    },
    timerSeconds: 5,
  },
  {
    id: 39,
    category: 'Preguntas Relampago',
    question: { es: '¿Cuantos dias tiene una semana?', zh: '一周有几天？' },
    options: [
      { es: '5', zh: '5' },
      { es: '6', zh: '6' },
      { es: '7', zh: '7' },
      { es: '8', zh: '8' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'Una semana tiene 7 dias',
      zh: '一周有7天。',
    },
    timerSeconds: 5,
  },
  {
    id: 40,
    category: 'Preguntas Relampago',
    question: { es: '¿Color de la hierba?', zh: '草是什么颜色的？' },
    options: [
      { es: 'Amarillo', zh: '黄色' },
      { es: 'Azul', zh: '蓝色' },
      { es: 'Verde', zh: '绿色' },
      { es: 'Rojo', zh: '红色' },
    ],
    correctIndex: 2,
    explanation: {
      es: 'La hierba es verde',
      zh: '草是绿色的。',
    },
    timerSeconds: 5,
  },
];

// ─── MEMORY DATA ────────────────────────────────────────────────────────────

export const memoryPairs: MemoryPair[] = [
  // ── Deck 1: Animales del mundo (16 pairs) ──
  { es: 'Panda', zh: '熊猫', pinyin: 'xióngmāo', deck: 'Animales del mundo' },
  { es: 'Dragon', zh: '龙', pinyin: 'lóng', deck: 'Animales del mundo' },
  { es: 'Mariposa', zh: '蝴蝶', pinyin: 'húdié', deck: 'Animales del mundo' },
  { es: 'Tigre', zh: '老虎', pinyin: 'lǎohǔ', deck: 'Animales del mundo' },
  { es: 'Delfin', zh: '海豚', pinyin: 'hǎitún', deck: 'Animales del mundo' },
  { es: 'Condor', zh: '秃鹫', pinyin: 'tūjiù', deck: 'Animales del mundo' },
  { es: 'Serpiente', zh: '蛇', pinyin: 'shé', deck: 'Animales del mundo' },
  { es: 'Oso', zh: '熊', pinyin: 'xióng', deck: 'Animales del mundo' },
  { es: 'Aguila', zh: '鹰', pinyin: 'yīng', deck: 'Animales del mundo' },
  { es: 'Camello', zh: '骆驼', pinyin: 'luòtuo', deck: 'Animales del mundo' },
  { es: 'Cisne', zh: '天鹅', pinyin: "tiān'é", deck: 'Animales del mundo' },
  { es: 'Lobo', zh: '狼', pinyin: 'láng', deck: 'Animales del mundo' },
  { es: 'Pulpo', zh: '章鱼', pinyin: 'zhāngyú', deck: 'Animales del mundo' },
  { es: 'Koala', zh: '树熊', pinyin: 'shùxióng', deck: 'Animales del mundo' },
  { es: 'Pinguino', zh: '企鹅', pinyin: "qǐ'é", deck: 'Animales del mundo' },
  { es: 'Loro', zh: '鹦鹉', pinyin: 'yīngwǔ', deck: 'Animales del mundo' },

  // ── Deck 2: Colores y Formas (16 pairs) ──
  { es: 'Rojo', zh: '红色', pinyin: 'hóngsè', deck: 'Colores y Formas' },
  { es: 'Azul', zh: '蓝色', pinyin: 'lánsè', deck: 'Colores y Formas' },
  { es: 'Amarillo', zh: '黄色', pinyin: 'huángsè', deck: 'Colores y Formas' },
  { es: 'Verde', zh: '绿色', pinyin: 'lǜsè', deck: 'Colores y Formas' },
  { es: 'Morado', zh: '紫色', pinyin: 'zǐsè', deck: 'Colores y Formas' },
  { es: 'Naranja', zh: '橙色', pinyin: 'chéngsè', deck: 'Colores y Formas' },
  { es: 'Rosa', zh: '粉色', pinyin: 'fěnsè', deck: 'Colores y Formas' },
  { es: 'Negro', zh: '黑色', pinyin: 'hēisè', deck: 'Colores y Formas' },
  { es: 'Blanco', zh: '白色', pinyin: 'báisè', deck: 'Colores y Formas' },
  { es: 'Gris', zh: '灰色', pinyin: 'huīsè', deck: 'Colores y Formas' },
  { es: 'Circulo', zh: '圆形', pinyin: 'yuánxíng', deck: 'Colores y Formas' },
  { es: 'Triangulo', zh: '三角形', pinyin: 'sānjiǎoxíng', deck: 'Colores y Formas' },
  { es: 'Cuadrado', zh: '正方形', pinyin: 'zhèngfāngxíng', deck: 'Colores y Formas' },
  { es: 'Estrella', zh: '星形', pinyin: 'xīngxíng', deck: 'Colores y Formas' },
  { es: 'Corazon', zh: '心形', pinyin: 'xīnxíng', deck: 'Colores y Formas' },
  { es: 'Diamante', zh: '菱形', pinyin: 'língxíng', deck: 'Colores y Formas' },

  // ── Deck 3: Familia y Personas (16 pairs) ──
  { es: 'Mama', zh: '妈妈', pinyin: 'māmā', deck: 'Familia y Personas' },
  { es: 'Papa', zh: '爸爸', pinyin: 'bàba', deck: 'Familia y Personas' },
  { es: 'Abuela', zh: '奶奶', pinyin: 'nǎinai', deck: 'Familia y Personas' },
  { es: 'Abuelo', zh: '爷爷', pinyin: 'yéye', deck: 'Familia y Personas' },
  { es: 'Hermana', zh: '姐姐', pinyin: 'jiějie', deck: 'Familia y Personas' },
  { es: 'Hermano', zh: '哥哥', pinyin: 'gēge', deck: 'Familia y Personas' },
  { es: 'Amiga', zh: '朋友', pinyin: 'péngyou', deck: 'Familia y Personas' },
  { es: 'Bebe', zh: '婴儿', pinyin: "yīng'ér", deck: 'Familia y Personas' },
  { es: 'Maestra', zh: '老师', pinyin: 'lǎoshī', deck: 'Familia y Personas' },
  { es: 'Doctor', zh: '医生', pinyin: 'yīshēng', deck: 'Familia y Personas' },
  { es: 'Chef', zh: '厨师', pinyin: 'chúshī', deck: 'Familia y Personas' },
  { es: 'Artista', zh: '艺术家', pinyin: 'yìshùjiā', deck: 'Familia y Personas' },
  { es: 'Novia', zh: '女朋友', pinyin: 'nǚpéngyou', deck: 'Familia y Personas' },
  { es: 'Novio', zh: '男朋友', pinyin: 'nánpéngyou', deck: 'Familia y Personas' },
  { es: 'Vecino', zh: '邻居', pinyin: 'línjū', deck: 'Familia y Personas' },
  { es: 'Jefe', zh: '老板', pinyin: 'lǎobǎn', deck: 'Familia y Personas' },

  // ── Deck 4: Comida Asiatica y Latina (16 pairs) ──
  { es: 'Sushi', zh: '寿司', pinyin: 'shòusī', deck: 'Comida Asiatica y Latina' },
  { es: 'Ramen', zh: '拉面', pinyin: 'lāmiàn', deck: 'Comida Asiatica y Latina' },
  { es: 'Dim Sum', zh: '点心', pinyin: 'diǎnxīn', deck: 'Comida Asiatica y Latina' },
  { es: 'Tofu', zh: '豆腐', pinyin: 'dòufu', deck: 'Comida Asiatica y Latina' },
  { es: 'Pho', zh: '越南河粉', pinyin: 'yuènán hépěn', deck: 'Comida Asiatica y Latina' },
  { es: 'Dumplings', zh: '饺子', pinyin: 'jiǎozi', deck: 'Comida Asiatica y Latina' },
  { es: 'Ceviche', zh: '柠檬腌鱼', pinyin: 'níngméng ānyú', deck: 'Comida Asiatica y Latina' },
  { es: 'Empanada', zh: '馅饼', pinyin: 'xiànbǐng', deck: 'Comida Asiatica y Latina' },
  { es: 'Caldo', zh: '汤', pinyin: 'tāng', deck: 'Comida Asiatica y Latina' },
  { es: 'Arroz', zh: '米饭', pinyin: 'mǐfàn', deck: 'Comida Asiatica y Latina' },
  { es: 'Mochi', zh: '麻薯', pinyin: 'máshǔ', deck: 'Comida Asiatica y Latina' },
  { es: 'Tapioca', zh: '木薯粉', pinyin: 'mùshǔfěn', deck: 'Comida Asiatica y Latina' },
  { es: 'Churros', zh: '吉事果', pinyin: 'jíshìguǒ', deck: 'Comida Asiatica y Latina' },
  { es: 'Tamales', zh: '玉米粽', pinyin: 'yùmǐzòng', deck: 'Comida Asiatica y Latina' },
  { es: 'Mapo Tofu', zh: '麻婆豆腐', pinyin: 'mápó dòufu', deck: 'Comida Asiatica y Latina' },
  { es: 'Lomo Saltado', zh: '翻炒牛肉', pinyin: 'fānchǎo niúròu', deck: 'Comida Asiatica y Latina' },

  // ── Deck 5: Emociones y Sentimientos (16 pairs) ──
  { es: 'Feliz', zh: '快乐', pinyin: 'kuàilè', deck: 'Emociones y Sentimientos' },
  { es: 'Triste', zh: '伤心', pinyin: 'shāngxīn', deck: 'Emociones y Sentimientos' },
  { es: 'Enojada', zh: '生气', pinyin: 'shēngqì', deck: 'Emociones y Sentimientos' },
  { es: 'Asustada', zh: '害怕', pinyin: 'hàipà', deck: 'Emociones y Sentimientos' },
  { es: 'Sorprendida', zh: '惊讶', pinyin: 'jīngyà', deck: 'Emociones y Sentimientos' },
  { es: 'Emocionada', zh: '兴奋', pinyin: 'xīngfèn', deck: 'Emociones y Sentimientos' },
  { es: 'Aburrida', zh: '无聊', pinyin: 'wúliáo', deck: 'Emociones y Sentimientos' },
  { es: 'Nerviosa', zh: '紧张', pinyin: 'jǐnzhāng', deck: 'Emociones y Sentimientos' },
  { es: 'Orgullosa', zh: '骄傲', pinyin: "jiāo'ào", deck: 'Emociones y Sentimientos' },
  { es: 'Avergonzada', zh: '害羞', pinyin: 'hàixiū', deck: 'Emociones y Sentimientos' },
  { es: 'Confundida', zh: '困惑', pinyin: 'kùnhuò', deck: 'Emociones y Sentimientos' },
  { es: 'Cansada', zh: '累', pinyin: 'lèi', deck: 'Emociones y Sentimientos' },
  { es: 'Relajada', zh: '放松', pinyin: 'fàngsōng', deck: 'Emociones y Sentimientos' },
  { es: 'Celosa', zh: '嫉妒', pinyin: 'jídù', deck: 'Emociones y Sentimientos' },
  { es: 'Enamorada', zh: '恋爱中', pinyin: "liàn'àizhōng", deck: 'Emociones y Sentimientos' },
  { es: 'Nostalgica', zh: '怀旧', pinyin: 'huáijiù', deck: 'Emociones y Sentimientos' },

  // ── Deck 6: Naturaleza y Clima (16 pairs) ──
  { es: 'Sol', zh: '太阳', pinyin: 'tàiyáng', deck: 'Naturaleza y Clima' },
  { es: 'Luna', zh: '月亮', pinyin: 'yuèliàng', deck: 'Naturaleza y Clima' },
  { es: 'Estrella', zh: '星星', pinyin: 'xīngxīng', deck: 'Naturaleza y Clima' },
  { es: 'Lluvia', zh: '雨', pinyin: 'yǔ', deck: 'Naturaleza y Clima' },
  { es: 'Nieve', zh: '雪', pinyin: 'xuě', deck: 'Naturaleza y Clima' },
  { es: 'Viento', zh: '风', pinyin: 'fēng', deck: 'Naturaleza y Clima' },
  { es: 'Arcoiris', zh: '彩虹', pinyin: 'cǎihóng', deck: 'Naturaleza y Clima' },
  { es: 'Trueno', zh: '雷', pinyin: 'léi', deck: 'Naturaleza y Clima' },
  { es: 'Tornado', zh: '龙卷风', pinyin: 'lóngjuǎnfēng', deck: 'Naturaleza y Clima' },
  { es: 'Oceano', zh: '海洋', pinyin: 'hǎiyáng', deck: 'Naturaleza y Clima' },
  { es: 'Montana', zh: '山', pinyin: 'shān', deck: 'Naturaleza y Clima' },
  { es: 'Desierto', zh: '沙漠', pinyin: 'shāmò', deck: 'Naturaleza y Clima' },
  { es: 'Bosque', zh: '森林', pinyin: 'sēnlín', deck: 'Naturaleza y Clima' },
  { es: 'Rio', zh: '河流', pinyin: 'héliú', deck: 'Naturaleza y Clima' },
  { es: 'Volcan', zh: '火山', pinyin: 'huǒshān', deck: 'Naturaleza y Clima' },
  { es: 'Cascada', zh: '瀑布', pinyin: 'pùbù', deck: 'Naturaleza y Clima' },
];

// ─── TRUTH OR DARE DATA ─────────────────────────────────────────────────────

export const truthDareCards: TruthDareCard[] = [
  // ── Truth cards (35) ──
  { id: 1, type: 'truth', es: '¿Cual es tu mayor miedo secreto?', zh: '你最大的秘密恐惧是什么？', difficulty: 'easy' },
  { id: 2, type: 'truth', es: '¿Cual fue tu crush mas ridiculo?', zh: '你最荒唐的暗恋对象是谁？', difficulty: 'medium' },
  { id: 3, type: 'truth', es: '¿Que habito tuyo te da verguenza?', zh: '你有什么令自己尴尬的习惯？', difficulty: 'medium' },
  { id: 4, type: 'truth', es: '¿Alguna vez mentiste para evitar reunion social?', zh: '你有没有为了逃避社交活动而撒谎？', difficulty: 'easy' },
  { id: 5, type: 'truth', es: '¿Cosa mas estupida por amor?', zh: '你为了爱情做过最蠢的事是什么？', difficulty: 'hard' },
  { id: 6, type: 'truth', es: '¿A quien envidias mas?', zh: '你最嫉妒谁？为什么？', difficulty: 'hard' },
  { id: 7, type: 'truth', es: '¿Cancion favorita que te da verguenza?', zh: '有什么歌是你喜欢但不好意思承认的？', difficulty: 'easy' },
  { id: 8, type: 'truth', es: '¿Sueno romantico con alguien inesperado?', zh: '你有没有梦到过出乎意料的人的浪漫梦境？', difficulty: 'hard' },
  { id: 9, type: 'truth', es: '¿Peor regalo recibido?', zh: '你收到过最糟糕的礼物是什么？', difficulty: 'easy' },
  { id: 10, type: 'truth', es: '¿Trampa en juego o examen?', zh: '你有没有在游戏或考试中作弊？', difficulty: 'medium' },
  { id: 11, type: 'truth', es: '¿Que harias con un millon en 24h?', zh: '如果你有24小时内必须花掉一百万美元，你会怎么做？', difficulty: 'easy' },
  { id: 12, type: 'truth', es: '¿Meme que mas te describe?', zh: '哪个表情包最能描述你？', difficulty: 'easy' },
  { id: 13, type: 'truth', es: '¿Recuerdo mas vergonzoso de la infancia?', zh: '你童年最尴尬的记忆是什么？', difficulty: 'medium' },
  { id: 14, type: 'truth', es: '¿Has buscado a tu ex en Google?', zh: '你最近有没有谷歌过你的前任？', difficulty: 'medium' },
  { id: 15, type: 'truth', es: '¿Mentira mas convincente?', zh: '你说过的最令人信服的谎言是什么？', difficulty: 'hard' },
  { id: 16, type: 'truth', es: '¿Primero que haces al despertar?', zh: '你醒来第一件事是什么？', difficulty: 'easy' },
  { id: 17, type: 'truth', es: '¿Guilty pleasure de comida?', zh: '你最罪恶的美食享受是什么？', difficulty: 'easy' },
  { id: 18, type: 'truth', es: '¿Leer la mente de quien?', zh: '如果你能读心术，你想读谁的心？', difficulty: 'medium' },
  { id: 19, type: 'truth', es: '¿Cuanto sin ducharte?', zh: '如果没人发现，你最久能多久不洗澡？', difficulty: 'medium' },
  { id: 20, type: 'truth', es: '¿Talento oculto mas raro?', zh: '你最奇特的隐藏才能是什么？', difficulty: 'easy' },
  { id: 21, type: 'truth', es: '¿Serie vista mas de 3 veces?', zh: '你看过超过3遍的是哪部剧或电影？', difficulty: 'easy' },
  { id: 22, type: 'truth', es: '¿Mensaje al contacto equivocado?', zh: '你有没有把消息发给了错误的人？', difficulty: 'medium' },
  { id: 23, type: 'truth', es: '¿Compra impulsiva mas cara?', zh: '你最冲动的高价消费是什么？', difficulty: 'medium' },
  { id: 24, type: 'truth', es: '¿Supersticion secreta?', zh: '你有没有别人不知道的迷信习惯？', difficulty: 'medium' },
  { id: 25, type: 'truth', es: '¿Consejo que das pero no sigues?', zh: '你经常给别人却从不自己遵守的建议是什么？', difficulty: 'hard' },
  { id: 26, type: 'truth', es: '¿Que harias si fueras invisible?', zh: '如果你有一天隐身，你会做什么？', difficulty: 'easy' },
  { id: 27, type: 'truth', es: '¿Mayor arrepentimiento 5 anos?', zh: '你过去5年最大的遗憾是什么？', difficulty: 'hard' },
  { id: 28, type: 'truth', es: '¿App secreta en tu telefono?', zh: '你手机里有什么别人不知道的APP？', difficulty: 'medium' },
  { id: 29, type: 'truth', es: '¿Si te queda un ano de vida?', zh: '如果你只有一年可活，你会改变什么？', difficulty: 'hard' },
  { id: 30, type: 'truth', es: '¿Mensaje a persona famosa?', zh: '你给过的最有名的人发过消息吗？', difficulty: 'medium' },
  { id: 31, type: 'truth', es: '¿Opinion real de redes sociales?', zh: '你对社交媒体真实的看法是什么？', difficulty: 'medium' },
  { id: 32, type: 'truth', es: '¿Tipo de persona con quien nunca saldrias?', zh: '你绝对无法接受的恋爱对象类型是什么？', difficulty: 'medium' },
  { id: 33, type: 'truth', es: '¿Momento que mas te reiste?', zh: '你什么时候笑得最停不下来？', difficulty: 'easy' },
  { id: 34, type: 'truth', es: '¿Apodo que solo usa tu familia?', zh: '你有只有家人叫的昵称吗？', difficulty: 'easy' },
  { id: 35, type: 'truth', es: '¿Nota a tu propia cocina?', zh: '你给自己的厨艺打几分（满分10分）？', difficulty: 'easy' },

  // ── Dare cards (35) ──
  { id: 36, type: 'dare', es: 'Imita animal 30 segundos', zh: '模仿一种动物30秒不停', difficulty: 'easy' },
  { id: 37, type: 'dare', es: 'Canta coro en chino o espanol', zh: '唱一首中文歌的副歌（如果你是朋友，就唱西班牙语歌）', difficulty: 'medium' },
  { id: 38, type: 'dare', es: 'Pose de superheroe 10 segundos', zh: '摆出超级英雄的姿势保持10秒', difficulty: 'easy' },
  { id: 39, type: 'dare', es: 'Alfabeto al reves rapido', zh: '尽快倒着说字母表', difficulty: 'medium' },
  { id: 40, type: 'dare', es: 'Baila 30 segundos sin musica', zh: '无音乐跳舞30秒', difficulty: 'easy' },
  { id: 41, type: 'dare', es: 'Escribe nombre con mano no dominante', zh: '用不常用的手写下你的全名', difficulty: 'easy' },
  { id: 42, type: 'dare', es: '10 flexiones o 20 sentadillas', zh: '做10个俯卧撑或20个深蹲', difficulty: 'medium' },
  { id: 43, type: 'dare', es: 'Di 5 palabras en chino/espanol', zh: '不借助工具说5个中文单词（或西班牙语）', difficulty: 'medium' },
  { id: 44, type: 'dare', es: 'Imita cantante favorito 20s', zh: '模仿你最喜欢的歌手20秒', difficulty: 'easy' },
  { id: 45, type: 'dare', es: 'Describe tu dia con mimica', zh: '只用手势和哑剧描述你今天的一天', difficulty: 'medium' },
  { id: 46, type: 'dare', es: 'Sonido de 5 animales en 10s', zh: '10秒内模仿5种不同动物的叫声', difficulty: 'easy' },
  { id: 47, type: 'dare', es: 'Muestra ultima foto del telefono', zh: '展示你手机里最后一张照片', difficulty: 'hard' },
  { id: 48, type: 'dare', es: 'Di algo bonito en idioma de la otra', zh: '用对方的语言说一句夸奖她的话', difficulty: 'medium' },
  { id: 49, type: 'dare', es: 'Foto para Instagram story ahora', zh: '现在拍一张照片发故事', difficulty: 'hard' },
  { id: 50, type: 'dare', es: 'Comercial de shampoo', zh: '表演一个洗发水广告', difficulty: 'easy' },
  { id: 51, type: 'dare', es: 'Autorretrato en 60 segundos', zh: '60秒内画一张自画像', difficulty: 'medium' },
  { id: 52, type: 'dare', es: 'Intenta lamer tu codo', zh: '尝试舔你的肘部（剧透：不可能）', difficulty: 'easy' },
  { id: 53, type: 'dare', es: 'Chiste malo', zh: '讲一个冷笑话。越冷越好', difficulty: 'easy' },
  { id: 54, type: 'dare', es: 'Acento exagerado 2 minutos', zh: '接下来2分钟用夸张的口音说话', difficulty: 'medium' },
  { id: 55, type: 'dare', es: 'Reaccion de ganar loteria', zh: '表演你中彩票时的反应', difficulty: 'easy' },
  { id: 56, type: 'dare', es: 'Rima con tu nombre', zh: '用你的名字即兴创作一首押韵诗', difficulty: 'medium' },
  { id: 57, type: 'dare', es: 'Reverencia japonesa elegante', zh: '做一个优雅的日式鞠躬', difficulty: 'easy' },
  { id: 58, type: 'dare', es: 'Trabalenguas 5 veces rapido', zh: '快速说5遍"西红柿炒鸡蛋"', difficulty: 'medium' },
  { id: 59, type: 'dare', es: 'Emoji mas usado del mes', zh: '展示你这个月用得最多的表情', difficulty: 'easy' },
  { id: 60, type: 'dare', es: 'Audio gracioso a un contacto', zh: '给联系人发一段有趣的语音消息', difficulty: 'hard' },
  { id: 61, type: 'dare', es: 'Yoga pose arbol 30 segundos', zh: '保持瑜伽树式30秒', difficulty: 'medium' },
  { id: 62, type: 'dare', es: 'Robot por 1 minuto', zh: '像机器人一样行动整整1分钟', difficulty: 'easy' },
  { id: 63, type: 'dare', es: 'Describe comida favorita como poema', zh: '像写诗一样描述你最喜欢的食物的味道', difficulty: 'medium' },
  { id: 64, type: 'dare', es: 'Presentador de noticias', zh: '表演你作为新闻主播会是什么样', difficulty: 'easy' },
  { id: 65, type: 'dare', es: 'Inventa palabra nueva', zh: '发明一个新词并解释它的意思', difficulty: 'medium' },
  { id: 66, type: 'dare', es: 'Mini clase de cocina 1 minuto', zh: '用1分钟上一堂你最喜欢的菜的迷你烹饪课', difficulty: 'medium' },
  { id: 67, type: 'dare', es: 'Cara cuando ves arana', zh: '展示你看到蜘蛛时的表情', difficulty: 'easy' },
  { id: 68, type: 'dare', es: 'Escena de pelicula de accion', zh: '无声表演一段动作片场景', difficulty: 'medium' },
  { id: 69, type: 'dare', es: 'Telefono de familiar de memoria', zh: '尝试默背家人的电话号码', difficulty: 'medium' },
  { id: 70, type: 'dare', es: 'Baile del robot camara lenta', zh: '慢动作表演机器人舞', difficulty: 'easy' },
];

// ─── QUICK PHRASES DATA ─────────────────────────────────────────────────────

export const quickPhrases: QuickPhrase[] = [
  { emoji: '👉', es: '¡Te toca!', zh: '轮到你了！', pinyin: 'Lún dào nǐ le!', category: 'Turno' },
  { emoji: '🎉', es: '¡Gane!', zh: '我赢了！', pinyin: 'Wǒ yíng le!', category: 'Victoria' },
  { emoji: '👏', es: '¡Muy bien!', zh: '很好！', pinyin: 'Hěn hǎo!', category: 'Elogio' },
  { emoji: '🤝', es: 'Bien jugado', zh: '打得好', pinyin: 'Dǎ de hǎo', category: 'Elogio' },
  { emoji: '🔥', es: '¡Estas en racha!', zh: '你很厉害！', pinyin: 'Nǐ hěn lìhài!', category: 'Elogio' },
  { emoji: '🤔', es: 'No entendi', zh: '我不明白', pinyin: 'Wǒ bù míngbái', category: 'Comunicacion' },
  { emoji: '🔁', es: '¿Puedes repetir?', zh: '能再说一遍吗？', pinyin: 'Néng zài shuō yībiàn ma?', category: 'Comunicacion' },
  { emoji: '⏸️', es: 'Un momento', zh: '等一下', pinyin: 'Děng yīxià', category: 'Comunicacion' },
  { emoji: '😂', es: 'jajajaja', zh: '哈哈哈哈', pinyin: 'Hāhāhāhā', category: 'Emocion' },
  { emoji: '😅', es: '¡Que dificil!', zh: '太难了！', pinyin: 'Tài nán le!', category: 'Emocion' },
  { emoji: '🙈', es: '¡Me da verguenza!', zh: '好尴尬！', pinyin: 'Hǎo gāngà!', category: 'Emocion' },
  { emoji: '🤯', es: '¡No lo puedo creer!', zh: '我不敢相信！', pinyin: 'Wǒ bù gǎn xiāngxìn!', category: 'Emocion' },
  { emoji: '😤', es: '¡Trampa!', zh: '作弊！', pinyin: 'Zuòbì!', category: 'Juego' },
  { emoji: '😭', es: '¡Perdi!', zh: '我输了！', pinyin: 'Wǒ shū le!', category: 'Juego' },
  { emoji: '🚀', es: '¡Empecemos!', zh: '开始吧！', pinyin: 'Kāishǐ ba!', category: 'Juego' },
  { emoji: '😇', es: '¡Paso mi turno!', zh: '我放弃这轮！', pinyin: 'Wǒ fàngqì zhè lún!', category: 'Juego' },
  { emoji: '👀', es: '¡Te estoy mirando!', zh: '我在看着你！', pinyin: 'Wǒ zài kànzhe nǐ!', category: 'Juego' },
  { emoji: '⏰', es: '¡Se acabo el tiempo!', zh: '时间到！', pinyin: 'Shíjiān dào!', category: 'Juego' },
  { emoji: '💃', es: '¡Bailemos!', zh: '我们跳舞吧！', pinyin: 'Wǒmen tiàowǔ ba!', category: 'Diversion' },
  { emoji: '📸', es: '¡Saca foto!', zh: '拍照！', pinyin: 'Pāizhào!', category: 'Diversion' },
  { emoji: '🎵', es: '¿Puedes cantar eso?', zh: '你能唱出来吗？', pinyin: 'Nǐ néng chàng chūlái ma?', category: 'Diversion' },
  { emoji: '🍕', es: 'Tengo hambre', zh: '我饿了', pinyin: 'Wǒ è le', category: 'Cotidiano' },
  { emoji: '☕', es: '¿Quieres tomar algo?', zh: '要喝点什么吗？', pinyin: 'Yào hē diǎn shénme ma?', category: 'Cotidiano' },
  { emoji: '😴', es: 'Estoy cansada', zh: '我累了', pinyin: 'Wǒ lèi le', category: 'Cotidiano' },
  { emoji: '🌙', es: '¿Seguimos manana?', zh: '明天继续吗？', pinyin: 'Míngtiān jìxù ma?', category: 'Cotidiano' },
  { emoji: '❤️', es: 'Te quiero, amiga', zh: '我爱你，朋友', pinyin: 'Wǒ ài nǐ, péngyou', category: 'Afecto' },
  { emoji: '🤗', es: '¡Te mando un abrazo!', zh: '给你一个拥抱！', pinyin: 'Gěi nǐ yīgè yōngbào!', category: 'Afecto' },
  { emoji: '🎂', es: '¡Feliz cumpleanos!', zh: '生日快乐！', pinyin: 'Shēngrì kuàilè!', category: 'Especial' },
  { emoji: '🥳', es: '¡Vamos a celebrar!', zh: '我们来庆祝吧！', pinyin: 'Wǒmen lái qìngzhù ba!', category: 'Especial' },
  { emoji: '🤐', es: 'No puedo decirlo', zh: '我不能说', pinyin: 'Wǒ bù néng shuō', category: 'Verdad o Reto' },
  { emoji: '🙏', es: 'Por favor', zh: '请', pinyin: 'Qǐng', category: 'Cortesia' },
  { emoji: '✅', es: '¡Correcto!', zh: '正确！', pinyin: 'Zhèngquè!', category: 'Trivia' },
  { emoji: '❌', es: '¡Incorrecto!', zh: '错误！', pinyin: 'Cuòwù!', category: 'Trivia' },
  { emoji: '🎯', es: '¡Acerte!', zh: '我猜对了！', pinyin: 'Wǒ cāi duì le!', category: 'Pictionary' },
  { emoji: '🖌️', es: 'Dibuja mas grande', zh: '画大一点', pinyin: 'Huà dà yīdiǎn', category: 'Pictionary' },
];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle (in-place)
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get a random Pictionary word that hasn't been used yet.
 */
export function getRandomPictionaryWord(
  usedIndices: number[] = []
): { word: PictionaryWord; index: number } {
  const availableIndices = pictionaryWords
    .map((_, i) => i)
    .filter((i) => !usedIndices.includes(i));

  if (availableIndices.length === 0) {
    // All words used — reset and pick any
    const index = Math.floor(Math.random() * pictionaryWords.length);
    return { word: pictionaryWords[index], index };
  }

  const randomIdx = Math.floor(Math.random() * availableIndices.length);
  const index = availableIndices[randomIdx];
  return { word: pictionaryWords[index], index };
}

/**
 * Get N random trivia questions (shuffled, no repeats).
 */
export function getRandomTriviaQuestions(count: number): TriviaQuestion[] {
  const shuffled = fisherYatesShuffle(triviaQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get a shuffled memory deck: 32 cards (16 ES + 16 ZH) from the named deck.
 * Each card has: id, pairId, lang, text, pinyin, isMatched.
 */
export function getShuffledMemoryDeck(deckName: string): MemoryCard[] {
  const pairs = memoryPairs.filter((p) => p.deck === deckName);

  if (pairs.length === 0) {
    return [];
  }

  const cards: MemoryCard[] = [];
  let cardId = 0;

  pairs.forEach((pair, pairIndex) => {
    // ES card
    cards.push({
      id: cardId++,
      pairId: pairIndex,
      lang: 'es',
      text: pair.es,
      pinyin: pair.pinyin,
      isMatched: false,
    });
    // ZH card
    cards.push({
      id: cardId++,
      pairId: pairIndex,
      lang: 'zh',
      text: pair.zh,
      pinyin: pair.pinyin,
      isMatched: false,
    });
  });

  // Shuffle and reassign sequential IDs
  const shuffled = fisherYatesShuffle(cards);
  return shuffled.map((card, i) => ({ ...card, id: i }));
}

/**
 * Get a random Truth or Dare card that hasn't been used yet.
 */
export function getRandomTruthDareCard(
  type: 'truth' | 'dare',
  usedIds: number[] = []
): { card: TruthDareCard; id: number } | null {
  const available = truthDareCards.filter(
    (c) => c.type === type && !usedIds.includes(c.id)
  );

  if (available.length === 0) {
    return null;
  }

  const randomIdx = Math.floor(Math.random() * available.length);
  const card = available[randomIdx];
  return { card, id: card.id };
}

// ─── DECK NAMES (for UI listing) ────────────────────────────────────────────

export const memoryDeckNames = [
  'Animales del mundo',
  'Colores y Formas',
  'Familia y Personas',
  'Comida Asiatica y Latina',
  'Emociones y Sentimientos',
  'Naturaleza y Clima',
] as const;

export type MemoryDeckName = (typeof memoryDeckNames)[number];

// ─── EMOJI CHARADES PROMPTS ──────────────────────────────────────────────────

export interface EmojiCharadesPrompt {
  es: string;
  zh: string;
  category: string;
}

export const emojiCharadesPrompts: EmojiCharadesPrompt[] = [
  // Peliculas / 电影
  { es: 'Titanic', zh: '泰坦尼克号', category: 'Peliculas' },
  { es: 'Rey Leon', zh: '狮子王', category: 'Peliculas' },
  { es: 'Harry Potter', zh: '哈利波特', category: 'Peliculas' },
  { es: 'Frozen', zh: '冰雪奇缘', category: 'Peliculas' },
  { es: 'Batman', zh: '蝙蝠侠', category: 'Peliculas' },
  { es: 'Star Wars', zh: '星球大战', category: 'Peliculas' },
  { es: 'Buscando a Nemo', zh: '海底总动员', category: 'Peliculas' },
  { es: 'Jurassic Park', zh: '侏罗纪公园', category: 'Peliculas' },
  { es: 'Spider-Man', zh: '蜘蛛侠', category: 'Peliculas' },
  { es: 'Toy Story', zh: '玩具总动员', category: 'Peliculas' },
  // Acciones / 动作
  { es: 'Cocinar pasta', zh: '煮意大利面', category: 'Acciones' },
  { es: 'Ir al gimnasio', zh: '去健身房', category: 'Acciones' },
  { es: 'Tomar cafe', zh: '喝咖啡', category: 'Acciones' },
  { es: 'Pasear al perro', zh: '遛狗', category: 'Acciones' },
  { es: 'Ir de compras', zh: '去购物', category: 'Acciones' },
  { es: 'Ver television', zh: '看电视', category: 'Acciones' },
  { es: 'Cantar en la ducha', zh: '在淋浴时唱歌', category: 'Acciones' },
  { es: 'Dormir la siesta', zh: '午睡', category: 'Acciones' },
  { es: 'Estudiar para examen', zh: '复习考试', category: 'Acciones' },
  { es: 'Bailar salsa', zh: '跳萨尔萨舞', category: 'Acciones' },
  // Lugares / 地点
  { es: 'La playa', zh: '海滩', category: 'Lugares' },
  { es: 'El hospital', zh: '医院', category: 'Lugares' },
  { es: 'Un restaurante chino', zh: '中餐厅', category: 'Lugares' },
  { es: 'La luna', zh: '月球', category: 'Lugares' },
  { es: 'El supermercado', zh: '超市', category: 'Lugares' },
  { es: 'Una fiesta de cumpleanos', zh: '生日派对', category: 'Lugares' },
  { es: 'El aeropuerto', zh: '机场', category: 'Lugares' },
  { es: 'Un parque de diversiones', zh: '游乐园', category: 'Lugares' },
  // Situaciones / 情景
  { es: 'Llueve y no tienes paraguas', zh: '下雨了但没有伞', category: 'Situaciones' },
  { es: 'Primera cita', zh: '第一次约会', category: 'Situaciones' },
  { es: 'Perdido en otro pais', zh: '在另一个国家迷路了', category: 'Situaciones' },
  { es: 'Ganaste la loteria', zh: '中了彩票', category: 'Situaciones' },
  { es: 'Fiesta sorpresa', zh: '惊喜派对', category: 'Situaciones' },
  { es: 'Atrapado en el trafico', zh: '堵车了', category: 'Situaciones' },
  { es: 'Cocinando y se quema la comida', zh: '做饭把菜烧焦了', category: 'Situaciones' },
  { es: 'Boda en la playa', zh: '沙滩婚礼', category: 'Situaciones' },
  // Animales / 动物
  { es: 'Panda comiendo bambu', zh: '熊猫吃竹子', category: 'Animales' },
  { es: 'Gato durmiendo', zh: '猫在睡觉', category: 'Animales' },
  { es: 'Perro jugando', zh: '狗在玩耍', category: 'Animales' },
  { es: 'Tiburon en el mar', zh: '海里的鲨鱼', category: 'Animales' },
  // Comida / 食物
  { es: 'Pizza con pina', zh: '菠萝披萨', category: 'Comida' },
  { es: 'Sushi de salmon', zh: '三文鱼寿司', category: 'Comida' },
  { es: 'Helado de chocolate', zh: '巧克力冰淇淋', category: 'Comida' },
  { es: 'Tacos mexicanos', zh: '墨西哥玉米饼', category: 'Comida' },
  { es: 'Ramen caliente', zh: '热拉面', category: 'Comida' },
  { es: 'Ceviche peruano', zh: '秘鲁酸橘汁腌鱼', category: 'Comida' },
];

export function getRandomEmojiPrompt(usedIndices: number[] = []): { prompt: EmojiCharadesPrompt; index: number } {
  const available = emojiCharadesPrompts
    .map((p, i) => ({ prompt: p, index: i }))
    .filter((item) => !usedIndices.includes(item.index));
  if (available.length === 0) {
    const index = Math.floor(Math.random() * emojiCharadesPrompts.length);
    return { prompt: emojiCharadesPrompts[index], index };
  }
  const pick = available[Math.floor(Math.random() * available.length)];
  return pick;
}

export const memoryDeckLabels: Record<string, { es: string; zh: string }> = {
  'Animales del mundo': { es: 'Animales del mundo', zh: '世界动物' },
  'Colores y Formas': { es: 'Colores y Formas', zh: '颜色和形状' },
  'Familia y Personas': { es: 'Familia y Personas', zh: '家庭与人物' },
  'Comida Asiatica y Latina': { es: 'Comida Asiatica y Latina', zh: '亚洲与拉美美食' },
  'Emociones y Sentimientos': { es: 'Emociones y Sentimientos', zh: '情感与感受' },
  'Naturaleza y Clima': { es: 'Naturaleza y Clima', zh: '自然与天气' },
};
