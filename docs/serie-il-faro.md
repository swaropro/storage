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
