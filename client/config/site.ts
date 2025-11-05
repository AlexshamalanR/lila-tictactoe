export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "TicTacToe",
  description:
    "TicTacToe Game, built with Nextjs (Radix UI, Tailwind CSS) + Nakama",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Game",
      href: "/tictactoe",
    },
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/alex-shamalan-r/",
    github: "https://github.com/AlexshamalanR/lila-tictactoe",
    docs: "https://ui.shadcn.com",
  },
}
