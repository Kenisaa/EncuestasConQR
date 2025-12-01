# Opciones de Colores para la Página de Inicio

Este documento contiene diferentes esquemas de colores que puedes aplicar a la página de inicio modificando el archivo `app/globals.css`.

## Ubicación de los cambios

**Archivo:** `app/globals.css`
**Líneas:** 5-39 para modo claro, 41-74 para modo oscuro

---

## Opción 0: Configuración Actual (Original del Proyecto)

### Modo Claro
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
```

### Modo Oscuro
```css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}
```

**Descripción:** Esquema de colores neutral con tonos grises. Color primario gris oscuro, ideal para un diseño limpio y profesional minimalista.

---

## Opción 1: Azul Moderno (Estilo Corporativo)

### Modo Claro

```css
:root {
  --background: oklch(0.99 0.005 240);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.5 0.2 250);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.96 0.01 240);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.96 0.01 240);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.55 0.18 250);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.9 0.01 240);
  --input: oklch(0.9 0.01 240);
  --ring: oklch(0.5 0.2 250);
  --chart-1: oklch(0.5 0.2 250);
  --chart-2: oklch(0.6 0.15 200);
  --chart-3: oklch(0.55 0.12 280);
  --chart-4: oklch(0.65 0.18 220);
  --chart-5: oklch(0.7 0.15 260);
  --radius: 0.625rem;
}
```

---

## Opción 2: Verde Fresco (Estilo Natural/Eco)

### Modo Claro

```css
:root {
  --background: oklch(0.99 0.005 150);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.18 150);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.96 0.01 150);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.96 0.01 150);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.6 0.15 140);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.9 0.01 150);
  --input: oklch(0.9 0.01 150);
  --ring: oklch(0.55 0.18 150);
  --chart-1: oklch(0.55 0.18 150);
  --chart-2: oklch(0.65 0.15 170);
  --chart-3: oklch(0.6 0.12 130);
  --chart-4: oklch(0.7 0.18 160);
  --chart-5: oklch(0.75 0.15 140);
  --radius: 0.625rem;
}
```

---

## Opción 3: Púrpura Vibrante (Estilo Creativo/Tech)

### Modo Claro

```css
:root {
  --background: oklch(0.99 0.005 290);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.5 0.22 290);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.96 0.01 290);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.96 0.01 290);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.55 0.2 310);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.9 0.01 290);
  --input: oklch(0.9 0.01 290);
  --ring: oklch(0.5 0.22 290);
  --chart-1: oklch(0.5 0.22 290);
  --chart-2: oklch(0.6 0.18 270);
  --chart-3: oklch(0.55 0.15 310);
  --chart-4: oklch(0.65 0.2 280);
  --chart-5: oklch(0.7 0.17 300);
  --radius: 0.625rem;
}
```

---

## Opción 4: Naranja Energético (Estilo Dinámico/Juvenil)

### Modo Claro

```css
:root {
  --background: oklch(0.99 0.005 50);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.6 0.2 40);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.96 0.01 40);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.96 0.01 40);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.65 0.18 50);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.9 0.01 40);
  --input: oklch(0.9 0.01 40);
  --ring: oklch(0.6 0.2 40);
  --chart-1: oklch(0.6 0.2 40);
  --chart-2: oklch(0.65 0.18 30);
  --chart-3: oklch(0.7 0.15 60);
  --chart-4: oklch(0.75 0.2 50);
  --chart-5: oklch(0.8 0.17 45);
  --radius: 0.625rem;
}
```

---

## Opción 5: Cian/Turquesa (Estilo Fresco/Moderno)

### Modo Claro

```css
:root {
  --background: oklch(0.99 0.005 200);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.15 200);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.96 0.01 200);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.96 0.01 200);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.6 0.13 190);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.9 0.01 200);
  --input: oklch(0.9 0.01 200);
  --ring: oklch(0.55 0.15 200);
  --chart-1: oklch(0.55 0.15 200);
  --chart-2: oklch(0.6 0.13 210);
  --chart-3: oklch(0.65 0.12 190);
  --chart-4: oklch(0.7 0.15 205);
  --chart-5: oklch(0.75 0.14 195);
  --radius: 0.625rem;
}
```

---

## Opción 6: Rojo/Rosa Vibrante (Estilo Atrevido/Destacado)

### Modo Claro

```css
:root {
  --background: oklch(0.99 0.005 10);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.22 10);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.96 0.01 10);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.96 0.01 10);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.6 0.2 350);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.9 0.01 10);
  --input: oklch(0.9 0.01 10);
  --ring: oklch(0.55 0.22 10);
  --chart-1: oklch(0.55 0.22 10);
  --chart-2: oklch(0.6 0.2 350);
  --chart-3: oklch(0.65 0.18 20);
  --chart-4: oklch(0.7 0.2 340);
  --chart-5: oklch(0.75 0.19 15);
  --radius: 0.625rem;
}
```

---

## Opción 7: Minimalista Gris (Estilo Elegante/Profesional)

### Modo Claro

```css
:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0 0);
  --primary: oklch(0.3 0 0);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.95 0 0);
  --secondary-foreground: oklch(0.2 0 0);
  --muted: oklch(0.95 0 0);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.25 0 0);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.99 0 0);
  --border: oklch(0.88 0 0);
  --input: oklch(0.88 0 0);
  --ring: oklch(0.4 0 0);
  --chart-1: oklch(0.4 0 0);
  --chart-2: oklch(0.5 0 0);
  --chart-3: oklch(0.6 0 0);
  --chart-4: oklch(0.7 0 0);
  --chart-5: oklch(0.8 0 0);
  --radius: 0.625rem;
}
```

---

## Cómo Aplicar los Cambios

1. Abre el archivo `app/globals.css`
2. Localiza la sección `:root` (líneas 5-39)
3. Reemplaza las variables con una de las opciones anteriores
4. Guarda el archivo
5. Recarga la página para ver los cambios

## Notas Importantes

- Solo necesitas cambiar la sección `:root` para el modo claro
- Si quieres también cambiar el modo oscuro, modifica la sección `.dark`
- El formato **OKLCH** tiene 3 valores:
  - **L (Lightness)**: 0 (negro) a 1 (blanco)
  - **C (Chroma)**: 0 (gris) a 0.4 (muy saturado)
  - **H (Hue)**: 0-360 (ángulo del color: 0=rojo, 120=verde, 240=azul, etc.)

## Combinaciones de Dos Colores

### Azul + Naranja (Complementarios)

```css
--primary: oklch(0.5 0.2 250); /* Azul */
--accent: oklch(0.65 0.18 50); /* Naranja */
```

### Verde + Púrpura (Complementarios)

```css
--primary: oklch(0.55 0.18 150); /* Verde */
--accent: oklch(0.55 0.2 310); /* Púrpura */
```

### Cian + Rosa (Complementarios)

```css
--primary: oklch(0.55 0.15 200); /* Cian */
--accent: oklch(0.6 0.2 350); /* Rosa */
```

---

**Última actualización:** Diciembre 2025
