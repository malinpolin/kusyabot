import random

import telebot

from dotenv import load_dotenv

from chatterbot import ChatBot

from time import sleep

from core import (
        TELEGRAM_TOKEN,
        HELP_TEXT, READY_TEXT,
        ANSWER_TEXT, DECIPHER_TEXT,
        FIND_TEXT, HIDE_KB,
        WEB_APP_FILMS, WEB_APP_CHARACTERS, WEB_APP_JAPAN,
        HELPS, ANSWERS,
        TASK_PICS, GOOD_PICS, PLACE_PICS,
        GOOD_PHRASES, TRY_PHRASES, TRY_PHRASES_ADD,
        ANIME_NAMES, ANIME_CHOICES,
        FACT_FORMS, WRONG_FACTS_TRUE,
        E_ARROWDOWN, E_JAPAN, E_HI, E_DONT_KNOW, E_IF_U_CAN, E_SMILE
    )

load_dotenv()

bot = telebot.TeleBot(TELEGRAM_TOKEN)
chatbot = ChatBot(
    'KusyaChatBot', 
    logic_adapters=[
        {
            'import_path': 'chatbot.adapters.CustomAdapter.CustomAdapter',
        }
    ])


attempts = {}
good_pics_used = {}
good_phrases_used = {}
helps_used = {}
task = {}
step = {}
openings_done = {}
wrong_facts_checked = {}


def send_msg(chat, message, kb=None, slp=True):
    '''
    Отправка сообщения пользователю.
    '''
    if (slp):
        sleep(2)
    if kb is None:
        bot.send_message(chat.id, text=message)
    elif kb == HIDE_KB:
        bot.send_message(chat.id, text=message, reply_markup=telebot.types.ReplyKeyboardRemove())
    else:
        bot.send_message(chat.id, text=message, reply_markup=kb)


def send_rnd_pics(chat):
    '''
    Отправка новой рандомной картинки пользователю. 
    Запоминает ранее отправленные.
    '''
    lst = list(set(GOOD_PICS) - set(good_pics_used.get(chat.id)))
    if len(lst) > 0:
        rnd_pic = random.choice(lst)
        good_pics_used[chat.id].append(rnd_pic)
    else:
        rnd_pic = random.choice(GOOD_PICS)
    bot.send_photo(chat.id, photo=open(rnd_pic, 'rb'), reply_markup=telebot.types.ReplyKeyboardRemove())


def send_rnd_good_phrase(chat):
    '''
    Отправка новой рандомной "поощрительной" фразы пользователю. 
    Запоминает ранее отправленные.
    '''
    lst = list(set(GOOD_PHRASES) - set(good_phrases_used.get(chat.id)))
    if len(lst) > 0:
        rnd_phrase = random.choice(lst)
        good_phrases_used[chat.id].append(rnd_phrase)
    else:
        rnd_phrase = random.choice(GOOD_PHRASES)
    send_msg(chat, rnd_phrase, HIDE_KB)


@bot.message_handler(commands=["start"])
def start_game(message):
    '''
    Обработка команды старт. 
    Инициализация начальных параметров. 
    Приветствие с пользователем.
    '''
    chat = message.chat
    task[chat.id] = 0
    step[chat.id] = 0 
    openings_done[chat.id] = []
    wrong_facts_checked[chat.id] = []
    helps_used[chat.id] = {}
    good_pics_used[chat.id] = []
    good_phrases_used[chat.id] = []
    send_msg(chat, f'Шторм и гром на твою голову, {chat.first_name if chat.first_name else chat.username}! {E_HI}', HIDE_KB)
    send_msg(chat, 'Я Малышка Кусильда, и я помогу тебе найти сокровище, спрятанное Старой Полли.')
    send_msg(chat, 'Фрагменты карты раскиданы по всей квартире.')
    send_msg(chat, 'Для того чтобы их собрать, тебе нужно выполнить все мои задания.')
    process_task(chat)


@bot.message_handler(commands=["skip"])
def skip_game(message):
    '''
    Функция для отладки.
    Обработка команды пропуск. 
    '''
    chat = message.chat
    task[chat.id] += 1
    step[chat.id] = 0 
    helps_used[chat.id][task.get(chat.id)] = 0
    process_task(chat)


def end_game(chat):
    '''
    Завершение квеста.
    '''
    send_msg(chat, 'Чёрт меня побери! Ты выполнил все задания.', HIDE_KB)
    send_msg(chat, 'Осталось только соединить карту и найти сокровище.')
    send_msg(chat, 'Кстати, я слышала, что у тебя сегодня день рождения' + E_DONT_KNOW)
    sleep(2)
    send_msg(chat, 'Прими мои поздравления! Ясной тебе погоды в океане жизни, и чтобы твой корабль всегда упрямо шёл своим путём, даже против сильного ветра!' + E_SMILE)
    sleep(2)
    send_msg(chat, f'Пришло время прощаться, {chat.first_name if chat.first_name else chat.username}. Было весело!')


