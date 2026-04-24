(function() {
  var themeSwitch = document.getElementById('themeSwitch');
  var menuToggle = document.getElementById('menuToggle');
  var navMenu = document.getElementById('navMenu');
  var backToTop = document.getElementById('backToTop');
  var readingProgress = document.getElementById('readingProgress');

  if (themeSwitch) {
    themeSwitch.addEventListener('click', function() {
      var currentTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('color-mode', newTheme);
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (readingProgress) {
    window.addEventListener('scroll', function() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (scrollTop / docHeight) * 100;
      readingProgress.style.width = progress + '%';
    });
  }

  var tocLinks = document.querySelectorAll('.toc-sidebar a');
  if (tocLinks.length > 0) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          tocLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-80px 0px -80% 0px' });

    document.querySelectorAll('.post-body h2, .post-body h3').forEach(function(heading) {
      observer.observe(heading);
    });
  }
})();

(function() {
  var searchToggle = document.getElementById('searchToggle');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchClose = document.getElementById('searchClose');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');

  var searchIndex = [];

  function loadSearchIndex() {
    return new Promise(function(resolve, reject) {
      if (searchIndex.length > 0) {
        resolve(searchIndex);
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/index.json', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              searchIndex = JSON.parse(xhr.responseText);
              resolve(searchIndex);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error('Failed to load search index'));
          }
        }
      };
      xhr.send();
    });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  function search(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    var results = searchIndex.filter(function(item) {
      var titleMatch = item.title && item.title.toLowerCase().includes(query.toLowerCase());
      var contentMatch = item.content && item.content.toLowerCase().includes(query.toLowerCase());
      return titleMatch || contentMatch;
    }).slice(0, 10);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">未找到相关结果</div>';
      return;
    }

    searchResults.innerHTML = results.map(function(item) {
      return '<a href="' + item.permalink + '" class="search-result">' +
        '<div class="result-title">' + highlightMatch(item.title, query) + '</div>' +
        '<div class="result-permalink">' + item.permalink + '</div>' +
        '<div class="result-excerpt">' + highlightMatch((item.summary || (item.content ? item.content.substring(0, 150) : '')), query) + '</div>' +
        '</a>';
    }).join('');
  }

  var searchTimeout;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      search(e.target.value.trim());
    }, 300);
  });

  function openSearch() {
    searchOverlay.classList.add('active');
    searchInput.focus();
    loadSearchIndex();
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (!searchOverlay || !searchOverlay.classList.contains('active')) {
        openSearch();
      }
    }
  });
})();
