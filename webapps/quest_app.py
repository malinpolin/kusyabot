from flask import Flask, render_template

webapp = Flask(__name__)


@webapp.route('/japan')
def japan():
    template = 'japan.html'
    return render_template(template)

@webapp.route('/films')
def films():
    template = 'films.html'
    return render_template(template)

@webapp.route('/characters')
def characters():
    template = 'characters.html'
    return render_template(template)


@webapp.route('/test')
def test():
    template = 'test.html'
    return render_template(template)

webapp.run()

