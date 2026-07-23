import type { ConceptEntry } from './entry';

export const dataStructureConcepts: ConceptEntry[] = [
  {
    id: 'algorithm',
    name: 'Algorithm',
    aliases: ['algorithms', 'algorithmic'],
    category: 'Algorithms & Data Structures',
    difficulty: 'beginner',
    shortExplanation:
      'An algorithm is a precise, step-by-step procedure for solving a problem — a recipe a computer can follow to get from input to output.',
    detailedExplanation:
      'Algorithms describe exactly what to do in what order: how to sort a list, find a route, or compress a photo. The same problem can have many algorithms that differ enormously in speed and memory use, which is why computer scientists analyze them with tools like Big O notation.',
    example:
      'To find the largest number in a list:\n1. Remember the first number.\n2. Look at each remaining number.\n3. If it is bigger, remember it instead.\n4. The remembered number is the answer.',
    analogy:
      'An algorithm is like driving directions: a fixed sequence of turns that reliably gets anyone from A to B.',
    whyItMatters:
      'Algorithms are the core of computer science — choosing a better one can turn an impossible computation into an instant one.',
    relatedConcepts: ['Big O Notation', 'Data Structure', 'Sorting'],
  },
  {
    id: 'data-structure',
    name: 'Data Structure',
    aliases: ['data structures'],
    category: 'Algorithms & Data Structures',
    difficulty: 'beginner',
    shortExplanation:
      'A data structure is an organized way of storing data in a program so it can be used efficiently — different shapes of storage for different jobs.',
    detailedExplanation:
      'Arrays, linked lists, stacks, queues, trees, and hash tables each organize data differently, making certain operations fast and others slow. Choosing the right structure — fast lookups? ordered data? frequent insertions? — is one of the most practical skills in programming.',
    example:
      'A contact list could be an array (simple), a hash table (instant lookup by name), or a tree (always sorted).',
    analogy:
      'Data structures are like kitchen storage: spice racks, stacked plates, and labeled drawers all hold things, but each makes a different task easy.',
    whyItMatters:
      'Nearly every technical interview and real program hinges on choosing appropriate data structures.',
    relatedConcepts: ['Array', 'Hash Table', 'Binary Tree', 'Algorithm'],
  },
  {
    id: 'array',
    name: 'Array',
    aliases: ['arrays', 'list', 'lists'],
    category: 'Algorithms & Data Structures',
    difficulty: 'beginner',
    shortExplanation:
      'An array is a sequence of items stored side by side in memory, where each item can be reached instantly by its position number (index).',
    detailedExplanation:
      'Because elements sit contiguously in memory, accessing arr[500] is just arithmetic and takes constant time. The tradeoff: inserting or removing in the middle means shifting everything after it, and classic arrays have a fixed size. Indexes almost always start at 0.',
    example: 'scores = [90, 85, 77]\nscores[0]  # 90 — instant access by index',
    analogy:
      'An array is a row of numbered mailboxes: knowing the number lets you walk straight to the right box without opening the others.',
    whyItMatters:
      'Arrays are the most common data structure in existence and the foundation many others are built on.',
    relatedConcepts: ['Linked List', 'Data Structure', 'Hash Table'],
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    aliases: ['linked lists', 'singly linked list', 'doubly linked list', 'node'],
    category: 'Algorithms & Data Structures',
    difficulty: 'intermediate',
    shortExplanation:
      'A linked list stores items as separate nodes, where each node holds a value plus a pointer to the next node — a chain of data scattered through memory.',
    detailedExplanation:
      'Unlike arrays, linked list nodes can live anywhere in memory. Adding or removing a node just means rewiring pointers, which is fast; but finding the nth item requires walking the chain from the start. Doubly linked lists add a pointer to the previous node so you can walk both ways.',
    example: '[A] -> [B] -> [D]\nInsert C: point B at C, point C at D:\n[A] -> [B] -> [C] -> [D]',
    analogy:
      'A linked list is a scavenger hunt: each clue tells you where the next clue is, so you must follow them in order.',
    whyItMatters:
      'Linked lists teach how pointers build structures, and they are the classic warm-up for interview questions and systems code.',
    relatedConcepts: ['Array', 'Pointer', 'Queue'],
  },
  {
    id: 'stack',
    name: 'Stack',
    aliases: ['stacks', 'lifo', 'push and pop', 'push pop'],
    category: 'Algorithms & Data Structures',
    difficulty: 'beginner',
    shortExplanation:
      'A stack stores items in last-in-first-out (LIFO) order: you can only add (push) or remove (pop) from the top, like a pile of plates.',
    detailedExplanation:
      'Stacks are ideal whenever the most recent thing matters first: undo history, the browser back button, matching brackets in code, and the call stack that tracks running functions. Both push and pop take constant time.',
    example: 'push(A), push(B), push(C)\npop() -> C\npop() -> B  # last in, first out',
    analogy: 'A stack is a Pringles can: the last chip in is the first chip out.',
    whyItMatters:
      'Stacks explain how function calls, undo systems, and expression parsing actually work.',
    relatedConcepts: ['Queue', 'Recursion', 'Stack vs Heap'],
  },
  {
    id: 'queue',
    name: 'Queue',
    aliases: ['queues', 'fifo', 'enqueue', 'dequeue', 'message queue'],
    category: 'Algorithms & Data Structures',
    difficulty: 'beginner',
    shortExplanation:
      'A queue stores items in first-in-first-out (FIFO) order: items join at the back and leave from the front, like a line at a store.',
    detailedExplanation:
      'Queues preserve arrival order, which makes them perfect for scheduling: print jobs, tasks waiting for a CPU, requests hitting a server, or breadth-first search through a graph. Variants include priority queues, where urgent items jump ahead.',
    example: 'enqueue(A), enqueue(B), enqueue(C)\ndequeue() -> A  # first in, first out',
    analogy: 'A queue is the line at a coffee shop: first person in line gets served first.',
    whyItMatters:
      'Queues are everywhere in real systems — operating systems, web servers, and messaging platforms all schedule work with them.',
    relatedConcepts: ['Stack', 'Process', 'Thread'],
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    aliases: [
      'hash tables',
      'hashmap',
      'hash map',
      'dictionary',
      'dict',
      'associative array',
      'key-value',
    ],
    category: 'Algorithms & Data Structures',
    difficulty: 'intermediate',
    shortExplanation:
      'A hash table stores key–value pairs and uses a hash function to jump almost instantly to where any key’s value is stored — near-constant-time lookup.',
    detailedExplanation:
      'The hash function converts a key like "alice" into a bucket number. Lookups, insertions, and deletions average O(1). When two keys hash to the same bucket (a collision), the table chains entries or probes for a free slot. Python dicts, JavaScript objects/Maps, and Java HashMaps are all hash tables.',
    example:
      'ages = {"alice": 17, "bob": 18}\nages["alice"]  # 17, found without scanning the whole table',
    analogy:
      'A hash table is like a coat check: your ticket number tells the attendant exactly which hook holds your coat.',
    whyItMatters:
      'Hash tables are arguably the most useful data structure in practice — most "fast lookup" problems are solved with one.',
    relatedConcepts: ['Hashing', 'Array', 'Data Structure'],
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    aliases: ['binary trees', 'binary search tree', 'bst', 'tree data structure', 'tree traversal'],
    category: 'Algorithms & Data Structures',
    difficulty: 'intermediate',
    shortExplanation:
      'A binary tree is a hierarchy of nodes where each node has at most two children. In a binary search tree, smaller values go left and larger go right, making search fast.',
    detailedExplanation:
      'Trees model hierarchical data (folders, HTML, org charts). A balanced binary search tree finds, inserts, or deletes values in O(log n) time by discarding half the remaining tree at every step. Traversals — in-order, pre-order, post-order — visit nodes in different useful orders.',
    example:
      '      8\n     / \\\n    3   10\n   / \\    \\\n  1   6    14\nSearching for 6: 8 -> left to 3 -> right to 6. Three steps.',
    analogy:
      'It is like the game 20 Questions: each yes/no answer eliminates half the possibilities.',
    whyItMatters:
      'Trees underpin databases, filesystems, and autocomplete — and they are a staple of interviews and data structures courses.',
    relatedConcepts: ['Recursion', 'Binary Search', 'Data Structure'],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    aliases: ['bisection search', 'logarithmic search'],
    category: 'Algorithms & Data Structures',
    difficulty: 'intermediate',
    shortExplanation:
      'Binary search finds a value in a sorted list by repeatedly checking the middle and discarding the half that cannot contain the answer.',
    detailedExplanation:
      'Each comparison halves the search space, so a million items need at most about 20 checks — O(log n). The catch: the data must already be sorted. Binary search also generalizes to "find the first value where a condition becomes true," a pattern used constantly in real code.',
    example:
      'Find 7 in [1, 3, 5, 7, 9, 11]:\nmiddle is 5 -> too small, search right half\nmiddle is 9 -> too big, search left half\nfound 7. Three steps instead of six.',
    analogy:
      'It is how you find a word in a dictionary: open near the middle, decide which half the word is in, repeat.',
    whyItMatters:
      'Binary search is the clearest example of how a clever algorithm crushes brute force — the heart of algorithmic thinking.',
    relatedConcepts: ['Big O Notation', 'Sorting', 'Binary Tree'],
  },
  {
    id: 'sorting',
    name: 'Sorting',
    aliases: [
      'sort',
      'sorting algorithm',
      'quicksort',
      'merge sort',
      'bubble sort',
      'insertion sort',
    ],
    category: 'Algorithms & Data Structures',
    difficulty: 'beginner',
    shortExplanation:
      'Sorting means arranging items into order (numeric, alphabetical, by date). Dozens of algorithms exist, trading simplicity for speed.',
    detailedExplanation:
      'Simple algorithms like bubble sort and insertion sort compare neighbors and take O(n²) time — fine for small lists. Efficient algorithms like merge sort and quicksort divide the data and reach O(n log n), which is dramatically faster at scale. Sorted data also unlocks binary search.',
    example:
      '[5, 2, 8, 1] -> [1, 2, 5, 8]\nBubble sort: repeatedly swap out-of-order neighbors until no swaps remain.',
    analogy:
      'Sorting a hand of cards: most people naturally use insertion sort — slide each new card into its right place.',
    whyItMatters:
      'Sorting is the classic case study for comparing algorithm efficiency, and ordered data makes almost every other operation faster.',
    relatedConcepts: ['Big O Notation', 'Binary Search', 'Algorithm'],
  },
  {
    id: 'time-complexity',
    name: 'Time Complexity',
    aliases: [
      'runtime complexity',
      'computational complexity',
      'space complexity',
      'asymptotic analysis',
    ],
    category: 'Algorithms & Data Structures',
    difficulty: 'intermediate',
    shortExplanation:
      'Time complexity describes how an algorithm’s running time grows as its input gets bigger — the key question being "what happens when n doubles?"',
    detailedExplanation:
      'Rather than measuring seconds (which depend on hardware), complexity counts how the number of steps scales with input size n. Linear algorithms double their work when n doubles; quadratic ones quadruple it; logarithmic ones barely notice. Space complexity applies the same idea to memory.',
    example:
      'Checking every pair in a list of n items takes about n² steps:\n10 items -> 100 steps, but 1,000 items -> 1,000,000 steps.',
    analogy:
      'It is like asking how a road trip scales: double the distance and driving time doubles (linear), but visiting every pair of cities blows up much faster (quadratic).',
    whyItMatters:
      'Complexity is how engineers predict whether code that works on 100 items will survive 100 million — essential for interviews and real systems.',
    relatedConcepts: ['Big O Notation', 'Algorithm', 'Sorting'],
  },
  {
    id: 'big-o',
    name: 'Big O Notation',
    aliases: ['big o', 'big-o', 'o(n)', 'o(1)', 'o(log n)', 'o(n^2)', 'o(n log n)'],
    category: 'Algorithms & Data Structures',
    difficulty: 'intermediate',
    shortExplanation:
      'Big O notation is the standard shorthand for time complexity: O(1) is constant, O(n) linear, O(n²) quadratic — it captures how work grows with input size, ignoring constant factors.',
    detailedExplanation:
      'Big O describes the growth rate of the worst case as input size n grows large. O(1) means the same work regardless of size (hash lookup); O(log n) halves the problem each step (binary search); O(n) touches everything once; O(n log n) is efficient sorting; O(n²) compares all pairs; O(2ⁿ) explodes exponentially.',
    example:
      'Common classes, fastest to slowest:\nO(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)',
    analogy:
      'Big O is like describing a car by its acceleration curve rather than one speed reading — it tells you how performance behaves, not one data point.',
    whyItMatters:
      'Big O is the shared language engineers use to discuss efficiency — it appears in nearly every technical interview.',
    relatedConcepts: ['Time Complexity', 'Binary Search', 'Sorting'],
  },
];
