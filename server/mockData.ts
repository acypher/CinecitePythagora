import { MovieResult } from "@shared/schema";

export const mockMovies: MovieResult[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    year: 1994,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    plotSummary: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion. Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit.",
    ratings: [
      { source: "Tomatometer", score: 91, maxScore: 100, displayScore: "91%" },
      { source: "Audience Score", score: 98, maxScore: 100, displayScore: "98%" },
      { source: "Metacritic", score: 82, maxScore: 100, displayScore: "82" },
      { source: "IMDb", score: 9.3, maxScore: 10, displayScore: "9.3/10" },
    ],
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne" },
      { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding" },
      { name: "Bob Gunton", character: "Warden Norton" },
      { name: "William Sadler", character: "Heywood" },
      { name: "Clancy Brown", character: "Captain Hadley" },
      { name: "Gil Bellows", character: "Tommy Williams" },
    ],
    director: "Frank Darabont",
    genres: ["Drama", "Crime"],
    runtime: "2h 22m",
    streaming: [
      { service: "Max", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
  {
    id: "2",
    title: "Breaking Bad",
    year: 2008,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_.jpg",
    plotSummary: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future. The critically acclaimed series explores themes of morality, family, and the consequences of choices.",
    ratings: [
      { source: "Tomatometer", score: 96, maxScore: 100, displayScore: "96%" },
      { source: "Audience Score", score: 96, maxScore: 100, displayScore: "96%" },
      { source: "Metacritic", score: 87, maxScore: 100, displayScore: "87" },
      { source: "IMDb", score: 9.5, maxScore: 10, displayScore: "9.5/10" },
    ],
    cast: [
      { name: "Bryan Cranston", character: "Walter White" },
      { name: "Aaron Paul", character: "Jesse Pinkman" },
      { name: "Anna Gunn", character: "Skyler White" },
      { name: "Dean Norris", character: "Hank Schrader" },
      { name: "Betsy Brandt", character: "Marie Schrader" },
      { name: "RJ Mitte", character: "Walter White Jr." },
    ],
    director: "Vince Gilligan",
    genres: ["Crime", "Drama", "Thriller"],
    runtime: "5 Seasons",
    streaming: [
      { service: "Netflix", type: "subscription" },
      { service: "Amazon Prime Video", type: "buy" },
    ],
  },
  {
    id: "3",
    title: "The Dark Knight",
    year: 2008,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    plotSummary: "When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness. A masterful superhero film that transcends the genre.",
    ratings: [
      { source: "Tomatometer", score: 94, maxScore: 100, displayScore: "94%" },
      { source: "Audience Score", score: 94, maxScore: 100, displayScore: "94%" },
      { source: "Metacritic", score: 84, maxScore: 100, displayScore: "84" },
      { source: "IMDb", score: 9.0, maxScore: 10, displayScore: "9.0/10" },
    ],
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman" },
      { name: "Heath Ledger", character: "The Joker" },
      { name: "Aaron Eckhart", character: "Harvey Dent / Two-Face" },
      { name: "Michael Caine", character: "Alfred Pennyworth" },
      { name: "Maggie Gyllenhaal", character: "Rachel Dawes" },
      { name: "Gary Oldman", character: "James Gordon" },
    ],
    director: "Christopher Nolan",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    runtime: "2h 32m",
    streaming: [
      { service: "Max", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Vudu", type: "rent" },
    ],
  },
  {
    id: "4",
    title: "Stranger Things",
    year: 2016,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    plotSummary: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl. The show blends science fiction horror, supernatural elements, and 80s nostalgia.",
    ratings: [
      { source: "Tomatometer", score: 91, maxScore: 100, displayScore: "91%" },
      { source: "Audience Score", score: 85, maxScore: 100, displayScore: "85%" },
      { source: "Metacritic", score: 76, maxScore: 100, displayScore: "76" },
      { source: "IMDb", score: 8.7, maxScore: 10, displayScore: "8.7/10" },
    ],
    cast: [
      { name: "Millie Bobby Brown", character: "Eleven" },
      { name: "Finn Wolfhard", character: "Mike Wheeler" },
      { name: "Winona Ryder", character: "Joyce Byers" },
      { name: "David Harbour", character: "Jim Hopper" },
      { name: "Gaten Matarazzo", character: "Dustin Henderson" },
      { name: "Caleb McLaughlin", character: "Lucas Sinclair" },
    ],
    director: "The Duffer Brothers",
    genres: ["Drama", "Fantasy", "Horror", "Mystery"],
    runtime: "4 Seasons",
    streaming: [
      { service: "Netflix", type: "subscription" },
    ],
  },
  {
    id: "5",
    title: "Inception",
    year: 2010,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    plotSummary: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    ratings: [
      { source: "Tomatometer", score: 87, maxScore: 100, displayScore: "87%" },
      { source: "Audience Score", score: 91, maxScore: 100, displayScore: "91%" },
      { source: "Metacritic", score: 74, maxScore: 100, displayScore: "74" },
      { source: "IMDb", score: 8.8, maxScore: 10, displayScore: "8.8/10" },
    ],
    cast: [
      { name: "Leonardo DiCaprio", character: "Dom Cobb" },
      { name: "Joseph Gordon-Levitt", character: "Arthur" },
      { name: "Elliot Page", character: "Ariadne" },
      { name: "Tom Hardy", character: "Eames" },
      { name: "Ken Watanabe", character: "Saito" },
      { name: "Marion Cotillard", character: "Mal Cobb" },
    ],
    director: "Christopher Nolan",
    genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
    runtime: "2h 28m",
    streaming: [
      { service: "Peacock", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
  {
    id: "6",
    title: "The Office",
    year: 2005,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
    plotSummary: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium. The beloved comedy series follows the Scranton branch of the Dunder Mifflin Paper Company.",
    ratings: [
      { source: "Tomatometer", score: 89, maxScore: 100, displayScore: "89%" },
      { source: "Audience Score", score: 89, maxScore: 100, displayScore: "89%" },
      { source: "Metacritic", score: 78, maxScore: 100, displayScore: "78" },
      { source: "IMDb", score: 9.0, maxScore: 10, displayScore: "9.0/10" },
    ],
    cast: [
      { name: "Steve Carell", character: "Michael Scott" },
      { name: "Rainn Wilson", character: "Dwight Schrute" },
      { name: "John Krasinski", character: "Jim Halpert" },
      { name: "Jenna Fischer", character: "Pam Beesly" },
      { name: "B.J. Novak", character: "Ryan Howard" },
      { name: "Ed Helms", character: "Andy Bernard" },
    ],
    director: "Greg Daniels",
    genres: ["Comedy"],
    runtime: "9 Seasons",
    streaming: [
      { service: "Peacock", type: "subscription" },
      { service: "Amazon Prime Video", type: "buy" },
    ],
  },
  {
    id: "7",
    title: "Pulp Fiction",
    year: 1994,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYTViYTE3ZGQtNDBlMC00ZTAyLTkyODMtZGRiZDg0MjA2YThkXkEyXkFqcGc@._V1_.jpg",
    plotSummary: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption. Quentin Tarantino's masterpiece redefined independent cinema.",
    ratings: [
      { source: "Tomatometer", score: 92, maxScore: 100, displayScore: "92%" },
      { source: "Audience Score", score: 96, maxScore: 100, displayScore: "96%" },
      { source: "Metacritic", score: 95, maxScore: 100, displayScore: "95" },
      { source: "IMDb", score: 8.9, maxScore: 10, displayScore: "8.9/10" },
    ],
    cast: [
      { name: "John Travolta", character: "Vincent Vega" },
      { name: "Uma Thurman", character: "Mia Wallace" },
      { name: "Samuel L. Jackson", character: "Jules Winnfield" },
      { name: "Bruce Willis", character: "Butch Coolidge" },
      { name: "Harvey Keitel", character: "Winston Wolfe" },
      { name: "Tim Roth", character: "Pumpkin" },
    ],
    director: "Quentin Tarantino",
    genres: ["Crime", "Drama"],
    runtime: "2h 34m",
    streaming: [
      { service: "Paramount+", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
  {
    id: "8",
    title: "Game of Thrones",
    year: 2011,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMi00NDI5LTgxMzMtN2EzZjA1NjhlOGMxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    plotSummary: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia. The epic fantasy series features political intrigue, warfare, and supernatural elements.",
    ratings: [
      { source: "Tomatometer", score: 89, maxScore: 100, displayScore: "89%" },
      { source: "Audience Score", score: 83, maxScore: 100, displayScore: "83%" },
      { source: "Metacritic", score: 86, maxScore: 100, displayScore: "86" },
      { source: "IMDb", score: 9.2, maxScore: 10, displayScore: "9.2/10" },
    ],
    cast: [
      { name: "Emilia Clarke", character: "Daenerys Targaryen" },
      { name: "Kit Harington", character: "Jon Snow" },
      { name: "Peter Dinklage", character: "Tyrion Lannister" },
      { name: "Lena Headey", character: "Cersei Lannister" },
      { name: "Nikolaj Coster-Waldau", character: "Jaime Lannister" },
      { name: "Sophie Turner", character: "Sansa Stark" },
    ],
    director: "David Benioff & D.B. Weiss",
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    runtime: "8 Seasons",
    streaming: [
      { service: "Max", type: "subscription" },
    ],
  },
  {
    id: "9",
    title: "Oppenheimer",
    year: 2023,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_.jpg",
    plotSummary: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb. Christopher Nolan's biographical thriller explores the moral complexities of scientific discovery and its consequences.",
    ratings: [
      { source: "Tomatometer", score: 93, maxScore: 100, displayScore: "93%" },
      { source: "Audience Score", score: 91, maxScore: 100, displayScore: "91%" },
      { source: "Metacritic", score: 88, maxScore: 100, displayScore: "88" },
      { source: "IMDb", score: 8.4, maxScore: 10, displayScore: "8.4/10" },
    ],
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer" },
      { name: "Emily Blunt", character: "Kitty Oppenheimer" },
      { name: "Matt Damon", character: "Leslie Groves" },
      { name: "Robert Downey Jr.", character: "Lewis Strauss" },
      { name: "Florence Pugh", character: "Jean Tatlock" },
      { name: "Josh Hartnett", character: "Ernest Lawrence" },
    ],
    director: "Christopher Nolan",
    genres: ["Biography", "Drama", "History"],
    runtime: "3h",
    streaming: [
      { service: "Peacock", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
  {
    id: "10",
    title: "The Bear",
    year: 2022,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWNhNjI4YzctNTIzOC00NzAxLThjNjAtNWJhMTA1MTFhNmI2XkEyXkFqcGc@._V1_.jpg",
    plotSummary: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a heartbreaking death. The acclaimed series explores trauma, ambition, and the pressures of the restaurant industry.",
    ratings: [
      { source: "Tomatometer", score: 100, maxScore: 100, displayScore: "100%" },
      { source: "Audience Score", score: 91, maxScore: 100, displayScore: "91%" },
      { source: "Metacritic", score: 92, maxScore: 100, displayScore: "92" },
      { source: "IMDb", score: 8.6, maxScore: 10, displayScore: "8.6/10" },
    ],
    cast: [
      { name: "Jeremy Allen White", character: "Carmen 'Carmy' Berzatto" },
      { name: "Ebon Moss-Bachrach", character: "Richard 'Richie' Jerimovich" },
      { name: "Ayo Edebiri", character: "Sydney Adamu" },
      { name: "Lionel Boyce", character: "Marcus" },
      { name: "Abby Elliott", character: "Natalie 'Sugar' Berzatto" },
      { name: "Liza Colón-Zayas", character: "Tina" },
    ],
    director: "Christopher Storer",
    genres: ["Comedy", "Drama"],
    runtime: "3 Seasons",
    streaming: [
      { service: "Hulu", type: "subscription" },
      { service: "Disney+", type: "subscription" },
    ],
  },
  {
    id: "11",
    title: "Dune: Part Two",
    year: 2024,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg",
    plotSummary: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. He faces a choice between the love of his life and the fate of the universe.",
    ratings: [
      { source: "Tomatometer", score: 92, maxScore: 100, displayScore: "92%" },
      { source: "Audience Score", score: 95, maxScore: 100, displayScore: "95%" },
      { source: "Metacritic", score: 79, maxScore: 100, displayScore: "79" },
      { source: "IMDb", score: 8.5, maxScore: 10, displayScore: "8.5/10" },
    ],
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides" },
      { name: "Zendaya", character: "Chani" },
      { name: "Rebecca Ferguson", character: "Lady Jessica" },
      { name: "Austin Butler", character: "Feyd-Rautha" },
      { name: "Florence Pugh", character: "Princess Irulan" },
      { name: "Javier Bardem", character: "Stilgar" },
    ],
    director: "Denis Villeneuve",
    genres: ["Action", "Adventure", "Drama", "Sci-Fi"],
    runtime: "2h 46m",
    streaming: [
      { service: "Max", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
  {
    id: "12",
    title: "Severance",
    year: 2022,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjkwZjcwMGQtNDAzOC00YjJiLThiYTgtNWU3ZjRiZmY2YzEzXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    plotSummary: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth.",
    ratings: [
      { source: "Tomatometer", score: 97, maxScore: 100, displayScore: "97%" },
      { source: "Audience Score", score: 92, maxScore: 100, displayScore: "92%" },
      { source: "Metacritic", score: 83, maxScore: 100, displayScore: "83" },
      { source: "IMDb", score: 8.7, maxScore: 10, displayScore: "8.7/10" },
    ],
    cast: [
      { name: "Adam Scott", character: "Mark Scout" },
      { name: "Zach Cherry", character: "Dylan George" },
      { name: "Britt Lower", character: "Helly Riggs" },
      { name: "John Turturro", character: "Irving Bailiff" },
      { name: "Patricia Arquette", character: "Harmony Cobel" },
      { name: "Christopher Walken", character: "Burt Goodman" },
    ],
    director: "Dan Erickson",
    genres: ["Drama", "Mystery", "Sci-Fi", "Thriller"],
    runtime: "2 Seasons",
    streaming: [
      { service: "Apple TV+", type: "subscription" },
    ],
  },
  {
    id: "13",
    title: "Parasite",
    year: 2019,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg",
    plotSummary: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan. Bong Joon-ho's masterpiece won the Academy Award for Best Picture.",
    ratings: [
      { source: "Tomatometer", score: 98, maxScore: 100, displayScore: "98%" },
      { source: "Audience Score", score: 90, maxScore: 100, displayScore: "90%" },
      { source: "Metacritic", score: 96, maxScore: 100, displayScore: "96" },
      { source: "IMDb", score: 8.5, maxScore: 10, displayScore: "8.5/10" },
    ],
    cast: [
      { name: "Song Kang-ho", character: "Kim Ki-taek" },
      { name: "Lee Sun-kyun", character: "Park Dong-ik" },
      { name: "Cho Yeo-jeong", character: "Park Yeon-gyo" },
      { name: "Choi Woo-shik", character: "Kim Ki-woo" },
      { name: "Park So-dam", character: "Kim Ki-jung" },
      { name: "Jang Hye-jin", character: "Kim Chung-sook" },
    ],
    director: "Bong Joon-ho",
    genres: ["Drama", "Thriller"],
    runtime: "2h 12m",
    streaming: [
      { service: "Hulu", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
  {
    id: "14",
    title: "Succession",
    year: 2018,
    type: "tv",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODY5YjA3ZDgtNTI4MS00NzlhLTliMjMtYmM2Zjg1ZGU4NjkxXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    plotSummary: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps back from the company. A critically acclaimed drama about power, wealth, and family.",
    ratings: [
      { source: "Tomatometer", score: 94, maxScore: 100, displayScore: "94%" },
      { source: "Audience Score", score: 90, maxScore: 100, displayScore: "90%" },
      { source: "Metacritic", score: 89, maxScore: 100, displayScore: "89" },
      { source: "IMDb", score: 8.8, maxScore: 10, displayScore: "8.8/10" },
    ],
    cast: [
      { name: "Brian Cox", character: "Logan Roy" },
      { name: "Jeremy Strong", character: "Kendall Roy" },
      { name: "Sarah Snook", character: "Siobhan 'Shiv' Roy" },
      { name: "Kieran Culkin", character: "Roman Roy" },
      { name: "Alan Ruck", character: "Connor Roy" },
      { name: "Matthew Macfadyen", character: "Tom Wambsgans" },
    ],
    director: "Jesse Armstrong",
    genres: ["Drama"],
    runtime: "4 Seasons",
    streaming: [
      { service: "Max", type: "subscription" },
    ],
  },
  {
    id: "15",
    title: "Barbie",
    year: 2023,
    type: "movie",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjI3NDU0ZTMtMzgyMy00ZjI4LWI5NjEtZmM0MDA0YjM1NTgwXkEyXkFqcGc@._V1_.jpg",
    plotSummary: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    ratings: [
      { source: "Tomatometer", score: 88, maxScore: 100, displayScore: "88%" },
      { source: "Audience Score", score: 83, maxScore: 100, displayScore: "83%" },
      { source: "Metacritic", score: 80, maxScore: 100, displayScore: "80" },
      { source: "IMDb", score: 6.9, maxScore: 10, displayScore: "6.9/10" },
    ],
    cast: [
      { name: "Margot Robbie", character: "Barbie" },
      { name: "Ryan Gosling", character: "Ken" },
      { name: "America Ferrera", character: "Gloria" },
      { name: "Kate McKinnon", character: "Weird Barbie" },
      { name: "Issa Rae", character: "President Barbie" },
      { name: "Will Ferrell", character: "CEO" },
    ],
    director: "Greta Gerwig",
    genres: ["Adventure", "Comedy", "Fantasy"],
    runtime: "1h 54m",
    streaming: [
      { service: "Max", type: "subscription" },
      { service: "Amazon Prime Video", type: "rent" },
      { service: "Apple TV", type: "rent" },
    ],
  },
];

// Helper function to normalize strings for matching
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Calculate match score
function calculateMatchScore(movie: MovieResult, searchTerm: string): number {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedTitle = normalizeString(movie.title);
  
  let score = 0;
  
  // Exact match
  if (normalizedTitle === normalizedSearch) {
    score += 100;
  }
  // Title starts with search term
  else if (normalizedTitle.startsWith(normalizedSearch)) {
    score += 80;
  }
  // Title contains search term as whole word
  else if (normalizedTitle.includes(normalizedSearch)) {
    score += 60;
  }
  // Words match
  else {
    const searchWords = normalizedSearch.split(" ");
    const titleWords = normalizedTitle.split(" ");
    const matchedWords = searchWords.filter((w) => titleWords.includes(w));
    score += matchedWords.length * 20;
  }
  
  // Boost for recency
  if (movie.year) {
    const currentYear = new Date().getFullYear();
    const recencyBonus = Math.max(0, 10 - (currentYear - movie.year));
    score += recencyBonus;
  }
  
  // Boost for high IMDb rating (popularity)
  const imdbRating = movie.ratings.find((r) => r.source === "IMDb");
  if (imdbRating && imdbRating.score) {
    score += imdbRating.score;
  }
  
  return score;
}

export function searchMovies(query: string): { result: MovieResult | null; suggestions: MovieResult[]; matchConfidence: "high" | "medium" | "low" } {
  const normalizedQuery = normalizeString(query);
  
  if (!normalizedQuery) {
    return { result: null, suggestions: [], matchConfidence: "low" };
  }
  
  // Score all movies
  const scoredMovies = mockMovies
    .map((movie) => ({
      movie,
      score: calculateMatchScore(movie, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  if (scoredMovies.length === 0) {
    return { result: null, suggestions: [], matchConfidence: "low" };
  }
  
  const topMatch = scoredMovies[0];
  const suggestions = scoredMovies.slice(1, 4).map((item) => item.movie);
  
  let matchConfidence: "high" | "medium" | "low";
  if (topMatch.score >= 80) {
    matchConfidence = "high";
  } else if (topMatch.score >= 40) {
    matchConfidence = "medium";
  } else {
    matchConfidence = "low";
  }
  
  return {
    result: topMatch.movie,
    suggestions,
    matchConfidence,
  };
}
