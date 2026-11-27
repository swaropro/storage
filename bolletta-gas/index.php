<!DOCTYPE html>
<html>
<head>
    <title>Bolletta gas</title>
</head>
<body>

    <h1>Calcolo consumo GAS e Bolletta</h1>

    <form method="post" action="">

        <label>Data prima lettura:</label>
        <input type="date" name="data1" required>
        <br><br>

        <label>Prima lettura (m3):</label>
        <input type="number" name="lettura1" required>
        <br><br>

        <label>Data seconda lettura:</label>
        <input type="date" name="data2" required>
        <br><br>

        <label>Seconda lettura (m3):</label>
        <input type="number" name="lettura2" required>
        <br><br>

        <input type="submit" value="Calcola bolletta">

    </form>

    <?php

    if (isset($_POST['lettura1'])) {

        $data1 = $_POST['data1'];
        $data2 = $_POST['data2'];
        $lettura1 = $_POST['lettura1'];
        $lettura2 = $_POST['lettura2'];

        // Prezzo di un metro cubo di gas
        $prezzo = 0.53;

        if ($lettura2 < $lettura1) {

            echo "<p>Errore: la seconda lettura deve essere maggiore della prima.</p>";

        } else {

            // 1) Calcolo del consumo
            $consumo = $lettura2 - $lettura1;

            // 2) Calcolo del costo della bolletta
            $costo = $consumo * $prezzo;

            echo "<h2>Bolletta</h2>";

            echo "<ul>";
            echo "<li>Periodo: dal $data1 al $data2</li>";
            echo "<li>Prima lettura: $lettura1 m3</li>";
            echo "<li>Seconda lettura: $lettura2 m3</li>";
            echo "<li>Consumo: $consumo m3</li>";
            echo "<li>Prezzo: $prezzo euro al m3</li>";
            echo "<li>Totale bolletta: " . number_format($costo, 2, ",", ".") . " euro</li>";
            echo "</ul>";
        }

    }

    ?>

</body>
</html>
