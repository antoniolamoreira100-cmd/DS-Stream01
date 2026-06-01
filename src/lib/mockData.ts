export interface Content {
  id: string;
  tipo: 'filme' | 'serie';
  titulo: string;
  sinopse: string;
  ano: number;
  duracao_min: number | null;
  classificacao_etaria: string;
  generos: string[];
  thumbnail_url: string;
  backdrop_url: string;
  trailer_url: string | null;
  avaliacao: number;
  temporadas?: number;
  elenco?: { nome: string; personagem: string }[];
}

export interface Episode {
  id: string;
  content_id: string;
  temporada: number;
  numero_episodio: number;
  titulo: string;
  sinopse: string;
  duracao_min: number;
  thumbnail_url: string;
  video_url: string;
}

// Using high-quality Pexels images for thumbnails & backdrops
export const MOCK_CONTENTS: Content[] = [
  {
    id: '1',
    tipo: 'filme',
    titulo: 'Sombras do Abismo',
    sinopse: 'Em um mundo onde a escuridão consome tudo, um guerreiro solitário deve confrontar os demônios do passado para salvar o que resta da humanidade. Uma jornada épica de redenção, sacrifício e a busca pela luz em meio às trevas mais profundas.',
    ano: 2024,
    duracao_min: 148,
    classificacao_etaria: '16',
    generos: ['Ação', 'Fantasia', 'Drama'],
    thumbnail_url: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    avaliacao: 8.7,
    elenco: [
      { nome: 'Marcus Veil', personagem: 'Kael Draven' },
      { nome: 'Sofia Monteiro', personagem: 'Lyra' },
      { nome: 'James Thornton', personagem: 'Lord Malachar' },
    ]
  },
  {
    id: '2',
    tipo: 'serie',
    titulo: 'Código Vermelho',
    sinopse: 'Uma espiã de elite infiltra uma organização criminosa global e descobre uma conspiração que ameaça governos ao redor do mundo. Cada missão a leva mais fundo em uma teia de mentiras, lealdades e segredos que podem custar sua vida.',
    ano: 2023,
    duracao_min: null,
    classificacao_etaria: '18',
    generos: ['Thriller', 'Espionagem', 'Drama'],
    thumbnail_url: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 9.1,
    temporadas: 3,
    elenco: [
      { nome: 'Ana Carvalho', personagem: 'Agente Vega' },
      { nome: 'Robert Chase', personagem: 'Diretor Harmon' },
    ]
  },
  {
    id: '3',
    tipo: 'filme',
    titulo: 'Horizonte Perdido',
    sinopse: 'Quando um astronauta retorna após 10 anos preso no espaço profundo, ele descobre que o mundo que conhecia não existe mais. Uma história comovente sobre identidade, pertencimento e o que significa ser humano.',
    ano: 2024,
    duracao_min: 132,
    classificacao_etaria: '12',
    generos: ['Ficção Científica', 'Drama'],
    thumbnail_url: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 8.3,
    elenco: [
      { nome: 'Daniel Russo', personagem: 'Comandante Elias' },
      { nome: 'Claire Watts', personagem: 'Dr. Maya' },
    ]
  },
  {
    id: '4',
    tipo: 'serie',
    titulo: 'A Vila',
    sinopse: 'Numa pequena vila isolada nas montanhas, um detetive recém-chegado começa a investigar desaparecimentos misteriosos que os moradores parecem saber mais do que revelam. Segredos antigos emergem à medida que a trama se aprofunda.',
    ano: 2023,
    duracao_min: null,
    classificacao_etaria: '14',
    generos: ['Mistério', 'Suspense', 'Drama'],
    thumbnail_url: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 8.9,
    temporadas: 2,
    elenco: [
      { nome: 'Paulo Henrique', personagem: 'Detetive Braga' },
      { nome: 'Isabela Fonseca', personagem: 'Clara' },
    ]
  },
  {
    id: '5',
    tipo: 'filme',
    titulo: 'Tempestade de Neon',
    sinopse: 'No coração de uma megalópole cyberpunk, uma hacker rebelde descobre que a corporação que controla a cidade possui um segredo sombrio. Com o tempo se esgotando, ela deve escolher entre a segurança e a verdade.',
    ano: 2024,
    duracao_min: 121,
    classificacao_etaria: '16',
    generos: ['Ficção Científica', 'Ação', 'Thriller'],
    thumbnail_url: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 7.8,
    elenco: [
      { nome: 'Yuki Tanaka', personagem: 'Zara' },
      { nome: 'Marcus Chen', personagem: 'Diretor Nexus' },
    ]
  },
  {
    id: '6',
    tipo: 'serie',
    titulo: 'Impérios em Chamas',
    sinopse: 'Uma saga épica sobre reinos em guerra, alianças quebradas e o preço do poder. Famílias rivais disputam o controle de um continente enquanto uma ameaça antiga desperta além das fronteiras conhecidas.',
    ano: 2022,
    duracao_min: null,
    classificacao_etaria: '16',
    generos: ['Fantasia', 'Drama', 'Ação'],
    thumbnail_url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 9.4,
    temporadas: 4,
    elenco: [
      { nome: 'Arthur Belmont', personagem: 'Rei Aldric' },
      { nome: 'Victoria Sands', personagem: 'Rainha Sera' },
    ]
  },
  {
    id: '7',
    tipo: 'filme',
    titulo: 'O Último Verão',
    sinopse: 'Quatro amigos se reúnem pela última vez num chalé à beira-mar antes de seguirem caminhos diferentes. Entre memórias, segredos guardados e sentimentos não ditos, eles descobrem que o passado nunca fica realmente para trás.',
    ano: 2023,
    duracao_min: 104,
    classificacao_etaria: '12',
    generos: ['Drama', 'Romance'],
    thumbnail_url: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 7.5,
    elenco: [
      { nome: 'Laura Medeiros', personagem: 'Ana' },
      { nome: 'Bruno Silveira', personagem: 'Pedro' },
    ]
  },
  {
    id: '8',
    tipo: 'serie',
    titulo: 'Frequência Zero',
    sinopse: 'Um produtor de rádio noturno começa a receber transmissões de frequências inexplicáveis que parecem ser de outro tempo. Cada transmissão revela pistas sobre desaparecimentos não resolvidos na sua cidade.',
    ano: 2024,
    duracao_min: null,
    classificacao_etaria: '14',
    generos: ['Suspense', 'Mistério', 'Sci-Fi'],
    thumbnail_url: 'https://images.pexels.com/photos/1481253/pexels-photo-1481253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1481253/pexels-photo-1481253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 8.6,
    temporadas: 1,
    elenco: [
      { nome: 'Renata Luz', personagem: 'Mara' },
      { nome: 'Felipe Costa', personagem: 'DJ Night' },
    ]
  },
  {
    id: '9',
    tipo: 'filme',
    titulo: 'Batalha Infinita',
    sinopse: 'Em um mundo onde soldados são presos em loops de batalha por uma inteligência artificial, um veterano descobre a chave para quebrar o ciclo — mas o preço pode ser a memória de tudo que ele ama.',
    ano: 2024,
    duracao_min: 156,
    classificacao_etaria: '16',
    generos: ['Ação', 'Ficção Científica'],
    thumbnail_url: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 8.0,
    elenco: [
      { nome: 'Connor Walsh', personagem: 'Sgt. Drake' },
    ]
  },
  {
    id: '10',
    tipo: 'serie',
    titulo: 'Restaurante das Almas',
    sinopse: 'Um chef misterioso abre um restaurante onde cada prato carrega uma memória ou cura uma dor emocional. Uma série tocante e mágica sobre comida, cura e as histórias que carregamos.',
    ano: 2023,
    duracao_min: null,
    classificacao_etaria: 'L',
    generos: ['Drama', 'Fantasia', 'Comédia'],
    thumbnail_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 9.2,
    temporadas: 2,
    elenco: [
      { nome: 'Kenji Nakamura', personagem: 'Chef Sol' },
      { nome: 'Amara Diallo', personagem: 'Valentina' },
    ]
  },
  {
    id: '11',
    tipo: 'filme',
    titulo: 'Fronteiras do Medo',
    sinopse: 'Uma família se muda para uma casa nos confins da floresta e descobre que os vizinhos mais próximos guardam segredos perturbadores. O horror começa devagar e vai crescendo até um clímax aterrorizante.',
    ano: 2024,
    duracao_min: 112,
    classificacao_etaria: '18',
    generos: ['Terror', 'Suspense'],
    thumbnail_url: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 7.3,
    elenco: [
      { nome: 'Hannah Pierce', personagem: 'Rachel' },
      { nome: 'Tom Ellsworth', personagem: 'David' },
    ]
  },
  {
    id: '12',
    tipo: 'serie',
    titulo: 'Nova Genebra',
    sinopse: 'Em 2087, a cidade-estado de Nova Genebra é governada por algoritmos de bem-estar social. Mas quando os sistemas começam a falhar, um grupo de hackers e ativistas tenta expor a verdade por trás da utopia perfeita.',
    ano: 2024,
    duracao_min: null,
    classificacao_etaria: '14',
    generos: ['Ficção Científica', 'Thriller', 'Drama'],
    thumbnail_url: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=450&w=300',
    backdrop_url: 'https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600',
    trailer_url: null,
    avaliacao: 8.8,
    temporadas: 1,
    elenco: [
      { nome: 'Lena Vasquez', personagem: 'Echo' },
      { nome: 'Omar Hassan', personagem: 'Declan' },
    ]
  },
];

