import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3015;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'resolve2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
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
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler products.json:', err);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Erro ao salvar products.json:', err);
    return false;
  }
}

// Simple token auth middleware for admin operations
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (token === `Bearer ${ADMIN_PASSWORD}`) {
    return next();
  }
  return res.status(401).json({ error: 'Acesso não autorizado. Senha incorreta.' });
}

// --- API ROUTES ---

// 1. Admin login verification
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_PASSWORD, message: 'Autenticado com sucesso!' });
  }
  return res.status(401).json({ success: false, error: 'Senha incorreta.' });
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
app.post('/api/products', authMiddleware, (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: 'nb-' + Date.now(),
    title: req.body.title || 'Notebook',
    price: Number(req.body.price) || 0,
    installments: req.body.installments || 'em até 12x no cartão',
    category: req.body.category || 'Geral',
    badge: req.body.badge || 'Seminovo Revisado',
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
app.put('/api/products/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const products = readProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Notebook não encontrado.' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
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

// Serve frontend dist if available
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Resolve Notebook Server ativo na porta ${PORT}`);
});
