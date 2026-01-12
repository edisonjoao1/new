/**
 * Blog Image System v5.0 - Human + Abstract Blend
 *
 * Authentic human moments + abstract AI art. Personal AND relevant.
 *
 * Design Philosophy:
 * - Real people doing real work (not generic stock poses)
 * - Developers, creators, innovators in action
 * - Diverse, authentic human subjects
 * - Mixed with abstract AI/tech visuals for variety
 * - No suits, no handshakes, no cheesy smiles
 *
 * Every image tells a story. Every person is engaged in something real.
 */

// Blend of authentic human subjects + abstract art - NO GENERIC STOCK
const CATEGORY_IMAGES: Record<string, string[]> = {
  'Tutorial': [
    // Developers coding, learning, building
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=90', // Developer at MacBook, focused
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=90', // Laptop coding close-up
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=90', // Monitor with code, atmospheric
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=90', // Matrix digital rain (abstract)
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1920&q=90', // Code pattern abstract
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1920&q=90', // Pure code on screen
    'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1920&q=90', // Developer workspace with plants
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=1920&q=90', // Night coding aesthetic
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=90', // Neural network abstract
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=90', // Team working on laptops
  ],
  'Research': [
    // Scientists, researchers, AI exploration
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=90', // AI face abstract
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=90', // Thoughtful person portrait
    'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1920&q=90', // Neural brain visualization
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&w=1920&q=90', // Abstract AI waves
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=90', // Woman with tech overlay
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1920&q=90', // Holographic abstract
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=90', // Robot portrait artistic
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1920&q=90', // Fluid abstract art
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1920&q=90', // Person with VR headset
    'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?auto=format&fit=crop&w=1920&q=90', // Robot hand reaching
  ],
  'Guide': [
    // People learning, strategizing, planning
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=90', // Team whiteboard planning
    'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?auto=format&fit=crop&w=1920&q=90', // Woman on laptop, cafe vibes
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=1920&q=90', // Iridescent gradient abstract
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=90', // Abstract 3D render
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=90', // Casual team collaboration
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=90', // Circuit pattern abstract
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1920&q=90', // Purple gradient abstract
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1920&q=90', // UX designer working
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=90', // Workshop/brainstorm
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1920&q=90', // Abstract fluid gradient
  ],
  'Business': [
    // Entrepreneurs, founders, modern work
    'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1920&q=90', // Entrepreneur at desk
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=90', // Startup team casual
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=90', // Blockchain abstract
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=90', // Earth from space data
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1920&q=90', // Woman celebrating success
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&q=90', // Confident professional woman
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=90', // Team high-five moment
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1920&q=90', // Remote work laptop
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=90', // Galaxy nebula abstract
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=90', // Trading charts
  ],
  'Case Study': [
    // Success stories, achievements, results
    'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1920&q=90', // Team achievement moment
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1920&q=90', // Fluid colorful abstract
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=90', // Portrait confident person
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=90', // Professional woman smiling
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=90', // Abstract light painting
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=1920&q=90', // Neon lights abstract
    'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=1920&q=90', // Person presenting
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1920&q=90', // Confident professional portrait
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=90', // Gradient mesh abstract
    'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1920&q=90', // Team celebrating win
  ],
  'Technical': [
    // Engineers, infrastructure, deep tech
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=90', // Circuit board macro
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=90', // Server room blue
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=90', // Network fiber optics
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1920&q=90', // Microchip close up
    'https://images.unsplash.com/photo-1573495627361-d9b87960b12d?auto=format&fit=crop&w=1920&q=90', // Engineer at server rack
    'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=1920&q=90', // Processor chip macro
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1920&q=90', // Tech pattern abstract
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=1920&q=90', // Developer night coding
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=90', // Digital lock abstract
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1920&q=90', // Coding setup moody
  ],
  'Market': [
    // Data, analytics, insights
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=90', // Data visualization
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=90', // Analytics screen
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1920&q=90', // Data charts
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1920&q=90', // World map data
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=90', // Stock market
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=90', // Blockchain
    'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1920&q=90', // NFT abstract
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=90', // Trading charts
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1920&q=90', // Analyst working
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=90', // Dashboard
  ],
  'Comparison': [
    // Decision making, choices, evaluation
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1920&q=90', // Split gradient
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=90', // Person thinking, laptop
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=1920&q=90', // Rainbow iridescent
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1920&q=90', // Abstract 3D shapes
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1920&q=90', // Gradient abstract
    'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1920&q=90', // Person choosing options
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=90', // Retro tech
    'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=1920&q=90', // Contrast abstract
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=90', // Team discussing options
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1920&q=90', // React logo
  ],
  'Company News': [
    // Announcements, milestones, celebrations
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=90', // Team celebration
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=1920&q=90', // Neon celebration
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&q=90', // Aurora abstract
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1920&q=90', // Woman celebrating
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=90', // Cosmos stars
    'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1920&q=90', // Team win moment
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=90', // Startup team
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1920&q=90', // Dark gradient glow
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=90', // Team working
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=90', // Diverse team casual
  ],
}