@bot.message_handler(content_types=['text'])
def user_answer_text(message):
    '''
    Обработчик текстовых сообщений пользователя. 
    '''
    answer = message.text
    chat = message.chat
    process_answer(chat, answer)


@bot.message_handler(content_types=['web_app_data'])
def user_answer_webapp(webAppMes):
    '''
    Обработчик сообщений от Web-приложений. 
    '''
    chat = webAppMes.chat
    answer = webAppMes.web_app_data.data
    process_answer(chat, answer)


def process_task(chat):
    '''
    Процесс отправки сообщений пользователю.
    Зависит от текущих task и step.
    '''
    user = chat.id
    kb = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    if task.get(user) == 0:
        kb.add(telebot.types.KeyboardButton(text=READY_TEXT))
        send_msg(chat, 'Нажми на кнопку, когда будешь готов, и мы начнем.', kb)

    if task.get(user) == 1:
        if step.get(user) == 0:
            send_msg(chat, 'Вот первое задание. Лови фото устройства XIX века.', HIDE_KB)
            sleep(2)
            bot.send_photo(user, photo=open(TASK_PICS[task[user]], 'rb'))
            send_msg(chat, 'Часть карты спрятана в современном аналоге.')
            send_msg(chat, 'Найди её и пришли мне название этого устройства.')
            send_msg(chat, 'Чтобы пропустить это задание, введи команду /skip.', kb)
        if step.get(user) == 1:
            send_msg(chat, HELPS.get(task.get(user))[helps_used.get(user).get(task.get(user)) - 1], HIDE_KB)
        if step.get(user) == 2:
            kb.add(telebot.types.KeyboardButton(text=ANSWER_TEXT))
            send_msg(chat, 'Ты заюзал все подсказки(', kb)
        if step.get(user) == 3:
            if helps_used.get(user).get(task.get(user)) <= len(HELPS[task[user]]):
                kb.add(telebot.types.KeyboardButton(text=HELP_TEXT))
            else:
                kb.add(telebot.types.KeyboardButton(text=ANSWER_TEXT))
            send_msg(chat, random.choice(TRY_PHRASES_ADD))
            send_msg(chat, random.choice(TRY_PHRASES), kb)

    if task.get(user) == 2:
        if step.get(user) == 0:
            web_app=telebot.types.WebAppInfo(WEB_APP_FILMS)
            kb.add(telebot.types.KeyboardButton('Поехали!', web_app=web_app))
            send_msg(chat, 'Сможешь угадать фильм по кадру, постеру, фан-арту или фото со съёмок?', kb)

    if task.get(user) == 3:
        if step.get(user) == 0:
            for i in ANIME_NAMES.keys():
                if i not in openings_done.get(user):
                    kb.add(telebot.types.KeyboardButton(text=i))
            send_msg(chat, 'Внимательно прослушай опенинг и угадай, в каком аниме ты его слышал.', kb)
            send_msg(chat, 'Чтобы пропустить это задание, введи команду /skip.', kb)
        elif step.get(user) in ANIME_NAMES.keys():
            for choice in ANIME_CHOICES.get(step[user]):
                kb.add(telebot.types.KeyboardButton(text=choice))
            bot.send_audio(user, audio=open(f'openings/{step.get(user)}.mp3', 'rb'), reply_markup=kb)
            send_msg(chat, f'Кстати, название анимешки по-японски пишется "{ANIME_NAMES.get(step.get(user))}"')
        elif step.get(user) in [i * 10 for i in ANIME_NAMES.keys()]:
            for choice in ANIME_CHOICES.get(step.get(user) // 10):
                kb.add(telebot.types.KeyboardButton(text=choice))
            send_msg(chat, random.choice(TRY_PHRASES_ADD), kb)
            send_msg(chat, random.choice(TRY_PHRASES), kb)
        elif step.get(user) == -100:
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, 'Лови фото местонахождения следующего фрагмента карты:', kb)
            bot.send_photo(user, photo=open(PLACE_PICS.get(task.get(user)), 'rb'))
        elif step.get(user) == -101:
            return
        elif step.get(user) < 0:
            send_msg(chat, 'Выбери из предложенных вариантов ниже ' + E_ARROWDOWN)

    if task.get(user) == 4:
        if step.get(user) == 0:
            kb.add(telebot.types.KeyboardButton(text=HELP_TEXT))
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, 'Вот следующее задание:')
            bot.send_photo(user, photo=open(TASK_PICS[task.get(user)], 'rb'))
            send_msg(chat, 'Расшифруешь записку - найдешь путь к фрагменту карты.', kb)
            send_msg(chat, 'Чтобы пропустить это задание, введи команду /skip.', kb)
        elif step.get(user) == 1:
            kb.add(telebot.types.KeyboardButton(text=HELP_TEXT))
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, HELPS.get(task.get(user))[helps_used.get(user).get(task.get(user)) - 1], kb) 
        elif step.get(user) == 2:
            kb.add(telebot.types.KeyboardButton(text=DECIPHER_TEXT))
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, 'Ты заюзал все подсказки(', kb)
        elif step.get(user) == 3:
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, ANSWERS.get(task.get(user)), kb)

    if task.get(user) == 5:
        web_app=telebot.types.WebAppInfo(WEB_APP_JAPAN)
        if step.get(user) == 0:
            kb.add(telebot.types.KeyboardButton('Жми', web_app=web_app))
            send_msg(chat, 'Пришло время пятого задания:')
            send_msg(chat, 'Найди все верные факты о Японии' + E_JAPAN, kb)
            send_msg(chat, 'Чтобы пропустить это задание, введи команду /skip.', kb)
        if step.get(user) == 1:
            kb.add(telebot.types.KeyboardButton('Жми', web_app=web_app))
            send_msg(chat, 'Подумай хорошенько.', kb)
        if step .get(user)== -100:
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, 'Лови фото местонахождения следующего фрагмента карты:', kb)
            bot.send_photo(user, photo=open(PLACE_PICS.get(task.get(user)), 'rb'))

    if task.get(user) == 6:
        if step.get(user) == 0:
            send_msg(chat, 'Якорь мне в печень, мы добрались до финального задания!', HIDE_KB)
            web_app=telebot.types.WebAppInfo(WEB_APP_CHARACTERS)
            kb.add(telebot.types.KeyboardButton('Поехали!', web_app=web_app))
            send_msg(chat, 'В трёх картинках я загадала известных персонажей.')
            send_msg(chat, 'Угадай их всех, если сможешь' + E_IF_U_CAN, kb)
        if step.get(user) == -100:
            kb.add(telebot.types.KeyboardButton(text=FIND_TEXT))
            send_msg(chat, 'Лови фото местонахождения следующего фрагмента карты:', kb)
            bot.send_photo(user, photo=open(PLACE_PICS.get(task.get(user)), 'rb'))
    


