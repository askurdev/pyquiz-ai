# Python Quiz AI - Backend

FastAPI backend with Anthropic AI fcd backendor generating and evaluating Python quiz questions.
pip install -r requirements.txtpip install -r requirements.txt

```

## Environment Variables

Create a `.env` file or export:

```

ANTHROPIC_API_KEY=your_api_key_here

````

## Run

```bash
uvicorn main:app --reload --port 8000
````

## API Endpoints

- `GET /` - Health check
- `GET /topics` - List available topics & difficulties
- `POST /generate-quiz` - Generate quiz questions
- `POST /evaluate-answer` - Evaluate a student's answer

## Example Request

```json
POST /generate-quiz
{
  "topic": "functions",
  "difficulty": "intermediate",
  "num_questions": 5
}
```
