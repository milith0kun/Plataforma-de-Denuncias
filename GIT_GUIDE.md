# 🎯 Guía Rápida de Git - Para Exposición

## Por Dennis Ccapatinta

Esta guía documenta los comandos Git utilizados para contribuir al proyecto.

---

## 📋 Workflow Completo

### 1. Configuración Inicial (Solo una vez)

```bash
# Verificar configuración de Git
git config --global user.name "Dennis Ccapatinta"
git config --global user.email "dennis.ccapatinta@example.com"

# Ver configuración actual
git config --list
```

---

### 2. Crear y Trabajar en Tu Rama

```bash
# Ver todas las ramas
git branch -a

# Crear tu rama desde main
git checkout main
git pull origin main
git checkout -b dennis-ccapatinta

# Verificar que estás en tu rama
git branch
# * dennis-ccapatinta  ← Asterisco indica rama actual
#   main
```

---

### 3. Ver Estado del Repositorio

```bash
# Ver archivos modificados
git status

# Ver diferencias de cambios
git diff

# Ver diferencias de un archivo específico
git diff src/components/common/Toast.jsx

# Ver historial de commits
git log --oneline

# Ver últimos 5 commits
git log --oneline -5
```

---

### 4. Hacer Commits

```bash
# Añadir archivos específicos
git add README_DENNIS.md
git add CHANGELOG.md
git add src/components/common/Toast.jsx

# O añadir todos los cambios
git add .

# Ver qué se va a commitear
git status

# Hacer commit con mensaje
git commit -m "docs: Agregar README_DENNIS.md con contribuciones"

# Commit detallado (abre editor)
git commit
```

---

### 5. Series de Commits para el Proyecto

```bash
# Commit 1: Documentación
git add README_DENNIS.md
git commit -m "docs: Agregar documentación de contribuciones personales"

# Commit 2: Changelog
git add CHANGELOG.md
git commit -m "docs: Crear CHANGELOG con historial de versiones"

# Commit 3: Guía de contribución
git add CONTRIBUTING.md
git commit -m "docs: Agregar guía de contribución al proyecto"

# Commit 4: Toast Component
git add src/components/common/Toast.jsx
git add src/components/common/Toast.css
git commit -m "feat: Crear componente Toast para notificaciones"

# Commit 5: NotificationContext
git add src/contexts/NotificationContext.jsx
git commit -m "feat: Implementar NotificationContext con Context API"

# Commit 6: Documentación de validaciones
git add VALIDATION_IMPROVEMENTS.md
git commit -m "docs: Documentar mejoras de validación implementadas"

# Commit 7: Guía de Git
git add GIT_GUIDE.md
git commit -m "docs: Agregar guía rápida de comandos Git"
```

---

### 6. Push a GitHub

```bash
# Primera vez (push y configurar upstream)
git push -u origin dennis-ccapatinta

# Siguientes veces
git push origin dennis-ccapatinta

# Ver ramas remotas
git branch -r
```

---

### 7. Actualizar Tu Rama con Main

```bash
# Primero actualizar main local
git checkout main
git pull origin main

# Volver a tu rama
git checkout dennis-ccapatinta

# Merge main en tu rama
git merge main

# Si hay conflictos, resolverlos manualmente
# Luego:
git add .
git commit -m "merge: Actualizar rama con cambios de main"
git push origin dennis-ccapatinta
```

---

### 8. Crear Pull Request

**En GitHub (interfaz web):**

1. Ir a: https://github.com/milith0kun/Plataforma-de-Denuncias-
2. Click en "Pull requests"
3. Click en "New pull request"
4. Seleccionar:
   - Base: `main`
   - Compare: `dennis-ccapatinta`
5. Completar formulario
6. Click en "Create pull request"
7. Asignar a **Edmil** como reviewer

---

### 9. Resolver Conflictos

```bash
# Si hay conflictos al hacer merge
git status
# Verás archivos en conflicto

# Editar archivos manualmente
# Buscar marcadores:
# <<<<<<< HEAD
# ... tu código ...
# =======
# ... código de main ...
# >>>>>>> main

# Después de resolver
git add archivo-resuelto.jsx
git commit -m "merge: Resolver conflictos con main"
git push origin dennis-ccapatinta
```