// Keyword-specific images - Relevant human + abstract blend
const KEYWORD_IMAGES: Record<string, string> = {
  // AI Models & Providers - Mix of AI visuals and people using AI
  'gpt': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=90',
  'gpt-5': 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1920&q=90',
  'openai': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=90',
  'chatgpt': 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&w=1920&q=90',
  'claude': 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1920&q=90',
  'anthropic': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=90',
  'gemini': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1920&q=90',
  'google ai': 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=1920&q=90',
  'llm': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=90',
  'large language': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=90',

  // Voice & Audio - Sound and speaking
  'voice': 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1920&q=90',
  'voice ai': 'https://images.unsplash.com/photo-1507908708918-778587c9e563?auto=format&fit=crop&w=1920&q=90',
  'tts': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=90',
  'whisper': 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1920&q=90',
  'speech': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=90',
  'audio': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=90',

  // AI Concepts
  'agent': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=90',
  'agents': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=90',
  'autonomous': 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?auto=format&fit=crop&w=1920&q=90',
  'mcp': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=90',
  'protocol': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=90',
  'rag': 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=90',
  'retrieval': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=90',
  'embeddings': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1920&q=90',
  'vector': 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?auto=format&fit=crop&w=1920&q=90',
  'neural': 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1920&q=90',
  'machine learning': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=90',
  'deep learning': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=90',
  'training': 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1920&q=90',
  'fine-tuning': 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?auto=format&fit=crop&w=1920&q=90',
  'prompt': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=90',
  'prompting': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=90',

  // Media Types
  'video': 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1920&q=90',
  'video analysis': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=90',
  'image': 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1920&q=90',
  'image generation': 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=1920&q=90',
  'vision': 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1920&q=90',
  'multimodal': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=90',

  // Analytics & Data
  'analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=90',
  'dashboard': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=90',
  'metrics': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1920&q=90',
  'data': 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1920&q=90',
  'database': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=90',

  // Verticals - People in context
  'pet': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1920&q=90',
  'pet health': 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1920&q=90',
  'healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=90',
  'health': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=90',
  'medical': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1920&q=90',
  'finance': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=90',
  'fintech': 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1920&q=90',
  'payments': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=90',
  'ecommerce': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=90',

  // Languages & Markets
  'spanish': 'https://images.unsplash.com/photo-1489945052260-4f21c52268b9?auto=format&fit=crop&w=1920&q=90',
  'latam': 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1920&q=90',
  'multilingual': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=90',
  'localization': 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1920&q=90',

  // Business & Scale
  'scale': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=90',
  'scaling': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=90',
  'startup': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1920&q=90',
  'enterprise': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=90',
  'roi': 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1920&q=90',
  'cost': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=90',
  'pricing': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1920&q=90',

  // Mobile & Platforms
  'app store': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&q=90',
  'ios': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&q=90',
  'android': 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=1920&q=90',
  'mobile': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1920&q=90',
  'app': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1920&q=90',
  'swiftui': 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1920&q=90',

  // Technical Concepts
  'api': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=90',
  'integration': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=90',
  'architecture': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=90',
  'multi-model': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=90',
  'routing': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=90',
  'conversation': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1920&q=90',
  'chat': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=90',
  'chatbot': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1920&q=90',
  'automation': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1920&q=90',
  'workflow': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=90',

  // Trends & News
  'trends': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1920&q=90',
  '2026': 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1920&q=90',
  'future': 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1920&q=90',
  'innovation': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1920&q=90',
}

