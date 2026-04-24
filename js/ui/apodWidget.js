// ============================================
// T.A.R.D.I.S. â€” APOD WIDGET
// ============================================
import { fetchAPOD } from '../api/nasaApi.js';

export function initAPODWidget() {
    // Toggle expand/collapse
    const toggle = document.getElementById('apod-toggle');
    const widget = document.getElementById('apod-widget');
    if (toggle && widget) {
        toggle.addEventListener('click', () => {
            widget.classList.toggle('expanded');
            toggle.textContent = widget.classList.contains('expanded') ? 'â–¼' : 'â–²';

            const descEl = document.getElementById('apod-description');
            if (widget.classList.contains('expanded') && descEl.dataset.full) {
                descEl.textContent = descEl.dataset.full;
            } else if (descEl.dataset.truncated) {
                descEl.textContent = descEl.dataset.truncated;
            }
        });
    }

    // Parallax on image hover
    const imgWrapper = document.getElementById('apod-image-wrapper');
    if (imgWrapper) {
        imgWrapper.addEventListener('mousemove', (e) => {
            const rect = imgWrapper.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            const img = document.getElementById('apod-image');
            if (img) {
                img.style.transform = `scale(1.08) translate(${x * -8}px, ${y * -8}px)`;
            }
        });
        imgWrapper.addEventListener('mouseleave', () => {
            const img = document.getElementById('apod-image');
            if (img) {
                img.style.transform = 'scale(1.03) translate(0, 0)';
            }
        });
    }

    // Load APOD data
    fetchAPOD();
}