def process_answer(chat, answer):
    '''
    Процесс ответа пользователю в зависимости от его ответа.
    Зависит от текущих task и step.
    '''
    user = chat.id
    if task.get(user) == 0:
        if answer == READY_TEXT: 
            send_msg(chat, 'Ну наконец-то.', HIDE_KB)
            send_msg(chat, 'Бурю в паруса, попутного ветра в шляпы! Погнали.', HIDE_KB)
            task[user] = 1
            helps_used[user][task.get(user)] = 0
            step[user] = 0
        else:
            bot_response = chatbot.get_response(answer)
            send_msg(chat, bot_response, slp=False)
            step[user] = 1

    elif task.get(user) == 1:
        if answer.lower() in ANSWERS[task.get(user)]:
            task[user] = 2
            helps_used[user][task.get(user)] = 0
            step[user] = 0
            send_rnd_pics(chat)
            send_rnd_good_phrase(chat)
            send_msg(chat, "Так'с, переходим дальше.")
        elif answer == HELP_TEXT:
            if helps_used[user][task.get(user)] < len(HELPS[task.get(user)]):
                step[user] = 1
            else:
                step[user] = 2
            helps_used[user][task.get(user)] += 1
        elif answer == ANSWER_TEXT:
            send_msg(chat, ANSWERS.get(task.get(user))[0], HIDE_KB)
            task[user] = 2
            helps_used[user][task.get(user)] = 0
            step[user] = 0
            send_msg(chat, "Так'с, переходим дальше.")
        else:
            step[user] = 3

    elif task.get(user) == 2:
        if answer == ANSWERS.get(task.get(user)):
            task[user] = 3
            helps_used[user][task.get(user)] = 0
            step[user] = 0
            send_msg(chat, 'Три тысячи акул мне в глотку!', HIDE_KB)
            send_msg(chat, 'Ты великолепно справился.')
            send_msg(chat, 'Едем дальше.')
        else:
            step[user] = 1
            bot_response = chatbot.get_response(answer)
            send_msg(chat, bot_response, slp=False)


    elif task.get(user) == 3:
        step[user] = step.get(user) // 10 if step.get(user) in [i * 10 for i in ANIME_NAMES.keys()] else step.get(user)
        if step.get(user) in [-100, -101]:
            if answer == FIND_TEXT:
                step[user] = 0 # все анимешки угаданы
                task[user] = 4
                helps_used[user][task.get(user)] = 0
                send_msg(chat, 'Отлично.')
            else:
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, 'Нажми на кнопку, когда найдешь' + E_ARROWDOWN)
                step[user] = -101
        elif step.get(user) in [0, -1]:
            if answer in list(map(str, ANIME_NAMES.keys())):
                step[user] = int(answer)
            else:
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                step[user] = -1
        elif step.get(user) in ANIME_NAMES or step.get(user) < 0:
            step[user] = step.get(user) // 10 * (-1) if step.get(user) < 0 else step.get(user)
            if answer == ANSWERS.get(task.get(user)).get(step.get(user)):
                send_rnd_pics(chat)
                send_rnd_good_phrase(chat)
                openings_done[user].append(step.get(user))
                if len(openings_done.get(user)) == len(ANIME_NAMES):
                    step[user] = -100
                else:
                    step[user] = 0 # угадали анимешку, не все анимешки угаданы
            elif answer in (ANIME_CHOICES.get(step.get(user))):
                step[user] *= 10 # текущая анимешка не угадана, вариант ответа из списка
            else:
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                step[user] *= -10

    elif task.get(user) == 4:
        if answer == FIND_TEXT:
            task[user] = 5
            helps_used[user][task.get(user)] = 0
            step[user] = 0
            send_rnd_pics(chat)
            send_rnd_good_phrase(chat)
        elif answer == HELP_TEXT:
            if helps_used[user][task.get(user)] < len(HELPS[task.get(user)]):
                step[user] = 1
            else:
                step[user] = 2
            helps_used[user][task.get(user)] += 1
        elif answer == DECIPHER_TEXT:
            step[user] = 3
        else:
            if step.get(user) == 2 and helps_used[user][task.get(user)] > len(HELPS.get(task.get(user))):
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, f'Если нужна помощь - жми "{DECIPHER_TEXT}"')
            elif step.get(user) == 3:
                send_msg(chat, "Дальше ты справишься сам.")
            else:
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, f'Если нужна подсказка - жми "{HELP_TEXT}"')
            return

    elif task.get(user) == 5:
        if step.get(user) in [-100, -101]:
            if answer == FIND_TEXT:
                task[user] = 6
                helps_used[user][task.get(user)] = 0
                step[user] = 0
            else:
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, 'Когда найдешь фрагмент карты - жми на кнопку' + E_ARROWDOWN)
                step[user] = -101
        else:
            if set(answer) <= set('1234567,'):
                answer = list(map(int, answer.split(',')))
                send_msg(chat, "Так, сейчас проверю ...", HIDE_KB)
                if set(answer) == set(ANSWERS.get(task.get(user))):
                    send_rnd_pics(chat)
                    send_rnd_good_phrase(chat)
                    if len(wrong_facts_checked.get(user)) > 0:
                        send_msg(chat, 'Кстати, на заметку:')
                        for fact in wrong_facts_checked.get(user):
                            send_msg(chat, WRONG_FACTS_TRUE.get(fact))
                    step[user] = -100
                else:
                    cnt = len(set(answer) & set(ANSWERS.get(task.get(user))))
                    diff = set(answer).difference(set(ANSWERS.get(task.get(user))))
                    wrong_facts_checked[user] = list(set(wrong_facts_checked[user] + list(diff)))
                    if cnt == 0:
                        send_msg(chat, '0 попаданий.')
                    elif len(answer) > len(ANSWERS.get(task.get(user))):
                        send_msg(chat, 'Все факты угаданы, но есть лишние...')
                    else:
                        guessed = 'Угадано'
                        if cnt == 1:
                            guessed = 'Угадан'
                            fact = FACT_FORMS[0]
                        elif cnt in range(2, 5):
                            fact = FACT_FORMS[1]
                        else:
                            fact = FACT_FORMS[2]
                        send_msg(chat, f'{guessed} {cnt} {fact}. Но есть ещё верные.')
                    step[user] = 1
            else:
                step[user] = 2
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, 'Для выполнения задания нажми на кнопку' + E_ARROWDOWN)


    elif task.get(user) == 6:
        if step.get(user) in [-100, -101]:
            if answer == FIND_TEXT:
                task[user] = 7
                helps_used[user][task.get(user)] = 0
                step[user] = 0
                end_game(chat)
            else:
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, 'Когда найдешь фрагмент карты - жми на кнопку' + E_ARROWDOWN)
                step[user] = -101
        else:
            if answer == ANSWERS.get(task.get(user)):
                step[user] = -100
            else:
                step[user] = 1
                bot_response = chatbot.get_response(answer)
                send_msg(chat, bot_response, slp=False)
                send_msg(chat, 'Нажми кнопку "Поехали!"')
    
    elif task.get(user) == 7:
        bot_response = chatbot.get_response(answer)
        send_msg(chat, bot_response, kb=HIDE_KB, slp=False)

    process_task(chat)


bot.polling(none_stop=True)
