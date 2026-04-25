#!/bin/bash
# ─────────────────────────────────────────────
#  AtomixOS Cockpit Manager – Local Installer
#  github.com/freelocs-dev/atomix-cockpit-manager
# ─────────────────────────────────────────────

set -e

REPO="https://github.com/freelocs-dev/atomix-cockpit-manager.git"
DIR="atomix-cockpit-manager"
BLUE="\033[1;34m"
GREEN="\033[1;32m"
RED="\033[1;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"

print_header() {
  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════════╗${RESET}"
  echo -e "${BLUE}║   AtomixOS Cockpit Manager – Installer   ║${RESET}"
  echo -e "${BLUE}║   github.com/freelocs-dev               ║${RESET}"
  echo -e "${BLUE}╚══════════════════════════════════════════╝${RESET}"
  echo ""
}

ok()   { echo -e "${GREEN}✓${RESET} $1"; }
info() { echo -e "${BLUE}→${RESET} $1"; }
warn() { echo -e "${YELLOW}⚠${RESET} $1"; }
fail() { echo -e "${RED}✗ Fehler:${RESET} $1"; exit 1; }

check_deps() {
  info "Überprüfe Abhängigkeiten..."

  command -v git >/dev/null 2>&1 || fail "git ist nicht installiert. Bitte installieren: sudo dnf install git"
  ok "git gefunden"

  command -v node >/dev/null 2>&1 || fail "Node.js ist nicht installiert. Bitte installieren: https://nodejs.org"
  NODE_VERSION=$(node -v)
  ok "Node.js gefunden ($NODE_VERSION)"

  # npm oder bun oder pnpm
  if command -v bun >/dev/null 2>&1; then
    PKG_MANAGER="bun"
    ok "bun gefunden – wird als Package Manager genutzt"
  elif command -v pnpm >/dev/null 2>&1; then
    PKG_MANAGER="pnpm"
    ok "pnpm gefunden – wird als Package Manager genutzt"
  elif command -v npm >/dev/null 2>&1; then
    PKG_MANAGER="npm"
    ok "npm gefunden – wird als Package Manager genutzt"
  else
    fail "Kein Package Manager gefunden (npm/pnpm/bun)"
  fi
}

clone_repo() {
  info "Klone Repository..."

  if [ -d "$DIR" ]; then
    warn "Verzeichnis '$DIR' existiert bereits."
    read -rp "  Überschreiben? (j/n): " CONFIRM
    if [[ "$CONFIRM" =~ ^[jJyY]$ ]]; then
      rm -rf "$DIR"
      ok "Altes Verzeichnis entfernt"
    else
      info "Update bestehende Installation..."
      cd "$DIR"
      git pull
      ok "Repository aktualisiert"
      return
    fi
  fi

  git clone "$REPO" "$DIR"
  ok "Repository geklont"
  cd "$DIR"
}

install_deps() {
  info "Installiere Dependencies ($PKG_MANAGER install)..."
  $PKG_MANAGER install
  ok "Dependencies installiert"
}

create_env() {
  if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
      cp .env.example .env
      ok ".env aus .env.example erstellt"
    else
      cat > .env << 'ENVEOF'
# AtomixOS Cockpit Manager – lokale Konfiguration
# Supabase (optional – nur für Cloud-Sync)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
ENVEOF
      ok ".env Datei erstellt (Supabase optional)"
    fi
  else
    warn ".env existiert bereits – wird nicht überschrieben"
  fi
}

create_launcher() {
  info "Erstelle Start-Script..."

  cat > ../start-atomix.sh << LAUNCHEOF
#!/bin/bash
cd "\$(dirname "\$0")/$DIR"
echo ""
echo "  AtomixOS Cockpit Manager"
echo "  → http://localhost:5173"
echo ""
$PKG_MANAGER run dev
LAUNCHEOF

  chmod +x ../start-atomix.sh
  ok "start-atomix.sh erstellt"
}

print_done() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════╗${RESET}"
  echo -e "${GREEN}║         Installation erfolgreich!        ║${RESET}"
  echo -e "${GREEN}╚══════════════════════════════════════════╝${RESET}"
  echo ""
  echo -e "  ${BLUE}Starten:${RESET}"
  echo ""
  echo -e "    ${YELLOW}Option 1:${RESET} ./start-atomix.sh"
  echo ""
  echo -e "    ${YELLOW}Option 2:${RESET} cd $DIR && $PKG_MANAGER run dev"
  echo ""
  echo -e "  ${BLUE}Browser:${RESET} http://localhost:5173"
  echo ""
  echo -e "  ${BLUE}Update:${RESET}"
  echo -e "    cd $DIR && git pull && $PKG_MANAGER install"
  echo ""
}

# ── Main ─────────────────────────────────────
print_header
check_deps
clone_repo
install_deps
create_env
create_launcher
print_done
