// Lines from the Meditations of Marcus Aurelius, drawn from the George Long
// translation of 1862, which is public domain. Trimmed to under fifteen words
// each. One is shown in the footer, chosen by the day of the year.
//
// This is the whole of the stoic layer. It does not need anything else.

export const meditations: string[] = [
  'The universe is change; our life is what our thoughts make it.',
  'Waste no more time arguing what a good man should be. Be one.',
  'You have power over your mind, not over outside events.',
  'Confine yourself to the present.',
  'Never let the future disturb you.',
  'Loss is nothing else but change, and change is the delight of nature.',
  'Everything we hear is an opinion, not a fact.',
  'Everything we see is a perspective, not the truth.',
  'Do every act of your life as if it were your last.',
  'The best revenge is not to be like your enemy.',
  'Look within. Within is the fountain of good.',
  'Accept the things to which fate binds you.',
  'Nothing happens to any man that he is not formed by nature to bear.',
  'Reject your sense of injury and the injury itself disappears.',
  'The soul becomes dyed with the colour of its thoughts.',
  'How much time he gains who does not look to see what others say.',
  'Be like the rocky headland on which the waves constantly break.',
  'What is not good for the swarm is not good for the bee.',
  'Whatever happens at all happens as it should.',
  'Take away your opinion, and the complaint is taken away with it.',
  'Very little is needed to make a happy life.',
  'Time is a river of passing events, and its current is strong.',
  'Adapt yourself to the things among which your lot is cast.',
  'Love the people with whom fate has surrounded you.',
  'It is not death a man should fear, but never beginning to live.',
  'Observe constantly that all things take place by change.',
  'Begin the morning by saying to yourself: today I shall meet interference.',
  'Nowhere can a man find a quieter retreat than in his own soul.',
  'The happiness of your life depends upon the quality of your thoughts.',
  'Receive wealth without arrogance, and be ready to let it go.',
  'The art of living is more like wrestling than dancing.',
  'Consider that everything is opinion, and opinion is in your power.',
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
