async function fetchConjugations() {
    const verb = document.getElementById('verbInput').value;
    const resultDiv = document.getElementById('result');

    // Clear previous result
    resultDiv.innerHTML = '';

    if (!verb) {
        resultDiv.innerHTML = '<p>Please enter a verb.</p>';
        return;
    }

    try {
        const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${verb}`);
        const data = await response.json();

        if (data.data.length === 0) {
            resultDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        const entry = data.data[0];
        const word = entry.japanese[0].word || entry.japanese[0].reading;
        const reading = entry.japanese[0].reading;
        const senses = entry.senses.map(sense => sense.english_definitions.join(', ')).join('; ');

        resultDiv.innerHTML = `
            <h2>Results for: ${word}</h2>
            <p>Reading: ${reading}</p>
            <p>Meaning: ${senses}</p>
            <h3>Conjugations:</h3>
            <p>Dictionary form: ${entry.japanese[0].word || entry.japanese[0].reading}</p>
            <p>Masu form: ${entry.japanese[0].reading}ます</p>
            <p>Te form: ${entry.japanese[0].reading}て</p>
            <p>Nai form: ${entry.japanese[0].reading}ない</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = '<p>Error fetching data from Jisho API.</p>';
        console.error('Error:', error);
    }
}
