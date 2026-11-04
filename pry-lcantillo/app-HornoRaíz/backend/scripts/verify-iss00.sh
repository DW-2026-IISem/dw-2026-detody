#!/bin/bash
echo "=== 0.1 VERSIONES ==="
echo -n "Node: "; node -v
echo -n "npm: "; npm -v
echo -n "ng path: "; which ng
echo "--- Angular CLI Info ---"
ng version | head -n 14

echo ""
echo "=== 0.2 BACKEND EN MARCHA (PUERTO 3004) ==="
echo "Petición sin token a /api/clients (espera 401 Unauthorized):"
curl -s -i http://localhost:3004/api/clients | head -n 12

echo ""
echo "=== 0.3 LOGIN ADMIN Y PERMISOS ==="
LOGIN_ADMIN=$(curl -s -X POST http://localhost:3004/api/session/login -H "Content-Type: application/json" -d '{"identifier":"admin","password":"Admin123!"}')
echo "Respuesta login admin: ${LOGIN_ADMIN:0:120}..."
ADMIN_TOKEN=$(echo "$LOGIN_ADMIN" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Perfil Admin:"
curl -s http://localhost:3004/api/session/profile -H "Authorization: Bearer $ADMIN_TOKEN"
echo ""

echo "Acceso Admin a /api/clients (espera 200 OK):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3004/api/clients -H "Authorization: Bearer $ADMIN_TOKEN"

echo ""
echo "=== 0.4 CREDENCIALES SELLER ==="
LOGIN_SELLER=$(curl -s -X POST http://localhost:3004/api/session/login -H "Content-Type: application/json" -d '{"identifier":"seller","password":"Seller123!"}')
echo "Respuesta login seller: ${LOGIN_SELLER:0:120}..."
SELLER_TOKEN=$(echo "$LOGIN_SELLER" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Perfil Seller:"
curl -s http://localhost:3004/api/session/profile -H "Authorization: Bearer $SELLER_TOKEN"
echo ""

echo "Acceso Seller a /api/clients (espera 200 OK):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3004/api/clients -H "Authorization: Bearer $SELLER_TOKEN"

echo "Intento Seller POST /api/users (espera 403 Forbidden - RBAC activo):"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" -X POST http://localhost:3004/api/users -H "Authorization: Bearer $SELLER_TOKEN" -H "Content-Type: application/json" -d '{"username":"hack","email":"hack@test.com","password":"123"}'