---

### 10. Comandos de Emergencia

```bash
# Deshacer cambios no guardados
git checkout -- archivo.jsx

# Deshacer último commit (mantener cambios)
git reset --soft HEAD~1

# Deshacer último commit (PERDER cambios) ⚠️
git reset --hard HEAD~1

# Ver historial completo
git reflog

# Volver a un commit anterior
git reset --hard abc123  # abc123 es el hash del commit
```

---

## 📊 Resumen de Commits para el Proyecto

### Commits Realizados (7-10)

| # | Tipo | Descripción | Archivos |
|---|------|-------------|----------|
| 1 | `docs:` | README_DENNIS.md | +300 líneas |
| 2 | `docs:` | CHANGELOG.md | +200 líneas |
| 3 | `docs:` | CONTRIBUTING.md | +400 líneas |
| 4 | `feat:` | Toast.jsx | +70 líneas |
| 5 | `feat:` | Toast.css | +150 líneas |
| 6 | `feat:` | NotificationContext.jsx | +90 líneas |
| 7 | `docs:` | VALIDATION_IMPROVEMENTS.md | +500 líneas |
| 8 | `docs:` | GIT_GUIDE.md | +250 líneas |

**Total:** ~2000 líneas de código y documentación

---

## 🎤 Para la Exposición

### Mostrar commits en terminal

```bash
# Ver todos tus commits
git log --oneline --author="Dennis Ccapatinta"

# Ver commits con estadísticas
git log --stat --author="Dennis" -5

# Ver diferencias de un commit
git show abc123
```

### Mostrar en GitHub

1. Ir a tu PR
2. Mostrar "Files changed" tab
3. Mostrar "Commits" tab (lista de commits)
4. Mostrar conversación con reviewer

---

## 📝 Convenciones de Commits

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat:` | Nueva funcionalidad | `feat: Agregar sistema de notificaciones` |
| `fix:` | Corrección de bug | `fix: Corregir validación de email` |
| `docs:` | Documentación | `docs: Actualizar README` |
| `style:` | Estilos/formato | `style: Mejorar espaciado` |
| `refactor:` | Refactorización | `refactor: Simplificar lógica` |
| `test:` | Tests | `test: Agregar tests unitarios` |
| `chore:` | Mantenimiento | `chore: Actualizar dependencias` |

---

## 🔍 Verificar Antes de Push

```bash
# 1. Ver todos los cambios
git status

# 2. Revisar diferencias
git diff

# 3. Ver qué se va a pushear
git log origin/dennis-ccapatinta..HEAD

# 4. Hacer push
git push origin dennis-ccapatinta
```

---

## ✅ Checklist Pre-PR

- [ ] Todos los cambios están commiteados
- [ ] Commits tienen mensajes descriptivos
- [ ] Rama está actualizada con main
- [ ] No hay conflictos
- [ ] Código funciona correctamente
- [ ] Documentación actualizada

```bash
# Verificar
git status        # Todo limpio
git log -5        # Commits correctos
git diff main     # Ver diferencias con main
```

---

## 🌐 URLs Importantes

- **Repositorio:** https://github.com/milith0kun/Plataforma-de-Denuncias-
- **Tu rama:** https://github.com/milith0kun/Plataforma-de-Denuncias-/tree/dennis-ccapatinta
- **Pull Request:** (se generará al crear el PR)

---

## 📞 Para Pedir Ayuda

```bash
# Ver ayuda de un comando
git help status
git help commit
git help merge

# Ver manual completo
git --help
```

---

## 💡 Tips Útiles

### Alias útiles (configurar una vez)

```bash
# Crear shortcuts
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.cm commit
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --decorate"

# Usar:
git st   # en lugar de git status
git co main  # en lugar de git checkout main
git cm -m "mensaje"  # en lugar de git commit -m "mensaje"
```

### Ver ramas de forma visual

```bash
git log --all --graph --decorate --oneline
```

### Ver quién modificó cada línea

```bash
git blame archivo.jsx
```

---

**¡Éxito en tu exposición!** 🚀

**Autor:** Dennis Ccapatinta  
**Fecha:** 29 de Diciembre de 2025
