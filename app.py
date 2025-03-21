from flask import Flask, request, jsonify
from f import selToList, movieTable  # Assuming your functions are in f.py
import os

app = Flask(__name__, static_folder='static', static_url_path='/static')

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
    port = int(os.environ.get('PORT', 5000))  # Use PORT env variable for Render
    app.run(host='0.0.0.0', port=port, debug=False)
