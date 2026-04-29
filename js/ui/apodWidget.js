// ============================================
// T.A.R.D.I.S. — APOD WIDGET (Refactored)
// ============================================
import { fetchAPOD } from '../api/nasaApi.js';
import { emitAchievementEvent } from '../achievements/achievementEvents.js';

export const initAPODWidget = () => {
    const widget = document.getElementById('apod-widget');
    const toggle = document.getElementById('apod-toggle');
    const headerClick = document.getElementById('apod-header-click');

    if (!widget || !toggle) return;

    let lastApodViewedKey = null;

    const getApodViewMeta = () => {
        const title = document.getElementById('apod-title')?.textContent?.trim() || 'Astronomy Picture of the Day';
        const dateLabel = document.getElementById('apod-date')?.textContent?.trim() || new Date().toISOString().slice(0, 10);
        const mediaWrapper = document.getElementById('apod-image-wrapper');
        const mediaType = mediaWrapper?.querySelector('.apod-video-link') ? 'video' : 'image';

        return {
            title,
            date: dateLabel,
            dateKey: new Date().toISOString().slice(0, 10),
            mediaType
        };
    };

    const emitApodViewed = () => {
        const meta = getApodViewMeta();
        const key = `${meta.date}::${meta.title}`;
        if (key === lastApodViewedKey) return;
        lastApodViewedKey = key;
        emitAchievementEvent('apodViewed', meta, ['apodOpened']);
    };

    // Toggle collapsed/expanded state
    const toggleWidget = () => {
        const isCollapsed = widget.classList.contains('apod-collapsed');

        if (isCollapsed) {
            // Expand
            widget.classList.remove('apod-collapsed');
            widget.classList.add('expanded');
            toggle.textContent = '▼';
            emitApodViewed();
        } else {
            // Collapse
            widget.classList.add('apod-collapsed');
            widget.classList.remove('expanded');
            toggle.textContent = '▶';
        }

        // Update description text
        const descEl = document.getElementById('apod-description');
        if (!isCollapsed && descEl?.dataset.truncated) {
            descEl.textContent = descEl.dataset.truncated;
        } else if (isCollapsed && descEl?.dataset.full) {
            descEl.textContent = descEl.dataset.full;
        }
    };

    // Click on toggle button
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWidget();
    });

    // Click on header to toggle
    if (headerClick) {
        headerClick.addEventListener('click', toggleWidget);
        headerClick.style.cursor = 'pointer';
    }

    // Parallax on image hover
    const imgWrapper = document.getElementById('apod-image-wrapper');
    if (imgWrapper) {
        imgWrapper.addEventListener('mousemove', (e) => {
            const rect = imgWrapper.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            const img = document.getElementById('apod-image');
            if (img) img.style.transform = `scale(1.08) translate(${x * -8}px, ${y * -8}px)`;
        });
        imgWrapper.addEventListener('mouseleave', () => {
            const img = document.getElementById('apod-image');
            if (img) img.style.transform = 'scale(1.03) translate(0, 0)';
        });
    }

    // Load APOD data
    fetchAPOD();
};
