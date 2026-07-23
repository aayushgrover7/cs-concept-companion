import type { ConceptEntry } from './entry';

export const systemsConcepts: ConceptEntry[] = [
  {
    id: 'operating-system',
    name: 'Operating System',
    aliases: ['operating systems', 'os', 'kernel', 'linux', 'unix', 'windows kernel'],
    category: 'Systems & Networking',
    difficulty: 'intermediate',
    shortExplanation:
      'An operating system (OS) is the software layer that manages a computer’s hardware — CPU, memory, disks, screen — and lets many programs share it safely.',
    detailedExplanation:
      'The OS schedules which program uses the CPU, gives each program its own protected memory, handles files and devices, and provides system calls so programs can request services. Windows, macOS, Linux, iOS, and Android are all operating systems built around a core called the kernel.',
    example:
      'When you open two apps at once, the OS rapidly switches the CPU between them thousands of times per second so both appear to run simultaneously.',
    analogy:
      'The OS is an airport control tower: planes (programs) never negotiate runways (hardware) directly — the tower coordinates everything safely.',
    whyItMatters:
      'Every program you write runs on top of an OS; understanding it explains performance, crashes, and how software actually reaches hardware.',
    relatedConcepts: ['Process', 'Thread', 'Memory Allocation'],
  },
  {
    id: 'process',
    name: 'Process',
    aliases: ['processes', 'child process', 'process id', 'pid'],
    category: 'Systems & Networking',
    difficulty: 'intermediate',
    shortExplanation:
      'A process is a running program: the program’s code plus its own private memory, open files, and state, all managed by the operating system.',
    detailedExplanation:
      'Each process is isolated — one crashing usually cannot corrupt another. The OS creates a process when you launch a program, schedules its time on the CPU, and cleans up when it exits. Processes can communicate only through explicit channels like pipes or sockets, which keeps them safe but makes sharing data slower than threads.',
    example:
      'Opening Chrome starts several processes — one per tab — so a crashed tab does not take down the whole browser.',
    analogy:
      'A process is a self-contained office with locked doors: workers inside share everything, but talking to another office requires sending mail.',
    whyItMatters:
      'Processes are the unit of isolation in computing — understanding them explains multitasking, crashes, and modern browser and server design.',
    relatedConcepts: ['Thread', 'Operating System', 'Concurrency'],
  },
  {
    id: 'thread',
    name: 'Thread',
    aliases: ['threads', 'multithreading', 'multi-threading', 'threading', 'worker thread'],
    category: 'Systems & Networking',
    difficulty: 'intermediate',
    shortExplanation:
      'A thread is an independent path of execution inside a process. Multiple threads share the same memory, letting one program do several things at once.',
    detailedExplanation:
      'Threads are lighter than processes because they share their process’s memory and resources. That sharing makes communication instant but dangerous: two threads updating the same data simultaneously cause race conditions, so programs use locks and other synchronization to stay correct.',
    example:
      'A game runs one thread for graphics, one for physics, and one for loading files — all inside the same process, sharing the game’s data.',
    analogy:
      'Threads are cooks sharing one kitchen: work happens in parallel, but two cooks grabbing the same pan at once causes chaos without coordination.',
    whyItMatters:
      'Modern CPUs have many cores, and threads are how programs use them — along with the concurrency bugs that come up in real systems and interviews.',
    relatedConcepts: ['Process', 'Concurrency', 'Deadlock'],
  },
  {
    id: 'concurrency',
    name: 'Concurrency',
    aliases: [
      'concurrent',
      'parallelism',
      'parallel computing',
      'race condition',
      'race conditions',
    ],
    category: 'Systems & Networking',
    difficulty: 'advanced',
    shortExplanation:
      'Concurrency is structuring a program so multiple tasks make progress during the same time period — whether truly simultaneously (parallelism) or by rapid switching.',
    detailedExplanation:
      'Concurrent programs handle many things at once: serving web requests, downloading while rendering, background saves. The hard part is coordination — when tasks share data, timing-dependent bugs called race conditions appear, and tools like locks, queues, and atomic operations are needed to keep results correct.',
    example:
      'Two threads both run count = count + 1 at the same time.\nBoth read 5, both write 6 — one increment is lost. That is a race condition.',
    analogy:
      'Concurrency is a juggler keeping several balls in the air: even with one pair of hands (one CPU), every ball makes progress.',
    whyItMatters:
      'Nearly all real software — servers, apps, games — is concurrent, and concurrency bugs are among the hardest to find and fix.',
    relatedConcepts: ['Thread', 'Deadlock', 'Asynchronous Programming'],
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    aliases: ['deadlocks', 'deadlocked', 'mutual exclusion', 'lock contention'],
    category: 'Systems & Networking',
    difficulty: 'advanced',
    shortExplanation:
      'A deadlock is when two or more tasks are stuck forever, each waiting for a resource the other holds — nobody can move, so the program freezes.',
    detailedExplanation:
      'Classic case: thread A locks resource 1 and waits for resource 2, while thread B locks resource 2 and waits for resource 1. Neither will ever release what the other needs. Systems avoid deadlocks by acquiring locks in a fixed order, using timeouts, or detecting cycles and breaking them.',
    example:
      'Thread A: lock(printer); lock(scanner)\nThread B: lock(scanner); lock(printer)\nIf each grabs its first lock, both wait forever.',
    analogy:
      'Two polite people in a narrow doorway, each waiting for the other to go first — forever.',
    whyItMatters:
      'Deadlocks freeze real databases and servers; recognizing the pattern is a core skill in systems programming.',
    relatedConcepts: ['Concurrency', 'Thread', 'Operating System'],
  },
  {
    id: 'cache',
    name: 'Cache',
    aliases: ['caching', 'caches', 'cache hit', 'cache miss', 'cpu cache', 'browser cache'],
    category: 'Systems & Networking',
    difficulty: 'intermediate',
    shortExplanation:
      'A cache is a small, fast storage layer that keeps copies of recently or frequently used data so it can be served much faster than fetching it from the original source.',
    detailedExplanation:
      'Caches appear at every level: CPU caches sit next to the processor, browsers cache images, and servers cache database results. A "hit" means the data was in the cache (fast); a "miss" means going to the slower source. The hard problem is invalidation — knowing when cached data has gone stale.',
    example:
      'The first visit to a website downloads its logo; the next page loads it instantly from the browser cache instead of the network.',
    analogy:
      'A cache is the sticky note on your desk with numbers you keep needing — much faster than walking to the filing cabinet each time.',
    whyItMatters:
      'Caching is the single most common performance technique in computing, from hardware to global content delivery networks.',
    relatedConcepts: ['Memory Allocation', 'HTTP', 'Database'],
  },
  {
    id: 'networking',
    name: 'Computer Networking',
    aliases: [
      'networking',
      'network',
      'networks',
      'computer network',
      'packets',
      'packet',
      'bandwidth',
      'latency',
    ],
    category: 'Systems & Networking',
    difficulty: 'beginner',
    shortExplanation:
      'Networking is how computers exchange data: information is split into small packets that travel across wires, fiber, and radio to reach other machines, forming networks like the internet.',
    detailedExplanation:
      'Networks are built in layers: physical links carry bits, IP addresses identify machines and route packets between networks, and transport protocols like TCP make delivery reliable. Applications sit on top, speaking protocols like HTTP. Key measures are bandwidth (how much data per second) and latency (how long a round trip takes).',
    example:
      'Loading a webpage: your computer looks up the server’s address, opens a connection, requests the page, and receives it back as many small packets that are reassembled.',
    analogy:
      'A network is a postal system: letters (packets) carry addresses, pass through sorting centers (routers), and are reassembled into the full message at the destination.',
    whyItMatters:
      'Almost every modern application talks over a network — understanding the basics explains speed, outages, and how the internet works at all.',
    relatedConcepts: ['TCP/IP', 'HTTP', 'DNS'],
  },
  {
    id: 'tcp-ip',
    name: 'TCP/IP',
    aliases: [
      'tcp',
      'ip',
      'tcp/ip',
      'udp',
      'internet protocol',
      'transmission control protocol',
      'ip address',
    ],
    category: 'Systems & Networking',
    difficulty: 'intermediate',
    shortExplanation:
      'TCP/IP is the pair of core internet protocols: IP addresses and routes packets to the right machine, while TCP guarantees they arrive complete, in order, and error-free.',
    detailedExplanation:
      'IP gives every device an address and moves individual packets toward it, but packets can be lost or arrive out of order. TCP fixes that by numbering packets, acknowledging receipt, retransmitting losses, and reassembling the stream. Its sibling UDP skips those guarantees for speed, which suits games and video calls.',
    example:
      'Downloading a file over TCP: if packet 57 of 100 is lost in transit, TCP notices the missing acknowledgment and resends it automatically.',
    analogy:
      'IP is the postal service delivering individual letters; TCP is a diligent assistant who numbers every page, confirms each arrived, and re-mails any that got lost.',
    whyItMatters:
      'TCP/IP is the foundation the entire internet runs on — every web request, email, and video call rides on it.',
    relatedConcepts: ['Computer Networking', 'HTTP', 'DNS'],
  },
  {
    id: 'http',
    name: 'HTTP',
    aliases: [
      'https',
      'http request',
      'http response',
      'hypertext transfer protocol',
      'status code',
      '404',
    ],
    category: 'Systems & Networking',
    difficulty: 'beginner',
    shortExplanation:
      'HTTP is the language browsers and servers use to talk: the browser sends a request ("GET this page"), and the server sends back a response with a status code and content.',
    detailedExplanation:
      'Each HTTP request names a method (GET to fetch, POST to submit data), a URL, and headers with metadata. Responses carry a status code — 200 OK, 404 Not Found, 500 Server Error — plus the content. HTTPS wraps the whole exchange in encryption so no one along the path can read or tamper with it.',
    example: 'GET /index.html HTTP/1.1\nHost: example.com\n\n-> HTTP/1.1 200 OK + the page’s HTML',
    analogy:
      'HTTP is like ordering at a restaurant: you make a structured request from the menu, and the kitchen returns either your dish or an explanation ("we’re out of that" — a 404).',
    whyItMatters:
      'Every website and most mobile apps communicate over HTTP — reading its requests and status codes is a basic literacy for web development.',
    relatedConcepts: ['REST', 'TCP/IP', 'API'],
  },
  {
    id: 'dns',
    name: 'DNS',
    aliases: ['domain name system', 'domain name', 'nameserver', 'dns lookup', 'dns record'],
    category: 'Systems & Networking',
    difficulty: 'beginner',
    shortExplanation:
      'DNS (Domain Name System) is the internet’s phone book: it translates human-friendly names like example.com into the numeric IP addresses computers actually use.',
    detailedExplanation:
      'When you visit a site, your computer queries a chain of DNS servers — root, top-level domain, and the domain’s own nameservers — to resolve the name into an IP address, then caches the answer. If DNS fails, the internet feels "down" even though the servers themselves are fine.',
    example: 'example.com -> DNS lookup -> 93.184.216.34 -> your browser connects to that address.',
    analogy:
      'DNS is a phone book: you remember your friend’s name, the book turns it into the number the phone system needs to dial.',
    whyItMatters:
      'Every internet connection starts with a DNS lookup — it is a frequent cause of outages and a favorite topic in networking courses.',
    relatedConcepts: ['TCP/IP', 'Computer Networking', 'HTTP'],
  },
  {
    id: 'api',
    name: 'API',
    aliases: [
      'apis',
      'application programming interface',
      'web api',
      'api endpoint',
      'endpoint',
      'sdk',
    ],
    category: 'Systems & Networking',
    difficulty: 'beginner',
    shortExplanation:
      'An API (Application Programming Interface) is a defined set of rules for how one piece of software asks another to do something — a contract that hides the messy details.',
    detailedExplanation:
      'APIs exist at every level: a library exposes functions you can call; a web API exposes URLs a program can request, like a weather service returning today’s forecast as JSON. The caller only needs to know the contract — what to send and what comes back — not how the other side works internally.',
    example: 'GET https://api.weather.com/today?city=Boston\n-> { "tempF": 72, "sky": "sunny" }',
    analogy:
      'An API is a restaurant menu: it lists exactly what you can order and what you will get, while the kitchen’s inner workings stay hidden.',
    whyItMatters:
      'Modern software is assembled from APIs — maps, payments, AI models — so reading and designing them is a daily developer skill.',
    relatedConcepts: ['REST', 'HTTP', 'JSON', 'Abstraction'],
  },
  {
    id: 'rest',
    name: 'REST',
    aliases: ['restful', 'rest api', 'restful api', 'rest apis'],
    category: 'Systems & Networking',
    difficulty: 'intermediate',
    shortExplanation:
      'REST is a popular style for designing web APIs: everything is a resource with its own URL, and you act on it with standard HTTP verbs — GET to read, POST to create, PUT to update, DELETE to remove.',
    detailedExplanation:
      'A REST API models data as resources like /users/42 or /posts. Requests are stateless — each one carries everything the server needs — which makes REST APIs easy to cache and scale. Responses are usually JSON. The predictable structure means developers can often guess how an unfamiliar REST API works.',
    example:
      'GET    /api/books      -> list books\nPOST   /api/books      -> add a book\nGET    /api/books/7    -> book #7\nDELETE /api/books/7    -> remove it',
    analogy:
      'REST is like a well-organized filing system: every document has a labeled drawer (URL), and there are four standard things you can do with any drawer.',
    whyItMatters:
      'REST is the default architecture for web services — most public APIs you will ever call follow it.',
    relatedConcepts: ['API', 'HTTP', 'JSON'],
  },
  {
    id: 'json',
    name: 'JSON',
    aliases: ['javascript object notation', 'json file', 'json format', 'json data'],
    category: 'Systems & Networking',
    difficulty: 'beginner',
    shortExplanation:
      'JSON (JavaScript Object Notation) is a simple text format for structuring data as nested name–value pairs and lists — the standard way programs exchange data on the web.',
    detailedExplanation:
      'JSON supports objects (curly braces), arrays (square brackets), strings, numbers, booleans, and null. It is human-readable, language-independent, and nearly every language can parse it in one line, which is why web APIs, config files, and data pipelines default to it.',
    example: '{\n  "name": "Ada",\n  "age": 17,\n  "languages": ["Python", "C++"]\n}',
    analogy:
      'JSON is like a standardized packing list taped to a shipping box: any warehouse in the world can read exactly what is inside.',
    whyItMatters:
      'Practically every API response and config file you will meet is JSON — reading it fluently is a baseline skill.',
    relatedConcepts: ['API', 'REST', 'Data Structure'],
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    aliases: ['cloud', 'the cloud', 'aws', 'azure', 'google cloud', 'saas', 'iaas', 'serverless'],
    category: 'Systems & Networking',
    difficulty: 'beginner',
    shortExplanation:
      'Cloud computing means renting computing power, storage, and services from providers’ data centers over the internet, instead of owning and maintaining your own servers.',
    detailedExplanation:
      'Providers like AWS, Azure, and Google Cloud run vast data centers and lease slices of them on demand: virtual machines, databases, file storage, even AI models. You pay for what you use and can scale from one user to millions without buying hardware. Layers range from raw infrastructure (IaaS) to complete applications (SaaS).',
    example:
      'A student’s web app runs on a small cloud server for a few dollars a month; if it goes viral, the same app can scale to hundreds of servers in minutes.',
    analogy:
      'The cloud is like the electric grid: you plug in and pay for what you use, rather than building a personal power plant.',
    whyItMatters:
      'Most modern software runs in the cloud — knowing the model explains how tiny teams ship products that serve the whole world.',
    relatedConcepts: ['API', 'Database', 'Computer Networking'],
  },
];
