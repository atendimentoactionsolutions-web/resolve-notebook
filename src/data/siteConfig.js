export const SITE_CONFIG = {
  name: "Resolve Notebook",
  tagline: "Assistência Técnica Especializada",
  slogan: "Tecnologia que te move",
  whatsappNumber: "5511988095982",
  whatsappFormatted: "(11) 98809-5982",
  phoneFormatted: "(11) 98809-5982",
  instagramUrl: "https://www.instagram.com/resolve.notebook/",
  instagramHandle: "@resolve.notebook",
  mapsUrl: "https://share.google/LUfygV4B9Dst4atvz",
  googleRating: "5,0",
  googleReviewCount: "685",
  address: "R. Santa Ifigênia, 361 - Lj 14 - Santa Ifigênia, São Paulo - SP, 01207-001",
  addressShort: "R. Santa Ifigênia, 361 – Lj 14",
  addressReference: "Localizado no Shopping 355 • Santa Ifigênia",
  openingHours: "Segunda a sexta das 9h às 18h | Sábado das 9h às 15h",
};

export const SERVICES = [
  {
    id: "limpeza",
    title: "Limpeza interna e troca de pasta térmica",
    description: "Desobstrução do cooler, remoção de poeira e aplicação de pasta térmica de alta condutividade para evitar superaquecimento.",
    icon: "Sparkles",
    categoryNumber: 2,
  },
  {
    id: "formatacao",
    title: "Formatação e instalação de Windows / macOS",
    description: "Instalação limpa do Windows 10/11 ou macOS, ativação, atualização de drivers e pacote de programas essenciais.",
    icon: "AppWindow",
    categoryNumber: 12,
  },
  {
    id: "upgrade",
    title: "Upgrade de SSD e Memória RAM",
    description: "Deixe seu notebook até 10x mais rápido com SSD NVMe de alta velocidade e expansão de memória multitarefa.",
    icon: "HardDrive",
    categoryNumber: 8,
  },
  {
    id: "tela",
    title: "Troca de tela e cabo flat",
    description: "Substituição de displays quebrados, com linhas, manchados ou sem brilho (HD, Full HD, IPS e 144Hz Gamer).",
    icon: "Monitor",
    categoryNumber: 4,
  },
  {
    id: "teclado",
    title: "Troca de teclado e touchpad",
    description: "Troca de teclados convencionais e rebitados com teclas falhando, travadas ou danificadas por derramamento de líquidos.",
    icon: "Keyboard",
    categoryNumber: 5,
  },
  {
    id: "dobradicas",
    title: "Recuperação de carcaça e dobradiças",
    description: "Reconstrução com resina acrílica estrutural, alívio de pressão e troca de tampas e molduras quebradas.",
    icon: "ShieldAlert",
    categoryNumber: 6,
  },
  {
    id: "bateria",
    title: "Troca de bateria e conector DC Jack / USB-C",
    description: "Baterias novas e originais, reparo do circuito de carga, conector DC Jack e entradas USB-C Power Delivery / MagSafe.",
    icon: "BatteryCharging",
    categoryNumber: 7,
  },
  {
    id: "placa-mae",
    title: "Reparo eletrônico de placa-mãe & BGA",
    description: "Laboratório avançado de microeletrônica: reparo de curtos em 19V, mosfets, PWM, regravação de BIOS e reballing.",
    icon: "Cpu",
    categoryNumber: 14,
  },
  {
    id: "liquidos-backup",
    title: "Danos por líquidos & Recuperação de dados",
    description: "Desoxidação química após contato com água/café e recuperação segura de arquivos em HDs e SSDs danificados.",
    icon: "Database",
    categoryNumber: 16,
  },
];

export const FEATURED_SERVICES = SERVICES;

