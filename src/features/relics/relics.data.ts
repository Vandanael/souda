import { RelicDefinition } from '../../types/relic'

export const RELIC_DEFINITIONS: RelicDefinition[] = [
  {
    id: 'relic_blood_coin',
    name: 'Pièce Sanglante',
    description: 'Elle pulse quand tu pilles. Le métal semble boire le sang.',
    fragmentId: 'fragment_blood_coin',
    tags: ['greed', 'violence'],
    stages: [
      { id: 'dormant', xpRequired: 0, bonus: '+5% or trouvé' },
      { id: 'hungry', xpRequired: 4, bonus: '+10% or, +5% dégâts' },
      { id: 'thirsty', xpRequired: 10, bonus: '+15% or, +10% dégâts, -1 réputation' }
    ]
  },
  {
    id: 'relic_ashen_prayer',
    name: 'Prière de Cendre',
    description: 'Un murmure froid accompagne chaque survie in extremis.',
    fragmentId: 'fragment_ashen_prayer',
    tags: ['survival', 'faith'],
    stages: [
      { id: 'whisper', xpRequired: 0, bonus: '+5% chance de fuite réussie' },
      { id: 'plea', xpRequired: 4, bonus: '+10% fuite, -10% coût réparations' },
      { id: 'vow', xpRequired: 10, bonus: '+15% fuite, +1 DEF après victoire coûteuse' }
    ]
  }
]

export const RELIC_FRAGMENT_MAP: Record<string, string> = Object.fromEntries(
  RELIC_DEFINITIONS.map(def => [def.fragmentId, def.id])
)
