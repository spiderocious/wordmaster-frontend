/**
 * Format Category Challenge Text
 *
 * Utility to generate grammatically correct challenge text for game categories
 * Handles proper article usage (a/an) based on vowel sounds
 */

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/**
 * Determines if a word should use "an" instead of "a"
 */
function useAn(word: string): boolean {
  if (!word || word.length === 0) return false;
  const firstLetter = word[0].toLowerCase();
  return VOWELS.includes(firstLetter);
}

/**
 * Formats the category challenge text with proper grammar
 *
 * @param letter - The letter to use (e.g., "A", "B")
 * @param categoryName - The category name (e.g., "animal", "name", "city")
 * @returns Formatted challenge text (e.g., "An ANIMAL that starts with letter A")
 *
 * @example
 * formatCategoryChallenge("A", "animal") // "An ANIMAL that starts with letter A"
 * formatCategoryChallenge("B", "name") // "A NAME that starts with letter B"
 * formatCategoryChallenge("C", "object") // "An OBJECT that starts with letter C"
 */
export function formatCategoryChallenge(letter: string, categoryName: string): string {
  const article = useAn(categoryName) ? 'An' : 'A';
  const uppercasedCategory = categoryName.toUpperCase();
  const uppercasedLetter = letter.toUpperCase();

  if (categoryName === 'bible') {
    return `A name from the BIBLE that starts with letter ${uppercasedLetter}`;
  }

  return `${article} ${uppercasedCategory} that starts with letter ${uppercasedLetter}`;
}
