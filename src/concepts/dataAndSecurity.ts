import type { ConceptEntry } from './entry';

export const dataAndSecurityConcepts: ConceptEntry[] = [
  {
    id: 'database',
    name: 'Database',
    aliases: ['databases', 'dbms', 'relational database', 'nosql', 'db'],
    category: 'Data & Databases',
    difficulty: 'beginner',
    shortExplanation:
      'A database is organized storage for large amounts of data that programs can search, update, and share reliably — the long-term memory of an application.',
    detailedExplanation:
      'Relational databases (PostgreSQL, MySQL) store data in tables with rows and columns and are queried with SQL; NoSQL databases store documents or key–value pairs for flexibility and scale. Databases guarantee properties like durability (data survives crashes) and consistency, which plain files cannot.',
    example:
      'A school database might have a students table and a courses table, linked so you can ask: "which students are enrolled in CS101?"',
    analogy:
      'A database is a meticulous librarian: not just shelves of books, but a catalog system that can instantly answer questions about what is where.',
    whyItMatters:
      'Nearly every app — social media, banking, games — is built around a database; they are how software remembers anything.',
    relatedConcepts: ['SQL', 'Normalization', 'Data Structure'],
  },
  {
    id: 'sql',
    name: 'SQL',
    aliases: ['structured query language', 'sql query', 'select statement', 'sql injection'],
    category: 'Data & Databases',
    difficulty: 'beginner',
    shortExplanation:
      'SQL (Structured Query Language) is the standard language for talking to relational databases: you describe what data you want, and the database figures out how to get it.',
    detailedExplanation:
      'SQL statements read almost like English: SELECT retrieves rows, INSERT adds them, UPDATE changes them, DELETE removes them, and JOIN combines tables. Because you declare the result you want rather than the steps to compute it, the database engine is free to optimize the actual work.',
    example: 'SELECT name, grade\nFROM students\nWHERE grade >= 90\nORDER BY name;',
    analogy:
      'SQL is like ordering from a research librarian: you describe the report you need, and they handle the searching, cross-referencing, and assembly.',
    whyItMatters:
      'SQL has been essential for 50 years and still runs the world’s data — it is one of the most employable skills in software.',
    relatedConcepts: ['Database', 'Normalization', 'API'],
  },
  {
    id: 'normalization',
    name: 'Normalization',
    aliases: ['database normalization', 'normal form', 'normal forms', 'denormalization', '3nf'],
    category: 'Data & Databases',
    difficulty: 'advanced',
    shortExplanation:
      'Normalization is organizing database tables so each fact is stored exactly once, which prevents duplicated data and the inconsistencies that duplication causes.',
    detailedExplanation:
      'Instead of one wide table repeating a teacher’s name on every student row, normalization splits data into related tables — students, teachers, enrollments — connected by IDs. The "normal forms" (1NF, 2NF, 3NF) are progressively stricter rules for this. Sometimes engineers deliberately denormalize, re-duplicating data to make reads faster.',
    example:
      'Bad: every student row repeats "Ms. Chen, Room 204".\nGood: students hold teacher_id = 7; the teachers table stores Ms. Chen’s details once.',
    analogy:
      'It is like keeping one master contact card per person instead of rewriting their address in every letter you send — update it once, correct everywhere.',
    whyItMatters:
      'Normalization prevents subtle data corruption bugs and is core material in any databases course.',
    relatedConcepts: ['Database', 'SQL', 'Data Structure'],
  },
  {
    id: 'version-control',
    name: 'Version Control',
    aliases: [
      'source control',
      'revision control',
      'vcs',
      'commit',
      'commits',
      'branching',
      'merge conflict',
    ],
    category: 'Developer Tools',
    difficulty: 'beginner',
    shortExplanation:
      'Version control records every change made to a project’s files over time, so you can review history, undo mistakes, and let many people work on the same code without overwriting each other.',
    detailedExplanation:
      'A version control system stores snapshots (commits) of your project with messages describing each change. Branches let you develop features in parallel and merge them when ready. If something breaks, you can compare versions or roll back precisely to any point in history.',
    example:
      'commit 1: "Add login page"\ncommit 2: "Fix password bug"\ncommit 3: "Add dark mode"\nSomething broke? Jump back to commit 2 and compare.',
    analogy:
      'It is like a video game save system combined with Google Docs history: save points you can always return to, plus a record of who changed what and why.',
    whyItMatters:
      'Every professional software team uses version control daily — it is as fundamental to programming as saving files.',
    relatedConcepts: ['Git', 'Cloud Computing'],
  },
  {
    id: 'git',
    name: 'Git',
    aliases: [
      'github',
      'git repository',
      'repo',
      'git branch',
      'pull request',
      'git commit',
      'git merge',
      'clone',
    ],
    category: 'Developer Tools',
    difficulty: 'beginner',
    shortExplanation:
      'Git is the world’s most popular version control system: it tracks changes to your code as commits, supports branching and merging, and syncs work between computers. GitHub is a website for hosting and sharing Git projects.',
    detailedExplanation:
      'Git keeps a full copy of the project history on every developer’s machine, so it works offline and is very fast. Typical flow: edit files, stage them, commit with a message, and push to a shared remote like GitHub, where teammates review changes via pull requests before merging.',
    example: 'git add .\ngit commit -m "Add search feature"\ngit push origin main',
    analogy:
      'Git is a time machine plus a collaboration hub for your project: everyone has the full history, and changes merge together instead of overwriting.',
    whyItMatters:
      'Git is a day-one requirement for internships and jobs, and a GitHub profile is effectively a developer’s portfolio.',
    relatedConcepts: ['Version Control', 'Cloud Computing'],
  },
  {
    id: 'encryption',
    name: 'Encryption',
    aliases: [
      'encrypt',
      'encrypted',
      'decryption',
      'cipher',
      'public key',
      'private key',
      'end-to-end encryption',
      'tls',
      'ssl',
    ],
    category: 'Security',
    difficulty: 'intermediate',
    shortExplanation:
      'Encryption scrambles data with a mathematical key so only someone holding the right key can unscramble and read it — everyone else sees meaningless noise.',
    detailedExplanation:
      'Symmetric encryption uses one shared secret key for both locking and unlocking (fast, used for bulk data). Public-key encryption uses a key pair: anyone can encrypt with your public key, but only your private key decrypts. The web combines both — HTTPS uses public-key techniques to agree on a symmetric key, then encrypts all traffic.',
    example:
      '"HELLO" + key -> "Xk9#mQ2$"\nOnly the correct key turns "Xk9#mQ2$" back into "HELLO".',
    analogy:
      'Public-key encryption is a mailbox with a slot: anyone can drop a letter in (public key), but only the owner’s key opens the box (private key).',
    whyItMatters:
      'Encryption protects passwords, messages, and payments — it is the reason the internet can be trusted with anything sensitive.',
    relatedConcepts: ['Hashing', 'Cybersecurity', 'HTTP'],
  },
  {
    id: 'hashing',
    name: 'Hashing',
    aliases: ['hash', 'hash function', 'hashes', 'sha-256', 'md5', 'checksum', 'password hashing'],
    category: 'Security',
    difficulty: 'intermediate',
    shortExplanation:
      'Hashing runs data through a one-way function that produces a short, fixed-size fingerprint. The same input always gives the same hash, but you cannot reverse a hash back into the original data.',
    detailedExplanation:
      'Any change to the input — even one letter — produces a completely different hash, which makes hashes ideal for verifying integrity and storing passwords: sites store the hash of your password, not the password itself, and simply hash your login attempt and compare. Hashing also powers hash tables and Git commit IDs. Unlike encryption, hashing is not meant to be undone.',
    example:
      'hash("hello")  -> 2cf24dba5fb0a...\nhash("hello!") -> ce06092fb948d...  (tiny change, totally different)',
    analogy:
      'A hash is a fingerprint: it identifies a person uniquely, but you cannot rebuild the whole person from a fingerprint.',
    whyItMatters:
      'Hashing secures every login system, verifies downloads, and underpins Git and blockchains — one function, everywhere.',
    relatedConcepts: ['Encryption', 'Hash Table', 'Cybersecurity'],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    aliases: [
      'cyber security',
      'information security',
      'infosec',
      'security',
      'phishing',
      'malware',
      'vulnerability',
      'firewall',
    ],
    category: 'Security',
    difficulty: 'beginner',
    shortExplanation:
      'Cybersecurity is the practice of protecting computers, networks, and data from unauthorized access and attacks — and designing systems so that attacks fail.',
    detailedExplanation:
      'Attackers exploit software bugs, weak passwords, and human trust (phishing). Defenders respond with layers: encryption for data, authentication to prove identity, firewalls to filter traffic, updates to patch vulnerabilities, and least-privilege design so a single breach cannot reach everything. Security is a property of the whole system, not one product.',
    example:
      'A phishing email imitates your bank to steal your password; two-factor authentication blocks the attacker even if the password leaks.',
    analogy:
      'Securing a system is like securing a castle: walls, a moat, guards, and locked inner rooms — many layers, because any single one can fail.',
    whyItMatters:
      'Every organization now depends on software, making security one of the fastest-growing and highest-stakes fields in computing.',
    relatedConcepts: ['Encryption', 'Hashing', 'Computer Networking'],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    aliases: [
      'ml',
      'machine-learning',
      'training data',
      'model training',
      'supervised learning',
      'deep learning',
      'ai',
      'artificial intelligence',
    ],
    category: 'AI & Machine Learning',
    difficulty: 'intermediate',
    shortExplanation:
      'Machine learning is a way of building software that learns patterns from examples instead of following hand-written rules — you show it data, and it figures out the rules itself.',
    detailedExplanation:
      'Instead of coding "spam contains these words," you feed a model thousands of labeled emails and it learns which patterns predict spam. Training adjusts the model’s internal numbers to reduce mistakes; afterward it can generalize to new, unseen inputs. Main styles: supervised (learn from labeled examples), unsupervised (find structure in unlabeled data), and reinforcement learning (learn by trial and reward).',
    example:
      'Show a model 10,000 photos labeled "cat" or "dog" -> it learns visual patterns -> it correctly labels a brand-new photo it has never seen.',
    analogy:
      'It is like learning to ride a bike: nobody hands you equations of balance — you try, wobble, adjust, and improve from experience.',
    whyItMatters:
      'Machine learning powers recommendations, translation, medical imaging, and modern AI assistants — it is reshaping every industry.',
    relatedConcepts: ['Neural Network', 'Algorithm', 'Cloud Computing'],
  },
  {
    id: 'neural-network',
    name: 'Neural Network',
    aliases: [
      'neural networks',
      'neural net',
      'deep neural network',
      'neurons',
      'llm',
      'large language model',
      'transformer',
    ],
    category: 'AI & Machine Learning',
    difficulty: 'advanced',
    shortExplanation:
      'A neural network is a machine learning model made of layers of simple units ("neurons") that each do small calculations; stacked together, they can learn remarkably complex patterns.',
    detailedExplanation:
      'Each neuron multiplies its inputs by learned weights, sums them, and passes the result through a simple function. Layers transform the data step by step — early layers of an image network detect edges, later ones detect faces. Training uses backpropagation: measure the error, then nudge millions of weights slightly to reduce it, repeated over huge datasets. "Deep learning" means many layers; large language models are neural networks with billions of weights trained on text.',
    example:
      'Input photo pixels -> layer 1 finds edges -> layer 2 finds shapes -> layer 3 finds "whiskers, pointed ears" -> output: "cat, 97%".',
    analogy:
      'It is like a huge assembly line of inspectors: each one checks something tiny and passes notes forward, and the final inspector combines all the notes into a verdict.',
    whyItMatters:
      'Neural networks drive the current AI revolution — image recognition, speech, and chatbots all run on them.',
    relatedConcepts: ['Machine Learning', 'Algorithm', 'Big O Notation'],
  },
];
