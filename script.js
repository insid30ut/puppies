const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');

const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

// Helper to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fetch 3 random dogs
async function fetchDogs() {
    try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random/3');
        if (!res.ok) return [];
        const data = await res.json();
        return data.message || [];
    } catch {
        return [];
    }
}

// Fetch 3 random cats
async function fetchCats() {
    try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=3');
        if (!res.ok) return [];
        const data = await res.json();
        // The API might return more or fewer items
        return data.slice(0, 3).map(cat => cat.url);
    } catch {
        return [];
    }
}

// Fetch 3 random bunnies
async function fetchBunnies() {
    const promises = [];
    for (let i = 0; i < 3; i++) {
        promises.push(
            fetch('https://api.bunnies.io/v2/loop/random/?media=gif,png')
            .then(res => res.json())
            .then(data => data.media.gif)
            .catch(() => null)
        );
    }
    const results = await Promise.all(promises);
    return results.filter(url => url !== null);
}

// Fetch 3 random foxes
async function fetchFoxes() {
    const promises = [];
    for (let i = 0; i < 3; i++) {
        promises.push(
            fetch('https://randomfox.ca/floof/')
            .then(res => res.json())
            .then(data => data.image)
            .catch(() => null)
        );
    }
    const results = await Promise.all(promises);
    return results.filter(url => url !== null);
}

async function fetchCuteAnimals() {
    try {
        // Show loader and hide gallery
        loader.style.display = 'flex';
        gallery.classList.add('hidden');
        gallery.innerHTML = '';

        // Fetch all animal types in parallel
        const [dogs, cats, bunnies, foxes] = await Promise.all([
            fetchDogs(),
            fetchCats(),
            fetchBunnies(),
            fetchFoxes()
        ]);

        const allImages = [...dogs, ...cats, ...bunnies, ...foxes];
        
        // Shuffle the mixed images
        const shuffledImages = shuffleArray(allImages);

        // Create cards for each image
        shuffledImages.forEach((imageUrl, index) => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.style.animationDelay = `${index * 0.1}s`;

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'A cute animal';
            img.loading = 'lazy';

            card.appendChild(img);
            gallery.appendChild(card);
        });

        // Hide loader and show gallery
        loader.style.display = 'none';
        gallery.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error fetching cute animals:', error);
        loader.innerHTML = '<p>Oops! We had trouble finding cute animals. Please try refreshing the page.</p>';
    }
}

// Initial fetch
fetchCuteAnimals();

// Set interval to fetch new animals every 30 minutes
setInterval(fetchCuteAnimals, REFRESH_INTERVAL_MS);
