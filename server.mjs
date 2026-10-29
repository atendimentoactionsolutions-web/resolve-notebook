import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { randomBytes, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3015;
const ADMIN_USER = process.env.ADMIN_USER || 'resolve';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'resolve';
const sessions = new Map();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Directories
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DIST_DIR = path.join(__dirname, 'dist');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer storage for uploaded photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `notebook-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Somente arquivos de imagem são permitidos!'));
    }
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helpers for products JSON
function readProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(raw);
    if (!Array.isArray(products)) throw new Error('Formato inválido do catálogo.');
    return products;
  } catch (err) {
    console.error('Erro ao ler products.json:', err);
    throw err;
  }
}

function writeProducts(products) {
  try {
    const temporaryFile = `${PRODUCTS_FILE}.tmp`;
    fs.writeFileSync(temporaryFile, JSON.stringify(products, null, 2), 'utf-8');
    fs.renameSync(temporaryFile, PRODUCTS_FILE);
    return true;
  } catch (err) {
    console.error('Erro ao salvar products.json:', err);
    throw err;
  }
}

// Simple token auth middleware for admin operations
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  const sessionToken = token?.startsWith('Bearer ') ? token.slice(7) : '';
  const expires = sessions.get(sessionToken);
  if (expires && expires > Date.now()) {
    return next();
  }
  sessions.delete(sessionToken);
  return res.status(401).json({ error: 'Acesso não autorizado. Faça login novamente.' });
}

// --- API ROUTES ---
function validateProduct(req, res, next) {
  const body = req.body;
  const invalid = !body || Array.isArray(body) ||
    (req.method === 'POST' && (typeof body.title !== 'string' || !body.title.trim())) ||
    ['title', 'installments', 'category', 'badge', 'condition', 'description', 'image'].some(key =>
      body[key] !== undefined && typeof body[key] !== 'string') ||
    (body.price !== undefined && (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0)) ||
    (body.status !== undefined && !['available', 'sold'].includes(body.status)) ||
    (body.images !== undefined && (!Array.isArray(body.images) || body.images.some(image => typeof image !== 'string'))) ||
    (body.specs !== undefined && (!body.specs || typeof body.specs !== 'object' || Array.isArray(body.specs) || Object.values(body.specs).some(value => typeof value !== 'string')));
  if (invalid) return res.status(400).json({ error: 'Dados do produto inválidos. Confira título, preço e especificações.' });
  next();
}

// 1. Admin login verification
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Informe usuário e senha.' });
  }
  const validUser = (username || '').trim().toLowerCase() === ADMIN_USER.toLowerCase();
  const validPass = password === ADMIN_PASSWORD;

  if (validUser && validPass) {
    for (const [token, expires] of sessions) {
      if (expires <= Date.now()) sessions.delete(token);
    }
    const AUTH_TOKEN = randomBytes(32).toString('hex');
    sessions.set(AUTH_TOKEN, Date.now() + 8 * 60 * 60 * 1000);
    return res.json({ success: true, token: AUTH_TOKEN, message: 'Autenticado com sucesso!' });
  }
  return res.status(401).json({ success: false, error: 'Usuário ou senha incorretos.' });
});

// 2. Upload image endpoint
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.json({ success: true, url: imageUrl, filename: req.file.filename });
});

// 3. List all products (public)
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// 4. Create product (admin)
app.post('/api/products', authMiddleware, validateProduct, (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: 'nb-' + randomUUID(),
    title: req.body.title || 'Notebook',
    price: Number(req.body.price) || 0,
    installments: req.body.installments || 'em até 12x no cartão',
    category: req.body.category || 'Geral',
    badge: req.body.badge || 'Seminovo Revisado',
    condition: req.body.condition || 'Revisado',
    images: req.body.images || [],
    specs: req.body.specs || {},
    description: req.body.description || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop',
    status: req.body.status || 'available', // available | sold
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// 5. Update product (admin)
app.put('/api/products/:id', authMiddleware, validateProduct, (req, res) => {
  const { id } = req.params;
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Notebook não encontrado.' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id,
    createdAt: products[index].createdAt,
    updatedAt: new Date().toISOString()
  };

  writeProducts(products);
  res.json(products[index]);
});

// 6. Delete product (admin)
app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  let products = readProducts();
  const exists = products.some(p => p.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'Notebook não encontrado.' });
  }

  products = products.filter(p => p.id !== id);
  writeProducts(products);
  res.json({ success: true, message: 'Produto removido com sucesso.' });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint não encontrado.' }));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err instanceof multer.MulterError || err.type === 'entity.parse.failed' ? 400 : 500;
  console.error('Erro na requisição:', err.message);
  res.status(status).json({ error: status === 400 ? 'Arquivo ou dados inválidos. Limite de imagem: 15 MB.' : 'Não foi possível concluir a operação.' });
});

// Serve frontend dist if available
if (fs.existsSync(DIST_DIR)) {
  // Prevent browser caching of index.html so updates are always seen immediately
  app.use((req, res, next) => {
    if (req.path === '/' || req.path === '/index.html' || req.path.startsWith('/admin') || req.path.startsWith('/painel')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });

  // Serve static files
  app.use(express.static(DIST_DIR));

  // If a request for an asset in /assets/ is not found, return 404 instead of index.html
  app.use('/assets', (req, res) => {
    res.status(404).type('text/plain').send('Asset not found');
  });

  // SPA fallback
  app.use((req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Resolve Notebook Server ativo na porta ${server.address().port}`);
});
