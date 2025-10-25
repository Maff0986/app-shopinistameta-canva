{
  "$schema": "https://www.canva.dev/schemas/app/v1/manifest-schema.json",
  "manifest_schema_version": 1,
  "runtime": {
    "permissions": [
      { "name": "canva:design:content:read", "type": "mandatory" },
      { "name": "canva:design:content:write", "type": "mandatory" },
      { "name": "canva:asset:private:read", "type": "mandatory" },
      { "name": "canva:asset:private:write", "type": "mandatory" },
      { "name": "canva:brandkit:read", "type": "mandatory" }
    ]
  },
  "intent": {
    "design_editor": { "enrolled": true },
    "data_connector": { "enrolled": true }
  },
  "app": {
    "name": "ShopinistaMeta Canva App",
    "version": "1.0.0",
    "description": "Genera contenido, importa imágenes y crea catálogos desde feeds y URLs.",
    "homepage_url": "https://maff0986.github.io/app-shopinistameta-canva/"
  }
}
