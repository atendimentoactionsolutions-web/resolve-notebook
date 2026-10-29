import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';

test('API: autenticação, validação e ciclo completo do estoque', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'resolve-test-'));
  const server = spawn(process.execPath, ['server.mjs'], {
    env: { ...process.env, PORT: '0', DATA_DIR: directory, ADMIN_USER: 'test', ADMIN_PASSWORD: 'test-password' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  try {
    const output = await Promise.race([
      once(server.stdout, 'data'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Servidor não iniciou')), 10000).unref())
    ]);
    const port = String(output[0]).match(/porta (\d+)/)[1];
    const request = async (url, method = 'GET', body, token) => {
      const response = await fetch(`http://127.0.0.1:${port}${url}`, {
        method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body)
      });
      return { status: response.status, body: await response.json() };
    };
    assert.equal((await request('/api/products', 'POST', {}, 'resolve-secret-token')).status, 401);
    assert.equal((await request('/api/auth/login', 'POST', { username: {}, password: [] })).status, 400);
    const login = await request('/api/auth/login', 'POST', { username: 'test', password: 'test-password' });
    assert.equal(login.status, 200);
    const token = login.body.token;
    assert.equal((await request('/api/products', 'POST', { title: 'Teste', price: -1 }, token)).status, 400);
    const created = await request('/api/products', 'POST', { title: 'Teste', price: 1200, images: ['/uploads/test.jpg'], condition: 'Novo' }, token);
    assert.equal(created.status, 201);
    assert.equal(created.body.condition, 'Novo');
    assert.deepEqual(created.body.images, ['/uploads/test.jpg']);
    const updated = await request(`/api/products/${created.body.id}`, 'PUT', { id: 'alterado', status: 'sold' }, token);
    assert.equal(updated.body.id, created.body.id);
    assert.equal(updated.body.status, 'sold');
    assert.equal(JSON.parse(await readFile(path.join(directory, 'products.json'), 'utf8'))[0].status, 'sold');
    assert.equal((await request(`/api/products/${created.body.id}`, 'DELETE', undefined, token)).status, 200);
    assert.deepEqual((await request('/api/products')).body, []);
    assert.equal((await request('/api/inexistente')).status, 404);
    await writeFile(path.join(directory, 'products.json'), '{invalid');
    assert.equal((await request('/api/products')).status, 500);
    assert.equal((await request('/api/products', 'POST', { title: 'Teste' }, token)).status, 500);
    assert.equal(await readFile(path.join(directory, 'products.json'), 'utf8'), '{invalid');
  } finally {
    server.kill();
    await once(server, 'exit');
    await rm(directory, { recursive: true, force: true });
  }
});

test('API: persistência de sessão e normalização de preço formatado', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'resolve-session-test-'));
  let server = spawn(process.execPath, ['server.mjs'], {
    env: { ...process.env, PORT: '0', DATA_DIR: directory, ADMIN_USER: 'resolve', ADMIN_PASSWORD: 'resolve' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  try {
    let output = await Promise.race([
      once(server.stdout, 'data'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Servidor não iniciou')), 10000).unref())
    ]);
    let port = String(output[0]).match(/porta (\d+)/)[1];

    // Login
    const loginRes = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'resolve', password: 'resolve' })
    });
    const loginData = await loginRes.json();
    assert.equal(loginRes.status, 200);
    assert.ok(loginData.token);
    const token = loginData.token;

    // Add product with Brazilian formatted price: "2.490,00"
    const addRes = await fetch(`http://127.0.0.1:${port}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Notebook com Preço Formatado',
        price: '2.490,00',
        specs: { cpu: 'i5', ram: null }
      })
    });
    assert.equal(addRes.status, 201);
    const addedProduct = await addRes.json();
    assert.equal(addedProduct.price, 2490);
    assert.equal(addedProduct.specs.cpu, 'i5');
    assert.equal(addedProduct.specs.ram, '');

    // Stop server and restart to verify session and product persistence
    server.kill();
    await once(server, 'exit');

    server = spawn(process.execPath, ['server.mjs'], {
      env: { ...process.env, PORT: '0', DATA_DIR: directory, ADMIN_USER: 'resolve', ADMIN_PASSWORD: 'resolve' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    output = await Promise.race([
      once(server.stdout, 'data'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Servidor reiniciado não iniciou')), 10000).unref())
    ]);
    port = String(output[0]).match(/porta (\d+)/)[1];

    // Verify token still works after server restart!
    const addResAfterRestart = await fetch(`http://127.0.0.1:${port}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Notebook Pós Reinício',
        price: '3500'
      })
    });
    assert.equal(addResAfterRestart.status, 201);

    // Verify both products are present in catalog
    const listRes = await fetch(`http://127.0.0.1:${port}/api/products`);
    const list = await listRes.json();
    assert.equal(list.length, 2);
  } finally {
    server.kill();
    await once(server, 'exit');
    await rm(directory, { recursive: true, force: true });
  }
});
