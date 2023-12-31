/* Minimum Knight Moves - In an infinite chess board with coordinates from -infinity to +infinity, you have a knight at square [0, 0].
A knight has 8 possible moves it can make, as illustrated below. Each move is two squares in a cardinal direction, then one square in an orthogonal direction.
Return the minimum number of steps needed to move the knight to the square [x, y]. It is guaranteed the answer exists.
 */
const minKnightMoves = (x, y) => {

    /* pseudo code
        we have to do BFS travel from start point to end point
            start the queue with [0, 0]
            loop through queue items
                loop through curr items
                    add neighbour points for next travel
                increment num steps
    */

    // Notice the chess board is infinite
    let minSteps = 0;

    // Possible moves for the knight
    const offsets = [
        [1, 2], [-1, 2], [-2, 1], [-2, -1],
        [2, 1], [2, -1], [1, -2], [-1, -2]
    ];

    // We are using an array to save time; otherwise, time limit will be exceeded
    const visitedArr = Array(607).fill(null).map(() => Array(607).fill(false));

    // Queue to store the indices for BFS traversal
    const queue = [];
    queue.push([0, 0]); // Starting position

    // BFS traversal
    while (queue.length > 0) {
        const queueSize = queue.length;

        // Process all indices at the current level before increasing minSteps
        for (let counter = 0; counter < queueSize; counter++) {
            const currPair = queue.shift(); // Dequeue the front pair

            // Check if the current position is the destination
            if (currPair[0] === x && currPair[1] === y) {
                // Found the destination
                return minSteps;
            }

            // Explore all possible moves from the current position
            for (const [dx, dy] of offsets) {
                const nextX = currPair[0] + dx;
                const nextY = currPair[1] + dy;

                // Adding 302 to ensure 302, 302 is the (0, 0) reference point
                if (!visitedArr[nextX + 302][nextY + 302]) {
                    // Mark the next position as visited and enqueue it for further exploration
                    queue.push([nextX, nextY]);
                    visitedArr[nextX + 302][nextY + 302] = true;
                }
            }
        }

        // Move to the next level of positions
        minSteps++;
    }

    // If the destination is not reachable
    return -1;
}

/* Word Ladder - A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
Every adjacent pair of words differs by a single letter.
Every si for 1 <= i <= k is in wordList.Note that beginWord does not need to be in wordList.
    sk == endWord
Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.
 */
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
const ladderLength = (beginWord, endWord, wordList) => {

    /* pseudo code
        notice that in each word change only one char is allowed to change
        start the BFS with starting word
            loop through the queue
                loop through curr items in the queue
                    move i through the curr word
                        move j through all chars till 26
                            make a potential word
                            check if it belongs to word list
                                push to queue for next visit
                keep incrementing num steps
    */

    // Create a set for faster lookup
    const wordSet = new Set(wordList);

    // If the end word is not in the word list, it's not possible to transform
    if (!wordSet.has(endWord)) {
        return 0;
    }

    let steps = 1; // Initialize the number of transformations

    let queue = [beginWord]; // Start BFS with the initial word
    while (queue.length) {
        const next = []; // Initialize the next level of words to explore
        for (const curr of queue) {
            if (curr === endWord) {
                return steps; // If we reached the endWord, return the number of transformations
            }

            for (let i = 0; i < curr.length; i++) {
                //  try to transform each char one at a time as per condition
                for (let j = 0; j < 26; j++) {
                    // Generate next possible word by changing one letter at a time
                    const nextWord = curr.slice(0, i) + String.fromCharCode(97 + j) + curr.slice(i + 1);

                    if (wordSet.has(nextWord)) {
                        next.push(nextWord); // Add valid next words to the queue for exploration
                        wordSet.delete(nextWord); // Remove the word from the set to avoid repetition
                    }
                }
            }
        }
        queue = next; // Move to the next level of words
        steps++; // Increment the number of transformations
    }

    return 0; // If no transformation sequence is found, return 0
};

