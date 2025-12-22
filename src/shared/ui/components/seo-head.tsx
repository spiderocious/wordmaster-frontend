/**
 * SEO Head Component
 *
 * Dynamically updates page meta tags for SEO optimization
 */

import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export function SEOHead({
  title = 'WordShot - Fast-Paced Word Category Game | Play Free Online',
  description = 'Challenge yourself with WordShot! A thrilling word game where you race against time to find words in categories starting with specific letters. Test your vocabulary, speed, and creativity.',
  keywords = 'word game, vocabulary game, category game, fast-paced game, educational game, brain training, word puzzle, online word game, free word game, alphabet game, wordshot',
  ogImage = 'https://wordshot.netlify.app/og-image.png',
  canonicalUrl,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonicalUrl);
    }
  }, [title, description, keywords, ogImage, canonicalUrl]);

  return null;
}
