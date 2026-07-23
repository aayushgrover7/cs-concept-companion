import type { ConceptEntry } from './entry';

export const programmingConcepts: ConceptEntry[] = [
  {
    id: 'variable',
    name: 'Variable',
    aliases: ['variables', 'var', 'let', 'const variable'],
    category: 'Programming Basics',
    difficulty: 'beginner',
    shortExplanation:
      'A variable is a named container that stores a value your program can read and change, like a labeled box holding a number or a piece of text.',
    detailedExplanation:
      'Variables give data a name so code can refer to it later. Each variable has a name, a value, and (in many languages) a type such as number or string. When you assign a new value, the old one is replaced. Variables can be local to a function or shared more widely, which is called their scope.',
    example: 'score = 0\nscore = score + 10  # score now holds 10',
    analogy:
      'A variable is like a jar with a label on it. The label stays the same, but you can swap what is inside the jar at any time.',
    whyItMatters:
      'Almost every program stores and updates information. Variables are the most basic way to do that, so understanding them is the first step to reading any code.',
    relatedConcepts: ['Function', 'Data Structure', 'Memory Allocation'],
  },
  {
    id: 'function',
    name: 'Function',
    aliases: ['functions', 'method', 'methods', 'subroutine', 'procedure'],
    category: 'Programming Basics',
    difficulty: 'beginner',
    shortExplanation:
      'A function is a named, reusable block of code that performs one job. You give it inputs (arguments), it runs, and it can hand back an output (a return value).',
    detailedExplanation:
      'Functions let you write a piece of logic once and reuse it anywhere. They take parameters as input, do their work, and often return a result. Breaking a program into small functions makes it easier to read, test, and fix, because each function has one clear responsibility.',
    example: 'def area(width, height):\n    return width * height\n\narea(3, 4)  # returns 12',
    analogy:
      'A function is like a recipe: it lists the ingredients it needs (inputs), the steps to follow, and what dish comes out at the end (the return value).',
    whyItMatters:
      'Functions are how programmers avoid repeating themselves and keep large programs organized. Nearly all real code is built out of them.',
    relatedConcepts: ['Variable', 'Recursion', 'Abstraction'],
  },
  {
    id: 'recursion',
    name: 'Recursion',
    aliases: ['recursive', 'recursive function', 'recursion tree', 'recursive call'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Recursion is when a function solves a problem by calling itself on a smaller version of the same problem, until it reaches a simple case it can answer directly.',
    detailedExplanation:
      'A recursive function has two parts: a base case that stops the process, and a recursive case that breaks the problem into a smaller copy of itself. Each call waits for the smaller call to finish, and the answers combine on the way back up. Without a correct base case, recursion runs forever and crashes with a stack overflow.',
    example:
      'def factorial(n):\n    if n <= 1:      # base case\n        return 1\n    return n * factorial(n - 1)  # recursive case',
    analogy:
      'It is like standing between two mirrors: each reflection contains a slightly smaller reflection, until they become too small to see — that smallest one is the base case.',
    whyItMatters:
      'Many problems — searching trees, sorting, parsing nested data — are naturally recursive. It is also a favorite topic in interviews and CS courses.',
    relatedConcepts: ['Function', 'Binary Tree', 'Stack'],
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    aliases: ['oop', 'object oriented', 'object-oriented', 'object oriented programming'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Object-oriented programming (OOP) organizes code into objects — bundles of data and the functions that work on that data — modeled after things in the real world.',
    detailedExplanation:
      'In OOP you define classes (blueprints) that describe what an object knows (fields) and what it can do (methods). Programs are built by creating objects from those classes and letting them interact. The four classic pillars are encapsulation, abstraction, inheritance, and polymorphism.',
    example:
      'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f"{self.name} says woof"',
    analogy:
      'A class is like a cookie cutter and objects are the cookies: one blueprint, many individual cookies that each hold their own decorations.',
    whyItMatters:
      'OOP is the dominant style in languages like Java, Python, and C++. Understanding it unlocks most large codebases and frameworks.',
    relatedConcepts: ['Class', 'Inheritance', 'Polymorphism', 'Encapsulation'],
  },
  {
    id: 'class',
    name: 'Class',
    aliases: ['classes', 'object', 'objects', 'instance', 'instantiation'],
    category: 'Programming Basics',
    difficulty: 'beginner',
    shortExplanation:
      'A class is a blueprint that defines what data an object holds and what actions it can perform. An object is one concrete thing built from that blueprint.',
    detailedExplanation:
      'Classes describe structure and behavior once; objects (instances) are created from them with their own copies of the data. For example, a Car class might define color and a drive() method, while myCar and yourCar are two separate objects with different colors but the same abilities.',
    example:
      'class Car:\n    def __init__(self, color):\n        self.color = color\n\nmy_car = Car("red")',
    analogy:
      'A class is an architect’s floor plan; each object is an actual house built from it — same layout, different furniture.',
    whyItMatters:
      'Classes are the core building block of object-oriented languages, so you meet them everywhere from school assignments to production apps.',
    relatedConcepts: ['Object-Oriented Programming', 'Inheritance', 'Encapsulation'],
  },
  {
    id: 'inheritance',
    name: 'Inheritance',
    aliases: ['inherits', 'subclass', 'superclass', 'base class', 'derived class', 'extends'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Inheritance lets a class reuse and extend another class. The child class automatically gets the parent’s data and behavior, then adds or changes what it needs.',
    detailedExplanation:
      'With inheritance you define shared behavior once in a base class and specialize it in subclasses. A Dog class can inherit from Animal, keeping eat() and sleep() while adding bark(). Subclasses can also override inherited methods to change behavior, which is what makes polymorphism possible.',
    example:
      'class Animal:\n    def eat(self): ...\n\nclass Dog(Animal):  # Dog inherits eat()\n    def bark(self): ...',
    analogy:
      'It is like a family recipe passed down: the child keeps the original recipe but may tweak the spices.',
    whyItMatters:
      'Inheritance reduces duplicated code and models “is-a” relationships, and it appears in almost every object-oriented codebase and framework.',
    relatedConcepts: ['Object-Oriented Programming', 'Polymorphism', 'Class'],
  },
  {
    id: 'polymorphism',
    name: 'Polymorphism',
    aliases: ['polymorphic', 'method overriding', 'dynamic dispatch'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Polymorphism means "many forms": different types of objects can respond to the same instruction in their own way, so one piece of code works with many kinds of objects.',
    detailedExplanation:
      'If Dog and Cat both inherit from Animal and each defines its own speak() method, code that calls animal.speak() will bark for dogs and meow for cats — without knowing which one it has. This lets you write general code against a shared interface while each type supplies its own behavior.',
    example:
      'for animal in [Dog(), Cat()]:\n    print(animal.speak())\n# "Woof" then "Meow" — same call, different behavior',
    analogy:
      'Pressing "play" behaves differently on a CD player, a phone, and a streaming app — the same button, adapted to each device.',
    whyItMatters:
      'Polymorphism is what makes object-oriented code flexible and extensible: you can add new types without rewriting the code that uses them.',
    relatedConcepts: ['Inheritance', 'Object-Oriented Programming', 'Abstraction'],
  },
  {
    id: 'encapsulation',
    name: 'Encapsulation',
    aliases: ['information hiding', 'private fields', 'getters and setters'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Encapsulation bundles data together with the methods that use it, and hides the internal details so other code can only interact through a controlled interface.',
    detailedExplanation:
      'An encapsulated class keeps its fields private and exposes public methods for reading and changing them. This prevents outside code from putting the object into an invalid state, and lets the class change its internal implementation later without breaking anything that uses it.',
    example:
      'class BankAccount:\n    def __init__(self):\n        self._balance = 0   # internal\n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount',
    analogy:
      'A vending machine encapsulates its inner workings: you press buttons on the outside, but you cannot reach in and rearrange the snacks.',
    whyItMatters:
      'Encapsulation keeps large programs safe to change — bugs stay contained because each class controls its own data.',
    relatedConcepts: ['Object-Oriented Programming', 'Abstraction', 'Class'],
  },
  {
    id: 'abstraction',
    name: 'Abstraction',
    aliases: ['abstract', 'abstraction layer', 'abstract class', 'interface'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Abstraction means hiding complex details behind a simple interface, so you can use something without knowing exactly how it works inside.',
    detailedExplanation:
      'Programmers build layers of abstraction: a sort() function hides the sorting algorithm, a file API hides the disk hardware, a web framework hides raw networking. Each layer exposes only what the user of that layer needs, which keeps complexity manageable as systems grow.',
    example:
      'numbers.sort()  # you use sorting without writing the algorithm\nfile.read()     # you read data without touching disk hardware',
    analogy:
      'Driving a car is an abstraction: the steering wheel and pedals hide thousands of mechanical details you never need to think about.',
    whyItMatters:
      'Abstraction is arguably the central idea of computer science — it is how humans manage systems with millions of moving parts.',
    relatedConcepts: ['Encapsulation', 'API', 'Function'],
  },
  {
    id: 'pointer',
    name: 'Pointer',
    aliases: ['pointers', 'reference', 'references', 'memory address', 'dereference'],
    category: 'Programming Basics',
    difficulty: 'advanced',
    shortExplanation:
      'A pointer is a variable that stores the memory address of another value instead of the value itself — it "points" to where the data lives.',
    detailedExplanation:
      'In languages like C and C++, pointers let you share and modify data without copying it, build linked structures, and manage memory directly. Following a pointer to its data is called dereferencing. Pointer mistakes — like using an address after the data is gone — cause crashes and security bugs, which is why newer languages manage references automatically.',
    example:
      'int x = 5;\nint *p = &x;  // p holds the address of x\n*p = 10;      // changes x through the pointer',
    analogy:
      'A pointer is like a home address written on a card: the card is not the house, but it tells you exactly where the house is.',
    whyItMatters:
      'Pointers explain how data structures like linked lists work under the hood, and they are essential for systems programming and understanding memory bugs.',
    relatedConcepts: ['Memory Allocation', 'Linked List', 'Stack vs Heap'],
  },
  {
    id: 'memory-allocation',
    name: 'Memory Allocation',
    aliases: ['malloc', 'allocate memory', 'heap allocation', 'memory management'],
    category: 'Programming Basics',
    difficulty: 'advanced',
    shortExplanation:
      'Memory allocation is how a program reserves space in the computer’s RAM to store its data while it runs, and releases that space when it is done.',
    detailedExplanation:
      'Programs request memory either automatically (local variables on the stack) or explicitly (dynamic allocation on the heap). In C you call malloc and free yourself; in Python or Java the runtime allocates for you and a garbage collector reclaims unused memory. Forgetting to release memory causes leaks; releasing it too early causes crashes.',
    example:
      'int *arr = malloc(10 * sizeof(int));  // reserve space for 10 ints\nfree(arr);                            // give it back',
    analogy:
      'It is like booking hotel rooms: you reserve rooms when guests arrive and must check them out when they leave, or the hotel eventually runs out of rooms.',
    whyItMatters:
      'Understanding allocation explains why programs run out of memory, why leaks happen, and how languages differ in managing resources.',
    relatedConcepts: ['Stack vs Heap', 'Garbage Collection', 'Pointer'],
  },
  {
    id: 'stack-vs-heap',
    name: 'Stack vs Heap',
    aliases: [
      'call stack',
      'the stack',
      'the heap',
      'stack memory',
      'heap memory',
      'stack overflow',
    ],
    category: 'Programming Basics',
    difficulty: 'advanced',
    shortExplanation:
      'The stack and heap are two regions of a program’s memory: the stack holds function calls and local variables in strict order, while the heap holds data that lives longer and is managed more flexibly.',
    detailedExplanation:
      'Every function call pushes a frame onto the stack with its local variables, and popping happens automatically when the function returns — fast but limited in size (deep recursion causes a stack overflow). The heap is a larger pool for data whose size or lifetime is not known in advance, allocated on demand and freed manually or by a garbage collector.',
    example:
      'def f():\n    x = 5            # x lives on the stack\n    data = [0] * 10  # the list object lives on the heap',
    analogy:
      'The stack is a neat pile of cafeteria trays — you only add or remove from the top. The heap is a big storage room where you claim shelf space as needed.',
    whyItMatters:
      'This distinction explains recursion limits, memory leaks, and performance differences, and it comes up constantly in systems courses and interviews.',
    relatedConcepts: ['Memory Allocation', 'Recursion', 'Garbage Collection'],
  },
  {
    id: 'garbage-collection',
    name: 'Garbage Collection',
    aliases: ['gc', 'garbage collector', 'automatic memory management'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Garbage collection is a language feature that automatically finds data your program can no longer reach and frees its memory, so you do not have to manage memory by hand.',
    detailedExplanation:
      'Languages like Java, Python, and JavaScript run a garbage collector that periodically scans for objects no longer referenced by the program and reclaims their space. This prevents most memory leaks and use-after-free bugs, at the cost of occasional pauses and less precise control than manual management in C or C++.',
    example:
      'data = load_big_file()\ndata = None  # nothing references the file data now,\n             # so the garbage collector may reclaim it',
    analogy:
      'It is like a hotel cleaning crew that watches for guests who have checked out and immediately readies their rooms for reuse.',
    whyItMatters:
      'Garbage collection is why beginner-friendly languages feel safe, and understanding it explains performance hiccups in real applications.',
    relatedConcepts: ['Memory Allocation', 'Stack vs Heap', 'Pointer'],
  },
  {
    id: 'closure',
    name: 'Closure',
    aliases: ['closures', 'lexical scope', 'captured variable'],
    category: 'Programming Basics',
    difficulty: 'advanced',
    shortExplanation:
      'A closure is a function that remembers the variables from the place where it was created, even after that outer code has finished running.',
    detailedExplanation:
      'When a function is defined inside another function, it "closes over" the outer function’s variables. Those variables stay alive as long as the inner function exists. Closures are the basis for callbacks, event handlers, and data privacy patterns in JavaScript and functional languages.',
    example:
      'function counter() {\n  let count = 0;\n  return () => ++count;  // remembers count\n}\nconst next = counter();\nnext(); // 1\nnext(); // 2',
    analogy:
      'A closure is like a backpack: when the function leaves home, it packs the variables it needs and carries them wherever it goes.',
    whyItMatters:
      'Closures power much of modern JavaScript — event handlers, React hooks, async code — and they are a classic interview topic.',
    relatedConcepts: ['Function', 'Asynchronous Programming', 'Variable'],
  },
  {
    id: 'async',
    name: 'Asynchronous Programming',
    aliases: ['async', 'await', 'async await', 'promise', 'promises', 'callback', 'non-blocking'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'Asynchronous programming lets a program start a slow task — like a network request — and keep doing other work instead of freezing while it waits for the result.',
    detailedExplanation:
      'Instead of blocking, async code registers what should happen when the task finishes: via callbacks, promises, or async/await syntax. This keeps user interfaces responsive and lets servers handle many requests at once. The tradeoff is that program flow becomes less linear and errors must be handled along the async path.',
    example:
      'const res = await fetch("/api/data");  // waits without freezing the page\nconst data = await res.json();',
    analogy:
      'It is like ordering at a coffee shop that gives you a buzzer: you sit down and do other things, and the buzzer goes off when your drink is ready.',
    whyItMatters:
      'Every web app, server, and mobile app relies on async code to stay fast and responsive — it is unavoidable in modern development.',
    relatedConcepts: ['Thread', 'Concurrency', 'Closure'],
  },
  {
    id: 'compiler',
    name: 'Compiler',
    aliases: ['compilers', 'compile', 'compilation', 'compiled language'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'A compiler is a program that translates source code written by humans into machine code the computer can execute, all at once before the program runs.',
    detailedExplanation:
      'Compilers parse your code, check it for errors, optimize it, and output an executable. Because translation happens ahead of time, compiled programs (C, C++, Rust, Go) usually start and run fast, and many bugs are caught before the program ever runs. This contrasts with interpreters, which translate as the program executes.',
    example:
      'gcc hello.c -o hello   # compile C source into an executable\n./hello                # run the machine code',
    analogy:
      'A compiler is like translating an entire book before publishing it, rather than translating each page aloud as someone reads.',
    whyItMatters:
      'Knowing what a compiler does explains error messages, build steps, and why some languages are faster than others.',
    relatedConcepts: ['Interpreter', 'Variable', 'Operating System'],
  },
  {
    id: 'interpreter',
    name: 'Interpreter',
    aliases: ['interpreters', 'interpreted language', 'interpreted'],
    category: 'Programming Basics',
    difficulty: 'intermediate',
    shortExplanation:
      'An interpreter runs source code directly, translating and executing it line by line while the program runs, instead of compiling it all in advance.',
    detailedExplanation:
      'Interpreted languages like Python and JavaScript skip a separate build step: you edit and run immediately, which makes development fast and flexible. The cost is typically slower execution than compiled code, so modern engines blend both approaches with just-in-time (JIT) compilation.',
    example:
      'python script.py   # the interpreter reads and executes\n                   # the file statement by statement',
    analogy:
      'An interpreter is like a live translator at a meeting, converting each sentence as it is spoken rather than translating the whole speech beforehand.',
    whyItMatters:
      'The compiler/interpreter distinction explains why languages feel different to work with and why performance varies between them.',
    relatedConcepts: ['Compiler', 'Garbage Collection', 'Operating System'],
  },
];
