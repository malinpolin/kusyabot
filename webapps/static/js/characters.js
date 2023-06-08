let tg = window.Telegram.WebApp;

tg.expand();
tg.MainButton.text = "Закрыть";
tg.MainButton.textColor = "#ffffff";
tg.MainButton.color = "#986eda";

window.answersDone = [0, 0, 0, 0, 0, 0, 0, 0];
window.currentImageIndex = 0;
const answers = ["шерлок холмс", "рюк", "капитан америка", "дива", "уолтер уайт", "дэдпул", "гон фрикс", "джон уик"];
var results = ['', '', '', '', '', '', '', ''];
var old_input_value = '';


const good_gifs = {
    0: '/static/img/good_gifs/21.gif',
    1: '/static/img/good_gifs/22.gif',
    2: '/static/img/good_gifs/23.gif',
    3: '/static/img/good_gifs/24.gif',
    4: '/static/img/good_gifs/25.gif',
    5: '/static/img/good_gifs/26.gif',
    6: '/static/img/good_gifs/27.gif',
    7: '/static/img/good_gifs/28.gif',
    8: '/static/img/good_gifs/29.gif'
}

const try_gifs = [
    '/static/img/try_gifs/1.gif', '/static/img/try_gifs/2.gif',
    '/static/img/try_gifs/3.gif', '/static/img/try_gifs/4.gif',
    '/static/img/try_gifs/5.gif', '/static/img/try_gifs/6.gif',
    '/static/img/try_gifs/7.gif', '/static/img/try_gifs/8.gif',
    '/static/img/try_gifs/10.gif',
    '/static/img/try_gifs/11.gif', '/static/img/try_gifs/12.gif',
    '/static/img/try_gifs/13.gif', '/static/img/try_gifs/14.gif',
    '/static/img/try_gifs/15.gif', '/static/img/try_gifs/16.gif',
    '/static/img/try_gifs/17.gif', '/static/img/try_gifs/18.gif',
]

const helps = {
        0: [
            'Он обладает превосходными дедуктивными способностями.',
            'Его брат работает на британское правительство.',
            'Этого персонажа сыграли Бенедикт Камбербэтч и Роберт Дауни-младший.'
        ],
        1: [
            'Категорически не любит скуку.',
            'Одна из его слабостей - яблоки.',
            'Принадлежит к расе внепространственных существ, которые выживают, убивая людей и тем самым продлевают свою жизнь.'
        ],
        2: [
            'Был превращён из слабого юноши в «совершенный» образец человеческого развития и состояния.',
            'Его средство защиты сделано из вибраниума.',
            'Персонаж киновселенной Marvell.'
        ],
	    3: [
            'В прошлом - профессиональный игрок "Mecha Guardian V".',
            'Работает пилотом в составе южнокорейской армии.',
            'Настоящее имя - Хана Сон.'
        ],
	    4: [
            'В прошлом - учитель химии в школе.',
            'У него диагностировали неоперабельный рак лёгких.',
            'Его прозвище - Хайзенберг.'
        ],
	    5: [
            'В прошлом - солдат спецназа, подрабатывающий наёмником в Нью-Йорке.',
            'Он любит мультфильмы, туалетный юмор, Скиболл, классическую музыку, телевизионные шоу, рэп и американскую поп-культуру.',
            'Принял участие в экспериментальном лечении рака. Побочный эффект экспериментов - его тело и лицо обезображены.'
        ],
	    6: [
            'Его характер: простодушный, добрый, всегда ищет приключения.',
            'Любимая игра - "Камень-ножницы-бумага".',
            'Сдал экзамен, чтобы найти своего отца.'
        ],
	    7: [
            'Некоторые источники сообщают, что на его счету 306 убийств.',
            'Посмертный подарок его жены - щенок бигля.',
            'Его любимый отель - «Континенталь».'
        ]
	};

var helps_uses = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0,
}

const allImages = [
    "/static/img/characters/1.jpg", "/static/img/characters/2.jpg", "/static/img/characters/3.jpg",
    "/static/img/characters/4.jpg", "/static/img/characters/5.jpg", "/static/img/characters/6.jpg",
    "/static/img/characters/7.jpg", "/static/img/characters/8.jpg",
];

/*
document.addEventListener("DOMContentLoaded", () => {
    const images = new Array();
    function preloadImages(...images) {
        images.forEach((image, i) => {
            image = new Image();
            image.src = preloadImages.arguments[i];
        });
    };
    // Предварительная загрузка нужных картинок
    try_gifs.forEach(function(value, index, arr){
        preloadImages(value);
    });
    allImages.forEach(function(value, index, arr){
        preloadImages(value);
    });
    for (const [key, value] of Object.entries(good_gifs)) {
        preloadImages(value);
    };
});
*/

