from flask import Flask, request, jsonify
from f import selToList, movieTable  # Assuming your functions are in f.py

app = Flask(__name__)

@app.route('/')
def home():
    return app.send_static_file('index.html')  # Serve the new static home page

@app.route('/api/movies', methods=['GET'])
def get_movies():
    df = movieTable()
    movies = df[['movieID', 'Movie_Title', 'Director', 'Year', 'Genre']].to_dict(orient='records')
    return jsonify(movies)

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    ids = data.get('movie_ids', [])
    if not ids:
        return jsonify({'error': 'No movie IDs provided'}), 400
    recommendations = selToList(dumps(ids))
    return jsonify(recommendations.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)