# IL FARO — serie di YouTube Shorts

**Formato:** video verticali 1080×1920, 55–65 secondi l'uno.
**Ispirazione:** il formato del video di riferimento (narrazione in seconda persona, premio enorme, una regola, contatore che sale, scoperta inquietante, scelta finale nei commenti). Storia, ambientazione e grafica sono originali.

## Il concetto

Ti offrono **un milione di euro** per fare il guardiano di un faro automatico su uno scoglio in mezzo al mare per **40 notti**.
C'è **una sola regola**: la luce del faro non si deve spegnere. Mai.

Ogni episodio finisce con una **scelta** che il pubblico vota nei commenti. L'episodio dopo segue la risposta più votata. Così chi guarda torna per sapere com'è andata, e i commenti spingono l'algoritmo.

### Elementi fissi di ogni episodio (il "marchio" della serie)
- In alto: badge **IL FARO · EP.N**, contatore **NOTTE N** e **€** che sale (25.000 € a notte).
- Sottotitoli grandi, parola per parola; le parole chiave in **giallo** (premi, numeri) e in **rosso** (pericolo).
- Il faro sempre presente sullo sfondo, con il fascio di luce che gira: è il "personaggio" della serie.
- Chiusura con due pulsanti di scelta e **"SCRIVILO NEI COMMENTI"**.

## Gli episodi

| Ep. | Titolo | Cosa succede | Scelta finale |
|---|---|---|---|
| **1** | **La regola** | Arrivi sull'isola. Nel registro trovi i nomi di **sei guardiani**: tutti hanno scritto fino alla notte 39, poi più niente. Notte 39, ore 2:14: la radio si accende da sola: "Spegni la luce. Quelle che stai guidando non sono navi." | **ACCESA** o **SPENTA** |
| 2A | Accesa | Le luci nella nebbia si avvicinano. Sullo scoglio, sotto il faro, compaiono impronte bagnate che salgono le scale. | Chiudi la porta / Guardi giù |
| 2B | Spenta | Buio totale. Le luci in mare si fermano. Poi la radio, con la tua voce: "Riaccendila." | Riaccendi / Rispondi alla radio |
| 3 | Il settimo nome | In fondo al registro c'è una pagina strappata. Sopra, scritto a matita, c'è il **tuo nome** e la data di oggi. | Leggi / Bruci la pagina |
| 4 | Notte 40 | Arriva la barca. Il pilota non è quello dell'andata, e conosce il tuo nome. | Sali / Resti |
| 5 | Il guardiano | Il finale: chi accende davvero il faro, e perché pagano un milione. | Finale deciso dal pubblico |

## Episodio 1 — "La regola" (≈62 s)

| Tempo | Scena | Voce narrante | Grafica |
|---|---|---|---|
| 0–6 s | Gancio | Un milione di euro. Quaranta notti su un'isola. Nessuno è mai arrivato in fondo. | €1.000.000 e 40 NOTTI sopra il faro |
| 6–15 s | La regola | Il lavoro è semplice: tenere acceso il faro. C'è una sola regola. La luce non si spegne. Mai. | Contratto con firma e timbro "MAI" |
| 15–24 s | L'arrivo | Una barca ti lascia sullo scoglio. Viveri. Una radio. Un registro. Niente telefono. La barca torna tra quaranta notti. | La barca che si allontana, gli oggetti che compaiono |
| 24–33 s | La routine | Notte tre. Il vento non si ferma mai. Notte undici. Venticinquemila euro a notte, solo per guardare il buio. | Contatore delle notti e dei soldi che salgono |
| 33–45 s | Il registro | Notte trentasette. Sfogli il registro. Ci sono i nomi di chi c'era prima di te. Sei guardiani. Tutti hanno scritto fino alla notte trentanove. Poi, più niente. | Pagina del registro, sei nomi, tutti fermi a "39" |
| 45–54 s | La radio | Notte trentanove. Le 2:14. La radio si accende da sola. «Spegni la luce. Adesso.» «Quelle che stai guidando non sono navi.» | 2:14 rosso, la radio con l'onda della voce, luci nella nebbia |
| 54–62 s | La scelta | Il contratto è chiaro: se la luce si spegne, perdi tutto. Allora, cosa fai? Scrivi ACCESA o SPENTA. Decidi tu la notte quaranta. | Pulsanti ACCESA / SPENTA e "SCRIVILO NEI COMMENTI" |

