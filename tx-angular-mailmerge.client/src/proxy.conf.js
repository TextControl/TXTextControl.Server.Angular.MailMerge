const PROXY_CONFIG = [
  {
    context: [
      "/mailmerge",
    ],
    target: "https://localhost:7198",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
