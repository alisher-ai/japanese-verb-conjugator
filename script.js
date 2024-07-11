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
                'Origin': 'https://<your-username>.github.io/<your-repo-name>' // replace with your GitHub Pages URL
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

        // Display basic information
        resultDiv.innerHTML = `
            <h2>Results for: ${word}</h2>
            <p>Reading: ${reading}</p>
            <p>Meaning: ${senses}</p>
            <h3>Conjugations:</h3>
        `;

        // Fetch and display inflections if available
        if (entry.japanese[0].word) {
            const inflectionsUrl = `https://jisho.org/search/${entry.japanese[0].word}%20#inflections`;
            const inflectionsProxyUrl = `https://cors-anywhere.herokuapp.com/${inflectionsUrl}`;
            const inflectionsResponse = await fetch(inflectionsProxyUrl, {
                headers: {
                    'Origin': 'https://<your-username>.github.io/<your-repo-name>' // replace with your GitHub Pages URL
                }
            });

            const inflectionsText = await inflectionsResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(inflectionsText, 'text/html');
            const inflectionsTable = doc.querySelector('.conjugation-wrapper');

            if (inflectionsTable) {
                resultDiv.innerHTML += inflectionsTable.outerHTML;
            } else {
                resultDiv.innerHTML += '<p>No inflections found.</p>';
            }
        } else {
            resultDiv.innerHTML += '<p>No inflections found.</p>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Error fetching data from Jisho API: ${error.message}</p>`;
        console.error('Error:', error);
    }
}
