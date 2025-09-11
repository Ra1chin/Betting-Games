document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const blogPages = document.querySelectorAll('.blog-page');
    const pageNumbers = document.querySelectorAll('.page-number');
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const blogsPerPage = isMobile ? 5 : 10;

    // Initialize: Show only the first page
    const showPage = (pageNumber) => {
        blogPages.forEach(page => page.style.display = 'none');
        const pageToShow = document.querySelector(`.blog-page[data-page="${pageNumber}"]`);
        if (pageToShow) {
            pageToShow.style.display = 'grid';
        }
        pageNumbers.forEach(num => num.classList.remove('active'));
        const activeNumber = document.querySelector(`.page-number[data-page="${pageNumber}"]`);
        if (activeNumber) {
            activeNumber.classList.add('active');
        }
    };

    // Initialize first page
    showPage(1);

    // Pagination click handler
    pageNumbers.forEach(number => {
        number.addEventListener('click', (e) => {
            e.preventDefault();
            const page = number.getAttribute('data-page');
            showPage(page);
        });
    });

    // Search functionality
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const blogCards = document.querySelectorAll('.blog-card');
        const visibleBlogs = [];

        // Filter blogs by full title
        blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const isVisible = searchTerm === '' || title.includes(searchTerm);
            card.style.display = isVisible ? 'flex' : 'none';
            if (isVisible) {
                visibleBlogs.push(card);
            }
        });

        // Group visible blogs into pages
        const visiblePages = [];
        for (let i = 0; i < visibleBlogs.length; i += blogsPerPage) {
            const pageBlogs = visibleBlogs.slice(i, i + blogsPerPage);
            if (pageBlogs.length > 0) {
                visiblePages.push(pageBlogs);
            }
        }

        // Update pagination buttons
        pageNumbers.forEach(number => {
            const pageNum = parseInt(number.getAttribute('data-page'));
            number.classList.toggle('hidden', !visiblePages[pageNum - 1]);
        });

        // Update blog pages
        blogPages.forEach((page, index) => {
            const pageNum = index + 1;
            const pageCards = page.querySelectorAll('.blog-card');
            const hasVisibleCards = Array.from(pageCards).some(card => card.style.display === 'flex');
            page.style.display = hasVisibleCards ? 'grid' : 'none';
        });

        // Show the first page with visible blogs, or none if no results
        if (visiblePages.length > 0) {
            showPage(1);
        } else {
            blogPages.forEach(page => page.style.display = 'none');
            pageNumbers.forEach(num => num.classList.remove('active'));
        }
    });
});