document.getElementById("image").src = allImages[window.currentImageIndex];
document.getElementById("cur-question").innerHTML = window.currentImageIndex + 1;
document.getElementById("max-question").innerHTML = allImages.length;
document.getElementById('text').maxLength = answers[window.currentImageIndex].length;
CreateTable(window.currentImageIndex)


function LastPage() {
    document.getElementById('header').style = "display:none;";
    document.getElementById('question').style = "display:none;";
    document.getElementById("buttons-2").style = 'display:none;';
    document.getElementById('end').style = "display:block;";
    tg.MainButton.show();
    Telegram.WebApp.onEvent('mainButtonClicked', function(){
        tg.sendData('success');
    });
}


function CreateTable(ind) {
    if (ind >= 0){
        var del_table = document.getElementById("tbl");
        if (del_table) {
          del_table.remove();
        }
    }

    let table = document.createElement('table');
    table.id = "tbl";
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);
    var id_container = 'table';
    if (ind == 11) {
        id_container = 'end_tbl';
    }
    document.getElementById(id_container).appendChild(table);
    let answer = answers[ind];
    let cells_count = answer.length;

    table.className="style-table";

    let row = document.createElement('tr');
    for (let i = 0; i < cells_count; i++){
        let cell = document.createElement('td');
        cell.className="style-td";
        cell.innerHTML = '';
        if (answer[i] == ' ') {
            cell.style="border: none; background-color: rgba(255,255,255,0);";
        }
        row.appendChild(cell);
    }
    tbody.appendChild(row);

}


function isAllQuestionsDone() {
    return window.answersDone.reduce(function(sum, elem) {
        return sum + elem;
    }, 0) == answers.length - 1;
}


function FillAnswerRow() {
    let text = document.getElementById("text");
    const cells = document.getElementById("tbl").getElementsByTagName("td");
    var tmp_value = '';
    var input_value = text.value;
    if (input_value.length < old_input_value.length) {
      for (let i = input_value.length; i < old_input_value.length && i < cells.length; i++) {
        cells[i].innerHTML = '';
      }
    }
    let answer = answers[window.currentImageIndex];
    let j = 0;

    while (j < input_value.length) {
      if (input_value[j] == ' ' && answer[j] != ' '){
          text.value = input_value.substr(0, j);
        }
      else if (answer[j] == ' ' && input_value[j] != ' ') {
        tmp_value = input_value.substr(0, j) + ' ' + input_value[j];
        input_value = tmp_value;
        text.value = tmp_value;
        cells[j].innerHTML = ' ';
        j ++;
      }
      cells[j].innerHTML = input_value[j].toUpperCase();
      j ++;
    }
    results[currentImageIndex] = input_value;
    old_input_value = input_value;
}


function NEXTClick() {
    if (window.currentImageIndex == (allImages.length - 1)){
        if (isAllQuestionsDone()) {
          LastPage();
        }
        else {
            Swal.fire({
                title: 'Не все вопросы отгаданы!',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: "Завершить",
                cancelButtonText: "Сейчас сделаю!",
                confirmButtonColor: "#996fdb",
                cancelButtonColor: "#8ac4dc",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed){
                    LastPage();
                }
            });
        }
    }
    else {
        if (window.currentImageIndex == (allImages.length - 2)){
          document.getElementById('btn-next').style = "display:none;";
          document.getElementById('btn-back').style = "display:block;";
        }
        else {
          document.getElementById('btn-next').style = "display:block;";
          document.getElementById('btn-back').style = "display:block;";
        };
        document.getElementById("buttons").style = 'display:block-inline;';
        document.getElementById("buttons-2").style = 'display:none;';
        const image = document.getElementById("image");
        window.currentImageIndex += 1;
        image.src = allImages[window.currentImageIndex];
        CreateTable(window.currentImageIndex);
        if (window.answersDone[window.currentImageIndex] == 1) {
          document.getElementById("text").value = answers[window.currentImageIndex];
          document.getElementById("text").oninput();
          document.getElementById("text").style = 'display:none;';
          document.getElementById("buttons").style = 'display:none;';
          document.getElementById("buttons-2").style = 'display:block-inline;';
        }
        else {
          document.getElementById("text").value = "";
          document.getElementById("text").oninput();
          document.getElementById("text").style = 'display:block;';
          document.getElementById("buttons").style = 'display:block-inline;';
          document.getElementById("buttons-2").style = 'display:none;';
        };
        document.getElementById("cur-question").innerHTML = window.currentImageIndex + 1;
        document.getElementById("max-question").innerHTML = allImages.length;
        document.getElementById('text').maxLength = answers[window.currentImageIndex].length;
    }
}


