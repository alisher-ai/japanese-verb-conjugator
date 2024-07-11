async function fetchConjugations() {
    const verb = document.getElementById('verbInput').value.trim();
    const resultDiv = document.getElementById('result');

    // Clear previous result
    resultDiv.innerHTML = '';

    if (!verb) {
        resultDiv.innerHTML = '<p>Please enter a verb.</p>';
        return;
    }

    const encodedVerb = encodeURIComponent(verb);
    const apiUrl = `https://jisho.org/api/v1/search/words?keyword=${encodedVerb}`;
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${apiUrl}`;

    console.log(`Fetching data from: ${proxyUrl}`);

    try {
        const response = await fetch(proxyUrl, {
            headers: {
                'Origin': 'https://your-website.github.io' // replace with your GitHub Pages URL
            }
        });
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);

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
            <p>Dictionary form: ${word}</p>
            <p>Masu form: ${reading}ます</p>
            <p>Te form: ${reading}て</p>
            <p>Nai form: ${reading}ない</p>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>Error fetching data from Jisho API: ${error.message}</p>`;
        console.error('Error:', error);
    }
}
