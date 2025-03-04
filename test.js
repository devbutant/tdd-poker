const { Card } = require("./card");
const { Hand, HandType } = require("./hand");
const {
    compareHands,
    createDeck,
    shuffleDeck,
    dealCards,
    createHandFromString,
} = require("./poker");

/**
 * Fonction utilitaire pour afficher les résultats des tests
 */
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ ÉCHEC: ${message}`);
        return false;
    }
    console.log(`✅ SUCCÈS: ${message}`);
    return true;
}

/**
 * Test de la classe Card
 */
function testCard() {
    console.log("\n=== Test de la classe Card ===");

    // Création de cartes
    const aceHearts = new Card("A", "hearts");
    const kingSpades = new Card("K", "spades");
    const twoClubs = new Card("2", "clubs");

    assert(aceHearts.rank === "A", "Le rang de l'As est correct");
    assert(aceHearts.suit === "hearts", "La couleur de l'As est correcte");
    assert(aceHearts.getValue() === 14, "La valeur de l'As est 14");
    assert(kingSpades.getValue() === 13, "La valeur du Roi est 13");
    assert(twoClubs.getValue() === 2, "La valeur du 2 est 2");

    assert(aceHearts.isAce(), "isAce() fonctionne pour l'As");
    assert(!kingSpades.isAce(), "isAce() fonctionne pour les non-As");

    assert(
        aceHearts.toString() === "A♥",
        "toString() fonctionne pour l'As de cœur"
    );
    assert(
        kingSpades.toString() === "K♠",
        "toString() fonctionne pour le Roi de pique"
    );

    // Test d'erreur
    try {
        new Card("1", "hearts");
        assert(false, "Devrait rejeter un rang invalide");
    } catch (e) {
        assert(true, "Rejette correctement un rang invalide");
    }

    try {
        new Card("A", "invalid");
        assert(false, "Devrait rejeter une couleur invalide");
    } catch (e) {
        assert(true, "Rejette correctement une couleur invalide");
    }
}

/**
 * Test de la classe Hand
 */
function testHand() {
    console.log("\n=== Test de la classe Hand ===");

    // Test des différentes mains

    // Quinte Flush Royale
    const royalFlush = new Hand([
        new Card("A", "hearts"),
        new Card("K", "hearts"),
        new Card("Q", "hearts"),
        new Card("J", "hearts"),
        new Card("10", "hearts"),
    ]);
    assert(
        royalFlush.type === HandType.ROYAL_FLUSH,
        "Détecte correctement une Quinte Flush Royale"
    );

    // Quinte Flush
    const straightFlush = new Hand([
        new Card("9", "spades"),
        new Card("8", "spades"),
        new Card("7", "spades"),
        new Card("6", "spades"),
        new Card("5", "spades"),
    ]);
    assert(
        straightFlush.type === HandType.STRAIGHT_FLUSH,
        "Détecte correctement une Quinte Flush"
    );

    // Carré
    const fourOfAKind = new Hand([
        new Card("7", "hearts"),
        new Card("7", "diamonds"),
        new Card("7", "clubs"),
        new Card("7", "spades"),
        new Card("9", "hearts"),
    ]);
    assert(
        fourOfAKind.type === HandType.FOUR_OF_A_KIND,
        "Détecte correctement un Carré"
    );

    // Full
    const fullHouse = new Hand([
        new Card("10", "hearts"),
        new Card("10", "diamonds"),
        new Card("10", "spades"),
        new Card("4", "clubs"),
        new Card("4", "hearts"),
    ]);
    assert(
        fullHouse.type === HandType.FULL_HOUSE,
        "Détecte correctement un Full"
    );

    // Couleur
    const flush = new Hand([
        new Card("A", "clubs"),
        new Card("10", "clubs"),
        new Card("7", "clubs"),
        new Card("6", "clubs"),
        new Card("2", "clubs"),
    ]);
    assert(flush.type === HandType.FLUSH, "Détecte correctement une Couleur");

    // Quinte
    const straight = new Hand([
        new Card("9", "hearts"),
        new Card("8", "clubs"),
        new Card("7", "spades"),
        new Card("6", "diamonds"),
        new Card("5", "hearts"),
    ]);
    assert(
        straight.type === HandType.STRAIGHT,
        "Détecte correctement une Quinte"
    );

    // Quinte avec As bas
    const straightWithLowAce = new Hand([
        new Card("5", "hearts"),
        new Card("4", "clubs"),
        new Card("3", "spades"),
        new Card("2", "diamonds"),
        new Card("A", "hearts"),
    ]);
    assert(
        straightWithLowAce.type === HandType.STRAIGHT,
        "Détecte correctement une Quinte avec As bas"
    );

    // Brelan
    const threeOfAKind = new Hand([
        new Card("8", "hearts"),
        new Card("8", "diamonds"),
        new Card("8", "spades"),
        new Card("K", "clubs"),
        new Card("3", "diamonds"),
    ]);
    assert(
        threeOfAKind.type === HandType.THREE_OF_A_KIND,
        "Détecte correctement un Brelan"
    );

    // Deux Paires
    const twoPair = new Hand([
        new Card("J", "hearts"),
        new Card("J", "clubs"),
        new Card("4", "spades"),
        new Card("4", "hearts"),
        new Card("A", "diamonds"),
    ]);
    assert(
        twoPair.type === HandType.TWO_PAIR,
        "Détecte correctement Deux Paires"
    );

    // Paire
    const onePair = new Hand([
        new Card("10", "hearts"),
        new Card("10", "clubs"),
        new Card("K", "spades"),
        new Card("4", "hearts"),
        new Card("3", "diamonds"),
    ]);
    assert(
        onePair.type === HandType.ONE_PAIR,
        "Détecte correctement une Paire"
    );

    // Carte Haute
    const highCard = new Hand([
        new Card("A", "hearts"),
        new Card("Q", "clubs"),
        new Card("10", "spades"),
        new Card("5", "hearts"),
        new Card("3", "diamonds"),
    ]);
    assert(
        highCard.type === HandType.HIGH_CARD,
        "Détecte correctement une Carte Haute"
    );
}

/**
 * Test de la fonction compareHands
 */
function testCompareHands() {
    console.log("\n=== Test de la fonction compareHands ===");

    // Quinte Flush Royale vs Quinte Flush
    const royalFlush = new Hand([
        new Card("A", "hearts"),
        new Card("K", "hearts"),
        new Card("Q", "hearts"),
        new Card("J", "hearts"),
        new Card("10", "hearts"),
    ]);

    const straightFlush = new Hand([
        new Card("9", "spades"),
        new Card("8", "spades"),
        new Card("7", "spades"),
        new Card("6", "spades"),
        new Card("5", "spades"),
    ]);

    assert(
        compareHands(royalFlush, straightFlush) === 1,
        "Quinte Flush Royale bat Quinte Flush"
    );
    assert(
        compareHands(straightFlush, royalFlush) === 2,
        "Quinte Flush perd contre Quinte Flush Royale"
    );

    // Même type de main, différentes valeurs
    const fourKings = new Hand([
        new Card("K", "hearts"),
        new Card("K", "diamonds"),
        new Card("K", "clubs"),
        new Card("K", "spades"),
        new Card("5", "hearts"),
    ]);

    const fourQueens = new Hand([
        new Card("Q", "hearts"),
        new Card("Q", "diamonds"),
        new Card("Q", "clubs"),
        new Card("Q", "spades"),
        new Card("5", "hearts"),
    ]);

    assert(
        compareHands(fourKings, fourQueens) === 1,
        "Carré de Rois bat Carré de Dames"
    );
    assert(
        compareHands(fourQueens, fourKings) === 2,
        "Carré de Dames perd contre Carré de Rois"
    );

    // Même type et même valeur principale, mais kicker différent
    const fourKingsAce = new Hand([
        new Card("K", "hearts"),
        new Card("K", "diamonds"),
        new Card("K", "clubs"),
        new Card("K", "spades"),
        new Card("A", "hearts"),
    ]);

    assert(
        compareHands(fourKingsAce, fourKings) === 1,
        "Carré de Rois avec As bat Carré de Rois avec 5"
    );
    assert(
        compareHands(fourKings, fourKingsAce) === 2,
        "Carré de Rois avec 5 perd contre Carré de Rois avec As"
    );

    // Égalité parfaite
    const royalFlush2 = new Hand([
        new Card("A", "diamonds"),
        new Card("K", "diamonds"),
        new Card("Q", "diamonds"),
        new Card("J", "diamonds"),
        new Card("10", "diamonds"),
    ]);

    assert(
        compareHands(royalFlush, royalFlush2) === 0,
        "Deux Quintes Flush Royales sont à égalité"
    );
}

/**
 * Test des fonctions utilitaires
 */
function testUtilityFunctions() {
    console.log("\n=== Test des fonctions utilitaires ===");

    // Test de createDeck
    const deck = createDeck();
    assert(deck.length === 52, "createDeck crée un jeu de 52 cartes");

    // Vérifier que toutes les cartes sont uniques
    const cardStrings = deck.map((card) => card.toString());
    const uniqueCards = new Set(cardStrings);
    assert(uniqueCards.size === 52, "Toutes les cartes du jeu sont uniques");

    // Test de shuffleDeck
    const originalDeck = [...deck];
    const shuffled = shuffleDeck(deck);

    // Vérifier que le jeu mélangé a la même taille
    assert(shuffled.length === 52, "Le jeu mélangé contient 52 cartes");

    // Vérifier que le jeu a été mélangé (c'est probabiliste, mais devrait être vrai presque toujours)
    let different = false;
    for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i] !== originalDeck[i]) {
            different = true;
            break;
        }
    }
    assert(different, "Le jeu a été mélangé");

    // Test de dealCards
    const dealt = dealCards(shuffled, 5);
    assert(dealt.length === 5, "dealCards distribue le bon nombre de cartes");
    assert(
        shuffled.length === 47,
        "Les cartes distribuées sont retirées du jeu"
    );

    // Test de createHandFromString
    const handFromString = createHandFromString("A♥ K♥ Q♥ J♥ 10♥");
    assert(
        handFromString.type === HandType.ROYAL_FLUSH,
        "createHandFromString crée correctement une main à partir d'une chaîne"
    );

    const handFromString2 = createHandFromString("10♠ 10♥ 10♦ 2♣ 2♠");
    assert(
        handFromString2.type === HandType.FULL_HOUSE,
        "createHandFromString fonctionne avec différents types de mains"
    );
}

/**
 * Exécution des tests
 */
function runTests() {
    console.log("=== DÉBUT DES TESTS ===");

    testCard();
    testHand();
    testCompareHands();
    testUtilityFunctions();

    console.log("\n=== FIN DES TESTS ===");
}

// Exécuter les tests
runTests();

// Exemples d'utilisation
console.log("\n=== EXEMPLES D'UTILISATION ===");

// Créer et mélanger un jeu
const deck = shuffleDeck(createDeck());
console.log(`Jeu mélangé créé avec ${deck.length} cartes`);

// Distribuer deux mains
const hand1Cards = dealCards(deck, 5);
const hand2Cards = dealCards(deck, 5);

const hand1 = new Hand(hand1Cards);
const hand2 = new Hand(hand2Cards);

console.log(`\nMain 1: ${hand1.toString()}`);
console.log(`Main 2: ${hand2.toString()}`);

// Comparer les mains
const result = compareHands(hand1, hand2);
if (result === 1) {
    console.log("\nLa Main 1 gagne!");
} else if (result === 2) {
    console.log("\nLa Main 2 gagne!");
} else {
    console.log("\nÉgalité!");
}

// Exemples de mains spécifiques
console.log("\n=== EXEMPLES DE MAINS SPÉCIFIQUES ===");

const examples = [
    "A♥ K♥ Q♥ J♥ 10♥", // Quinte Flush Royale
    "9♠ 8♠ 7♠ 6♠ 5♠", // Quinte Flush
    "7♥ 7♦ 7♠ 7♣ 9♥", // Carré
    "10♥ 10♦ 10♠ 4♣ 4♥", // Full
    "A♣ 10♣ 7♣ 6♣ 2♣", // Couleur
    "9♥ 8♣ 7♠ 6♦ 5♥", // Quinte
    "8♥ 8♦ 8♠ K♣ 3♦", // Brelan
    "J♥ J♣ 4♠ 4♥ A♦", // Deux Paires
    "10♥ 10♣ K♠ 4♥ 3♦", // Paire
    "A♥ Q♣ 10♠ 5♥ 3♦", // Carte Haute
];

examples.forEach((example) => {
    const hand = createHandFromString(example);
    console.log(`${example} => ${hand.typeString}`);
});
