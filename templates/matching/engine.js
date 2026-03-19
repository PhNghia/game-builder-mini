function renderGame(data) {

  const container = document.getElementById("game")

  const left = document.createElement("div")
  const right = document.createElement("div")

  left.style.float = "left"
  left.style.marginRight = "50px"

  right.style.float = "left"

  data.forEach(pair => {

    const word = document.createElement("div")
    word.innerText = pair.word

    const match = document.createElement("div")
    match.innerText = pair.match

    left.appendChild(word)
    right.appendChild(match)

  })

  container.appendChild(left)
  container.appendChild(right)

}

renderGame(gameData)