// Category gradient colors
export const CATEGORY_GRADIENTS: Record<string, { from: string; to: string; accent: string; rgb: string }> = {
  'Tutorial': { from: 'from-violet-600', to: 'to-indigo-600', accent: 'bg-violet-500', rgb: '139, 92, 246' },
  'Research': { from: 'from-cyan-500', to: 'to-blue-600', accent: 'bg-cyan-500', rgb: '6, 182, 212' },
  'Guide': { from: 'from-emerald-500', to: 'to-teal-600', accent: 'bg-emerald-500', rgb: '16, 185, 129' },
  'Business': { from: 'from-amber-500', to: 'to-orange-600', accent: 'bg-amber-500', rgb: '245, 158, 11' },
  'Case Study': { from: 'from-rose-500', to: 'to-pink-600', accent: 'bg-rose-500', rgb: '244, 63, 94' },
  'Technical': { from: 'from-slate-600', to: 'to-zinc-700', accent: 'bg-slate-500', rgb: '71, 85, 105' },
  'Market': { from: 'from-lime-500', to: 'to-green-600', accent: 'bg-lime-500', rgb: '132, 204, 22' },
  'Comparison': { from: 'from-fuchsia-500', to: 'to-purple-600', accent: 'bg-fuchsia-500', rgb: '217, 70, 239' },
  'Company News': { from: 'from-blue-500', to: 'to-indigo-600', accent: 'bg-blue-500', rgb: '59, 130, 246' },
}

// Default fallback
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=90'

/**
 * Get the most relevant image for a blog post
 */
export function getBlogImage(
  category: string,
  keywords: string[] = [],
  slug?: string
): string {
  // First, try to match keywords
  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase()
    if (KEYWORD_IMAGES[lowerKeyword]) {
      return KEYWORD_IMAGES[lowerKeyword]
    }
    for (const [key, url] of Object.entries(KEYWORD_IMAGES)) {
      if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
        return url
      }
    }
  }

  // Fall back to category
  const categoryImages = CATEGORY_IMAGES[category]
  if (categoryImages && categoryImages.length > 0) {
    const hash = slug ? hashString(slug) : Math.random()
    const index = Math.floor(hash * categoryImages.length) % categoryImages.length
    return categoryImages[index]
  }

  return DEFAULT_IMAGE
}

/**
 * Get gradient colors for a category
 */
export function getCategoryGradient(category: string): { from: string; to: string; accent: string; rgb: string } {
  return CATEGORY_GRADIENTS[category] || { from: 'from-gray-600', to: 'to-gray-700', accent: 'bg-gray-500', rgb: '107, 114, 128' }
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) / 2147483647
}

/**
 * Get placeholder color
 */
export function getPlaceholderColor(category: string): string {
  const colors: Record<string, string> = {
    'Tutorial': '#7C3AED',
    'Research': '#06B6D4',
    'Guide': '#10B981',
    'Business': '#F59E0B',
    'Case Study': '#F43F5E',
    'Technical': '#475569',
    'Market': '#84CC16',
    'Comparison': '#D946EF',
    'Company News': '#3B82F6',
  }
  return colors[category] || '#6B7280'
}

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(baseUrl: string): string {
  const widths = [640, 1024, 1536, 1920]
  return widths
    .map(w => {
      const url = baseUrl.replace(/w=\d+/, `w=${w}`)
      return `${url} ${w}w`
    })
    .join(', ')
}

/**
 * Generate blur placeholder
 */
