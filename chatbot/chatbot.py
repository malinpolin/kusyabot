from chatterbot import ChatBot

chatbot = ChatBot(
    'KusyaChatBot', 
    logic_adapters=[
        {
            'import_path': 'adapters.CustomAdapter.CustomAdapter',
        }
    ])
