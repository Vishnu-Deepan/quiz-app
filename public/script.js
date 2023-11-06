// Define quiz questions and answers
const quizQuestions = [
    {
        question: "What is the primary role of CSS in web development?",
        options: ["Styling", "Framework", "server"],
        correctAnswer: "Styling",
    },
    {
        question: "Which protocol is commonly used for secure data transmission on the web?",
        options: ["HTTPS", "FTP", "SMTP"],
        correctAnswer: "HTTPS",
    },{
        question: "Which front-end library is often used for building user interfaces in web development and is known for its virtual DOM?",
        options: ["React", "Vue.js", "Node.js"],
        correctAnswer: "React",
    },{
        question: "What does SEO stand for in web development?",
        options: ["Search Engine Optimization", "Server Extension Objects", "Software Engineering Orientation"],
        correctAnswer: "Search Engine Optimization",
    },{
        question: "Which of the following is a server-side scripting language commonly used for web development?",
        options: ["HTML", "CSS", "PHP"],
        correctAnswer: "PHP",
    },{
        question: "What is the extension of HTML",
        options: ["Hyperlink and Text Markup Language", "High-level Text Markup Language", "Hyper Text Markup Language"],
        correctAnswer: "Hyper Text Markup Language",
    },
    {
        question: "Which programming language is commonly used for adding interactivity to web pages?",
        options: ["Java", "Python", "JavaScript"],
        correctAnswer: "JavaScript",
    },{
        question: "Which of the following databases is often used in full-stack web development?",
        options: ["Photoshop", "MySQL", "Excel"],
        correctAnswer: "MySQL",
    },{
        question: "Which front-end framework is often used for building user interfaces in full-stack web development?",
        options: ["Django", "Angular", "Express.js"],
        correctAnswer: "Angular",
    },{
        question: "In web development, what does API stand for?",
        options: ["Automated Page Interaction", " Active Page Integration", "Application Programming Interface"],
        correctAnswer: "Application Programming Interface",
    },
];

// Define variables to keep track of the quiz state
let currentQuestionIndex = 0;
let userScore = 0;

// Function to start the quiz
function startQuiz() {
    showQuestion(currentQuestionIndex);
}

// Function to display a question and its options
function showQuestion(index) {
    const quizContainer = document.getElementById('quiz-container');
    const questionData = quizQuestions[index];
    if (questionData) {
        const optionsHTML = questionData.options
            .map((option) => `<button onclick="handleAnswer('${option}')" class="quiz-button">${option}</button>`)
            .join(' ');
        quizContainer.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${questionData.question}</p>
            ${optionsHTML}
        `;
    } else {
        endQuiz();
    }
}


// Function to handle user's answer
function handleAnswer(answer) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (currentQuestion && answer === currentQuestion.correctAnswer) {
        userScore++;
    }
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
}

// Function to end the quiz
function endQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <h2>Quiz Finished</h2>
        <p>Your Score: ${userScore}</p>
        <button id="submit-score-button" onclick="submitScore()" class="quiz-button">Submit Score</button>
        <button id="refresh-button" onclick="refreshQuiz()" class="quiz-button">Refresh</button>
    `;
}


// Function to refresh the quiz
function refreshQuiz() {
    location.reload(); // Reload the page to start the quiz again
}

// Function to submit the user's score to the server
function submitScore() {
    const name = prompt('Enter your name:');
    if (name) {
        // Send an HTTP POST request to the server with the user's name and score
        fetch('/api/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score: userScore }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);
            // After submitting the score, display high scores
            displayHighScores();
        })
        .catch((error) => {
            console.error('Error submitting score:', error);
        });
    }
}

// Function to fetch and display high scores
function displayHighScores() {
    // Fetch high scores from the server and display them in the 'high-scores' div
    fetch('/api/high-scores')
        .then((response) => response.json())
        .then((highScores) => {
            const highScoresElement = document.getElementById('high-scores');

            // Create an ordered list to display the high scores
            highScoresElement.innerHTML = '<h2>High Scores</h2>';
            highScoresElement.innerHTML += '<ol>';

            highScores.forEach((score, index) => {
                highScoresElement.innerHTML += `<li>&nbsp;&nbsp;&nbsp;&nbsp; ${score.score} &nbsp; : &nbsp;&nbsp;${score.name}</li>`;
            });

            highScoresElement.innerHTML += '</ol>';

            // Apply CSS styles
            const listItems = highScoresElement.querySelectorAll('li');
            listItems.forEach((item) => {
                item.style.textAlign = 'justify'; // Justify text
                item.style.listStyleType = 'none'; // Remove bullets
                item.style.fontSize = '18px'; // Set font size
                item.style.lineHeight = '2'; // Set line spacing
            });

            // Add a reset button
            highScoresElement.innerHTML += `
                <button onclick="resetHighScores()" class="quiz-button" id="reset">Reset High Scores</button>
            `;
        })
        .catch((error) => {
            console.error('Error fetching high scores:', error);
        });
}


// Function to reset high scores
function resetHighScores() {
    const confirmation = window.confirm("Are you sure you want to reset all high scores?");
    if (confirmation) {
        fetch('/api/reset-high-scores', {
            method: 'POST',
        })
            .then(() => {
                displayHighScores(); // Refresh the high scores list
            })
            .catch((error) => {
                console.error('Error resetting high scores:', error);
            });
    }
}







// Call the startQuiz function to begin the quiz
startQuiz();

// Display the user's score and high scores when the quiz is finished
displayHighScores();