export function getBlurDataURL(category: string): string {
  const color = getPlaceholderColor(category).replace('#', '')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="%23${color}" width="1" height="1" opacity="0.5"/></svg>`
  return `data:image/svg+xml,${svg}`
}

/**
 * Get optimized image URL
 */
export function getOptimizedImageUrl(
  baseUrl: string,
  options: { width?: number; height?: number; quality?: number; crop?: 'entropy' | 'faces' | 'center' } = {}
): string {
  const { width = 1920, height, quality = 90, crop = 'entropy' } = options
  let url = baseUrl

  url = url.replace(/w=\d+/, `w=${width}`)
  if (height) {
    url = url.includes('&h=') ? url.replace(/h=\d+/, `h=${height}`) : `${url}&h=${height}`
  }
  url = url.replace(/q=\d+/, `q=${quality}`)
  if (!url.includes('crop=')) {
    url = `${url}&crop=${crop}`
  }

  return url
}

/**
 * Image configs for different contexts
 */
export const IMAGE_CONFIGS = {
  hero: { width: 1920, height: 1080, quality: 90, sizes: '100vw' },
  card: { width: 800, height: 500, quality: 85, sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' },
  thumbnail: { width: 400, height: 250, quality: 80, sizes: '(max-width: 768px) 50vw, 200px' },
  featured: { width: 1200, height: 675, quality: 90, sizes: '(max-width: 1024px) 100vw, 50vw' },
} as const

/**
 * Aspect ratio classes
 */
export function getAspectRatioClass(format: 'hero' | 'card' | 'square' | 'wide'): string {
  const ratios = { hero: 'aspect-[16/9]', card: 'aspect-[16/10]', square: 'aspect-square', wide: 'aspect-[21/9]' }
  return ratios[format] || 'aspect-[16/10]'
}

/**
 * Preload props
 */
export function getPreloadImageProps(url: string): {
  rel: 'preload'; as: 'image'; href: string; imageSrcSet: string; imageSizes: string
} {
  return { rel: 'preload', as: 'image', href: url, imageSrcSet: generateSrcSet(url), imageSizes: '100vw' }
}

/**
 * Error fallback SVG
 */
export function getErrorFallbackImage(category: string): string {
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS['Research']
  const colorMap: Record<string, string> = {
    'from-violet-600': '#7C3AED', 'from-cyan-500': '#06B6D4', 'from-emerald-500': '#10B981',
    'from-amber-500': '#F59E0B', 'from-rose-500': '#F43F5E', 'from-slate-600': '#475569',
    'from-lime-500': '#84CC16', 'from-fuchsia-500': '#D946EF', 'from-blue-500': '#3B82F6',
    'to-indigo-600': '#4F46E5', 'to-blue-600': '#2563EB', 'to-teal-600': '#0D9488',
    'to-orange-600': '#EA580C', 'to-pink-600': '#DB2777', 'to-zinc-700': '#3F3F46',
    'to-green-600': '#16A34A', 'to-purple-600': '#9333EA',
  }

  const fromColor = colorMap[gradient.from] || '#6B7280'
  const toColor = colorMap[gradient.to] || '#374151'

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${fromColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${toColor};stop-opacity:1" />
        </linearGradient>
        <pattern id="neural" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="3" fill="white" opacity="0.2"/>
          <line x1="50" y1="50" x2="100" y2="0" stroke="white" stroke-width="0.5" opacity="0.1"/>
          <line x1="50" y1="50" x2="100" y2="100" stroke="white" stroke-width="0.5" opacity="0.1"/>
          <line x1="50" y1="50" x2="0" y2="50" stroke="white" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect fill="url(#grad)" width="1920" height="1080"/>
      <rect fill="url(#neural)" width="1920" height="1080"/>
      <circle cx="1500" cy="250" r="350" fill="white" opacity="0.03"/>
      <circle cx="400" cy="750" r="250" fill="white" opacity="0.03"/>
      <circle cx="960" cy="540" r="150" fill="white" opacity="0.05"/>
    </svg>
  `.trim().replace(/\s+/g, ' ')

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_IMAGES)
}

export function hasKeywordImage(keyword: string): boolean {
  return keyword.toLowerCase() in KEYWORD_IMAGES
}
