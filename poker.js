const { Card } = require("./card");
const { Hand } = require("./hand");
const readline = require("readline");

/**
 * Compare deux mains de poker et détermine la gagnante
 * @param {Hand} hand1 - La première main
 * @param {Hand} hand2 - La deuxième main
 * @returns {number} - 1 si hand1 gagne, 2 si hand2 gagne, 0 en cas d'égalité
 */
function compareHands(hand1, hand2) {
    const value1 = hand1.getValue();
    const value2 = hand2.getValue();

    // Comparer les valeurs élément par élément
    for (let i = 0; i < Math.min(value1.length, value2.length); i++) {
        if (value1[i] > value2[i]) {
            return 1; // hand1 gagne
        }
        if (value1[i] < value2[i]) {
            return 2; // hand2 gagne
        }
    }

    // Si toutes les valeurs sont égales, c'est une égalité
    return 0;
}

/**
 * Crée un jeu de cartes standard (52 cartes)
 * @returns {Card[]} - Un tableau de 52 cartes
 */
function createDeck() {
    const deck = [];

    Card.SUITS.forEach((suit) => {
        Card.RANKS.forEach((rank) => {
            deck.push(new Card(rank, suit));
        });
    });

    return deck;
}

/**
 * Mélange un jeu de cartes
 * @param {Card[]} deck - Le jeu de cartes à mélanger
 * @returns {Card[]} - Le jeu mélangé
 */
function shuffleDeck(deck) {
    const shuffled = [...deck];

    // Algorithme de Fisher-Yates
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Distribue des cartes à partir d'un jeu
 * @param {Card[]} deck - Le jeu de cartes
 * @param {number} numCards - Le nombre de cartes à distribuer
 * @returns {Card[]} - Les cartes distribuées
 */
function dealCards(deck, numCards) {
    if (numCards > deck.length) {
        throw new Error(
            `Impossible de distribuer ${numCards} cartes d'un jeu de ${deck.length} cartes`
        );
    }

    return deck.splice(0, numCards);
}

/**
 * Crée une main de poker à partir d'une chaîne de caractères
 * Format: "As♥ Roi♥ Dame♥ Valet♥ 10♥" ou "A♥ K♥ Q♥ J♥ 10♥"
 * @param {string} handString - La chaîne représentant la main
 * @returns {Hand} - La main de poker
 */
function createHandFromString(handString) {
    const cardStrings = handString.split(" ");

    if (cardStrings.length !== 5) {
        throw new Error("Une main de poker doit contenir exactement 5 cartes");
    }

    const cards = cardStrings.map((cardStr) => {
        // Extraire le rang et la couleur
        const rankMap = {
            As: "A",
            Roi: "K",
            Dame: "Q",
            Valet: "J",
            A: "A",
            K: "K",
            Q: "Q",
            J: "J",
        };

        const suitMap = {
            "♥": "hearts",
            "♦": "diamonds",
            "♣": "clubs",
            "♠": "spades",
        };

        let rank, suit;

        // Trouver la couleur (dernier caractère)
        const suitChar = cardStr.slice(-1);
        suit = suitMap[suitChar];

        if (!suit) {
            throw new Error(`Couleur invalide: ${suitChar}`);
        }

        // Extraire le rang (tout sauf le dernier caractère)
        const rankStr = cardStr.slice(0, -1);
        rank = rankMap[rankStr] || rankStr;

        return new Card(rank, suit);
    });

    return new Hand(cards);
}

/**
 * Interface en ligne de commande pour l'évaluateur de poker
 */
function runCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    console.log("=== Évaluateur de Poker ===");
    console.log("Instructions:");
    console.log(
        "- Pour évaluer une main, entrez 5 cartes (exemple: A♥ K♥ Q♥ J♥ 10♥)"
    );
    console.log(
        "- Utilisez les symboles ♥ (cœur), ♦ (carreau), ♣ (trèfle), ♠ (pique)"
    );
    console.log("");
    console.log("Commandes disponibles:");
    console.log("  compare - Comparer avec la main précédente");
    console.log("  clear - Effacer la main mémorisée");
    console.log("  exit - Quitter le programme");

    let previousHand = null;

    function promptForHand() {
        rl.question("> ", (input) => {
            const lowerInput = input.toLowerCase();

            if (lowerInput === "exit") {
                console.log("Au revoir!");
                rl.close();
                return;
            }

            if (lowerInput === "clear") {
                previousHand = null;
                console.log("Main mémorisée effacée.");
                promptForHand();
                return;
            }

            if (lowerInput === "compare") {
                if (!previousHand) {
                    console.log(
                        "Aucune main précédente à comparer. Entrez d'abord une main."
                    );
                } else {
                    console.log(
                        "Entrez une nouvelle main pour la comparer avec la précédente:"
                    );
                    rl.question("> ", (newHandInput) => {
                        try {
                            const newHand = createHandFromString(newHandInput);
                            console.log(`Nouvelle main: ${newHand.toString()}`);
                            console.log(
                                `Main précédente: ${previousHand.toString()}`
                            );

                            const result = compareHands(newHand, previousHand);
                            if (result === 1) {
                                console.log("La nouvelle main est plus forte!");
                            } else if (result === 2) {
                                console.log(
                                    "La main précédente est plus forte!"
                                );
                            } else {
                                console.log(
                                    "Les deux mains sont de force égale!"
                                );
                            }
                        } catch (error) {
                            console.error(`Erreur: ${error.message}`);
                        }
                        promptForHand();
                    });
                    return;
                }
            }

            try {
                const currentHand = createHandFromString(input);
                console.log(`Main évaluée: ${currentHand.toString()}`);

                if (previousHand) {
                    const result = compareHands(currentHand, previousHand);
                    if (result === 1) {
                        console.log(
                            "Cette main est plus forte que la précédente!"
                        );
                    } else if (result === 2) {
                        console.log(
                            "Cette main est plus faible que la précédente!"
                        );
                    } else {
                        console.log(
                            "Cette main est de force égale à la précédente!"
                        );
                    }
                }

                previousHand = currentHand;
            } catch (error) {
                console.error(`Erreur: ${error.message}`);
            }

            promptForHand();
        });
    }

    promptForHand();
}

// Exporter les fonctions
module.exports = {
    compareHands,
    createDeck,
    shuffleDeck,
    dealCards,
    createHandFromString,
};

// Si le script est exécuté directement (pas importé comme module)
if (require.main === module) {
    runCLI();
}
