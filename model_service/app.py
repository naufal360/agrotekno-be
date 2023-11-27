from flask import Flask,jsonify, request, make_response
import fuzzylab as fl

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    if request.method=='POST':
        data = request.get_json()
        num = data['id']
        model = ['Social-dimension', 'Economic-dim-new', 'Environmental-dimension']
        fis = fl.readfis('./models/'+model[num])
        output = fl.evalfis(fis, [data['input_one'], data['input_two'], data['input_three'], data['input_four'], data['input_five']])
        print(output)
        return make_response(jsonify({'name': model[num], 'result': output}), 200)

@app.route("/dimensionpredict", methods=["POST"])
def dimensionpredict():
    if request.method=='POST':
        data = request.get_json()
        fis = fl.readfis('./models/cek2')
        output = fl.evalfis(fis, [data['input_one'], data['input_two'], data['input_three']])
        print(output)
        return make_response(jsonify({'name': 'anfis dimension', 'result': output}), 200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