## Voce e sottotitoli (fatto per l'ep. 1)

- **Voce:** ElevenLabs, voce *Dade M – Mysterious Suspense Narrator* (italiano), modello `eleven_v4` con tag di regia ([pause], [whispers]…). File: `public/il-faro/ep1-voce.mp3` (take 1; la take 2 è in `assets/il-faro/`).
- **Tempi parola per parola:** trascrizione ElevenLabs Scribe → `assets/il-faro/ep1-words.json`.
- **Sottotitoli:** `npm run captions -- assets/il-faro/ep1-words.json src/IlFaro/ep1-captions.json` (riprende i colori dal copione).
- Le scene e le animazioni sono allineate ai tempi della voce (65,8 s di parlato + 1,7 s di coda).

## Cosa manca ancora

1. **Musica e suoni**: tappeto ambient, vento, onde, rumore della radio.
2. *(Facoltativo)* **Illustrazioni** in stile cartone come il video di riferimento: personaggio e ambienti disegnati, generati con un modello di immagini o forniti da te. Ora la grafica è fatta tutta in codice (forme vettoriali).

## Ep. 1 v2 — personaggio, camera e suoni

Composizione `IlFaroEp1` (codice in `src/IlFaro/v2/`). La prima bozza resta come `IlFaroEp1Bozza`.

- **Il guardiano** (`Keeper.tsx`): omino con impermeabile giallo e berretto rosso. Cammina, salta, si siede, alza le braccia, cambia espressione.
- **Il mondo** (`World.tsx` + `timeline.ts`): vista laterale con isola, pontile, faro e barca; camera con zoom e carrellate; il cielo cambia colore con la tensione (tramonto → notte → verde malato → rosso).
- **Interni** (`Room.tsx`): la stanza con il registro (lampada che tremola) e la radio che si accende al buio.
- **Grafiche** (`Overlays.tsx`): contratto con timbro, registro, orologio 2:14, fumetti della radio, carte A/B con conto alla rovescia.

### Suoni (ElevenLabs Sound Effects v2, 170 crediti in tutto)

| File | Uso | Quando |
|---|---|---|
| `amb-a-mare-calmo.mp3` (loop 10 s) | mare calmo | 0–26 s |
| `amb-b-vento.mp3` (loop 10 s) | vento forte | 25–35 s |
| `amb-c-stanza.mp3` (loop 10 s) | stanza inquietante | 34–46 s |
| `amb-d-terrore.mp3` (loop 10 s) | terrore, nebbia | 45–67 s |
| `sfx-timbro.mp3` | timbro "MAI" | 14,5 s |
| `sfx-barca.mp3` | la barca riparte | 17 s |
| `sfx-radio.mp3` | la radio si accende | 48,7 s |
| `sfx-boom.mp3` | 2:14 e "non sono navi" | 45,75 s · 54,3 s |

Risparmio crediti: ambienti brevi in loop (non tracce lunghe), una sola versione per suono, effetti riusati. Volumi bilanciati con ffmpeg. Gli ambienti si incrociano con dissolvenze di 1 s (`Soundtrack.tsx`) e sono riutilizzabili negli episodi successivi.

## Ep. 2 — "Spenta" (48 s) · composizione `IlFaroEp2`

Segue la scelta **B · SPENTA** dell'ep. 1. Codice: `src/IlFaro/v2/Episode2.tsx`, `ep2Scene.tsx`, `Boatman.tsx`, `GroundFloor.tsx`. Copione con i colori: `src/IlFaro/ep2/script.ts`.

