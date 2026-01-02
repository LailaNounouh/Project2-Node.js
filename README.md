# BeautyConnect API  
**Project 2 – Backend Web**  
_Gemaakt door **Laila Nounouh**_

---

## Beschrijving  

**BeautyConnect API** is een data-driven **REST API** ontwikkeld met **Node.js** en **Express**.  
De API beheert **gebruikers**, **posts** en **categorieën** voor een beautyplatform.  
Ze dient als backend die kan worden gekoppeld aan een frontend (bijvoorbeeld een **Laravel**-website).

Alle gegevens worden dynamisch opgeslagen en opgehaald uit een **SQLite-database** met behulp van **Knex**.

---

## Installatie & Opstarten  

### Vereisten  
- **Node.js** versie 20 of hoger  

### Installatie  

Gebruik het volgende commando om dependencies te installeren:

`npm install`

### Server starten  

Start de ontwikkelserver met:

`npm run dev`

De server draait standaard op: [**http://localhost:3000**](http://localhost:3000)

---

## Rootpagina  

Op de root (`GET /`) wordt een **HTML-pagina** weergegeven met een overzicht van alle beschikbare API-endpoints.

---

## API Endpoints  

### Users  

**GET /users** — Alle users ophalen  
**GET /users/:id** — Details van één user  
**POST /users** — Nieuwe user toevoegen  
**PUT /users/:id** — Bestaande user aanpassen  
**DELETE /users/:id** — User verwijderen  

**Query parameters:**  
- `?search=` → Zoeken op naam of e-mail  
- `?limit=` → Beperkt aantal resultaten  
- `?offset=` → Startpositie bij paginatie  

---

### Posts  

**GET /posts** — Alle posts ophalen  
**GET /posts/:id** — Details van één post  
**POST /posts** — Nieuwe post toevoegen  
**PUT /posts/:id** — Post aanpassen  
**DELETE /posts/:id** — Post verwijderen  

---

### Categories  

**GET /categories** — Alle categorieën ophalen  
**GET /categories/:id** — Details van één categorie  
**POST /categories** — Nieuwe categorie toevoegen  
**PUT /categories/:id** — Categorie aanpassen  
**DELETE /categories/:id** — Categorie verwijderen  

_Categorieën worden gebruikt om posts te groeperen (bijvoorbeeld: makeup, hair, skincare)._

---

## Validatie  

De API bevat basisvalidatie:  
- Verplichte velden mogen niet leeg zijn  
- Numerieke velden accepteren geen strings  
- Voornaam mag geen cijfers bevatten  
- Ongeldige input resulteert in duidelijke JSON-foutmeldingen  

---

## Extra Features  

- Zoeken via query parameters  
- Paginatie met `limit` en `offset`  
- Extra entiteit **categories**  
- Relatie tussen **posts** en **categorieën**  
- Centrale HTML-rootpagina met endpoint-overzicht  
- Duidelijke JSON errorhandling  

---

## Gebruikte Technologieën  

- **Node.js**  
- **Express**  
- **Knex**  
- **SQLite**  
- **Nodemon**  
- **Git & GitHub**

**Bronnen:**  
- https://expressjs.com  
- https://knexjs.org  
- https://www.sqlite.org  
- https://nodejs.org  

---

## Auteur  

**Project gemaakt door:** **Laila Nounouh**
