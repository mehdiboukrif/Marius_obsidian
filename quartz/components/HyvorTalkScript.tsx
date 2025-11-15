import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

function HyvorTalkScript({ displayClass }: QuartzComponentProps) {
  // Le contenu du script publish.js sera injecté ici
  const scriptContent = `
// Hyvor Talk Integration for Obsidian Publish
// Version: 1.0.8
// Adapted for Quartz SPA routing

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  // Adapter le sélecteur de conteneur pour Quartz
  
  const CONFIG = {
    websiteId: '11990',
    pageIdStrategy: 'url', // Utiliser l'URL canonique si possible
    loadingMode: 'default',
    // Sélecteur de conteneur adapté pour Quartz
    containerSelector: '.popover-hint.markdown-preview-view', 
    insertPosition: 'end',
    customSelector: null,
    excludePaths: [],
    includePaths: [],
    showHeader: true,
    customSettings: {},
    sso: {
      enabled: false,
    },
    debug: true,
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function log(...args) {
    if (CONFIG.debug) {
      console.log('[Hyvor Talk]', ...args);
    }
  }

  function error(...args) {
    console.error('[Hyvor Talk]', ...args);
  }

  // Check if current page should have comments
  function shouldShowComments() {
    const currentPath = window.location.pathname;
    
    // Check exclude paths
    if (CONFIG.excludePaths.length > 0) {
      for (const pattern of CONFIG.excludePaths) {
        if (matchPath(currentPath, pattern)) {
          log('Page excluded by pattern:', pattern);
          return false;
        }
      }
    }

    // Check include paths (if specified)
    if (CONFIG.includePaths.length > 0) {
      let matched = false;
      for (const pattern of CONFIG.includePaths) {
        if (matchPath(currentPath, pattern)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        log('Page not in include paths');
        return false;
      }
    }

    return true;
  }

  // Simple path matching with wildcard support
  function matchPath(path, pattern) {
    if (pattern === path) return true;
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2);
      return path.startsWith(prefix);
    }
    return false;
  }

  // Get page identifier based on strategy
  function getPageId() {
    if (CONFIG.pageIdStrategy === 'url') {
      // Use canonical URL or current URL
      const canonical = document.querySelector('link[rel="canonical"]');
      return canonical ? canonical.href : window.location.href;
    } else if (CONFIG.pageIdStrategy === 'custom') {
      // Try to get from meta tag or frontmatter
      const metaPageId = document.querySelector('meta[name="hyvor-page-id"]');
      if (metaPageId) {
        return metaPageId.content;
      }
      // Fallback to URL-based identifier
      return window.location.pathname;
    }
    return window.location.href;
  }

  // ============================================
  // HYVOR TALK INITIALIZATION
  // ============================================

  function loadHyvorScript() {
    return new Promise((resolve, reject) => {
      // Check if script already loaded
      if (document.querySelector('script[src*="talk.hyvor.com/embed"]')) {
        log('Hyvor script already loaded');
        resolve();
        return;
      }

      // Add CSS to control Hyvor Talk component display
      if (!document.getElementById('hyvor-talk-custom-css')) {
        const style = document.createElement('style');
        style.id = 'hyvor-talk-custom-css';
        style.textContent = \`
          /* Wrapper respects Quartz theme width constraint */
          .popover-hint.markdown-preview-view .hyvor-talk-wrapper {
            margin-left: 1rem !important;
            margin-right: 1rem !important;
            box-sizing: border-box !important;
          }
          
          /* Basic constraints for Hyvor Talk comments */
          hyvor-talk-comments {
            display: block !important;
            min-height: auto !important;
            height: auto !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
        \`;
        document.head.appendChild(style);
      }

      const script = document.createElement('script');
      script.src = 'https://talk.hyvor.com/embed/embed.js';
      script.type = 'module';
      script.async = true;
      
      script.onload = () => {
        log('Hyvor script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        error('Failed to load Hyvor script');
        reject(new Error('Failed to load Hyvor Talk script'));
      };

      document.head.appendChild(script);
    });
  }

  function createCommentsElement() {
    const comments = document.createElement('hyvor-talk-comments');
    
    // Set required attributes
    comments.setAttribute('website-id', CONFIG.websiteId);
    comments.setAttribute('page-id', getPageId());
    
    // Set loading mode
    if (CONFIG.loadingMode) {
      comments.setAttribute('loading', CONFIG.loadingMode);
    }

    // Apply custom settings if provided
    if (CONFIG.customSettings && Object.keys(CONFIG.customSettings).length > 0) {
      try {
        comments.setAttribute('settings', JSON.stringify(CONFIG.customSettings));
      } catch (e) {
        error('Failed to apply custom settings:', e);
      }
    }

    // SSO configuration (if enabled)
    if (CONFIG.sso && CONFIG.sso.enabled) {
      if (CONFIG.sso.userData && CONFIG.sso.hash) {
        comments.setAttribute('sso-user', CONFIG.sso.userData);
        comments.setAttribute('sso-hash', CONFIG.sso.hash);
      } else {
        error('SSO enabled but userData or hash not provided');
      }
    }

    return comments;
  }

  function insertComments() {
    // Check if comments already exist to prevent duplicates
    if (document.querySelector('.hyvor-talk-wrapper')) {
      log('Comments already inserted, skipping...');
      return false;
    }

    // Use .markdown-preview-view (stable container, not recreated during scroll)
    let container = document.querySelector(CONFIG.containerSelector);
    
    if (!container) {
      error('Container not found:', CONFIG.containerSelector);
      return false;
    }
    
    log('Using stable container:', CONFIG.containerSelector);
    log('Container element:', container);

    // Create wrapper for comments
    const wrapper = document.createElement('div');
    wrapper.className = 'hyvor-talk-wrapper';
    wrapper.setAttribute('data-hyvor-debug', 'true');
    wrapper.style.marginTop = '3rem';
    wrapper.style.paddingTop = '2rem';
    wrapper.style.borderTop = '1px solid var(--background-modifier-border, #e0e0e0)';
    wrapper.style.minHeight = 'auto';
    wrapper.style.maxHeight = 'none';

    // Add optional header
    if (CONFIG.showHeader) {
      const header = document.createElement('h2');
      header.textContent = 'Commentaires';
      header.style.marginBottom = '1.5rem';
      wrapper.appendChild(header);
    }

    // Create and add comments element
    const comments = createCommentsElement();
    wrapper.appendChild(comments);

    // Insert based on position
    if (CONFIG.insertPosition === 'custom' && CONFIG.customSelector) {
      const customTarget = document.querySelector(CONFIG.customSelector);
      if (customTarget) {
        customTarget.appendChild(wrapper);
      } else {
        error('Custom selector not found:', CONFIG.customSelector);
        container.appendChild(wrapper);
      }
    } else if (CONFIG.insertPosition === 'start') {
      container.insertBefore(wrapper, container.firstChild);
    } else {
      // 'end' is default
      container.appendChild(wrapper);
    }

    log('Comments inserted successfully');
    log('Wrapper element:', wrapper);
    
    return true;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async function init() {
    log('Initializing Hyvor Talk integration...');

    // Validate configuration
    if (!CONFIG.websiteId || CONFIG.websiteId === 'YOUR_WEBSITE_ID') {
      error('Website ID not configured. Please set your Hyvor Talk Website ID in the configuration.');
      return;
    }

    // Check if comments should be shown on this page
    if (!shouldShowComments()) {
      log('Comments disabled for this page');
      return;
    }

    try {
      // Load Hyvor script
      await loadHyvorScript();

      // Insert comments
      insertComments();

      log('Hyvor Talk initialized successfully');
    } catch (err) {
      error('Initialization failed:', err);
    }
  }

  // Handle Quartz page navigation (SPA-like behavior)
  // Re-initialize on navigation
  let lastUrl = location.href;
  let isInitializing = false;
  
  // Utiliser l'événement 'nav' de Quartz pour une meilleure compatibilité
  document.addEventListener("nav", () => {
    const url = location.href;
    if (url !== lastUrl && !isInitializing) {
      lastUrl = url;
      isInitializing = true;
      log('Navigation detected, reinitializing...');
      
      // Remove existing comments
      const existing = document.querySelector('.hyvor-talk-wrapper');
      if (existing) {
        existing.remove();
      }
      
      // Reinitialize after a short delay to ensure page is ready
      setTimeout(() => {
        init();
        isInitializing = false;
      }, 200);
    }
  });

  // Initialisation au chargement initial du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already loaded
    init();
  }

})();
  `;

  return (
    <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
  )
}

HyvorTalkScript.afterDOMLoaded = `
  // Le script s'auto-exécute, pas besoin de logique ici
`;

export default (() => HyvorTalkScript) satisfies QuartzComponentConstructor
