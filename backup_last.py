import os

import random

import telebot

#from webapps.quest_app import webapp
from time import sleep
from dotenv import load_dotenv 
from core import (
        helps, task_pics, good_pics, 
        answers, good_phrases, 
        try_phrases, try_add_phrases,
        anime_names, anime_choices,
        fact_forms, wrong_facts_true,
        eArrowDown, eJapan, eHi, eDontKnow, eIfUCan
    )

load_dotenv
TELEGRAM_TOKEN = os.getenv('TOKEN')
CHAT_ID = '1561949951'
HELP_TEXT = 'Хелп!'
READY_TEXT = 'Я готов!'
ANSWER_TEXT = 'Давай уже свой ответ...'
DECIPHER_TEXT = 'Расшифруй записку...'
FIND_TEXT = 'Я нашёл!'
HIDE_KB = 1

task = -1
step = 0
attempts = {}
helps_used = {}
good_pics_used = []
good_phrases_used = []
openings_done = []
wrong_facts_checked = set()


bot = telebot.TeleBot(TELEGRAM_TOKEN)


def send_msg(user, message, kb=None):
    s = len(message) / 18 if len(message) / 18 < 4 else 4
    # sleep(s)
    if kb is None:
        bot.send_message(user, text=message)
    elif kb == HIDE_KB:
        bot.send_message(user, text=message, reply_markup=telebot.types.ReplyKeyboardRemove())
    else:
        bot.send_message(user, text=message, reply_markup=kb)


def send_rnd_pics(user):
    global good_pics_used
    rnd_pic = random.choice(list(set(good_pics) - set(good_pics_used)))
    good_pics_used.append(rnd_pic)
    bot.send_photo(user, photo=open(rnd_pic, 'rb'))
    sleep(2)


def send_rnd_good_phrase(user):
    global good_phrases_used
    rnd_phrase = random.choice(list(set(good_phrases) - set(good_phrases_used)))
    good_phrases_used.append(rnd_phrase)
    send_msg(user, rnd_phrase, HIDE_KB)


@bot.message_handler(commands=["start"])
def start_game(message):
    global task, attempts, helps_used
    user = message.chat.id
    task = 0

    send_msg(user, 'Шторм и гром на твою голову, Akira Kimura!' + eHi)
    send_msg(user, 'Я Малышка Кусильда, и я помогу тебе найти сокровище, спрятанное Старой Полли.')
    send_msg(user, 'Фрагменты карты раскиданы по всей квартире.')
    send_msg(user, 'Для того чтобы их собрать, тебе нужно выполнить все мои задания.')

    process_task(user)


@bot.callback_query_handler(func=lambda call: True) 
def user_answer_command(call):
    user = call.message.chat.id
    print(f'in button:  {call.data}')
    process_answer(user, call.data)


@bot.message_handler(content_types=['text'])
def user_answer_text(message):
    user = message.chat.id
    print(f'in message:  {message.text}')
    process_answer(user, message.text)


@bot.message_handler(content_types=['web_app_data'])
def user_answer_webapp(webAppMes):
    user = webAppMes.chat.id
    answer = webAppMes.web_app_data.data
    process_answer(user, answer)


