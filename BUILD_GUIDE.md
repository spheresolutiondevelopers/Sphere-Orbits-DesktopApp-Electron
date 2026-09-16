# 🛠️ Sphere Orbits – Windows Executable & Installer Build Guide

This comprehensive guide covers how to build, package, and troubleshoot the standalone Windows Executable (`.exe`) and NSIS Installer for **Sphere Orbits Desktop**.

---

## 📋 Table of Contents

1. [Overview & Build Outputs](#-overview--build-outputs)
2. [Prerequisites & Environment Setup](#-prerequisites--environment-setup)
3. [Quick Start: Build in 3 Commands](#-quick-start-build-in-3-commands)
4. [Step-by-Step Detailed Build Process](#-step-by-step-detailed-build-process)
5. [Configuration Deep Dive (`electron-builder.yml`)](#-configuration-deep-dive-electron-builderyml)
6. [Native Modules & ABI Handling (`better-sqlite3`, `keytar`)](#-native-modules--abi-handling-better-sqlite3-keytar)
7. [Code Signing & SmartScreen Warnings](#-code-signing--smartscreen-warnings)
8. [Troubleshooting & FAQs](#-troubleshooting--faqs)
9. [Automated CI/CD Workflow (GitHub Actions)](#-automated-cicd-workflow-github-actions)

---

## 📦 Overview & Build Outputs

Sphere Orbits uses **Turborepo** + **pnpm** for monorepo package compilation and **Electron Builder** for packaging and generating Windows distribution binaries.

When you run the build commands, the resulting files are placed into the `release/` directory:

| Artifact | Location | Description |
| :--- | :--- | :--- |
| **NSIS Installer** | `release/Sphere Orbits Setup <version>.exe` | User-friendly setup wizard. Installs shortcuts, handles uninstallation, and configures file associations. |
| **Blockmap File** | `release/Sphere Orbits Setup <version>.exe.blockmap` | Used by electron-updater for efficient differential / delta auto-updates. |
| **Unpacked Executable** | `release/win-unpacked/Sphere Orbits.exe` | Portable, unpacked application folder. Great for rapid local testing without installing. |
| **Asar Archive** | `release/win-unpacked/resources/app.asar` | Encapsulated production bundles (Main, Preload, Renderer, Domain, Data, Shared). |
| **Extra Resources** | `release/win-unpacked/resources/database/migrations` | SQLite migration `.sql` scripts bundled outside ASAR for runtime execution. |

---

## 💻 Prerequisites & Environment Setup

Before building on Windows, ensure the following tools are installed on your machine:

### 1. Node.js & pnpm
- **Node.js**: Version `v20.x` or `v22.x` LTS recommended (Minimum: `v18.x`).
  - Verify: `node -v`
- **pnpm**: Version `8.15.0+` or `9.x`.
  - Install pnpm: `npm install -g pnpm`
  - Verify: `pnpm -v`

### 2. Windows C++ Build Tools & Python (Crucial for Native Modules)
The application relies on C++ native add-ons (`better-sqlite3` and `keytar`). Node-gyp requires a C++ compiler and Python to build them for the Electron ABI.

#### Recommended Setup via Visual Studio Installer:
1. Download and run the **[Visual Studio Installer](https://visualstudio.microsoft.com/downloads/)** (Community Edition is free).
2. Under **Workloads**, select:
   - **Desktop development with C++**
3. Ensure the installation includes:
   - *MSVC v143 - VS 2022 C++ x64/x86 build tools*
   - *Windows 10 or 11 SDK*
4. Ensure **Python 3.10+** is installed and accessible in your system `PATH`:
   - Verify: `python --version`

---

## ⚡ Quick Start: Build in 3 Commands

From the root project folder:

```powershell
# 1. Install all dependencies and rebuild native modules for Electron
pnpm install

# 2. Compile all packages (shared, domain, data, preload, renderer, main)
pnpm run build

# 3. Create the Windows NSIS installer and unpacked .exe
pnpm run dist:win
```

Your installer will be generated at:
`./release/Sphere Orbits Setup 1.0.0.exe`

---

## 🔍 Step-by-Step Detailed Build Process

### Step 1: Clone & Clean Dependency Installation
```powershell
git clone <repo-url>
cd sphere-orbits-desktop-electron-app

# Install dependencies (runs 'electron-builder install-app-deps' automatically via postinstall)
pnpm install
```

> **Note:** The `postinstall` hook triggers `electron-builder install-app-deps`, which downloads or compiles the prebuilt binaries of `better-sqlite3` and `keytar` specifically for the active Electron version.

### Step 2: Environment Configuration
Create or verify your `.env` file in the project root:
```powershell
cp .env.example .env
```
Ensure required environment variables like `API_BASE_URL`, `ENCRYPTION_KEY`, etc., are configured properly for production.

### Step 3: Generate Application Icons (If Missing or Updated)
Icons must be present in `build/` and `public/icons/`:
- `build/icon.ico` (Windows executable & installer icon)
- `build/icon.png` (Linux / general)
- `build/icon.icns` (macOS)

If you modify the brand icon or need to recreate them, run:
```powershell
node make-icons.js
```

### Step 4: Compile TypeScript and Vite Packages
Use Turborepo to build all monorepo packages in their topological dependency order:
```powershell
pnpm run build
```
This builds:
1. `packages/shared` (TypeScript compiler `tsc`)
2. `packages/domain` (TypeScript compiler `tsc`)
3. `packages/data` (TypeScript compiler `tsc`)
4. `packages/preload` (Vite build)
5. `packages/renderer` (Vite + React + Tailwind build)
6. `packages/main` (Vite bundle)

### Step 5: Package the Application

Choose the command matching your target output:

#### Option A: Build the NSIS Installer (`.exe`)
```powershell
pnpm run dist:win
```
- Compiles the project and runs `electron-builder --win`.
- Produces `release/Sphere Orbits Setup 1.0.0.exe`.

#### Option B: Pack Unpacked Executable Directory (Fast Testing)
```powershell
pnpm run pack
```
- Compiles the project and runs `electron-builder --dir`.
- Generates `release/win-unpacked/Sphere Orbits.exe` directly without generating an installer.
- Run `.\release\win-unpacked\"Sphere Orbits.exe"` to test immediately.

---

## ⚙️ Configuration Deep Dive (`electron-builder.yml`)

The packaging parameters are controlled by `electron-builder.yml`. Key configurations explained:

```yaml
appId: com.sphere.orbits
productName: Sphere Orbits
copyright: Copyright © 2025 Sphere Solutions

directories:
  output: release              # Destination for built installers and binaries
  buildResources: build        # Location of icon.ico, icon.png, etc.

asar: true                     # Packages application code into encrypted/compressed archive
npmRebuild: true               # Ensures native modules are matched to the Electron ABI

files:                         # Bundle only compiled output files
  - packages/main/dist/**/*
  - packages/preload/dist/**/*
  - packages/renderer/dist/**/*
  - packages/data/dist/**/*
  - packages/domain/dist/**/*
  - packages/shared/dist/**/*
  - "!**/*.map"                # Exclude source maps from production bundle
  - "!**/*.ts"

extraResources:                # Extra files preserved outside the asar archive
  - from: packages/main/src/database/migrations
    to: database/migrations
    filter:
      - "*.sql"

win:
  target:
    - target: nsis             # Nullsoft Scriptable Install System
      arch:
        - x64                  # 64-bit architecture
  icon: build/icon.ico

nsis:
  oneClick: false                           # Shows standard wizard (Destination, options)
  perMachine: false                         # Installs per-user (no Administrator prompt needed)
  allowToChangeInstallationDirectory: true  # Enables custom install directory selection
  deleteAppDataOnUninstall: false           # Retains user SQLite database upon uninstallation
  createDesktopShortcut: true               # Generates desktop icon
  createStartMenuShortcut: true             # Adds app to Windows Start menu
  shortcutName: Sphere Orbits
```

---

## 🧩 Native Modules & ABI Handling (`better-sqlite3`, `keytar`)

Electron uses a different Node ABI (Application Binary Interface) version than your system's Node.js runtime. If native modules are compiled with system Node instead of Electron, the app crashes on launch with an error like:

> `Error: The module '...better_sqlite3.node' was compiled against a different Node.js version using NODE_MODULE_VERSION XX. This version of Electron requires NODE_MODULE_VERSION YY.`

### How to Fix / Force Rebuild:

#### Method 1: Using electron-builder's app deps tool (Recommended)
```powershell
pnpm exec electron-builder install-app-deps
```

#### Method 2: Using @electron/rebuild
```powershell
# Rebuild all native modules for current Electron version
pnpm exec electron-rebuild -f -w @sphere/data

# Or target specific module
pnpm exec electron-rebuild -f -m node_modules/better-sqlite3
```

---

## 🛡️ Code Signing & SmartScreen Warnings

When distributing `.exe` files on Windows, unsigned binaries will trigger **Windows Defender SmartScreen**:
> *"Windows protected your PC - Microsoft Defender SmartScreen prevented an unrecognized app from starting."*

### For Local / Internal Testing:
Users can bypass this by clicking:
1. **More info**
2. **Run anyway**

### For Production Releases:
To eliminate SmartScreen warnings, sign the executable using a Trusted Code Signing Certificate (EV or Standard):

1. Obtain a certificate (`.pfx` file or Hardware Token / Cloud HSM like Azure Key Vault).
2. Configure environment variables before building:
   ```powershell
   $env:CSC_LINK = "C:\path\to\certificate.pfx"
   $env:CSC_KEY_PASSWORD = "YourCertificatePassword"
   ```
3. Run `pnpm run dist:win`. Electron Builder will automatically invoke `signtool.exe` to sign both the installer and the inner executable.

---

## 🔧 Troubleshooting & FAQs

### 1. NSIS Error: `!include: could not open file: ...allowOnlyOneInstallerInstance.nsh` (`ERR_ELECTRON_BUILDER_CANNOT_EXECUTE`)
- **Cause:** **Windows 260-character path length limit (`MAX_PATH`)**. When using `pnpm` on Windows, nested package paths in `node_modules\.pnpm\...` exceed 260 characters, which causes the 32-bit NSIS compiler (`makensis.exe`) to fail to open template files.
- **Solution Options:**
  - **Option A (Instant – No Reinstall Needed): Virtual Drive `subst`**:
    Map your project directory to a short drive letter (e.g. `X:`) in PowerShell:
    ```powershell
    subst X: "C:\Users\lenovo\Projects\sheduling and planning\sphere-orbits-desktop-electron-app"
    X:
    pnpm run dist:win
    ```
    *(When finished, you can remove the drive mapping anytime with `subst X: /d`)*.
  - **Option B (Permanent via `.npmrc`)**:
    We have added a `.npmrc` file with `shamefully-hoist=true` to create a flat dependency layout. Run:
    ```powershell
    pnpm install
    pnpm run dist:win
    ```
  - **Option C (Windows Long Path Registry Fix)**:
    In PowerShell (Run as Administrator), enable long paths system-wide:
    ```powershell
    New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
    ```
  - **Note on the Standalone Executable:**
    The standalone executable itself **was already built successfully** and is located at:
    `release/win-unpacked/Sphere Orbits.exe` (run it directly without an installer).

### 2. `node-gyp` or MSBuild error during install: `MSB8020` or `MSBuild.exe not found`
- **Cause:** Visual Studio C++ build tools are missing or `node-gyp` cannot locate them.
- **Solution:**
  1. Open Visual Studio Installer -> Modify -> ensure **Desktop development with C++** is checked.
  2. In PowerShell (Run as Administrator), run:
     ```powershell
     npm config set msvs_version 2022
     ```

### 3. Error: `Cannot find module .../migrations/*.sql`
- **Cause:** Migrations are missing from the packaged resources directory.
- **Solution:** Verify `extraResources` in `electron-builder.yml`. When running in production, ensure `process.resourcesPath` is referenced in the database migration loader:
  ```typescript
  const migrationsPath = app.isPackaged
    ? path.join(process.resourcesPath, 'database/migrations')
    : path.join(__dirname, '../database/migrations');
  ```

### 4. App window is blank or white screen on start
- **Cause:** Renderer build missing or incorrect base path in `index.html`.
- **Solution:** 
  1. Run `pnpm run build` to ensure `packages/renderer/dist/index.html` exists.
  2. Ensure `vite.config.ts` in `packages/renderer` has `base: './'` so assets load relatively via `file://`.

### 5. Cache issues during Turborepo build
- **Solution:** Clean Turborepo cache and previous build outputs:
  ```powershell
  pnpm run clean
  pnpm run build
  ```

---

## 🤖 Automated CI/CD Workflow (GitHub Actions)

To automatically compile and release the Windows installer whenever you push a Git tag (e.g. `v1.0.0`), add the following workflow to `.github/workflows/build-windows.yml`:

```yaml
name: Build Windows Installer

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-windows:
    runs-on: windows-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 8.15.0

      - name: Install Dependencies
        run: pnpm install

      - name: Build Application Packages
        run: pnpm run build

      - name: Package Windows Installer
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm run dist:win

      - name: Upload Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: windows-installer
          path: |
            release/*.exe
            release/*.blockmap
```

---

## 📞 Support & Resources

- **Project Lead:** Sphere Solution Developers
- **Email:** spheresolutiondevelopers@gmail.com
- **Website:** [https://sphereschedule.io](https://sphereschedule.io)
