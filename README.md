## Описание

Квест-бот для поиска подарка дома на день рождения.

Разрабатывался для именника, который обожает Японию, аниме, фильмы и играть! :heart_eyes:

Доступен по QR-коду:

![Image alt](https://github.com/malinpolin/kusyabot/blob/main/images/qr.png)

Необходимый инвентарь для проведения квеста: 
- Фрагменты карты помещения, с отмеченным местонахождением клада (6 шт) - задание №1;
- Пиратская шляпа - задание №2;
- Телескоп  - задание №3;
- Компас - задание №4;
- Окклюдер - задание №5;
- Сабля - задание №6.

Выполнила [Полина Стрельникова](https://github.com/malinpolin).
_____________________________________________________________________________________________________________________________________
## Технологии:
- python 3.7;
- pyTelegramBotAPI 4.12.0;
- chatterbot;
- JS;
- HTML, CSS.
_____________________________________________________________________________________________________________________________________
## Установка:

### 1. Клонировать репозиторий в рабочую директорию на компьютере:

##### Linux или MacOS
```bash
git clone git@github.com:malinpolin/kusyabot.git
```
##### Windows
```bash
git clone https://github.com/malinpolin/api_final_yatube.git
```

### 2. Перейти в директорию /kusyabot: 

```bash
cd kusyabot/
```

### 3. Cоздать и активировать виртуальное окружение: 

##### Linux или MacOS
```bash
python3 -m venv venv
```
```bash
source venv/bin/activate
```
##### Windows
```bash
python -m venv venv
```
```bash
source venv/Scripts/activate
```

### 4. Обновить pip:
##### Linux или MacOS
```bash
python3 -m pip install --upgrade pip
```
##### Windows
```bash
python -m pip install --upgrade pip
```

### 5. Установить зависимости:
##### Linux или MacOS
```bash
git clone git@github.com:feignbird/ChatterBot-spacy_fixed.git
```
##### Windows
```bash
git clone https://github.com/feignbird/ChatterBot-spacy_fixed.git
```
#### для chatterbot (fixes)
```bash
git clone https://github.com/feignbird/ChatterBot-spacy_fixed.git
pip install ./ChatterBot-spacy_fixed
pip install chatterbot-corpus
pip uninstall pyYAML
pip install pyYAML==5.3.1
python -m spacy download en_core_web_sm
```
##### из файла requirements.txt
```bash
pip install -r requirements.txt
```

### 6. Создать файл .env с API-токеном Вашего телеграм-бота
#### Создать файл
```bash
nano .env
```
#### Записать в файл переменную
```bash
TOKEN = <ВАШ API-токен>
```

### 7. Запустить проект:
##### Linux или MacOS
```bash
python3 manage.py runserver
```
##### Windows
```bash
python manage.py runserver
```
