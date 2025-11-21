# Workspaces API - Exemples d'utilisation

## Suppose que tu as déjà un accessToken (depuis /auth/register ou /auth/login)

```bash
TOKEN="... ton JWT ..."
```

## Créer un workspace

```bash
curl -X POST http://localhost:3001/workspaces \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Mon Espace","description":"Projet Trello"}'
```

## Lister mes workspaces

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/workspaces
```

## Récupérer un workspace précis

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/workspaces/<id>
```

## Inviter un membre (il doit exister en base)

```bash
curl -X POST http://localhost:3001/workspaces/<id>/invite \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"membre@ex.com","role":"MEMBER"}'
```

