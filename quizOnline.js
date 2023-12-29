const questionElement = document.getElementById('quest')
const nextBtn = document.getElementById('next-btn')

let firstA = document.getElementById('firstA');
let secondA = document.getElementById('secondA');
let thirdA = document.getElementById('thirdA');
let fourthA = document.getElementById('fourthA');

let quizOpt = document.getElementById('quizOpt')
let quizQuestions = document.getElementById('app')

let answerButtons = document.querySelectorAll('.btn');
let quest, answers, currentQuesIndex, score;
let optionClicked = false;

let count, category, level;
const questions = []

document.getElementById("loading").style.display = "none";

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.makeRequest = async function (e) {
    e.preventDefault();
    document.getElementById("loading").style.display = "block";
    count = document.getElementById('count').value;
    category = document.getElementById('category').value;
    level = document.getElementById('level').value;

    let url = 'https://opentdb.com/api.php?amount=' + count 

    if(category != 'any'){
        url = url + '&category='+ category
    }

    if(level != 'any'){
        url = url + '&difficulty=' + level
    }

    url = url + '&type=multiple'

        try {
            // const res = await axios.get('https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple')
            const res = await axios.get(`${url}`)
            let quesData = res.data.results

            for(let i = 0; i < quesData.length; i++) {    
                let a = res.data.results[i]
                let options = a.incorrect_answers
                options.push(a.correct_answer)
                let correctness = [false, false, false, true]
    
                let allOptions = options.map((v,i) => ({
                    text : v,
                    correct: correctness[i]
                }))
    
                for(let i=0; i<4; i++){
                    let j = Math.floor(Math.random() * 4);
                    [allOptions[i], allOptions[j]]=[allOptions[j], allOptions[i]];
                }
    
                let question = {
                    quest: `${i+1}. ${a.question}`,
                    answers: allOptions
                }
                questions.push(question)

            await delay(1000);
            }
            quizOpt.style.display = 'none';
            document.getElementById("loading").style.display = "none";
            document.getElementById('count').value = ''
            document.getElementById('category').value = 'any'
            document.getElementById('level').value = 'any'
            startQuiz();
        } catch (error) {
            console.error(error);
            document.getElementById("loading").style.display = "none";
        }
}

const startQuiz = () => {
    currentQuesIndex = 0
    score = 0
    showQuestion();
    quizQuestions.style.display = 'block'
}

const showQuestion = ()=>{
    let set = questions[currentQuesIndex];
        questionElement.innerHTML = set.quest
        firstA.innerHTML = set.answers[0].text
        secondA.innerHTML = set.answers[1].text
        thirdA.innerHTML = set.answers[2].text
        fourthA.innerHTML = set.answers[3].text
}

nextBtn.addEventListener('click', () => {
    if(nextBtn.innerHTML == "Play Again"){
        nextBtn.innerHTML = "Next";
        document.getElementById('answer-btns').style.display = ''
        quizOpt.style.display = '';
        quizQuestions.style.display = 'none'
    } else{
        if(!optionClicked){
            alert('choose your answer!')
            return false
        }
        currentQuesIndex++;
        optionClicked = false;
        nextBtn.style.display = "none"
        answerButtons.forEach(btn => btn.classList.remove('correct', 'incorrect', 'disabled'));

        if (currentQuesIndex < questions.length) {
            showQuestion();
        } else {
            nextBtn.innerHTML = "Play Again";
            nextBtn.style.display = "block"
            questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`
            document.getElementById('answer-btns').style.display = 'none'
            questions.length = 0
        }
    }
});
    
for (let i = 0; i < answerButtons.length; i++) {
    answerButtons[i].addEventListener('click', function() {
        optionClicked = true;
        nextBtn.style.display = "block"
        checkAnswer(questions[currentQuesIndex].answers[i], answerButtons[i]);
    });
}

function checkAnswer(answer, button) {
    answerButtons.forEach(elem => elem.classList.add('disabled'));    
    if (answer.correct) {
        button.classList.add('correct')
        score++
    } else {
        button.classList.add('incorrect')
        let correctAnswerIndex = questions[currentQuesIndex].answers.findIndex(a => a.correct);
        let answerButtonsIndex = answerButtons[correctAnswerIndex]
        answerButtonsIndex.classList.add('correct')
    }
}
