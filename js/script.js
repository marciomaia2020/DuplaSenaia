let savedGames = [];

function validateAndUpdateOptions() {
    const fixedNumbers = [];
    for (let i = 1; i <= 3; i++) {
        const input = document.getElementById(`fixed-number-${i}`);
        if (input.value !== '') {
            fixedNumbers.push(parseInt(input.value));
        }
    }

    for (let i = 1; i <= 3; i++) {
        const input = document.getElementById(`fixed-number-${i}`);
        const value = parseInt(input.value);

        // Limpar valores duplicados
        if (fixedNumbers.indexOf(value) !== fixedNumbers.lastIndexOf(value)) {
            input.value = '';
        }

        // Atualizar min e max
        updateInputOptions(input, fixedNumbers);
    }

    // Habilitar o botão de gerar números se os três inputs estiverem preenchidos
    document.getElementById('generate-btn').disabled = fixedNumbers.length < 3;
}

function updateInputOptions(input, fixedNumbers) {
    const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1);

    // Limpar opções existentes
    input.innerHTML = '';

    // Adicionar opções válidas
    allNumbers.forEach(number => {
        const option = document.createElement("option");
        option.value = number;
        option.text = number;
        input.appendChild(option);
    });

    fixedNumbers.forEach(number => {
        const option = input.querySelector(`option[value="${number}"]`);
        if (option) {
            input.removeChild(option);
        }
    });
}

function generateNumbers() {
    const fixed1 = parseInt(document.getElementById('fixed-number-1').value);
    const fixed2 = parseInt(document.getElementById('fixed-number-2').value);
    const fixed3 = parseInt(document.getElementById('fixed-number-3').value);

    if (isNaN(fixed1) || isNaN(fixed2) || isNaN(fixed3)) {
        alert("Por favor, insira números fixos válidos.");
        return;
    }

    const fixedNumbers = [fixed1, fixed2, fixed3];
    const allNumbers = Array.from({ length: 50 }, (_, i) => i + 1);
    const availableNumbers = allNumbers.filter(num => !fixedNumbers.includes(num));
    const randomNumbers = [];

    while (randomNumbers.length < (6 - fixedNumbers.length)) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const number = availableNumbers.splice(randomIndex, 1)[0];
        randomNumbers.push(number);
    }

    const generatedNumbers = [...fixedNumbers, ...randomNumbers].sort((a, b) => a - b);
    document.getElementById('generated-numbers').innerText = `Números Gerados: ${generatedNumbers.join(', ')}`;
    
    // Habilitar o botão de salvar jogo
    document.getElementById('save-btn').disabled = false;
}

function saveGame() {
    const generatedText = document.getElementById('generated-numbers').innerText;
    if (!generatedText) {
        alert("Nenhum jogo gerado para salvar.");
        return;
    }

    const generatedNumbers = generatedText.replace('Números Gerados: ', '');
    savedGames.push(generatedNumbers);

    const savedGamesDiv = document.getElementById('saved-games');
    savedGamesDiv.innerHTML = savedGames.map(game => `<div>${game}</div>`).join('');
}

function exportToExcel() {
    if (savedGames.length === 0) {
        alert("Nenhum jogo salvo para exportar.");
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(savedGames.map(game => game.split(', ')));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jogos Salvos");
    XLSX.writeFile(workbook, "jogos_dupla_sena.xlsx");
}

document.addEventListener('DOMContentLoaded', () => {
    validateAndUpdateOptions();
});