def process_task(user):
    kb = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    if task == 0:
        kb.add(telebot.types.KeyboardButton(text=READY_TEXT))
        send_msg(user, 'Нажми на кнопку когда будешь готов, и мы начнем.', kb)
    if task == 1:
        if step == 0:
            send_msg(user, 'Вот первое задание. Лови фото устройства XIX века.')
            bot.send_photo(user, photo=open(task_pics[task], 'rb'))
            sleep(2)
            send_msg(user, 'Часть карты спрятана в современном аналоге.')
            send_msg(user, 'Найди его и пришли мне название современного устройства.')    
        if step == 1:
            send_msg(user, helps.get(task)[helps_used[task] - 1], HIDE_KB)
        if step == 2:
            kb.add(telebot.types.KeyboardButton(text=ANSWER_TEXT))
            send_msg(user, 'Ты заюзал все подсказки(', kb)
        if step == 3:
            if helps_used[task] <= len(helps[task]):
                kb.add(telebot.types.KeyboardButton(text=HELP_TEXT))
            else:
                kb.add(telebot.types.KeyboardButton(text=ANSWER_TEXT))
            send_msg(user, random.choice(try_add_phrases))
            send_msg(user, random.choice(try_phrases), kb)           
    
    if task == 2:
        if step == 0:
            web_app=telebot.types.WebAppInfo('https://malinpolin.pythonanywhere.com/films')
            kb.add(telebot.types.KeyboardButton('Поехали!', web_app=web_app))
            send_msg(user, 'Пришло время второго задания.')
            send_msg(user, 'Сможешь угадать фильм по кадру, постеру, фан-арту или фото со съёмок?', kb) 
                   
    if task == 3:
        if step == 0:
            for i in anime_names.keys():
                if i not in openings_done:
                    kb.add(telebot.types.KeyboardButton(text=i))
            send_msg(user, 'Внимательно прослушай опенинг и угадай, в каком аниме ты его слышал.')
        if step in anime_names.keys():
            for choice in anime_choices.get(step):
                kb.add(telebot.types.KeyboardButton(text=choice))
            bot.send_audio(user, audio=open(f'openings/{step}.mp3', 'rb'))
            send_msg(user, f'Кстати, название анимешки по-японски пишется "{anime_names.get(step)}"', kb)
        if step in [i * 10 for i in anime_names.keys()]:
            for choice in anime_choices.get(step // 10):
                kb.add(telebot.types.KeyboardButton(text=choice))
            send_msg(user, random.choice(try_add_phrases), kb)
            send_msg(user, random.choice(try_phrases), kb)
        if step < 0:
            send_msg(user, 'Выбери из предложенных вариантов ниже ' + eArrowDown)

    if task == 4:
        if step == 0:
            kb.add(telebot.types.KeyboardButton(text=HELP_TEXT))
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(user, 'Вот следующее задание:')
            bot.send_photo(user, photo=open(task_pics[task], 'rb'))
            send_msg(user, 'Расшифруешь записку - найдешь путь к фрагменту карты.', kb)
        elif step == 1:
            kb.add(telebot.types.KeyboardButton(text=HELP_TEXT))
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(user, helps.get(task)[helps_used[task] - 1], kb)
        elif step == 2:
            kb.add(telebot.types.KeyboardButton(text=DECIPHER_TEXT))
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(user, 'Ты заюзал все подсказки(', kb)
        elif step == 3:
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(user, answers.get(task), kb)

    if task == 5:
        web_app=telebot.types.WebAppInfo('https://malinpolin.pythonanywhere.com/japan')
        kb.add(telebot.types.KeyboardButton('Жми', web_app=web_app))
        if step == 0:
            send_msg(user, 'Теперь перейдём к пятому заданию:')
            send_msg(user, 'Найди все верные факты о Японии' + eJapan, kb)
        if step == 1:
            send_msg(user, 'Попробуй ещё раз.', kb)

    if task == 6:
        if step == 0:
            send_msg(user, 'Якорь мне в печень, мы добрались до финального задания!')
            web_app=telebot.types.WebAppInfo('https://malinpolin.pythonanywhere.com/characters')
            kb.add(telebot.types.KeyboardButton('Поехали!', web_app=web_app))
            send_msg(user, 'В трёх картинках я загадала известных персонажей.') 
            send_msg(user, 'Угадай их всех, если сможешь' + eIfUCan, kb) 

    if task == 7:
        send_msg(user, 'Поздравление с др')
        send_msg(user, 'Попрощаться')
        # В твой день рождения желаю тебе ясной погоды в океане жизни, и чтобы твой корабль всегда упрямо шёл своим путём, даже против сильного ветра.
        bot.stop_polling()
    

def process_answer(user, answer):
    global helps_used, task, step, openings_done, wrong_facts_checked
    if task == 0:
        if answer == READY_TEXT:
            send_msg(user, 'Ну наконец-то.', HIDE_KB)
            send_msg(user, 'Бурю в паруса, попутного ветра в шляпы! Погнали.')
            task = 5
            helps_used[task] = 0
            step = 0
        else:
            send_msg(user, 'Хватит баловаться!')

    elif task == 1:
        if answer.lower() in answers[task]:
            task = 2
            helps_used[task] = 0
            step = 0
            send_rnd_pics(user)
            send_rnd_good_phrase(user)
            send_msg(user, "Так'с, переходим дальше.")
        elif answer == HELP_TEXT: 
            if helps_used[task] < len(helps[task]):
                step = 1
            else:
                step = 2
            helps_used[task] += 1
        elif answer == ANSWER_TEXT:
            send_msg(user, answers.get(task)[0], HIDE_KB)
            task = 2
            helps_used[task] = 0
            step = 0
            send_msg(user, "Так'с, переходим дальше.")
        else:
            step = 3
        
    elif task == 2:
        if answer == answers.get(task):
                task = 3
                helps_used[task] = 0
                step = 0
                send_msg(user, 'Три тысячи акул мне в глотку!', HIDE_KB)
                send_msg(user, 'Ты великолепно справился.')
        else:
            step = 1 
            msg = random.choice(['Ничего не поняла' + eDontKnow, 'Ты точно выполняешь задание?', 'Нажми кнопку "Поехали!"'])
            send_msg(user, msg)
        
    elif task == 3:
        step = step // 10 if step in [i * 10 for i in anime_names.keys()] else step
        if step in [0, -1]:
            if answer in list(map(str, anime_names.keys())):
                step = int(answer)
            else:
                send_msg(user, 'Ничего не поняла' + eDontKnow)
                step = -1
        elif step in anime_names or step < 0:
            step = step // 10 * (-1) if step < 0 else step 
            if answer == answers.get(task).get(step):
                send_rnd_pics(user)
                send_rnd_good_phrase(user)
                openings_done.append(step)
                if len(openings_done) == len(anime_names):
                    step = 0 # все анимешки угаданы
                    send_rnd_pics(user)
                    send_msg(user, 'Лови фото местонахождения следующего фрагмента карты:', HIDE_KB) 
                    # Отправить фотку
                    task = 4
                    helps_used[task] = 0
                else:
                    step = 0 # угадали анимешку, не все анимешки угаданы
            elif answer in (anime_choices.get(step)):
                step *= 10 # текущая анимешка не угадана, вариант ответа из списка
            else:
                send_msg(user, 'Ничего не поняла' + eDontKnow)
                step *= -10 


    elif task == 4:
        if answer == FIND_TEXT:
            task = 5
            helps_used[task] = 0
            step = 0
            send_rnd_pics(user)
            send_rnd_good_phrase(user)
            send_msg(user, "Мы почти у цели! Осталось совсем чуть-чуть.")
        elif answer == HELP_TEXT: 
            if helps_used[task] < len(helps[task]):
                step = 1
            else:
                step = 2
            helps_used[task] += 1
        elif answer == DECIPHER_TEXT:
            step = 3
        else:
            if step == 2 and helps_used[task] > len(helps.get(task)):
                send_msg(user, 'Ничего не поняла' + eDontKnow)
                send_msg(user, f'Если нужна помощь - жми "{DECIPHER_TEXT}"')
            elif step == 3:
                send_msg(user, "Дальше ты справишься сам.")
            else: 
                send_msg(user, 'Моя твоя не понимать' + eDontKnow)
                send_msg(user, f'Если нужна подсказка - жми "{HELP_TEXT}"')
            return
            
    elif task == 5:
        if set(answer) <= set('1234567,'):
            answer = list(map(int, answer.split(',')))
            send_msg(user, "Так, сейчас проверю ...", HIDE_KB)
            if set(answer) == set(answers.get(task)):
                send_rnd_pics(user)
                send_rnd_good_phrase(user)
                if len(wrong_facts_checked) > 0:
                    send_msg(user, 'Кстати, на заметку:') 
                    for fact in wrong_facts_checked:
                        send_msg(user, wrong_facts_true.get(fact))   
                send_msg(user, 'Лови фото местонахождения следующего фрагмента карты:', HIDE_KB) 
                # отправить фотку
                task = 6
                helps_used[task] = 0
                step = 0
            else:
                cnt = len(set(answer) & set(answers.get(task)))
                diff = set(answer).difference(set(answers.get(task)))
                wrong_facts_checked.update(diff)
                if cnt == 0:
                    send_msg(user, '0 попаданий.')
                elif len(answer) > len(answers.get(task)):
                    send_msg(user, 'Все факты угаданы, но есть лишние...')
                else:
                    guessed = 'Угадано'
                    if cnt == 1:
                        guessed = 'Угадан'
                        fact = fact_forms[0]
                    elif cnt in range(2, 5):
                        fact = fact_forms[1]
                    else:
                        fact = fact_forms[2]
                    send_msg(user, f'{guessed} {cnt} {fact}.')
                    send_msg(user, 'Но есть ещё верные ответы.')
                step = 1
        else:
            step = 2
            send_msg(user, 'Увы, я пока не настолько умная(')
            send_msg(user, 'Для выполнения задания нажми на кнопку' + eArrowDown)

        
    elif task == 6:
        if answer == answers.get(task):
                task = 7
                send_msg(user, 'Конец!', HIDE_KB)
        else:
            step = 1 
            msg = random.choice(['Ничего не поняла' + eDontKnow, 'Ты точно выполняешь задание?', 'Нажми кнопку "Поехали!"'])
            send_msg(user, msg)

    process_task(user)



bot.polling(none_stop=True)
#webapp.run(host='0.0.0.0')