/* Minimum Genetic Mutation - Given the two gene strings startGene and endGene and the gene bank bank, return the minimum number of mutations needed to mutate from startGene to endGene. If there is no such a mutation, return -1.

Note that the starting point is assumed to be valid, so it might not be included in the bank.
 */
/**
 * @param {string} startGene
 * @param {string} endGene
 * @param {string[]} bank
 * @return {number}
 */
const minMutation = (startGene, endGene, bank) => {

    /* pseudo code
        start BFS with curr gene
            loop through the queue
                move i through curr gene
                    move through valid mutations
                        create a new Gene
                        check if this gene can be added to the queue for next travel
    */

    // Define the valid mutations that can occur
    const validMutations = ['A', 'C', 'G', 'T'];

    // Convert the bank array to a set for faster lookup
    const geneSet = new Set(bank);

    // Check if the end gene is not in the bank, return -1 as it's not possible
    if (!geneSet.has(endGene)) {
        return -1;
    }

    // Set to keep track of visited genes
    const visitedGenes = new Set();

    // Queue for BFS, each element is [gene, mutations]
    const queue = [[startGene, 0]];

    // Mark the start gene as visited
    visitedGenes.add(startGene);

    // BFS loop
    while (queue.length > 0) {
        // Dequeue the current gene and its mutations
        const [currGene, mutations] = queue.shift();

        // Check if the current gene is the end gene
        if (currGene === endGene) {
            // Found the end gene, return the number of mutations
            return mutations;
        }

        // Loop through each character in the current gene
        for (let i = 0; i < currGene.length; i++) {
            // Loop through each valid mutation
            for (let mutationChar of validMutations) {
                // Skip if the current character is the same as the mutation character
                if (currGene[i] === mutationChar) {
                    continue;
                }

                // Create a new gene with the mutation
                const newGene = currGene.slice(0, i) + mutationChar + currGene.slice(i + 1);

                // Check if the new gene is in the bank and has not been visited
                if (geneSet.has(newGene) && !visitedGenes.has(newGene)) {
                    // Found a new valid unvisited gene, enqueue it with mutations + 1
                    queue.push([newGene, mutations + 1]);
                    // Mark the new gene as visited
                    visitedGenes.add(newGene);
                }
            }
        }
    }

    // If the end gene is not reachable, return -1
    return -1;
};

/* Shortest Path to Get Food */

const getFood = grid => {

    /* pseudo code
        find the pos of the person in the matrix
        start BFS with the person's pos
            loop through the queue
                check if neighbours can be pushed in the queue for next travel
    */

    const ROWS = grid.length;
    const COLS = grid[0].length;

    // Find the starting position of the person marked with '*'
    let startX, startY;
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] === '*') {
                startX = i;
                startY = j;
                break;
            }
        }
    }

    // Define the possible directions to move (up, down, left, right)
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Create a set to keep track of visited cells to avoid revisiting them
    const visited = new Set();

    // Function to check if a given position is valid (within the grid boundaries)
    const isValid = (x, y) => x >= 0 && x < ROWS && y >= 0 && y < COLS;

    // Initialize the queue with the starting position and the number of steps taken
    const queue = [[startX, startY, 0]];

    while (queue.length > 0) {
        // Dequeue the current position and steps taken
        const [x, y, steps] = queue.shift();

        // Check if food is found at the current position
        if (grid[x][y] === '#') {
            return steps; // Return the number of steps taken when food is found
        }

        // Explore neighbors in all possible directions
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            // Check if the new position is valid and has not been visited before
            if (isValid(newX, newY) && grid[newX][newY] !== 'X' && !visited.has(`${newX}-${newY}`)) {
                visited.add(`${newX}-${newY}`); // Mark the new position as visited
                queue.push([newX, newY, steps + 1]); // Enqueue the new position with updated steps
            }
        }
    }

    // Return -1 if no food is found (should not happen if the grid is well-formed)
    return -1;
};
