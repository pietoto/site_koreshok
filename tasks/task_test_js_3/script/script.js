const questions = [
    {
        text: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
        answers: [
            {
                text: "Пол деревни, за раз",
                correct: false
            },
            {
                text: "Полдеревни, зараз",
                correct: true,
                congratulations: "Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом."
            },
            {
                text: "Пол-деревни, за раз",
                correct: false
            }]
        },

        {
        text: "А эти слова как пишутся?",
        answers: [
            {
                text: "Капуччино и эспрессо",
                correct: false
            },
            {
                text: "Капучино и эспрессо",
                correct: true,
                congratulations: "Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо»."
            },
            {
                text: "Каппуччино и экспресо",
                correct: false
            }]
        },

        {
        text: "Как нужно писать?",
        answers: [
            {
                text: "Черезчур",
                correct: false
            },
            {
                text: "Чересчур",
                correct: true,
                congratulations: "Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур»."
            },
            {
                text: "Черес-чур",
                correct: false
            }]
        },

        {
        text: "Где допущена ошибка?",
        answers: [
            {
                text: "Аккордеон",
                correct: false
            },
            {
                text: "Эпелепсия",
                correct: true,
                congratulations: "Верно! Это слово пишется так: «эпИлепсия»."
            },
            {
                text: "Белиберда",
                correct: false
            }]
        },

        {
        text: "В каких предложениях слово «одевать» употреблено правильно с точки зрения литературной нормы?»",
        answers: [
            {
                text: "Он одевает пальто и выходит на улицу.",
                correct: false
            },
            {
                text: "Мама одевает ребёнка перед прогулкой.",
                correct: true,
                congratulations: "Правильно. Глагол «одевать» — переходный: он употребляется, когда кто-то одевает кого-то другого (ребёнка, клиента)"
            },
            {
                text: "Она одевает шапку и бежит на работу.",
                correct: false
            },
            {
                text: "Стилист одевает клиента перед фотосессией. ",
                correct: true,
                congratulations: "Правильно. Глагол «одевать» — переходный: он употребляется, когда кто-то одевает кого-то другого (ребёнка, клиента)"
            }]
        }
];


let cur_question_index = 0;
let correct_answers_count = 0;
let is_answered = false;
let is_test_finished = false;
const user_result = [];

const container = document.getElementById('quiz-container');
const status_div = document.getElementById('status-container');

function shuffle(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffle(questions);

function render_question()
{
    if (cur_question_index >= questions.length)
    {
       finish_test();
        return;
    }

    is_answered = false;
    const q = questions[cur_question_index];

    const q_block = document.createElement('div');
    q_block.className = 'question-block';

    const q_title = document.createElement('div');
    q_title.className = 'question-title';
    
    q_title.innerHTML = `
        <div class="question-text">
            <b>Вопрос ${cur_question_index + 1}.</b> ${q.text}
        </div>
        <span class="marker"></span>
    `;
    q_block.appendChild(q_title);

    const shuffled_answers = shuffle([...q.answers]);

    shuffled_answers.forEach(ans =>
        {
            const a_block = document.createElement('div');
            a_block.className = 'answer-block';
            a_block.innerHTML = ans.text;
            a_block.onclick = () => check_answer(a_block, ans, q_block);
            q_block.appendChild(a_block);
        }
    );

    container.appendChild(q_block);
}

function check_answer(selected_answer_block, answer_data, question_block)
{

    if (is_answered) return;
    is_answered = true;

    const marker = question_block.querySelector('.marker');

    user_result[cur_question_index] = {
        is_correct: answer_data.correct,
        user_answer: selected_answer_block.innerHTML
    };

    selected_answer_block.classList.add('selected');

    
    setTimeout(() => {
        selected_answer_block.classList.remove('selected');

        if (answer_data.correct)
        {
            correct_answers_count++;
            selected_answer_block.classList.add('correct');
            
            
            if (answer_data.congratulations)
            {
                const exp_block = document.createElement('div');
                exp_block.className = 'explanation';
                exp_block.innerHTML = answer_data.congratulations;
                selected_answer_block.appendChild(exp_block);
            }
            marker.innerHTML = '✅';

        }
        else
        {
            selected_answer_block.classList.add('wrong');
            marker.innerHTML = '❌';
        }

        
        const all_answers = question_block.querySelectorAll('.answer-block');
        
        // если был дан верный ответ, то уезжают сначала неверные ответы (300 мс), потом через 2.5с уезжает верный
        if (answer_data.correct) {
            
            let delay = 0;
            all_answers.forEach((block) => {
                if (!block.classList.contains('correct')) {
                    setTimeout(() => {
                        block.classList.add('move-down');
                    }, delay);
                    delay += 300; 
                }
            });
            
            
            setTimeout(() => {
                selected_answer_block.classList.add('move-down');
            }, 2500); 
            
        // если дан неверный ответ, то уезжают поочерёдно (300 мс)
        } else {
           
            all_answers.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add('move-down');
                }, index * 300);
            });
        }

        const transitionDelay = answer_data.correct ? 4000 : 1500;

        setTimeout(() => {
            question_block.classList.add('completed'); // скрываем ответы
            cur_question_index++;
            render_question(); 
        }, transitionDelay);

    }, 500);
}

function finish_test() {
    status_div.innerHTML = `<h3>Тест завершен!</h3><p>Правильных ответов: ${correct_answers_count} из ${questions.length}</p><p><i>Нажмите на любой вопрос выше, чтобы проверить себя.</i></p>`;

    const all_completed_blocks = document.querySelectorAll('.question-block.completed');
    
    all_completed_blocks.forEach((block, index) => {
        block.onclick = () => {
            
            const was_open = block.classList.contains('revealed');
            
            
            all_completed_blocks.forEach(b => b.classList.remove('revealed'));           
            
            if (!was_open) {
                block.classList.add('revealed');
                
                
                if (!block.querySelector('.review-content')) {
                    const result = user_result[index];
                                     
                    const correct_answers_html = questions[index].answers
                        .filter(a => a.correct)
                        .map(a => a.text)
                        .join('<br>');
                    
                    block.insertAdjacentHTML('beforeend', `
                        <div class="review-content">
                            <div class="review-line"><b>Ваш ответ:</b> ${result.user_answer}</div>
                            <div class="review-line correct-text"><b>Правильный ответ:</b><br>${correct_answers_html}</div>
                        </div>
                    `);
                }
            }
        };
    });
}

render_question();