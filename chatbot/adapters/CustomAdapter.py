import yaml
import random
import re
import string
import os
import nltk
import pymorphy2


from chatterbot.logic import LogicAdapter
from chatterbot.conversation import Statement


nltk.download('punkt')
morph_analyzer = pymorphy2.MorphAnalyzer()


EMOJI_PATTERN = re.compile(
    r'\U00000023|\U0000002A|\U00000030-\U00000039|\U000000A9|\U000000AE|'
    r'\U0001F004|\U0001F0CF|\U0001F170-\U0001F171|\U0001F17E-\U0001F17F|'
    r'\U0001F18E|\U0001F191-\U0001F193|\U0001F194-\U0001F199|\U0001F19A|'
    r'\U0001F1E6-\U0001F1FF|\U0001F201|\U0001F202|\U0001F21A|\U0001F22F|'
    r'\U0001F232-\U0001F237|\U0001F238-\U0001F23A|\U0001F250-\U0001F251|'
    r'\U0001F300-\U0001F321|\U0001F324-\U0001F32F|\U0001F330-\U0001F335|'
    r'\U0001F336-\U0001F337|\U0001F338-\U0001F33A|\U0001F33B-\U0001F33F|'
    r'\U0001F340-\U0001F344|\U0001F345-\U0001F37F|\U0001F380-\U0001F3E9|'
    r'\U0001F3EA-\U0001F3EF|\U0001F3F3-\U0001F3F9|\U0001F400-\U0001F43E|'
    r'\U0001F3F0|\U0001F440-\U0001F4FC|\U0001F4FF-\U0001F53D|\U0001F5E3|'
    r'\U0001F54B-\U0001F54E|\U0001F550-\U0001F567|\U0001F57A|\U0001F5FA|'
    r'\U0001F595-\U0001F596|\U0001F5A4-\U0001F5A5|\U0001F5B1-\U0001F5B2|'
    r'\U0001F5A8|\U0001F5BC|\U0001F5C2-\U0001F5C4|\U0001F5D1-\U0001F5D3|'
    r'\U0001F5DC-\U0001F5DE|\U0001F5E8-\U0001F5EA|\U0001F5EF-\U0001F5F2|'
    r'\U0001F5E1|\U0001F6A2-\U0001F6A2|\U0001F6CC|\U0001F6D0-\U0001F6D2|'
    r'\U0001F6A4-\U0001F6B9|\U0001F6BA|\U0001F6BB-\U0001F6BE|\U0001F6C0|'
    r'\U0001F6D5-\U0001F6D7|\U0001F6EB-\U0001F6EC|\U0001F6F0|\U0001F6F3|'
    r'\U0001F6F4|\U0001F6F5-\U0001F6F6|\U0001FA78-\U0001FA7A|'
    r'\U0001F6F7-\U0001F6F8|\U0001F6F9-\U0001F6F9|\U0001F910-\U0001F918|'
    r'\U0001F980-\U0001F984|\U0001F9C0-\U0001F9C2|\U000E0020-\U000E007E|'
    r'\U0001F9D0-\U0001F9E6|\U0001F9E7-\U0001F9FF|\U0001FA70-\U0001FA73|'
    r'\U0001FA90-\U0001FA95|\U0001FA80-\U0001FA82|'
)

PRONOUNS = ['ты', 'твой']


class CustomAdapter(LogicAdapter):

    def __init__(self, chatbot, **kwargs):
        super().__init__(chatbot, **kwargs)
        self.patterns = self.load_patterns('datasets\discussion.yml')
        self.keywords = (
            self.load_patterns('datasets\keywords.yml') + 
            self.load_patterns('datasets\quest.yml')
        )
        self.default_responses = [
            'Прошу прощения, но у меня нет ответа на это.',
            'У меня нет ответа на этот вопрос, но мне всегда интересно узнать что-то новое.',
            'Мне жаль, но у меня нет той информации, которую ты ищешь.',
            'К сожалению, на данный момент у меня нет подходящего ответа.',
            'Мне кажется, мы свернули с темы. Давай вернемся к нашей беседе.',
            'Извини, не поняла тебя.'
        ]


    def load_patterns(self, file_path):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, '..', file_path)
        with open(file_path, 'r', encoding='utf-8') as file:
            data = yaml.load(file, Loader=yaml.SafeLoader)
        return data['categories']


    def can_process(self, statement):
        return True


    def process(self, statement, conversation):
        for pattern in self.patterns:
            if self.compare_pattern(pattern['pattern'], statement):
                return Statement(text=self.get_response(pattern['responses']))
        for keyword in self.keywords:
            if self.find_keyword(keyword['keyword'], statement):
                return Statement(text=self.get_response(keyword['responses']))
        return Statement(text=random.choice(self.default_responses))


    def compare_pattern(self, pattern, statement):
        statement = self.text_conversion(statement.text)
        pattern = self.text_conversion(pattern)
        return pattern == statement
    

    def find_keyword(self, keyword, statement):
        statement = self.text_conversion(statement.text)
        keyword = self.text_conversion(keyword)
        return keyword in statement.split()


    def text_conversion(self, text):
        text = EMOJI_PATTERN.sub(r'', text)
        translator = str.maketrans('', '', string.punctuation)
        text = text.translate(translator)
        tokens = nltk.word_tokenize(text)
        lemmas = [morph_analyzer.parse(token)[0].normal_form for token in tokens]
        text = " ".join(lemmas)
        for p in PRONOUNS:
            text = text.replace(p, '').replace('  ', ' ').rstrip().lstrip()
        return text


    def get_response(self, responses):
        return random.choice(responses)