// Complete 20 Categories Catalog
export const FULL_SERVICES_CATALOG = [
  {
    number: "01",
    title: "Diagnóstico e Avaliação Técnica",
    icon: "Stethoscope",
    items: [
      "Diagnóstico de notebook que não liga.",
      "Diagnóstico de notebook que liga, mas não apresenta imagem.",
      "Investigação de travamentos, lentidão e reinicializações.",
      "Diagnóstico de desligamentos inesperados.",
      "Testes de memória RAM, HD e SSD.",
      "Testes de bateria, carregador e alimentação.",
      "Verificação de temperaturas e desempenho.",
      "Identificação de defeitos de hardware e software."
    ]
  },
  {
    number: "02",
    title: "Limpeza e Manutenção Preventiva",
    icon: "Sparkles",
    items: [
      "Desmontagem técnica do equipamento.",
      "Limpeza interna dos componentes.",
      "Remoção de poeira das ventoinhas e dissipadores.",
      "Desobstrução das entradas e saídas de ventilação.",
      "Substituição de pasta térmica de alta condutividade.",
      "Substituição de thermal pads, quando necessária.",
      "Inspeção de cabos e conexões internas.",
      "Testes de funcionamento e temperatura após a manutenção."
    ]
  },
  {
    number: "03",
    title: "Sistema de Refrigeração",
    icon: "Wind",
    items: [
      "Troca de cooler ou ventoinha.",
      "Substituição do conjunto dissipador.",
      "Substituição do conjunto de tubos de calor (heatpipes).",
      "Diagnóstico de ruídos na refrigeração.",
      "Correção de falhas de ventilação.",
      "Diagnóstico e tratamento de superaquecimento (thermal throttling).",
      "Manutenção térmica de processador e chip gráfico."
    ]
  },
  {
    number: "04",
    title: "Tela e Imagem",
    icon: "Monitor",
    items: [
      "Troca de tela quebrada ou trincada.",
      "Substituição de painel com manchas, linhas ou falhas.",
      "Troca do conjunto completo de tela, conforme o modelo.",
      "Troca de cabo flat de vídeo.",
      "Reparo do circuito de iluminação da tela.",
      "Diagnóstico de tela piscando ou com imagem intermitente.",
      "Diagnóstico de falhas de imagem ao movimentar a tampa."
    ]
  },
  {
    number: "05",
    title: "Teclado e Touchpad",
    icon: "Keyboard",
    items: [
      "Troca de teclado convencional e rebitado.",
      "Substituição do conjunto superior com teclado integrado (palmrest).",
      "Troca de touchpad ou trackpad.",
      "Troca dos cabos e conexões do teclado e touchpad.",
      "Diagnóstico de teclas sem funcionamento.",
      "Diagnóstico de teclado digitando sozinho.",
      "Diagnóstico de touchpad sem resposta."
    ]
  },
  {
    number: "06",
    title: "Carcaça e Dobradiças",
    icon: "ShieldAlert",
    items: [
      "Recuperação de carcaça trincada ou quebrada.",
      "Reconstrução de pontos de fixação com resina estrutural.",
      "Troca de dobradiças.",
      "Ajuste e alívio de torque de dobradiças.",
      "Troca da tampa traseira da tela.",
      "Troca da moldura da tela.",
      "Troca da base inferior e apoio das mãos.",
      "Correção de peças soltas e fixações danificadas."
    ]
  },
  {
    number: "07",
    title: "Bateria e Alimentação",
    icon: "BatteryCharging",
    items: [
      "Teste de bateria e autonomia.",
      "Troca de bateria interna ou removível.",
      "Substituição urgente de bateria estufada.",
      "Diagnóstico de bateria que não carrega.",
      "Teste e substituição de carregador.",
      "Troca do conector de energia DC jack.",
      "Reparo da entrada de carregamento USB-C (Power Delivery).",
      "Reparo da entrada MagSafe em MacBooks compatíveis.",
      "Reparo do circuito de carregamento da bateria."
    ]
  },
  {
    number: "08",
    title: "Armazenamento e Memória RAM",
    icon: "HardDrive",
    items: [
      "Troca de HD mecânico antigo.",
      "Substituição de HD por SSD (até 10x mais rápido).",
      "Instalação e troca de SSD SATA.",
      "Instalação e troca de SSD NVMe de alta performance.",
      "Ampliação da capacidade de armazenamento.",
      "Instalação de segunda unidade (caddy ou M.2).",
      "Troca de memória RAM defeituosa.",
      "Expansão de memória RAM (DDR3, DDR4 e DDR5)."
    ]
  },
  {
    number: "09",
    title: "Portas, Conectores e Cabos",
    icon: "Usb",
    items: [
      "Reparo ou troca de portas USB e Type-C.",
      "Reparo ou troca de conector HDMI.",
      "Troca de conectores de fone de ouvido e microfone (P2/P3).",
      "Reparo de conectores internos soldados.",
      "Substituição de cabos flat.",
      "Reparo ou troca de placas auxiliares de conexão (sub-boards).",
      "Diagnóstico de portas que não reconhecem dispositivos.",
      "Correção de mau contato em conexões internas."
    ]
  },
  {
    number: "10",
    title: "Wi-Fi e Bluetooth",
    icon: "Wifi",
    items: [
      "Troca de placa Wi-Fi e Bluetooth.",
      "Reparo ou substituição de antenas internas.",
      "Instalação e correção de drivers de rede.",
      "Diagnóstico de conexão instável.",
      "Diagnóstico de adaptador de rede não reconhecido.",
      "Correção de falhas de conexão causadas por configuração."
    ]
  },
  {
    number: "11",
    title: "Áudio, Câmera e Microfone",
    icon: "Volume2",
    items: [
      "Troca de alto-falantes estourados ou mudos.",
      "Substituição de webcam.",
      "Troca de microfone interno.",
      "Substituição de cabos e módulos associados.",
      "Diagnóstico de notebook sem som.",
      "Diagnóstico de áudio distorcido ou com falhas.",
      "Diagnóstico de câmera ou microfone sem funcionamento."
    ]
  },
  {
    number: "12",
    title: "Sistema Operacional e Programas",
    icon: "AppWindow",
    items: [
      "Formatação e reinstalação limpa do Windows 10/11.",
      "Reinstalação do macOS em MacBooks compatíveis.",
      "Instalação e configuração de drivers de fábrica.",
      "Atualização do sistema operacional e segurança.",
      "Instalação e configuração de programas essenciais.",
      "Remoção de vírus, malware e programas espiões.",
      "Correção de falhas de inicialização.",
      "Investigação e correção de tela azul (BSOD).",
      "Otimização do sistema para inicialização rápida."
    ]
  },
  {
    number: "13",
    title: "Backup e Transferência de Dados",
    icon: "Database",
    items: [
      "Backup de arquivos seguro antes de formatação ou reparo.",
      "Transferência completa de arquivos entre notebooks.",
      "Migração de arquivos para uma nova unidade SSD.",
      "Clonagem exata de HD para SSD mantendo programas e senhas.",
      "Configuração de rotinas de backup.",
      "Recuperação lógica de arquivos apagados acidentalmente.",
      "Recuperação de dados de partições danificadas."
    ]
  },
  {
    number: "14",
    title: "Reparo Eletrônico de Placa-Mãe",
    icon: "Cpu",
    items: [
      "Diagnóstico eletrônico avançado com osciloscópio e fonte assimétrica.",
      "Localização e correção de curtos-circuitos nas linhas de tensão.",
      "Reparo dos circuitos de alimentação primários e secundários.",
      "Reparo do circuito de carga (PWM de charger).",
      "Substituição de capacitores cerâmicos e MOSFETs.",
      "Substituição de circuitos integrados (CIs) defeituosos.",
      "Recuperação de trilhas rompidas e pontos de solda.",
      "Reparo de conectores soldados na placa.",
      "Recuperação de placas com oxidação severa.",
      "Substituição completa da placa-mãe, quando necessária."
    ]
  },
  {
    number: "15",
    title: "BIOS e Firmware",
    icon: "Binary",
    items: [
      "Atualização oficial de BIOS ou UEFI.",
      "Regravação de BIOS corrompida com gravador de chip EEPROM.",
      "Recuperação após atualização malsucedida ou queda de energia.",
      "Programação de chips de firmware dedicados.",
      "Programação de controladores I/O (Super I/O) compatíveis."
    ]
  },
  {
    number: "16",
    title: "Danos por Líquidos e Oxidação",
    icon: "Droplets",
    items: [
      "Desmontagem imediata e avaliação após contato com líquidos.",
      "Limpeza técnica em cuba ultrassônica com álcool isopropílico.",
      "Desoxidação química da placa-mãe e das conexões internas.",
      "Identificação microscópica de componentes e trilhas danificados.",
      "Reparo eletrônico das áreas afetadas por curto da água.",
      "Substituição de peças comprometidas (teclado, flats, bateria).",
      "Testes prolongados de estresse e estabilidade após o reparo."
    ]
  },
  {
    number: "17",
    title: "Reparos BGA e Chip Gráfico",
    icon: "Layers",
    items: [
      "Diagnóstico de falhas em componentes soldados em matriz de esferas (BGA).",
      "Reballing profissional com esferas de solda de alta qualidade.",
      "Substituição de chip gráfico dedicado (GPU) em casos viáveis.",
      "Substituição de chipset ponte norte/sul em casos tecnicamente viáveis."
    ]
  },
  {
    number: "18",
    title: "Recuperação Avançada de Dados",
    icon: "FileSearch",
    items: [
      "Recuperação de dados de HD com falha física ou clique da morte.",
      "Recuperação de dados de SSD com falha no controlador eletrônico.",
      "Tratamento de falhas de firmware da unidade de armazenamento.",
      "Leitura de unidades com equipamentos de bancada especializados.",
      "Transferência segura dos dados resgatados para outra mídia."
    ]
  },
  {
    number: "19",
    title: "Manutenção de Notebooks Antigos",
    icon: "History",
    items: [
      "Troca ou adaptação de unidade de CD/DVD.",
      "Manutenção do sistema de iluminação de telas com inversor (CCFL).",
      "Substituição de componentes e barramentos de gerações anteriores.",
      "Manutenção e revitalização condicionada à disponibilidade de peças."
    ]
  },
  {
    number: "20",
    title: "Suporte Técnico Complementar",
    icon: "Headphones",
    items: [
      "Atendimento remoto para resolução ágil de problemas de software.",
      "Configuração de contas de e-mail e programas profissionais.",
      "Instalação e configuração de impressoras e periféricos.",
      "Ajustes de segurança, antivírus e firewall do sistema.",
      "Configuração de ferramentas de trabalho home office e escritório.",
      "Orientação personalizada de uso, conservação e autonomia de bateria."
    ]
  }
];

