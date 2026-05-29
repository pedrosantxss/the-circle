export type Lang = "en" | "pt";

export const translations = {
  en: {
    // ─── Hero ─────────────────────────────────────────────
    hero: {
      tag:    "Est. 2025 · Global Movement",
      line1:  "The world",
      line2:  "belongs to",
      line3:  "those who build.",
      sub:    "An elite network for founders, creators, and visionaries redefining what's possible.",
      cta1:   "Request Access",
      cta2:   "Explore",
      status: "Applications Open",
      scroll: "Scroll",
    },

    // ─── Navigation ────────────────────────────────────────
    nav: {
      links: [
        { label: "About",     href: "#about"     },
        { label: "Ecosystem", href: "#ecosystem" },
        { label: "Community", href: "#community" },
      ],
      cta: "Apply Now",
    },

    // ─── About ─────────────────────────────────────────────
    about: {
      label: "About The Circle",
      h1:    "Not a community.",
      h2:    "A constellation.",
      p1:    "The Circle exists at the intersection of ambition and execution. We unite the builders, the disruptors, the visionaries who refuse to wait for permission to change the world.",
      p2:    "This is not a networking group. This is infrastructure for the ambitious — access, knowledge, and a circle of people who raise every standard you thought you had.",
      tagline:      "Networking · Innovation · Execution",
      manifesto:    "Building the next generation of young founders.",
      manifestoSub: "A community for ambitious young people building the future.",
    },

    // ─── Ecosystem ─────────────────────────────────────────
    ecosystem: {
      label:       "The Ecosystem",
      h1:          "Six pillars.",
      h2:          "One unfair advantage.",
      description: "Every pillar is designed to compound. Together they create an ecosystem that's impossible to replicate elsewhere.",
      pillars: [
        { number: "I",   title: "Network",    desc: "Curated connections with founders, investors, and leaders at the frontier of every major industry. Quality over quantity. Always.",                                                         tag: "Access"    },
        { number: "II",  title: "Knowledge",  desc: "Raw, unfiltered intelligence from people who've built it, scaled it, and survived it. No textbooks. No theory. Only signal.",                                                              tag: "Mastery"   },
        { number: "III", title: "Capital",    desc: "Deal flow, funding circles, and investor relationships at your disposal. The right idea finds the right money here.",                                                                        tag: "Resources" },
        { number: "IV",  title: "AI & Tech",  desc: "Stay at the bleeding edge. Early access, technical deep dives, and the unfair advantage of knowing what's coming before it arrives.",                                                       tag: "Edge"      },
        { number: "V",   title: "Mindset",    desc: "Elite performance philosophy. Mental frameworks borrowed from Olympic athletes, Navy SEALs, and $100M operators.",                                                                          tag: "Foundation"},
        { number: "VI",  title: "Launch",     desc: "From concept to market. Tactical support, accountability, and a circle that refuses to let your best ideas die quiet.",                                                                     tag: "Execution" },
      ],
    },

    // ─── Experience ────────────────────────────────────────
    experience: {
      label:  "The Experience",
      h1:     "Membership isn't",
      h2:     "a subscription.",
      h3:     "It's an upgrade.",
      bgWord: "Premium",
      moments: [
        { label: "Events",        title: "Private summits in the world's most ambitious cities.",   body: "Invite-only gatherings where deals are made, ideas are born, and the people who will shape the next decade are in the same room as you." },
        { label: "Mentorship",    title: "Direct lines to people who've done it.",                  body: "Not panels. Not webinars. Actual conversations with operators running 8-figure companies who chose to invest their time in you."         },
        { label: "Digital Layer", title: "A private OS for high-performers.",                       body: "Curated intelligence, deal alerts, member matching, and AI-powered tools that give every Circle member an operational edge."            },
      ],
    },

    // ─── Community ─────────────────────────────────────────
    community: {
      label:    "The Community",
      h1:       "For the next",
      h2:       "generation of",
      h3:       "young founders.",
      sub:      "The Circle is a home for ambitious young builders — people who take ideas seriously and turn them into reality.",
      marquee:  ["Entrepreneurs", "Creators", "Founders", "Builders", "Investors", "Visionaries", "Operators", "Disruptors", "Leaders", "Innovators"],
      pillars: [
        { title: "Networking", desc: "Real connections between ambitious young people building in the same direction." },
        { title: "Innovation", desc: "A space where new ideas are taken seriously and given the fuel they deserve."    },
        { title: "Execution",  desc: "From concept to reality. The Circle exists to make things happen."              },
      ],
    },

    // ─── CTA ───────────────────────────────────────────────
    cta: {
      label:       "05 — Applications Open",
      h1:          "The world is built",
      h2:          "by those who dared",
      h3:          "to enter the room.",
      sub:         "Applications are reviewed on a rolling basis. Membership is selective — not because we want to be exclusive, but because your environment determines your trajectory.",
      button:      "Apply Now",
      fine:        "No spam. Reviewed within 48h.",
      form: {
        fullName:        "Full Name",
        age:             "Age",
        city:            "City",
        email:           "Email",
        whatsapp:        "WhatsApp",
        instagram:       "Instagram",
        goals:           "Your Goals",
        goalsHint:       "What do you want to build? What drives you?",
        project:         "Project / Company (optional)",
        projectHint:     "What are you currently working on?",
        success:         "Application received.",
        successSub:      "We'll review it and get back to you within 48 hours.",
        errorDuplicate:  "This email has already submitted an application.",
        errorGeneric:    "Something went wrong. Please try again.",
      },
    },

    // ─── Footer ────────────────────────────────────────────
    footer: {
      copyright: "© 2026 The Circle",
      rights:    "All rights reserved",
    },
  },

  // ─────────────────────────────────────────────────────────
  pt: {
    hero: {
      tag:    "Est. 2025 · Movimento Global",
      line1:  "O mundo",
      line2:  "pertence a",
      line3:  "quem constrói.",
      sub:    "Uma rede de elite para fundadores, criadores e visionários redefinindo o que é possível.",
      cta1:   "Solicitar Acesso",
      cta2:   "Explorar",
      status: "Inscrições Abertas",
      scroll: "Rolar",
    },

    nav: {
      links: [
        { label: "Sobre",       href: "#about"     },
        { label: "Ecossistema", href: "#ecosystem" },
        { label: "Comunidade",  href: "#community" },
      ],
      cta: "Candidatar",
    },

    about: {
      label: "Sobre O Círculo",
      h1:    "Não é uma comunidade.",
      h2:    "É uma constelação.",
      p1:    "O Círculo existe na intersecção entre ambição e execução. Reunimos os construtores, os disruptores, os visionários que se recusam a esperar permissão para mudar o mundo.",
      p2:    "Isto não é um grupo de networking. É infraestrutura para os ambiciosos — acesso, conhecimento e um círculo de pessoas que elevam todos os padrões que pensavas ter.",
      tagline:      "Networking · Inovação · Execução",
      manifesto:    "Construindo a próxima geração de jovens founders.",
      manifestoSub: "Uma comunidade para jovens ambiciosos construindo o futuro.",
    },

    ecosystem: {
      label:       "O Ecossistema",
      h1:          "Seis pilares.",
      h2:          "Uma vantagem única.",
      description: "Cada pilar é desenhado para crescer. Juntos criam um ecossistema impossível de replicar.",
      pillars: [
        { number: "I",   title: "Rede",           desc: "Ligações selecionadas com fundadores, investidores e líderes na fronteira de cada grande indústria. Qualidade acima de quantidade. Sempre.",                                            tag: "Acesso"    },
        { number: "II",  title: "Conhecimento",   desc: "Inteligência crua e sem filtros de quem já construiu, escalou e sobreviveu. Sem manuais. Sem teoria. Apenas sinal.",                                                                     tag: "Domínio"   },
        { number: "III", title: "Capital",        desc: "Fluxo de negócios, círculos de financiamento e relações com investidores ao teu dispor. A ideia certa encontra o dinheiro certo aqui.",                                                 tag: "Recursos"  },
        { number: "IV",  title: "IA & Tecnologia",desc: "Mantém-te na vanguarda. Acesso antecipado, aprofundamentos técnicos e a vantagem de saber o que está a chegar antes de chegar.",                                                       tag: "Vantagem"  },
        { number: "V",   title: "Mentalidade",    desc: "Filosofia de performance de elite. Quadros mentais de atletas olímpicos, forças especiais e operadores de 100M+.",                                                                      tag: "Base"      },
        { number: "VI",  title: "Lançamento",     desc: "Do conceito ao mercado. Suporte tático, responsabilização e um círculo que recusa deixar as tuas melhores ideias morrer em silêncio.",                                                  tag: "Execução"  },
      ],
    },

    experience: {
      label:  "A Experiência",
      h1:     "Ser membro não é",
      h2:     "uma assinatura.",
      h3:     "É um upgrade.",
      bgWord: "Premium",
      moments: [
        { label: "Eventos",        title: "Cimeiras privadas nas cidades mais ambiciosas do mundo.",   body: "Encontros exclusivos onde negócios são feitos, ideias nascem e as pessoas que vão moldar a próxima década estão na mesma sala que tu." },
        { label: "Mentoria",       title: "Linhas diretas para quem já o fez.",                        body: "Sem painéis. Sem webinars. Conversas reais com operadores a gerir empresas de 8 dígitos que escolheram investir o seu tempo em ti."    },
        { label: "Camada Digital", title: "Um sistema operativo privado para alta performance.",        body: "Inteligência curada, alertas de negócios, matching de membros e ferramentas de IA que dão a cada membro do Círculo uma vantagem operacional." },
      ],
    },

    community: {
      label:    "A Comunidade",
      h1:       "Para a próxima",
      h2:       "geração de",
      h3:       "jovens founders.",
      sub:      "O Círculo é um lar para jovens construtores ambiciosos — pessoas que levam ideias a sério e as transformam em realidade.",
      marquee:  ["Empreendedores", "Criadores", "Fundadores", "Construtores", "Investidores", "Visionários", "Operadores", "Disruptores", "Líderes", "Inovadores"],
      pillars: [
        { title: "Networking", desc: "Conexões reais entre jovens ambiciosos que constroem na mesma direção."              },
        { title: "Inovação",   desc: "Um espaço onde novas ideias são levadas a sério e recebem o combustível que merecem." },
        { title: "Execução",   desc: "Do conceito à realidade. O Círculo existe para fazer acontecer."                     },
      ],
    },

    cta: {
      label:       "05 — Candidaturas Abertas",
      h1:          "O mundo é construído",
      h2:          "por quem ousou",
      h3:          "entrar na sala.",
      sub:         "As candidaturas são avaliadas continuamente. A membros é seletiva — não por querermos ser exclusivos, mas porque o teu ambiente determina a tua trajetória.",
      button:      "Candidatar",
      fine:        "Sem spam. Avaliado em 48h.",
      form: {
        fullName:        "Nome Completo",
        age:             "Idade",
        city:            "Cidade",
        email:           "Email",
        whatsapp:        "WhatsApp",
        instagram:       "Instagram",
        goals:           "Os Teus Objetivos",
        goalsHint:       "O que queres construir? O que te move?",
        project:         "Projeto / Empresa (opcional)",
        projectHint:     "Em que estás atualmente a trabalhar?",
        success:         "Candidatura recebida.",
        successSub:      "Iremos analisá-la e dar-te resposta em 48 horas.",
        errorDuplicate:  "Este email já submeteu uma candidatura.",
        errorGeneric:    "Algo correu mal. Por favor tenta novamente.",
      },
    },

    footer: {
      copyright: "© 2026 The Circle",
      rights:    "Todos os direitos reservados",
    },
  },
} as const;

export type Translations = typeof translations.en;