export const MOCK_EPISODES: Episode[] = [
  // Código Vermelho - Temporada 1
  { id: 'ep1', content_id: '2', temporada: 1, numero_episodio: 1, titulo: 'Infiltração', sinopse: 'Agente Vega recebe sua missão mais perigosa: infiltrar o Coletivo Sombra.', duracao_min: 52, thumbnail_url: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=356', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ep2', content_id: '2', temporada: 1, numero_episodio: 2, titulo: 'Identidades Falsas', sinopse: 'Com uma nova identidade, Vega começa a ganhar a confiança dos líderes do grupo.', duracao_min: 48, thumbnail_url: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=356', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ep3', content_id: '2', temporada: 1, numero_episodio: 3, titulo: 'O Delator', sinopse: 'Uma informação vaza e coloca toda a operação em risco.', duracao_min: 55, thumbnail_url: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=356', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ep4', content_id: '2', temporada: 1, numero_episodio: 4, titulo: 'Zona Vermelha', sinopse: 'Vega descobre que a conspiração vai muito além do que suspeitava.', duracao_min: 61, thumbnail_url: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=356', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  // A Vila - Temporada 1
  { id: 'ep5', content_id: '4', temporada: 1, numero_episodio: 1, titulo: 'A Chegada', sinopse: 'Detetive Braga chega à vila e encontra uma comunidade que parece guardar muitos segredos.', duracao_min: 45, thumbnail_url: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=356', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ep6', content_id: '4', temporada: 1, numero_episodio: 2, titulo: 'O Desaparecido', sinopse: 'Braga investiga o primeiro desaparecimento e encontra pistas perturbadoras.', duracao_min: 47, thumbnail_url: 'https://images.pexels.com/photos/2258536/pexels-photo-2258536.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=356', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

export const MOCK_PROFILES = [
  { id: 'p1', user_id: 'demo', nome: 'Demo User', avatar_url: '/images/avatar-1.jpg', is_kids: false, pin: null, idioma_audio: 'pt-BR', idioma_legenda: 'pt-BR', qualidade: 'auto', created_at: new Date().toISOString() },
  { id: 'p2', user_id: 'demo', nome: 'Infantil', avatar_url: null, is_kids: true, pin: '1234', idioma_audio: 'pt-BR', idioma_legenda: 'pt-BR', qualidade: 'auto', created_at: new Date().toISOString() },
];

export const AVATAR_OPTIONS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
];
