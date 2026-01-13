import { EveningEvent } from '../../types/eveningEvent'
import { useGameStore } from '../../store/gameStore'
import { generateLoot } from '../loot'

/**
 * Pool d'événements du soir
 * 50% textuels, 50% interactifs
 * @internal Utilisé uniquement en interne par selectEveningEvent
 */
function generateEveningEvents(_day: number): EveningEvent[] {
  // Note: state non utilisé actuellement mais peut être utilisé pour filtrage futur
  useGameStore.getState()
  
  return [
    // Événements textuels
    {
      id: 'marchand_passe',
      text: 'Un marchand passe par le camp. Il propose des équipements.',
      type: 'text'
    },
    {
      id: 'rumeurs_tresor',
      text: 'Tu entends des rumeurs sur un trésor caché dans les ruines.',
      type: 'text'
    },
    {
      id: 'voyageurs',
      text: 'Un groupe de voyageurs partage des nouvelles du royaume.',
      type: 'text'
    },
    {
      id: 'nuit_calme',
      text: 'La nuit est calme. Trop calme.',
      type: 'text'
    },
    {
      id: 'lumières_foret',
      text: 'Des lumières dans la forêt. Quelqu\'un d\'autre explore.',
      type: 'text'
    },
    {
      id: 'message_arbre',
      text: 'Un message est accroché à un arbre. Une offre de travail.',
      type: 'text'
    },
    {
      id: 'odeur_guerre',
      text: 'Le vent apporte l\'odeur de la guerre. Pas loin.',
      type: 'text'
    },
    {
      id: 'traces_pas',
      text: 'Des traces de pas. Récentes. Tu n\'es pas seul ici.',
      type: 'text'
    },
    
    // Événements interactifs
    {
      id: 'marchand_interactif',
      text: 'Un marchand passe par le camp. Il propose des équipements à prix réduit.',
      type: 'interactive',
      choices: [
        {
          text: 'Acheter un équipement (12💰)',
          description: 'Tu achètes un équipement de qualité.',
          consequence: () => {
            const store = useGameStore.getState()
            if (store.gold >= 12 && store.inventory.length < 10) {
              const item = generateLoot(3) // Risque moyen
              useGameStore.setState({
                gold: store.gold - 12,
                inventory: [...store.inventory, item]
              })
            }
          }
        },
        {
          text: 'Négocier (10💰, réputation ⭐⭐⭐ requise)',
          description: 'Tu négocies un meilleur prix grâce à ta réputation.',
          consequence: () => {
            const store = useGameStore.getState()
            if (store.gold >= 10 && store.reputation >= 3 && store.inventory.length < 10) {
              const item = generateLoot(3)
              useGameStore.setState({
                gold: store.gold - 10,
                inventory: [...store.inventory, item]
              })
            }
          }
        },
        {
          text: 'Refuser poliment',
          description: 'Tu déclines. Le marchand part.',
          consequence: () => {
            // Pas de conséquence
          }
        }
      ]
    },
    {
      id: 'lumières_foret_interactif',
      text: 'Des lumières dans la forêt. Quelqu\'un d\'autre explore. Que fais-tu ?',
      type: 'interactive',
      choices: [
        {
          text: 'Aller voir',
          description: 'Tu découvres un campement. Ils te proposent de partager leur feu.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 1
              }
            })
          }
        },
        {
          text: 'Rester caché',
          description: 'Tu observes de loin. Tu apprends des informations utiles.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + 5 // Petit bonus d'or
            })
          }
        },
        {
          text: 'Préparer une embuscade',
          description: 'Tu prépares une embuscade. Tu gagnes de l\'or, mais tu perds de l\'humanité.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + Math.floor(Math.random() * 11) + 10, // 10-20💰
              narrativeCounters: {
                ...store.narrativeCounters,
                cynisme: (store.narrativeCounters.cynisme || 0) + 1
              },
              reputation: Math.max(1, store.reputation - 1) as 1 | 2 | 3 | 4 | 5
            })
          }
        }
      ]
    },
    {
      id: 'message_arbre_interactif',
      text: 'Un message est accroché à un arbre. Une offre de travail.',
      type: 'interactive',
      choices: [
        {
          text: 'Accepter l\'offre',
          description: 'Tu acceptes. C\'est un travail dangereux, mais bien payé.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + 20, // Réduit de 25 à 20
              narrativeCounters: {
                ...store.narrativeCounters,
                pragmatisme: (store.narrativeCounters.pragmatisme || 0) + 1
              }
            })
          }
        },
        {
          text: 'Ignorer',
          description: 'Tu ignores le message. Mieux vaut ne pas s\'embarrasser.',
          consequence: () => {
            // Pas de conséquence
          }
        },
        {
          text: 'Détruire le message',
          description: 'Tu détruis le message. Personne d\'autre ne tombera dans le piège.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 1
              }
            })
          }
        }
      ]
    },
    {
      id: 'voyageurs_interactif',
      text: 'Un groupe de voyageurs partage des nouvelles du royaume. Ils te proposent de te joindre à eux.',
      type: 'interactive',
      choices: [
        {
          text: 'Partager un repas avec eux',
          description: 'Tu partages un repas. Tu te sens moins seul.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 1
              }
            })
          }
        },
        {
          text: 'Échanger des informations',
          description: 'Tu échanges des informations. Tu apprends des choses utiles.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + 10
            })
          }
        },
        {
          text: 'Les voler',
          description: 'Tu profites de leur confiance pour les voler.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + Math.floor(Math.random() * 11) + 12, // 12-22💰 (réduit de 15-30)
              narrativeCounters: {
                ...store.narrativeCounters,
                cynisme: (store.narrativeCounters.cynisme || 0) + 3
              },
              reputation: Math.max(1, store.reputation - 1) as 1 | 2 | 3 | 4 | 5
            })
          }
        }
      ]
    },
    
    // Nouveaux événements interactifs (Sprint 3)
    {
      id: 'ancien_soldat',
      text: 'Tu croises un ancien soldat. Il te reconnaît.',
      type: 'interactive',
      choices: [
        {
          text: 'Partager une expérience',
          description: 'Vous partagez vos histoires. Tu te sens moins seul.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 1
              }
            })
          }
        },
        {
          text: 'Éviter',
          description: 'Tu passes ton chemin.',
          consequence: () => {
            // Pas de conséquence
          }
        },
        {
          text: 'Voler ses affaires',
          description: 'Tu profites de sa distraction.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + Math.floor(Math.random() * 11) + 8, // 8-18💰
              narrativeCounters: {
                ...store.narrativeCounters,
                cynisme: (store.narrativeCounters.cynisme || 0) + 1
              },
              reputation: Math.max(1, store.reputation - 1) as 1 | 2 | 3 | 4 | 5
            })
          }
        }
      ]
    },
    {
      id: 'campement_abandonne',
      text: 'Tu découvres un campement abandonné. Des traces récentes, mais personne.',
      type: 'interactive',
      choices: [
        {
          text: 'Explorer prudemment',
          description: 'Tu trouves quelques objets utiles.',
          consequence: () => {
            const store = useGameStore.getState()
            if (store.inventory.length < 10) {
              const item = generateLoot(2) // Risque faible
              useGameStore.setState({
                inventory: [...store.inventory, item]
              })
            } else {
              useGameStore.setState({
                gold: store.gold + 15
              })
            }
          }
        },
        {
          text: 'Laisser tel quel',
          description: 'Tu respectes les morts. Peut-être que quelqu\'un reviendra.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 1
              }
            })
          }
        },
        {
          text: 'Piller le campement',
          description: 'Tu prends tout ce qui a de la valeur.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + Math.floor(Math.random() * 16) + 15, // 15-30💰
              narrativeCounters: {
                ...store.narrativeCounters,
                cynisme: (store.narrativeCounters.cynisme || 0) + 3
              },
              reputation: Math.max(1, store.reputation - 1) as 1 | 2 | 3 | 4 | 5
            })
          }
        }
      ]
    },
    {
      id: 'message_contact',
      text: 'Un message discret te parvient. Un contact te propose une mission.',
      type: 'interactive',
      choices: [
        {
          text: 'Suivre le contact',
          description: 'Tu acceptes la mission. C\'est risqué mais payant.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + Math.floor(Math.random() * 21) + 20, // 20-40💰
              narrativeCounters: {
                ...store.narrativeCounters,
                pragmatisme: (store.narrativeCounters.pragmatisme || 0) + 1
              }
            })
          }
        },
        {
          text: 'Ignorer',
          description: 'Tu ignores le message. Mieux vaut ne pas s\'embarrasser.',
          consequence: () => {
            // Pas de conséquence
          }
        },
        {
          text: 'Dénoncer le contact',
          description: 'Tu dénonces le contact aux autorités. Tu gagnes en réputation.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              reputation: Math.min(5, store.reputation + 1) as 1 | 2 | 3 | 4 | 5,
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 1
              }
            })
          }
        }
      ]
    },
    {
      id: 'refugies_camp',
      text: 'Un groupe de réfugiés s\'est installé près de ton campement. Ils ont faim.',
      type: 'interactive',
      choices: [
        {
          text: 'Partager ta nourriture',
          description: 'Tu partages ce que tu as. Ils te remercient.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold - 5, // Coût de la nourriture
              narrativeCounters: {
                ...store.narrativeCounters,
                humanite: (store.narrativeCounters.humanite || 0) + 2
              },
              reputation: Math.min(5, store.reputation + 1) as 1 | 2 | 3 | 4 | 5
            })
          }
        },
        {
          text: 'Les chasser',
          description: 'Tu les chasses. Ils partent, mais tu gagnes de l\'or qu\'ils avaient caché.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + Math.floor(Math.random() * 11) + 10, // 10-20💰
              narrativeCounters: {
                ...store.narrativeCounters,
                cynisme: (store.narrativeCounters.cynisme || 0) + 3
              },
              reputation: Math.max(1, store.reputation - 2) as 1 | 2 | 3 | 4 | 5
            })
          }
        },
        {
          text: 'Négocier avec eux',
          description: 'Tu leur proposes un marché. Information contre protection.',
          consequence: () => {
            const store = useGameStore.getState()
            useGameStore.setState({
              gold: store.gold + 8,
              narrativeCounters: {
                ...store.narrativeCounters,
                pragmatisme: (store.narrativeCounters.pragmatisme || 0) + 1
              }
            })
          }
        }
      ]
    }
  ]
}

/**
 * Sélectionne un événement du soir aléatoire
 */
export function selectEveningEvent(day: number): EveningEvent | null {
  const events = generateEveningEvents(day)
  
  // 45% chance d'avoir un événement (augmenté de 30%)
  if (Math.random() < 0.45) {
    return events[Math.floor(Math.random() * events.length)]
  }
  
  return null
}
