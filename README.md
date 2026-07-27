# YBS – Young Business Schmallenberg (statische Design-Vorschau)

Statische HTML/CSS-Vorschau für den Relaunch der YBS-Webseite und die
**YBS Summer Summit 2026** Event-Landingpage. Noch kein WordPress – reines
Frontend zur Designabstimmung.

## Seiten

| Datei | Inhalt |
|-------|--------|
| `index.html` | YBS Hauptseite (Startseite) |
| `summer-summit.html` | Summer Summit 2026 – Event-Landingpage |

Styles: `styles.css` (Hauptmarke), `summer-summit.css` (Event-Sub-Identität).
Bilder & Logos liegen unter `assets/`.

## Lokal ansehen

Einfach `index.html` im Browser öffnen – oder ein kleiner lokaler Server:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 aufrufen
```

## Live schalten via GitHub Pages

1. Dieses Repo zu GitHub pushen (siehe unten).
2. Im Repo unter **Settings → Pages**:
   - **Source:** „Deploy from a branch"
   - **Branch:** `main` / Ordner `/ (root)`
3. Nach ca. 1 Minute ist die Seite unter
   `https://<dein-user>.github.io/<repo-name>/` erreichbar.

Die Datei `.nojekyll` sorgt dafür, dass GitHub Pages die Dateien unverändert
ausliefert.

## Hinweise (Platzhalter, noch zu ersetzen)

- Ticketpreise und ticket.io-Einbindung sind Platzhalter.
- Speaker-Bios sind Entwurfstext.
- Unterschriften des Vorstands sind aktuell als Handschrift-Font gesetzt.
- Impressum/Datenschutz noch nicht befüllt.