export const PRODUCTS = [
  {
    id: "notebooks",
    title: "Notebooks",
    subtitle: "Diversas marcas e configurações",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop",
    btnText: "Ver modelos",
    whatsappMsg: "Olá! Gostaria de ver os modelos de notebooks disponíveis para compra na Resolve Notebook.",
  },
  {
    id: "ssd",
    title: "SSD NVMe e SATA",
    subtitle: "Mais velocidade para o seu notebook",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=800&auto=format&fit=crop",
    btnText: "Ver produtos",
    whatsappMsg: "Olá! Gostaria de consultar preços e opções de SSDs para o meu notebook.",
  },
  {
    id: "ram",
    title: "Memória RAM",
    subtitle: "DDR3, DDR4 e DDR5 para notebook",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=800&auto=format&fit=crop",
    btnText: "Ver produtos",
    whatsappMsg: "Olá! Quero fazer upgrade de memória RAM no meu notebook. Quais opções vocês têm?",
  },
  {
    id: "acessorios",
    title: "Acessórios",
    subtitle: "Tudo para o seu notebook",
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=800&auto=format&fit=crop",
    btnText: "Ver produtos",
    whatsappMsg: "Olá! Gostaria de ver os acessórios para notebook disponíveis na loja.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Carlos M.",
    role: "Cliente Verificado no Google",
    text: "Excelente atendimento, serviço de qualidade e muito profissionais. Trocaram a tela e recuperaram a carcaça do meu Dell. Recomendo de olhos fechados!",
    stars: 5,
  },
  {
    name: "Fernanda S.",
    role: "Cliente Verificado no Google",
    text: "Meu notebook molhou com café e não ligava mais. Fizeram a desoxidação e reparo na placa-mãe. Voltou a funcionar como novo. Atendimento honesto e nota 10!",
    stars: 5,
  },
  {
    name: "Ricardo T.",
    role: "Cliente Verificado no Google",
    text: "Melhor assistência técnica da Santa Ifigênia. Fizeram upgrade de SSD NVMe e limpeza interna em menos de 2 horas. Confiança, preço justo e competência!",
    stars: 5,
  },
];
