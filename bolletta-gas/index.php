<?php
/*
 * Calcolo consumo GAS e Bolletta
 * Form con due letture successive del contatore e le rispettive date.
 * 1) Stampa il consumo nel periodo compreso tra le due date
 * 2) Calcola il costo della bolletta (1 m3 = 0,53 euro)
 */

define('PREZZO_M3', 0.53); // euro per metro cubo

$errori   = [];
$risultato = null;

// Valori del form (ripresentati dopo l'invio)
$data1    = $_POST['data1']    ?? '';
$lettura1 = $_POST['lettura1'] ?? '';
$data2    = $_POST['data2']    ?? '';
$lettura2 = $_POST['lettura2'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // --- Validazione dei dati ---
    $d1 = DateTime::createFromFormat('!Y-m-d', $data1);
    $d2 = DateTime::createFromFormat('!Y-m-d', $data2);

    if (!$d1) $errori[] = 'Inserire una data valida per la prima lettura.';
    if (!$d2) $errori[] = 'Inserire una data valida per la seconda lettura.';
    if ($d1 && $d2 && $d2 <= $d1) {
        $errori[] = 'La data della seconda lettura deve essere successiva alla prima.';
    }

    if (!is_numeric($lettura1) || $lettura1 < 0) {
        $errori[] = 'La prima lettura deve essere un numero positivo.';
    }
    if (!is_numeric($lettura2) || $lettura2 < 0) {
        $errori[] = 'La seconda lettura deve essere un numero positivo.';
    }
    if (is_numeric($lettura1) && is_numeric($lettura2) && $lettura2 < $lettura1) {
        $errori[] = 'La seconda lettura non può essere inferiore alla prima.';
    }

    // --- Calcolo ---
    if (empty($errori)) {
        $consumo = $lettura2 - $lettura1;          // m3 consumati
        $costo   = $consumo * PREZZO_M3;           // euro
        $giorni  = $d1->diff($d2)->days;           // durata del periodo

        $risultato = [
            'dal'     => $d1->format('d/m/Y'),
            'al'      => $d2->format('d/m/Y'),
            'giorni'  => $giorni,
            'consumo' => $consumo,
            'costo'   => $costo,
        ];
    }
}

// Formatta un numero all'italiana (virgola decimale, punto per le migliaia)
function num($n, $dec = 2) {
    return number_format($n, $dec, ',', '.');
}

// Protegge l'output HTML
function h($s) {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Calcolo consumo GAS e Bolletta</title>
    <style>
        body { font-family: Arial, sans-serif; background: #eef2f5; margin: 0; padding: 20px; }
        .box { max-width: 520px; margin: 0 auto; background: #fff; padding: 24px;
               border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.1); }
        h1 { font-size: 1.4em; margin-top: 0; color: #1f4e79; }
        fieldset { border: 1px solid #ccd; border-radius: 6px; margin-bottom: 14px; }
        legend { font-weight: bold; color: #1f4e79; }
        label { display: block; margin: 8px 0 4px; }
        input { width: 100%; padding: 7px; box-sizing: border-box; border: 1px solid #aab; border-radius: 4px; }
        button { padding: 10px 18px; border: 0; border-radius: 4px; cursor: pointer; font-size: 1em; }
        .calcola { background: #1f4e79; color: #fff; }
        .reset { background: #ccc; }
        .errori { background: #fde2e2; color: #900; padding: 10px 14px; border-radius: 6px; }
        .bolletta { margin-top: 20px; border: 2px dashed #1f4e79; padding: 16px; border-radius: 6px; }
        .bolletta table { width: 100%; border-collapse: collapse; }
        .bolletta td { padding: 6px 4px; border-bottom: 1px solid #eee; }
        .bolletta td:last-child { text-align: right; }
        .totale td { font-weight: bold; font-size: 1.15em; border-top: 2px solid #1f4e79; }
        @media print { form, .noprint { display: none; } body { background: #fff; } .box { box-shadow: none; } }
    </style>
</head>
<body>
<div class="box">
    <h1>Calcolo consumo GAS e Bolletta</h1>

    <?php if ($errori): ?>
        <div class="errori">
            <ul>
                <?php foreach ($errori as $e): ?>
                    <li><?= h($e) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form method="post" action="">
        <fieldset>
            <legend>Prima lettura</legend>
            <label for="data1">Data</label>
            <input type="date" id="data1" name="data1" value="<?= h($data1) ?>" required>
            <label for="lettura1">Lettura contatore (m³)</label>
            <input type="number" id="lettura1" name="lettura1" min="0" step="0.001" value="<?= h($lettura1) ?>" required>
        </fieldset>

        <fieldset>
            <legend>Seconda lettura</legend>
            <label for="data2">Data</label>
            <input type="date" id="data2" name="data2" value="<?= h($data2) ?>" required>
            <label for="lettura2">Lettura contatore (m³)</label>
            <input type="number" id="lettura2" name="lettura2" min="0" step="0.001" value="<?= h($lettura2) ?>" required>
        </fieldset>

        <button type="submit" class="calcola">Calcola bolletta</button>
        <button type="reset" class="reset" onclick="location.href=location.pathname; return false;">Nuovo calcolo</button>
    </form>

    <?php if ($risultato): ?>
        <div class="bolletta">
            <h2>Bolletta GAS</h2>
            <table>
                <tr><td>Periodo</td><td>dal <?= $risultato['dal'] ?> al <?= $risultato['al'] ?></td></tr>
                <tr><td>Giorni</td><td><?= $risultato['giorni'] ?></td></tr>
                <tr><td>Lettura iniziale</td><td><?= num($lettura1, 3) ?> m³</td></tr>
                <tr><td>Lettura finale</td><td><?= num($lettura2, 3) ?> m³</td></tr>
                <tr><td>1) Consumo nel periodo</td><td><?= num($risultato['consumo'], 3) ?> m³</td></tr>
                <tr><td>Prezzo unitario</td><td>€ <?= num(PREZZO_M3) ?> / m³</td></tr>
                <tr class="totale"><td>2) Totale bolletta</td><td>€ <?= num($risultato['costo']) ?></td></tr>
            </table>
            <p class="noprint"><button class="calcola" onclick="window.print()">Stampa bolletta</button></p>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
