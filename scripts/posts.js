 const posts = [
  {
    title: "Using AI as a Junior Software Engineer",
    date: "2026-02-27",
    lastEdited: "2026-02-27",
    slug: "2026-02-27-using-ai-as-a-junior",
    excerpt: "Takeaways from my first 6 months working as a Software Engineer",
    tags: ["AI Tools", "Software Engineering", "Workflow"]
  }
];

// State
let searchQuery = '';
let activeTags = new Set();

// Extract all unique tags
function getAllTags() {
  const tagSet = new Set();
  posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Build date display string
function buildDateString(post) {
  const published = `Published ${formatDate(post.date)}`;
  if (post.lastEdited && post.lastEdited !== post.date) {
    return `${published} · Edited ${formatDate(post.lastEdited)}`;
  }
  return published;
}

// Filter posts
function filterPosts() {
  return posts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = activeTags.size === 0 ||
      post.tags.some(tag => activeTags.has(tag));

    return matchesSearch && matchesTags;
  });
}

// Update results count
function updateResultsCount(count) {
  const el = document.getElementById('resultsCount');
  el.textContent = count === posts.length
    ? `${count} posts`
    : `${count} of ${posts.length} posts`;
}

// Update clear filters button visibility
function updateClearButton() {
  const btn = document.getElementById('clearFilters');
  btn.classList.toggle('hidden', searchQuery === '' && activeTags.size === 0);
}

// Render tag filters
function renderTagFilters() {
  const container = document.getElementById('tagFilters');
  container.innerHTML = '';

  getAllTags().forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-filter';
    btn.textContent = tag;
    btn.dataset.tag = tag;
    if (activeTags.has(tag)) btn.classList.add('active');
    btn.addEventListener('click', () => toggleTag(tag));
    container.appendChild(btn);
  });
}

// Render posts
function renderPosts() {
  const list = document.getElementById('postList');
  const filtered = filterPosts();
  list.innerHTML = '';

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state">No posts found matching your filters.</div>';
    updateResultsCount(0);
    return;
  }

  filtered.forEach(post => {
    const card = document.createElement('a');
    card.href = `posts/${post.slug}.html`;
    card.className = 'post-card';

    card.innerHTML = `
      <h2>${post.title}</h2>
      <div class="post-meta">${buildDateString(post)}</div>
      <div class="post-excerpt">${post.excerpt}</div>
      <div class="post-tags">
        ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    `;

    list.appendChild(card);
  });

  updateResultsCount(filtered.length);
}

// Toggle tag
function toggleTag(tag) {
  if (activeTags.has(tag)) {
    activeTags.delete(tag);
  } else {
    activeTags.add(tag);
  }
  renderTagFilters();
  renderPosts();
  updateClearButton();
}

// Handle search input
function handleSearch(e) {
  searchQuery = e.target.value;
  renderPosts();
  updateClearButton();
}

// Clear all filters
function clearAllFilters() {
  searchQuery = '';
  activeTags.clear();
  document.getElementById('searchBox').value = '';
  renderTagFilters();
  renderPosts();
  updateClearButton();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTagFilters();
  renderPosts();

  document.getElementById('searchBox')
    ?.addEventListener('input', handleSearch);
  document.getElementById('clearFilters')
    ?.addEventListener('click', clearAllFilters);
});