function BACKClick(){
    if (window.currentImageIndex == 1){
        document.getElementById('btn-back').style = "display:none;";
        document.getElementById('btn-next').style = "display:block;";
    }
    else {
        document.getElementById('btn-back').style = "display:block;";
        document.getElementById('btn-next').style = "display:block;";
    };

    const image = document.getElementById("image");
    window.currentImageIndex -= 1;
    image.src = allImages[window.currentImageIndex];
    CreateTable(window.currentImageIndex);
    if (window.answersDone[window.currentImageIndex] == 1) {
      document.getElementById("text").value = answers[window.currentImageIndex];
      document.getElementById("text").oninput();
      document.getElementById("text").style = 'display:none;';
      document.getElementById("buttons").style = 'display:none;';
      document.getElementById("buttons-2").style = 'display:block-inline;';
    }
    else {
      document.getElementById("text").value = "";
      document.getElementById("text").oninput();
      document.getElementById("text").style = 'display:block;';
      document.getElementById("buttons").style = 'display:block-inline;';
      document.getElementById("buttons-2").style = 'display:none;';
    };
    document.getElementById("cur-question").innerHTML = window.currentImageIndex + 1;
    document.getElementById("max-question").innerHTML = allImages.length;
    document.getElementById('text').maxLength = answers[window.currentImageIndex].length;
}


function CHECKClick() {
    var v_title = "Попробуй еще!";
    var v_imageUrl = try_gifs[Math.floor(Math.random()*try_gifs.length)];
    var v_showCancelButton = true;
    var v_showConfirmButton = false;
    if (answers[window.currentImageIndex] == results[window.currentImageIndex]){
        v_title = "Превосходно!";
        v_imageUrl = good_gifs[window.currentImageIndex];
        v_showCancelButton = false;
        v_showConfirmButton = true;
        window.answersDone[window.currentImageIndex] = 1;
    }
    Swal.fire({
        title: v_title,
        imageUrl: v_imageUrl,
        // imageWidth: 550,
        imageHeight: 225,
        showCancelButton: v_showCancelButton,
        showConfirmButton: v_showConfirmButton,
        confirmButtonText: "Далее",
        cancelButtonText: "ОК",
        confirmButtonColor: "#996fdb",
        cancelButtonColor: "#8ac4dc",
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed){
            NEXTClick();
        }
    });
}


function EXITClick() {
    var v_text = "Вы уверены, что хотите пропустить это задание?";
    var v_showCancelButton = true;
    var v_showConfirmButton = true;
    Swal.fire({
        text: v_text,
        showCancelButton: v_showCancelButton,
        showConfirmButton: v_showConfirmButton,
        confirmButtonText: "Да",
        cancelButtonText: "Нет",
        confirmButtonColor: "#996fdb",
        cancelButtonColor: "#8ac4dc",
    }).then((result) => {
        if (result.isConfirmed){
            LastPage();
        }
    });
}


function HELPClick() {
    var v_title, v_text, v_icon, v_cancelButtonText,
        v_showConfirmButton, v_confirmButtonText;
    if (helps_uses[window.currentImageIndex] < helps[window.currentImageIndex].length) {
        v_title = "Подсказка " + (helps_uses[window.currentImageIndex] + 1) + " из " + helps[window.currentImageIndex].length;
        v_text = helps[window.currentImageIndex][helps_uses[window.currentImageIndex]];
        v_icon = 'question';
        v_cancelButtonText = "Понял";
        v_showConfirmButton = false;
        helps_uses[window.currentImageIndex] ++;
    }
    else {
        v_title = 'Подсказки закончились!';
        v_text = '';
        v_icon = 'error';
        v_confirmButtonText = "Ответ";
        v_cancelButtonText = "ОКЕЙ(";
        v_showConfirmButton = true;
    }

    Swal.fire({
        title: v_title,
        icon: v_icon,
        text: v_text,
        showCancelButton: true,
        showConfirmButton: v_showConfirmButton,
        cancelButtonText: v_cancelButtonText,
        confirmButtonText: v_confirmButtonText,
        cancelButtonColor: "#8ac4dc",
        confirmButtonColor: "#996fdb",
    }).then((result) => {
        if (result.isConfirmed){
            Swal.fire({
                title: answers[window.currentImageIndex],
                icon: 'success',
                text: '',
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonText: 'ОК',
                cancelButtonColor: "#8ac4dc",
              });
              document.getElementById("text").value = answers[window.currentImageIndex];
              document.getElementById("text").oninput();
              document.getElementById("buttons").style = 'display:none;';
              document.getElementById("buttons-2").style = 'display:block;';
              window.answersDone[window.currentImageIndex] = 1;
        }
    });
}
