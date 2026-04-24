// ============================================
// T.A.R.D.I.S. — NASA APIs
// ============================================
import { NASA_IMAGE_API, NASA_APOD_API } from '../config.js';

/**
 * Fetches a single NASA image for a given query.
 */
export async function fetchNASAImage(query) {
    try {
        const container = document.getElementById('nasa-image-container');
        container.style.display = 'none';
        const res = await fetch(`${NASA_IMAGE_API}?q=${encodeURIComponent(query)}&media_type=image&page_size=1`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.collection?.items?.length > 0) {
            const item = data.collection.items[0];
            const imageUrl = item.links?.[0]?.href;
            const title = item.data?.[0]?.title || '';
            if (imageUrl) {
                document.getElementById('nasa-image').src = imageUrl;
                document.getElementById('nasa-caption').textContent = title;
                container.style.display = 'block';
            }
        }
    } catch (e) {
        console.error('NASA Image API error:', e);
    }
}

/**
 * Fetches multiple NASA images for gallery.
 */
export async function fetchNASAGallery(query, count = 8) {
    try {
        const res = await fetch(`${NASA_IMAGE_API}?q=${encodeURIComponent(query)}&media_type=image&page_size=${count}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.collection?.items || []).map(item => ({
            url: item.links?.[0]?.href || '',
            title: item.data?.[0]?.title || '',
            description: item.data?.[0]?.description || ''
        })).filter(i => i.url);
    } catch (e) {
        console.error('NASA Gallery error:', e);
        return [];
    }
}

/**
 * Fetches NASA Astronomy Picture of the Day.
 */
export async function fetchAPOD() {
    const loadingEl = document.getElementById('apod-loading');
    const widget = document.getElementById('apod-widget');

    widget.classList.add('visible');

    try {
        const res = await fetch(NASA_APOD_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Date
        const dateEl = document.getElementById('apod-date');
        if (data.date) {
            const [y, m, d] = data.date.split('-');
            const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
            dateEl.textContent = `${d} ${months[parseInt(m) - 1]} ${y}`;
        }

        if (data.media_type === 'image' && data.url) {
            const img = document.getElementById('apod-image');
            img.onload = () => {
                if (loadingEl) loadingEl.style.display = 'none';
                img.classList.add('loaded');
            };
            img.onerror = () => {
                if (loadingEl) loadingEl.innerHTML = '<span style="color:#ff9944;">Erro ao carregar imagem</span>';
            };
            img.src = data.hdurl || data.url;
            document.getElementById('apod-title').textContent = data.title || '';

            const desc = data.explanation || '';
            const descEl = document.getElementById('apod-description');
            descEl.textContent = desc.length > 200 ? desc.substring(0, 200) + '...' : desc;
            descEl.dataset.full = desc;
            descEl.dataset.truncated = descEl.textContent;

            if (data.copyright) {
                document.getElementById('apod-copyright').textContent = `\u00a9 ${data.copyright.trim()}`;
            }
        } else if (data.media_type === 'video') {
            if (loadingEl) loadingEl.style.display = 'none';
            const wrapper = document.getElementById('apod-image-wrapper');
            wrapper.innerHTML = `<a href="${data.url}" target="_blank" class="apod-video-link">\u25b6 Assistir V\u00eddeo</a>`;
            document.getElementById('apod-title').textContent = data.title || '';
            const desc = data.explanation || '';
            const descEl = document.getElementById('apod-description');
            descEl.textContent = desc.length > 200 ? desc.substring(0, 200) + '...' : desc;
        }
    } catch (e) {
        console.error('APOD error:', e);
        if (loadingEl) {
            loadingEl.innerHTML = `
                <span style="color:#ff9944; font-family: var(--font-display); font-size: 8px; letter-spacing: 1px;">API INDISPON\u00cdVEL</span>
                <span style="color:#666; font-size: 10px; margin-top: 4px;">Tente novamente mais tarde</span>
            `;
        }
        document.getElementById('apod-title').textContent = 'Astronomy Picture of the Day';
        document.getElementById('apod-description').textContent = 'A imagem astron\u00f4mica do dia da NASA n\u00e3o p\u00f4de ser carregada.';
    }
}