| Tempo | Cosa succede | Suono |
|---|---|---|
| 0–2 s | "AVETE SCELTO: B · SPENTA"; il guardiano ha la mano sulla leva, la luce ancora accesa | ronzio di terrore |
| 2–6 s | "Spegni la luce": tira la leva, il faro si spegne, tutto diventa nero | leva + spegnimento |
| 6–16 s | Buio; il vento si ferma; le luci nel mare si fermano e si spengono una alla volta | silenzio quasi totale |
| 16–19 s | "Hai perso il milione": il contatore scende a €0 e viene barrato; il guardiano respira | silenzio |
| 19–25 s | Tre colpi alla porta del faro, una lanterna accesa accanto alla porta (TOC. TOC. TOC.) | tre colpi |
| 25–29 s | Il guardiano scende le scale e va alla finestra; fuori, la luce della lanterna | stanza inquieta |
| 29–36 s | **L'antagonista**: primo piano del barcaiolo nell'oblò, il sorriso che si allarga; fumetto "Sei il primo che la spegne. Aprimi… ti spiego tutto." | colpo sordo |
| 36–42 s | Il barcaiolo alla porta con la lanterna; dietro di lui gli occhi nel mare si riaccendono, e anche i suoi diventano verdi | colpo sordo, terrore |
| 42–48 s | Scelta: **A · APRI LA PORTA** / **B · RIACCENDI LA LUCE**, conto alla rovescia | terrore |

**L'antagonista — il barcaiolo:** cappotto scuro, cappello a tesa larga, barba grigia, lanterna. È l'uomo che ha portato il guardiano sull'isola, e i suoi occhi si accendono dello stesso verde delle "luci" nel mare.

**Crediti ElevenLabs ep. 2:** voce 626 (1 sola take) + 2 effetti nuovi 18 (colpi alla porta, leva) + trascrizione 0 = **644**. Gli ambienti e il colpo sordo sono riusati dall'ep. 1.

### Idee per l'ep. 3
- **A · Apri la porta:** il barcaiolo entra e racconta che i sei guardiani prima di lui non sono mai ripartiti: sono diventati le "luci" nel mare. Il faro non guida le navi: le tiene lontane.
- **B · Riaccendi la luce:** gli occhi si fermano, ma il barcaiolo non se ne va. Comincia a salire le scale esterne verso il ballatoio.

## Ep. 1 v3 — una sola notte con un imprevisto (65 s)

Al posto del montaggio delle notti 3 → 11 → 37 (e del registro) c'è **una notte con un imprevisto risolto subito**, poi si va dritti alla notte 39.

| Tempo | Cosa succede | Suono |
|---|---|---|
| 0–25 s | Gancio, contratto, arrivo in barca (come prima) | mare calmo, timbro, barca |
| 25–31 s | **Notte 12**: tempesta, pioggia, lampi; il guardiano alla base del faro; la luce trema | vento forte, tuono |
| 31–33 s | Un fulmine: **la luce si spegne**. "Hai pochi secondi." | tuono |
| 33–38 s | Corre alla porta, poi sul ballatoio fino alla **leva del generatore**: la luce torna | generatore che riparte |
| 38–43 s | Respira. "Nessuno se n'è accorto… o almeno, così credi": due occhi si aprono un istante sotto il pontile | silenzio sospeso |
| 43–65 s | **Notte 39**: 2:14, la radio, "non sono navi", scelta ACCESA / SPENTA | terrore |

La leva del generatore è la stessa dell'ep. 2 (lì la abbassa per spegnere).

- **Voce:** è stata rigenerata solo la parte nuova (234 crediti, 1 take) e unita con ffmpeg all'inizio e alla fine della voce originale → `public/il-faro/ep1-voce-v3.mp3`. Tempi parola per parola: `assets/il-faro/ep1-words-v3.json`; sottotitoli: `src/IlFaro/ep1/captions.json` (copione con colori in `src/IlFaro/ep1/script.ts`).
- **Suoni nuovi:** `sfx-tuono.mp3` (10 crediti), `sfx-generatore.mp3` (8 crediti). Totale ep. 1 v3: **252 crediti**.
- La voce e le parole della v2 restano in `assets/il-faro/` (`ep1-voce-v1.mp3`, `ep1-words-v1.json`).
