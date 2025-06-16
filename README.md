# Microfrontends com Angular 18, React 18 e Single-SPA

## 📋 Pré-requisitos

- Node.js instalado
- Angular CLI 18
- React 18
- Familiaridade com microfrontends

---

## 🧩 Estrutura do Projeto

### 🧠 Root/Shell

1. Crie uma pasta para o shell principal.
2. Dentro dela, crie um arquivo `index.html` com o seguinte conteúdo:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src *  data: blob: 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * data: blob: 'unsafe-inline'; font-src * data: blob: 'unsafe-inline';"
    />
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>MFEs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="importmap-type" content="systemjs-importmap" />

    <script type="systemjs-importmap">
      {
        "imports": {
          "single-spa": "https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.0/system/single-spa.min.js",
          "single-spa-layout": "https://unpkg.com/single-spa-layout@1.0.0-beta.2/dist/system/single-spa-layout.min.js"
        }
      }
    </script>

    <link
      rel="preload"
      href="https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.5.0/system/single-spa.min.js"
      as="script"
      crossorigin="anonymous"
    />
    <script src="https://unpkg.com/core-js-bundle@3.1.4/minified.js"></script>
    <script src="https://unpkg.com/import-map-overrides@1.15.1/dist/import-map-overrides.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/system.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/amd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/named-exports.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/named-register.min.js"></script>

    <template id="single-spa-layout">
      <single-spa-router>
        <nav class="topnav">
          <application name="nabar"></application>
        </nav>
        <div class="main-content">
          <route path="app1">
            <application name="app1"></application>
          </route>
          <route path="app2">
            <application name="app2"></application>
          </route>
        </div>
      </single-spa-router>
    </template>
  </head>
  <body>
    <script>
      Promise.all([
        System.import("single-spa"),
        System.import("single-spa-layout"),
      ]).then(([singleSpa, singleSpaLayout]) => {
        const {
          constructApplications,
          constructLayoutEngine,
          constructRoutes,
        } = singleSpaLayout;
        const { registerApplication, start } = singleSpa;

        const routes = constructRoutes(
          document.querySelector("#single-spa-layout")
        );
        const applications = constructApplications({
          routes,
          loadApp({ name }) {
            return System.import(name);
          },
        });
        const layoutEngine = constructLayoutEngine({ routes, applications });
        applications.forEach(registerApplication);

        start();
      });
    </script>
    <import-map-overrides-full></import-map-overrides-full>
  </body>
</html>
```

---

## 🚀 Criar Projetos Angular (MFEs)

```bash
npx @angular/cli@18 new NOME-APP --standalone=false
cd NOME-APP
ng add single-spa-angular@9
npm install
```

### 🛠️ Ajustes

### 🧾 Ajustes `app-routing.module.ts`

Adicione a rota:

```ts
{ path: '**', component: EmptyRouteComponent }
```

### 🧾 Ajustes `app.module.ts`

Adicione o provider:

```ts
{ provide: APP_BASE_HREF, useValue: "/" }
```

### 📦 Ajustes `package.json`

Substitua:

```json
"serve:single-spa:NOME-APP": "...",
"build:single-spa:NOME-APP": "..."
```

Para:

```json
"serve:single-spa": "...",
"build:single-spa": "..."
```

### ▶️ Rodar

```bash
npm run serve:single-spa
```

---

## ⚛️ Criar Projetos React (MFEs)

```bash
npx create-single-spa --framework react --moduleType app-parcel --moduleFormat systemjs
```

📦 Durante o setup:

- Escolha o gerenciador de pacotes (`npm` ou `yarn`)
- Responda **"Yes"** para TypeScript

### 📦 Ajustes `package.json`

```json
"react": "^18.0.0",
"react-dom": "^18.0.0",
"@types/react": "^16.3.0",
"@types/react-dom": "^16.3.0"
```

### 🧾 Ajustes `org-nome-app.tsx`

Substitua:

```ts
import * as ReactDOMClient from "react-dom/client";
```

Por:

```ts
import ReactDOM from "react-dom";
```

---

## 🧠 Confiração Root/Shell

### 🗺️ Importmap (type="systemjs-importmap")

Adicione o mapa de importações para carregar seus MFEs e bibliotecas compartilhadas (como React/ReactDOM, se aplicável):

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "@org/proj": "http://localhost:port/arquivo.js",

      // React global (caso use React)
      "react": "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
      "react-dom": "https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"
    }
  }
</script>
```

> 💡 Altere os caminhos conforme as portas e nomes reais dos seus microfrontends.

### 🔗 Scripts adicionais para o runtime

🟠 Se estiver usando Angular, adicione:

```html
<script src="https://unpkg.com/zone.js"></script>
```

🔵 Se estiver usando React:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
```

## 🔗 Compartilhar Dados entre MFEs (Micro Frontends)

Como criar um módulo utilitário para compartilhar dados entre aplicações em **React** e **Angular** usando o padrão do `single-spa`.

---

### 🧱 Criar Módulo Compartilhado (`@fiap/shared-data`)

Execute o comando abaixo para criar um módulo utilitário que será importado pelos MFEs:

```bash
npx create-single-spa --framework none --moduleType util-module --moduleFormat systemjs
```

📦 Durante o setup:

- Escolha o gerenciador de pacotes (`npm` ou `yarn`)
- Responda **"Yes"** para TypeScript

---

#### 🧾 Implementar o módulo `@fiap/shared-data`

Você pode usar o exemplo abaixo (em TypeScript) para compartilhar dados entre MFEs usando `rxjs`:

```ts
// src/shared.ts
import { BehaviorSubject } from "rxjs";

export const $test = new BehaviorSubject<string>("");

export function eventTest(value: string) {
  $test.next(value);
}
```

Esse módulo pode ser consumido por qualquer MFE (React, Angular, etc.) e propagará os dados via observables.

---

## ⚛️ React

### 📁 Criar `types/extra.d.ts`

```ts
declare module "@fiap/shared-data";
```

### 🧾 Exemplo de uso no `org-nome-app.tsx`

```tsx
import { useEffect } from "react";
import { $test, eventTest } from "@fiap/shared-data";

export default function Root(props) {
  function eventTestReact() {
    eventTest("react");
  }

  useEffect(() => {
    const subscription = $test.subscribe((value) => {
      console.log("Valor recebido no React:", value);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <section>{props.name} is mounted!</section>
      <button onClick={eventTestReact}>eventTestReact</button>
    </>
  );
}
```

---

## 🅰️ Angular

### 📁 Criar `types/extra.d.ts`

```ts
declare module "@fiap/shared-data";
```

### 🧾 Exemplo de uso no `home.component.ts`

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { $test, eventTest } from "@fiap/shared-data";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    $test.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      console.log("Valor recebido no Angular:", value);
    });
  }

  eventTestAngular() {
    eventTest("bla");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Shell/Root

### 🗺️ Importmap (type="systemjs-importmap")

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "@org/shared-data": "http://localhost:port/org-shared-data.js"
      //...
    }
  }
</script>
```
