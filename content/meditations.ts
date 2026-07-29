// Lines from the Meditations of Marcus Aurelius, adapted from the George Long
// translation of 1862, which is public domain. Long writes in thee and thou;
// these keep his wording and move the pronouns to modern English. Trimmed to
// under fifteen words each.
//
// Anything added here should come from Long or another pre-1929 translation.
// The widely quoted modern renderings, and most of what circulates on the
// internet under Aurelius' name, are either under copyright or not in the text
// at all.
//
// One is shown in the footer, chosen by the day of the year. This is the whole
// of the stoic layer. It does not need anything else.

export const meditations: string[] = [
  'The universe is transformation. Life is opinion.',
  'No longer talk about what a good man ought to be. Be such.',
  'Confine yourself to the present.',
  'Do not disturb yourself by thinking of the whole of your life at once.',
  'Loss is nothing else than change, and change is the delight of nature.',
  'Perform every act as if it were the last of your life.',
  'The best way of avenging yourself is not to become like the wrongdoer.',
  'Dig within. Within is the fountain of good.',
  'Adapt yourself to the things among which your lot has been cast.',
  'Love the people with whom your lot has been thrown.',
  'Nothing happens to any man which he is not formed by nature to bear.',
  'Take away your opinion, and the complaint is taken away with it.',
  'The soul is dyed by the thoughts.',
  'How much trouble he avoids who does not look to see what his neighbour says.',
  'Be like the promontory against which the waves continually break.',
  'That which is not good for the swarm is not good for the bee.',
  'Whatever happens at all happens as it should.',
  'Very little is needed to live happily.',
  'Time is a river of the events which happen, and its current is strong.',
  'Observe constantly that all things take place by change.',
  'Begin the morning by saying to yourself: today I shall meet with the meddler.',
  'Nowhere can a man retire with more quiet than into his own soul.',
  'Receive wealth without arrogance, and be ready to let it go.',
  'The art of life is more like the wrestler’s art than the dancer’s.',
  'Consider that everything is opinion, and opinion is in your power.',
  'Whatever this is that I am, it is a little flesh and breath.',
  'Everything harmonises with me which is harmonious to you, universe.',
  'He who does wrong does wrong against himself.',
  'Do not waste the remainder of your life in thoughts about other people.',
  'The happiness of a man is to do the proper work of a man.',
  'Death is a rest from the impressions of the senses.',
  'Look at the past, and see how many changes of dynasty it has taken.',
]

/**
 * Picks one line from the day of the year, so it turns over once daily and
 * stays identical for every render inside that day. Evaluated on the server at
 * build and revalidation time, which keeps the static output stable.
 */
export function meditationForDate(date: Date): string {
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 1)
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const dayOfYear = Math.floor((today - startOfYear) / 86_400_000)
  return meditations[dayOfYear % meditations.length]
}
