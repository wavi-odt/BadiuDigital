# Contrato da API — Badiu Digital

Backend Spring Boot + MySQL, com a mesma organização do Batuku.
Base URL: `${VITE_API_BASE_URL}/api`. Todas as respostas são JSON.

Endpoints públicos e só de leitura, exceto `POST /api/contact`.

## Resumo

| Método | Endpoint | Resposta | Usado em |
|---|---|---|---|
| GET | `/api/settings` | `SiteSettingsDTO` | Home, Footer, Contacto |
| GET | `/api/services` | `ServiceDTO[]` | Home (fase 3) |
| GET | `/api/projects?status=&featured=` | `ProjectSummaryDTO[]` | Home (fase 4), `/projetos` |
| GET | `/api/projects/{slug}` | `ProjectDetailDTO` | `/projetos/:slug` |
| GET | `/api/members` | `MemberSummaryDTO[]` | `/equipa` |
| GET | `/api/members/{slug}` | `MemberDetailDTO` | `/equipa/:slug` |
| POST | `/api/contact` | `201 { id, createdAt }` | `/contacto` |

Erros: `{ "status": 404, "message": "Projeto não encontrado." }`. O frontend mostra o campo `message`.

---

## GET /api/settings

```json
{
  "studioName": "Badiu Digital",
  "tagline": "Estúdio digital · Santiago, Cabo Verde",
  "manifesto": "Construímos software com raízes. …",
  "email": "hello@badiudigital.com",
  "socials": { "instagram": "https://…", "linkedin": "https://…", "github": "https://…" }
}
```

## GET /api/services

Ordenados por `number`.

```json
[
  { "id": 1, "number": "01", "title": "Design", "description": "…", "tags": ["Marca", "UI / UX", "Motion"] }
]
```

## GET /api/projects

Query params opcionais: `status` (`LIVE` | `CLIENT` | `IN_DEVELOPMENT` | `COMING_SOON`), `featured` (`true`/`false`). A home pede `featured=true`. Ordenar por `displayOrder`.

```json
[
  {
    "id": 1,
    "slug": "batuku",
    "name": "Batuku",
    "shortName": "Bk",
    "status": "IN_DEVELOPMENT",
    "featured": true,
    "summary": "Descoberta e monetização para artistas independentes cabo-verdianos.",
    "tags": ["React", "Spring Boot", "MySQL"],
    "coverColor": "#2B1B12",
    "coverTextColor": "#F08A4B",
    "coverImageUrl": null,
    "liveUrl": null,
    "repoUrl": null,
    "year": 2026
  }
]
```

## GET /api/projects/{slug}

`ProjectSummaryDTO` mais `description` e `team`. Devolve 404 se o slug não existir.

```json
{
  "...": "todos os campos do resumo",
  "description": "Plataforma de música com …",
  "team": [{ "slug": "rafael-reis", "name": "Rafael Reis", "role": "Fundador · full stack" }]
}
```

## GET /api/members

```json
[
  {
    "id": 1, "slug": "rafael-reis", "name": "Rafael Reis", "role": "Fundador",
    "shortBio": "Frontend · Design de interfaces · Deploy",
    "photoUrl": null, "founder": true, "theme": "PETROL"
  }
]
```

`theme`: `PETROL` | `SAND` (cor do cartão e da foto).

## GET /api/members/{slug}

```json
{
  "...": "todos os campos do resumo",
  "headline": "Frontend developer e fundador da Badiu. …",
  "bio": "…",
  "location": "Santiago, CV → Portalegre, PT",
  "availability": "Aberto a estágio e freelance",
  "links": { "cv": "https://…/cv.pdf", "portfolio": "https://…", "github": "https://…", "linkedin": "https://…", "email": "rafael@badiudigital.com" },
  "skills": [{ "group": "Frontend", "items": ["React", "Vite"] }],
  "timeline": [{ "period": "2026 — hoje", "title": "Fundador, Badiu Digital", "place": "…" }],
  "projects": [
    {
      "slug": "batuku", "name": "Batuku", "shortName": "Bk",
      "role": "Fundador · frontend, backend e base de dados",
      "tags": ["React", "Spring Boot"], "coverColor": "#2B1B12", "coverTextColor": "#F08A4B"
    }
  ]
}
```

## POST /api/contact

Request:

```json
{ "name": "Ana", "email": "ana@exemplo.com", "projectType": "SITE", "message": "Olá! …", "memberSlug": null }
```

Validação no backend (`@Valid`): `name` com 2–100 caracteres, `email` válido, `message` com 10–5000 caracteres, `projectType` ∈ `SITE | APP | INFRA | OTHER`.
Resposta `201 Created`: `{ "id": 42, "createdAt": "2026-11-04T15:00:00Z" }`. Opcional: enviar notificação por email com o mesmo `EmailService` do Batuku.

---

## Sugestão de estrutura do backend (igual ao Batuku)

```
src/main/java/org/example/badiu/
├── config/        # CorsConfig (permitir a origem do frontend), WebConfig
├── controller/    # SettingsController, ServiceController, ProjectController, MemberController, ContactController
├── dto/           # *DTO records (Summary/Detail/Request)
├── entity/        # Project, Member, MemberProject, StudioService, ContactMessage, SiteSettings
├── enums/         # ProjectStatus, MemberTheme, ProjectType
├── exception/     # NotFoundException + GlobalExceptionHandler → { status, message }
├── mapper/        # Entity → DTO
├── repository/    # JpaRepository por entidade (findBySlug, findByFeaturedTrueOrderByDisplayOrder…)
└── service/       # lógica de negócio
```

## Tabelas MySQL sugeridas

| Tabela | Colunas principais |
|---|---|
| `project` | id, slug (unique), name, short_name, status, featured, summary, description, cover_color, cover_text_color, cover_image_url, live_url, repo_url, year, display_order |
| `project_tag` | project_id, tag |
| `member` | id, slug (unique), name, role, short_bio, headline, bio, photo_url, location, availability, founder, theme, cv_url, portfolio_url, github_url, linkedin_url, email, display_order |
| `member_project` | member_id, project_id, role (o papel da pessoa nesse projeto) |
| `member_skill` | id, member_id, group_name, item, display_order |
| `member_timeline` | id, member_id, period, title, place, display_order |
| `studio_service` | id, number, title, description, display_order |
| `studio_service_tag` | service_id, tag |
| `contact_message` | id, name, email, project_type, message, member_slug, created_at, read_at |
| `site_settings` | id (linha única), studio_name, tagline, manifesto, email, instagram_url, linkedin_url, github_url |

Nota: `ProjectDetailDTO.team` e `MemberDetailDTO.projects` saem ambos de `member_project`.
