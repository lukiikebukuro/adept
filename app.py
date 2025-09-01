from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')
    
@app.route('/demo-motobot.html')
def demo_motobot():
    return render_template('demo-motobot.html')    

if __name__ == '__main__':
    app.run(debug=True)