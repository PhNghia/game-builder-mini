let current = 0

function renderQuestion(){

  const q = gameData[current]

  const questionEl = document.getElementById("question")
  const answersEl = document.getElementById("answers")

  questionEl.innerHTML = `${current+1}. ${q.question}`

  answersEl.innerHTML = ""

  q.options.forEach((option,i)=>{

    const btn = document.createElement("button")
    btn.innerText = option

    btn.onclick = ()=>{

      if(i === q.answer){
        btn.classList.add("correct")
      }else{
        btn.classList.add("wrong")
      }

    }

    answersEl.appendChild(btn)

  })

}

document.getElementById("nextBtn").onclick = ()=>{

  if(current < gameData.length-1){
    current++
    renderQuestion()
  }

}

document.getElementById("prevBtn").onclick = ()=>{

  if(current > 0){
    current--
    renderQuestion()
  }

}

renderQuestion()