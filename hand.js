const { Card } = require("./card");

/**
 * Types de mains de poker (du plus fort au plus faible)
 */
const HandType = {
    ROYAL_FLUSH: 9,
    STRAIGHT_FLUSH: 8,
    FOUR_OF_A_KIND: 7,
    FULL_HOUSE: 6,
    FLUSH: 5,
    STRAIGHT: 4,
    THREE_OF_A_KIND: 3,
    TWO_PAIR: 2,
    ONE_PAIR: 1,
    HIGH_CARD: 0,
};

/**
 * Classe représentant une main de poker (5 cartes)
 */
class Hand {
    /**
     * Crée une nouvelle main de poker
     * @param {Card[]} cards - Un tableau de 5 cartes
     */
    constructor(cards) {
        if (!Array.isArray(cards) || cards.length !== 5) {
            throw new Error(
                "Une main de poker doit contenir exactement 5 cartes"
            );
        }

        // Vérifier que tous les éléments sont des cartes
        cards.forEach((card) => {
            if (!(card instanceof Card)) {
                throw new Error(
                    "Tous les éléments doivent être des instances de Card"
                );
            }
        });

        this.cards = [...cards];
        // Trier les cartes par valeur décroissante
        this.sortByValue();

        // Évaluer la main
        this.evaluate();
    }

    /**
     * Trie les cartes par valeur décroissante
     */
    sortByValue() {
        this.cards.sort((a, b) => b.getValue() - a.getValue());
    }

    /**
     * Évalue la main et détermine son type et sa valeur
     */
    evaluate() {
        // Vérifier chaque type de main du plus fort au plus faible
        if (this.isRoyalFlush()) {
            this.type = HandType.ROYAL_FLUSH;
            this.typeString = "Quinte Flush Royale";
        } else if (this.isStraightFlush()) {
            this.type = HandType.STRAIGHT_FLUSH;
            this.typeString = "Quinte Flush";
        } else if (this.isFourOfAKind()) {
            this.type = HandType.FOUR_OF_A_KIND;
            this.typeString = "Carré";
        } else if (this.isFullHouse()) {
            this.type = HandType.FULL_HOUSE;
            this.typeString = "Full";
        } else if (this.isFlush()) {
            this.type = HandType.FLUSH;
            this.typeString = "Couleur";
        } else if (this.isStraight()) {
            this.type = HandType.STRAIGHT;
            this.typeString = "Quinte";
        } else if (this.isThreeOfAKind()) {
            this.type = HandType.THREE_OF_A_KIND;
            this.typeString = "Brelan";
        } else if (this.isTwoPair()) {
            this.type = HandType.TWO_PAIR;
            this.typeString = "Deux Paires";
        } else if (this.isOnePair()) {
            this.type = HandType.ONE_PAIR;
            this.typeString = "Paire";
        } else {
            this.type = HandType.HIGH_CARD;
            this.typeString = "Carte Haute";
        }
    }

    /**
     * Vérifie si la main est une quinte flush royale
     * @returns {boolean}
     */
    isRoyalFlush() {
        return this.isStraightFlush() && this.cards[0].getValue() === 14; // As en haut
    }

    /**
     * Vérifie si la main est une quinte flush
     * @returns {boolean}
     */
    isStraightFlush() {
        return this.isFlush() && this.isStraight();
    }

    /**
     * Vérifie si la main est un carré
     * @returns {boolean}
     */
    isFourOfAKind() {
        const counts = this.getValueCounts();
        return Object.values(counts).includes(4);
    }

    /**
     * Vérifie si la main est un full
     * @returns {boolean}
     */
    isFullHouse() {
        const counts = this.getValueCounts();
        const values = Object.values(counts);
        return values.includes(3) && values.includes(2);
    }

    /**
     * Vérifie si la main est une couleur
     * @returns {boolean}
     */
    isFlush() {
        const firstSuit = this.cards[0].suit;
        return this.cards.every((card) => card.suit === firstSuit);
    }

