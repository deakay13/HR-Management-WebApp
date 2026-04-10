import { jest } from '@jest/globals';

// Tạo mock Express app đơn giản để test luồng route → response
// Không cần kết nối DB thật - chỉ test cấu trúc route

describe('Auth Routes - Structure', () => {
  let authRoutes;

  beforeAll(async () => {
    const mod = await import('../../src/routes/authRoutes.js');
    authRoutes = mod.default;
  });

  test('auth router có tồn tại', () => {
    expect(authRoutes).toBeDefined();
  });

  test('auth router có các route POST', () => {
    // Express 5 router stores routes in router.stack
    const routes = authRoutes.stack
      ?.filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    expect(routes).toBeDefined();

    const paths = routes.map(r => r.path);
    expect(paths).toContain('/signin');
    expect(paths).toContain('/signout');
    expect(paths).toContain('/refresh');
  });
});

describe('Account Routes - Structure', () => {
  let accountRoutes;

  beforeAll(async () => {
    const mod = await import('../../src/routes/accountRoutes.js');
    accountRoutes = mod.default;
  });

  test('account router có tồn tại', () => {
    expect(accountRoutes).toBeDefined();
  });

  test('account router có đủ CRUD routes', () => {
    const routes = accountRoutes.stack
      ?.filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods),
      }));

    const paths = routes.map(r => r.path);
    expect(paths).toContain('/Accounts');
    expect(paths).toContain('/Accounts/:ID');
  });
});

describe('Permission Routes - Structure', () => {
  let permRoutes;

  beforeAll(async () => {
    const mod = await import('../../src/routes/permissionsRoutes.js');
    permRoutes = mod.default;
  });

  test('permission router có tồn tại', () => {
    expect(permRoutes).toBeDefined();
  });

  test('có routes cho roles, permission, Permission_Role', () => {
    const routes = permRoutes.stack
      ?.filter(layer => layer.route)
      .map(layer => layer.route.path);

    expect(routes).toContain('/roles');
    expect(routes).toContain('/permission');
    expect(routes).toContain('/Permission_Role');
  });
});