    /**
     * Vérifie si la main est une quinte
     * @returns {boolean}
     */
    isStraight() {
        // Cas spécial: A-5-4-3-2
        if (
            this.cards[0].getValue() === 14 && // As
            this.cards[1].getValue() === 5 &&
            this.cards[2].getValue() === 4 &&
            this.cards[3].getValue() === 3 &&
            this.cards[4].getValue() === 2
        ) {
            return true;
        }

        // Cas normal: vérifier que les cartes se suivent
        for (let i = 0; i < 4; i++) {
            if (this.cards[i].getValue() !== this.cards[i + 1].getValue() + 1) {
                return false;
            }
        }
        return true;
    }

    /**
     * Vérifie si la main est un brelan
     * @returns {boolean}
     */
    isThreeOfAKind() {
        const counts = this.getValueCounts();
        return (
            Object.values(counts).includes(3) &&
            !Object.values(counts).includes(2)
        );
    }

    /**
     * Vérifie si la main contient deux paires
     * @returns {boolean}
     */
    isTwoPair() {
        const counts = this.getValueCounts();
        const pairs = Object.values(counts).filter((count) => count === 2);
        return pairs.length === 2;
    }

    /**
     * Vérifie si la main contient une paire
     * @returns {boolean}
     */
    isOnePair() {
        const counts = this.getValueCounts();
        const pairs = Object.values(counts).filter((count) => count === 2);
        return pairs.length === 1 && !Object.values(counts).includes(3);
    }

    /**
     * Compte le nombre d'occurrences de chaque valeur dans la main
     * @returns {Object} - Un objet avec les valeurs comme clés et les occurrences comme valeurs
     */
    getValueCounts() {
        const counts = {};
        this.cards.forEach((card) => {
            const value = card.getValue();
            counts[value] = (counts[value] || 0) + 1;
        });
        return counts;
    }

    /**
     * Obtient les valeurs des cartes groupées par nombre d'occurrences
     * @returns {Object} - Un objet avec les occurrences comme clés et les valeurs comme tableaux
     */
    getGroupedValues() {
        const counts = this.getValueCounts();
        const result = {};

        Object.entries(counts).forEach(([value, count]) => {
            if (!result[count]) {
                result[count] = [];
            }
            result[count].push(parseInt(value));
        });

        // Trier chaque groupe par valeur décroissante
        Object.keys(result).forEach((count) => {
            result[count].sort((a, b) => b - a);
        });

        return result;
    }

    /**
     * Obtient la valeur de la main pour la comparaison
     * @returns {Array} - Un tableau avec le type de main et les valeurs pour départager
     */
    getValue() {
        const grouped = this.getGroupedValues();

        switch (this.type) {
            case HandType.ROYAL_FLUSH:
                return [this.type];

            case HandType.STRAIGHT_FLUSH:
            case HandType.STRAIGHT:
                // Pour la quinte A-5-4-3-2, considérer l'As comme un 1
                if (
                    this.cards[0].getValue() === 14 &&
                    this.cards[1].getValue() === 5
                ) {
                    return [this.type, 5]; // La valeur haute est 5
                }
                return [this.type, this.cards[0].getValue()];

            case HandType.FOUR_OF_A_KIND:
                return [this.type, grouped[4][0], grouped[1][0]];

            case HandType.FULL_HOUSE:
                return [this.type, grouped[3][0], grouped[2][0]];

            case HandType.FLUSH:
            case HandType.HIGH_CARD:
                return [
                    this.type,
                    this.cards[0].getValue(),
                    this.cards[1].getValue(),
                    this.cards[2].getValue(),
                    this.cards[3].getValue(),
                    this.cards[4].getValue(),
                ];

            case HandType.THREE_OF_A_KIND:
                return [this.type, grouped[3][0], ...grouped[1].slice(0, 2)];

            case HandType.TWO_PAIR:
                return [this.type, grouped[2][0], grouped[2][1], grouped[1][0]];

            case HandType.ONE_PAIR:
                return [this.type, grouped[2][0], ...grouped[1].slice(0, 3)];
        }
    }

    /**
     * Représentation textuelle de la main
     * @returns {string}
     */
    toString() {
        const cardsStr = this.cards.map((card) => card.toString()).join(" ");
        return `${cardsStr} (${this.typeString})`;
    }
}

module.exports = { Hand, HandType };
